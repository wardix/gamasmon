import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import type { ClusterResponse } from './types';
import { Header } from './components/Header';
import { StatsRow } from './components/StatsRow';
import { FilterBar } from './components/FilterBar';
import { ClusterGrid } from './components/ClusterGrid';
import { EmptyState } from './components/EmptyState';
import { LoadingState } from './components/LoadingState';

const REFRESH_INTERVAL = 30_000;

function App() {
  const [data, setData] = useState<ClusterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // Filters
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hideAcked, setHideAcked] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/clusters');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result: ClusterResponse = await response.json();
      setData(result);
      setLastFetched(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchData, REFRESH_INTERVAL);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefresh, fetchData]);

  const handleManualRefresh = () => {
    setLoading(true);
    fetchData();
  };

  const handleAck = async (operator: string, startedAt: string, ackedBy?: string) => {
    try {
      await fetch('/api/ack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operator, startedAt, ackedBy }),
      });
      fetchData();
    } catch {
      // Silently fail, next refresh will sync
    }
  };

  const handleUnack = async (operator: string, startedAt: string) => {
    try {
      await fetch('/api/ack', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operator, startedAt }),
      });
      fetchData();
    } catch {
      // Silently fail, next refresh will sync
    }
  };

  const filteredClusters = data?.clusters.filter((cluster) => {
    if (selectedOperator && cluster.operator !== selectedOperator) return false;
    if (hideAcked && cluster.acked) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchOperator = cluster.operator.toLowerCase().includes(query);
      const matchLabels = cluster.alerts.some((alert) =>
        Object.values(alert.labels).some((v) => v.toLowerCase().includes(query))
      );
      if (!matchOperator && !matchLabels) return false;
    }
    return true;
  }) ?? [];

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <Header
            autoRefresh={autoRefresh}
            onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
            onManualRefresh={handleManualRefresh}
            lastFetched={null}
            loading={true}
          />
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <Header
            autoRefresh={autoRefresh}
            onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
            onManualRefresh={handleManualRefresh}
            lastFetched={null}
            loading={false}
          />
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-error/10 border-2 border-error/20 flex items-center justify-center text-4xl mb-6">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-error mb-2">Connection Error</h2>
            <p className="text-sm text-base-content/50 mb-6 max-w-sm font-mono">{error}</p>
            <button className="btn btn-error btn-outline" onClick={handleManualRefresh}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <Header
          autoRefresh={autoRefresh}
          onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
          onManualRefresh={handleManualRefresh}
          lastFetched={lastFetched}
          loading={loading}
        />

        {data && <StatsRow data={data} />}

        {data && (
          <FilterBar
            operators={data.operators}
            selectedOperator={selectedOperator}
            onSelectOperator={setSelectedOperator}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            hideAcked={hideAcked}
            onToggleHideAcked={() => setHideAcked(!hideAcked)}
          />
        )}

        {filteredClusters.length > 0 ? (
          <ClusterGrid
            clusters={filteredClusters}
            onAck={handleAck}
            onUnack={handleUnack}
          />
        ) : (
          data && <EmptyState hasFilters={!!selectedOperator || !!searchQuery || hideAcked} />
        )}
      </div>
    </div>
  );
}

export default App;
