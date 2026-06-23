import type { ClusterResponse } from '../types';

type StatsRowProps = {
  data: ClusterResponse;
};

export function StatsRow({ data }: StatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="card bg-base-200/50 border border-base-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="card-body p-5">
          <p className="text-xs font-medium text-base-content/40 uppercase tracking-wider flex items-center gap-1.5">
            🔴 Gangguan Massal
          </p>
          <p className={`text-3xl font-extrabold tracking-tight ${data.totalClusters > 0 ? 'text-error' : 'text-success'}`}>
            {data.totalClusters}
          </p>
          <p className="text-xs text-base-content/40 font-mono">
            {data.totalAlerts} total alerts
          </p>
        </div>
      </div>

      <div className="card bg-base-200/50 border border-base-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="card-body p-5">
          <p className="text-xs font-medium text-base-content/40 uppercase tracking-wider flex items-center gap-1.5">
            🏢 Operators
          </p>
          <p className="text-3xl font-extrabold tracking-tight">
            {data.operators.length}
          </p>
          <p className="text-xs text-base-content/40 font-mono truncate">
            {data.operators.slice(0, 3).join(', ')}
            {data.operators.length > 3 ? ` +${data.operators.length - 3}` : ''}
          </p>
        </div>
      </div>

      <div className="card bg-base-200/50 border border-base-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="card-body p-5">
          <p className="text-xs font-medium text-base-content/40 uppercase tracking-wider flex items-center gap-1.5">
            ⚙️ Config
          </p>
          <p className="text-lg font-extrabold tracking-tight">
            {data.config.thresholdSeconds}s / {data.config.minGroupSize}
          </p>
          <p className="text-xs text-base-content/40 font-mono">threshold / min group</p>
        </div>
      </div>
    </div>
  );
}
