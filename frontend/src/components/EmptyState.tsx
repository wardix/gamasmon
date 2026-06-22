type EmptyStateProps = {
  hasFilters: boolean;
};

export function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-success/10 border-2 border-success/20 flex items-center justify-center text-4xl mb-6 animate-breathe">
        ✓
      </div>
      <h2 className="text-xl font-bold text-success mb-2">
        {hasFilters ? 'No Matching Clusters' : 'All Clear'}
      </h2>
      <p className="text-sm text-base-content/40 max-w-sm">
        {hasFilters
          ? 'No clusters match the current filters. Try adjusting your search criteria.'
          : 'No active alert clusters detected. The network is operating normally.'}
      </p>
    </div>
  );
}
