import type { ClusterSummary } from '../types';
import { ClusterCard } from './ClusterCard';

type ClusterGridProps = {
  clusters: ClusterSummary[];
};

export function ClusterGrid({ clusters }: ClusterGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {clusters.map((cluster, index) => (
        <ClusterCard
          key={`${cluster.operator}-${cluster.startedAt}-${index}`}
          cluster={cluster}
          index={index}
        />
      ))}
    </div>
  );
}
