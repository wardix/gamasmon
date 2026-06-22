export type ClusterSummary = {
  operator: string;
  alertCount: number;
  startedAt: string;
  isMassOutage: boolean;
  alerts: {
    startsAt: string;
    labels: Record<string, string>;
  }[];
};

export type ClusterResponse = {
  totalAlerts: number;
  totalClusters: number;
  massOutageCount: number;
  operators: string[];
  clusters: ClusterSummary[];
  config: {
    thresholdSeconds: number;
    minGroupSize: number;
    maxAlertAgeDays: number;
  };
  fetchedAt: string;
};
