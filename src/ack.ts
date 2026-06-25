import { join } from "path";

type AckEntry = {
  operator: string;
  startedAt: string;
  ackedAt: string;
  ackedBy?: string;
};

type AckStore = {
  entries: AckEntry[];
};

const ACK_FILE = Bun.env.ACK_FILE ?? join(import.meta.dir, "..", "ack.json");

async function readStore(): Promise<AckStore> {
  try {
    const file = Bun.file(ACK_FILE);
    if (await file.exists()) {
      return (await file.json()) as AckStore;
    }
  } catch {
    // File doesn't exist or is invalid, start fresh
  }
  return { entries: [] };
}

async function writeStore(store: AckStore): Promise<void> {
  await Bun.write(ACK_FILE, JSON.stringify(store, null, 2));
}

function makeKey(operator: string, startedAt: string): string {
  return `${operator}::${startedAt}`;
}

export async function ackCluster(
  operator: string,
  startedAt: string,
  ackedBy?: string,
): Promise<void> {
  const store = await readStore();
  const key = makeKey(operator, startedAt);
  const exists = store.entries.some(
    (e) => makeKey(e.operator, e.startedAt) === key,
  );

  if (!exists) {
    store.entries.push({
      operator,
      startedAt,
      ackedAt: new Date().toISOString(),
      ackedBy,
    });
    await writeStore(store);
  }
}

export async function unackCluster(
  operator: string,
  startedAt: string,
): Promise<void> {
  const store = await readStore();
  const key = makeKey(operator, startedAt);
  store.entries = store.entries.filter(
    (e) => makeKey(e.operator, e.startedAt) !== key,
  );
  await writeStore(store);
}

export async function getAckedSet(): Promise<
  Map<string, { ackedAt: string; ackedBy?: string }>
> {
  const store = await readStore();
  const map = new Map<string, { ackedAt: string; ackedBy?: string }>();
  for (const entry of store.entries) {
    map.set(makeKey(entry.operator, entry.startedAt), {
      ackedAt: entry.ackedAt,
      ackedBy: entry.ackedBy,
    });
  }
  return map;
}

export function buildAckKey(operator: string, startedAt: string): string {
  return makeKey(operator, startedAt);
}
