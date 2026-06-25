export type ClusterSummary = {
  operator: string;
  alertCount: number;
  startedAt: string;
  acked: boolean;
  ackedAt?: string;
  ackedBy?: string;
  alerts: {
    startsAt: string;
    labels: Record<string, string>;
  }[];
};

export type ClusterResponse = {
  totalAlerts: number;
  totalClusters: number;
  operators: string[];
  clusters: ClusterSummary[];
  config: {
    thresholdSeconds: number;
    minGroupSize: number;
    maxAlertAgeDays: number;
  };
  fetchedAt: string;
};
