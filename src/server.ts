import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import { buildMetrics, getClusterResponse } from "./metrics";

const app = new Hono();

const isProduction = Bun.env.NODE_ENV === "production";

// CORS for API routes
app.use("/api/*", cors());

// API endpoint
app.get("/api/clusters", async (c) => {
  try {
    const data = await getClusterResponse();
    return c.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return c.json({ error: message }, 500);
  }
});

// Prometheus metrics
app.get("/metrics", async (c) => {
  try {
    const metrics = await buildMetrics();
    c.header("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
    return c.body(metrics);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return c.text(`failed to build metrics: ${message}\n`, 500);
  }
});

// Health check
app.get("/healthz", (c) => {
  return c.json({ status: "ok" });
});

// Production: serve frontend static files
if (isProduction) {
  app.use("/*", serveStatic({ root: "./frontend/dist" }));
  // SPA fallback: serve index.html for any unmatched routes
  app.get("*", serveStatic({ root: "./frontend/dist", path: "index.html" }));
} else {
  app.get("/", (c) => {
    return c.text("ok — frontend available at http://localhost:5173");
  });
}

const port = Number(Bun.env.PORT ?? "3000");
const server = Bun.serve({
  port,
  fetch: app.fetch,
});

console.log(`listening on http://localhost:${server.port}`);
if (!isProduction) {
  console.log("run frontend dev server: cd frontend && npm run dev");
}
