export function LoadingState() {
  return (
    <div className="flex flex-col gap-4">
      {/* Skeleton stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card bg-base-200/50 border border-base-300 p-5 skeleton-shimmer">
            <div className="skeleton h-3 w-3/5 mb-3" />
            <div className="skeleton h-8 w-2/5 mb-2" />
            <div className="skeleton h-3 w-3/5" />
          </div>
        ))}
      </div>

      {/* Skeleton clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card bg-base-200/50 border border-base-300 border-l-4 border-l-base-300 p-5 skeleton-shimmer">
            <div className="skeleton h-3 w-3/5 mb-3" />
            <div className="skeleton h-8 w-2/5 mb-2" />
            <div className="skeleton h-4 w-full mb-2" />
            <div className="skeleton h-3 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
