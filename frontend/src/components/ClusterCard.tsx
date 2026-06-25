import { useState } from 'react';
import type { ClusterSummary } from '../types';

type ClusterCardProps = {
  cluster: ClusterSummary;
  index: number;
  onAck: () => void;
  onUnack: () => void;
};

function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHour > 0) return `${diffHour}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return 'just now';
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function ClusterCard({ cluster, index, onAck, onUnack }: ClusterCardProps) {
  const [expanded, setExpanded] = useState(false);

  const filteredLabelKeys = ['alertname', 'severity'];
  const borderColor = cluster.acked ? 'border-l-success' : 'border-l-error';
  const cardOpacity = cluster.acked ? 'opacity-60' : '';

  return (
    <div
      className={`card bg-base-200/50 border border-base-300 border-l-4 ${borderColor} shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden animate-fade-slide-in ${cardOpacity}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Header - clickable */}
      <div
        className="card-body p-5 pb-4 cursor-pointer flex-row items-start justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          {/* Top row: badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {cluster.acked ? (
              <span className="badge badge-success badge-sm font-bold uppercase tracking-wider">
                ✓ Acknowledged
              </span>
            ) : (
              <span className="badge badge-error badge-sm font-bold uppercase tracking-wider animate-pulse-badge">
                ⚠ Gangguan Massal
              </span>
            )}
            <span className="badge badge-primary badge-outline badge-sm font-semibold">
              {cluster.operator}
            </span>
          </div>

          {/* Alert count */}
          <div className="flex items-baseline gap-3">
            <span className={`text-3xl font-extrabold tracking-tight ${cluster.acked ? 'text-base-content/50' : 'text-error'}`}>
              {cluster.alertCount}
            </span>
            <span className="text-sm text-base-content/40">alerts</span>
          </div>

          {/* Time */}
          <p className="text-xs text-base-content/40 font-mono mt-2">
            <span className="text-base-content/60">{getRelativeTime(cluster.startedAt)}</span>
            {' · '}
            {formatDateTime(cluster.startedAt)}
          </p>

          {/* Ack info */}
          {cluster.acked && cluster.ackedAt && (
            <p className="text-xs text-success/60 font-mono mt-1">
              acked {formatDateTime(cluster.ackedAt)}
              {cluster.ackedBy && ` by ${cluster.ackedBy}`}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-1 shrink-0">
          {cluster.acked ? (
            <button
              className="btn btn-ghost btn-xs text-base-content/40 hover:text-error"
              onClick={(e) => { e.stopPropagation(); onUnack(); }}
              title="Un-acknowledge"
            >
              ✕
            </button>
          ) : (
            <button
              className="btn btn-success btn-xs btn-outline"
              onClick={(e) => { e.stopPropagation(); onAck(); }}
              title="Acknowledge"
            >
              ✓ Ack
            </button>
          )}
          <button className={`btn btn-ghost btn-xs btn-square transition-transform ${expanded ? 'rotate-180' : ''}`}>
            ▾
          </button>
        </div>
      </div>

      {/* Expandable detail */}
      <div className={`cluster-detail-wrapper ${expanded ? 'expanded' : ''}`}>
        <div className="px-5 pb-4 border-t border-base-300">
          <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wider pt-3 pb-2">
            Alert Members ({cluster.alerts.length})
          </p>
          <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto alert-list-scroll">
            {cluster.alerts.map((alert, i) => {
              const time = formatDateTime(alert.startsAt);
              const labels = Object.entries(alert.labels).filter(
                ([k]) => !filteredLabelKeys.includes(k)
              );
              return (
                <div key={i} className="flex items-start gap-2.5 py-2 px-3 bg-base-300/50 rounded-lg text-xs font-mono">
                  <span className="text-primary whitespace-nowrap shrink-0">{time}</span>
                  <span className="text-base-content/60 break-all">
                    {labels.map(([k, v], j) => (
                      <span key={k}>
                        {j > 0 && ' · '}
                        <span className="text-base-content/40">{k}:</span>{' '}
                        <span className="text-base-content/80">{v}</span>
                      </span>
                    ))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
