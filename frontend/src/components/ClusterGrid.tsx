import type { ClusterSummary } from '../types';
import { ClusterCard } from './ClusterCard';

type ClusterGridProps = {
  clusters: ClusterSummary[];
  onAck: (operator: string, startedAt: string) => void;
  onUnack: (operator: string, startedAt: string) => void;
};

export function ClusterGrid({ clusters, onAck, onUnack }: ClusterGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {clusters.map((cluster, index) => (
        <ClusterCard
          key={`${cluster.operator}-${cluster.startedAt}-${index}`}
          cluster={cluster}
          index={index}
          onAck={() => onAck(cluster.operator, cluster.startedAt)}
          onUnack={() => onUnack(cluster.operator, cluster.startedAt)}
        />
      ))}
    </div>
  );
}
