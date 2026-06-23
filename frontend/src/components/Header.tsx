type HeaderProps = {
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  onManualRefresh: () => void;
  lastFetched: Date | null;
  loading: boolean;
};

export function Header({
  autoRefresh,
  onToggleAutoRefresh,
  onManualRefresh,
  lastFetched,
  loading,
}: HeaderProps) {
  const formatTime = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  return (
    <header className="flex items-center justify-between flex-wrap gap-4 py-6 pb-8">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-xl shadow-lg shadow-primary/25">
          📡
        </div>
        <div>
          <h1 className="text-2xl font-bold header-title-glow tracking-tight">
            gamasmon
          </h1>
          <p className="text-xs text-base-content/40">Real-time mass outage detection</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-base-content/40 font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              autoRefresh ? 'bg-success animate-pulse-dot' : 'bg-base-content/30'
            }`}
          />
          {lastFetched ? (
            <span>Updated {formatTime(lastFetched)}</span>
          ) : (
            <span>{loading ? 'Loading...' : 'Not connected'}</span>
          )}
        </div>

        <button
          className={`btn btn-sm btn-ghost ${autoRefresh ? 'btn-active text-primary' : ''}`}
          onClick={onToggleAutoRefresh}
        >
          {autoRefresh ? '⏸ Pause' : '▶ Auto'}
        </button>

        <button
          className="btn btn-sm btn-ghost"
          onClick={onManualRefresh}
          disabled={loading}
        >
          {loading ? <span className="loading loading-spinner loading-xs" /> : '↻'} Refresh
        </button>
      </div>
    </header>
  );
}
