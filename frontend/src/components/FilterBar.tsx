type FilterBarProps = {
  operators: string[];
  selectedOperator: string | null;
  onSelectOperator: (op: string | null) => void;
  massOutageOnly: boolean;
  onToggleMassOutage: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export function FilterBar({
  operators,
  selectedOperator,
  onSelectOperator,
  massOutageOnly,
  onToggleMassOutage,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 mb-6 flex-wrap">
      <div className="flex gap-2 flex-wrap">
        <button
          className={`btn btn-xs ${!selectedOperator ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => onSelectOperator(null)}
        >
          All
        </button>
        {operators.map((op) => (
          <button
            key={op}
            className={`btn btn-xs ${selectedOperator === op ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onSelectOperator(selectedOperator === op ? null : op)}
          >
            {op}
          </button>
        ))}
      </div>

      <div className="divider divider-horizontal mx-0 h-6" />

      <button
        className={`btn btn-xs ${massOutageOnly ? 'btn-error' : 'btn-ghost border-error/20'}`}
        onClick={onToggleMassOutage}
      >
        🔴 Mass Outage Only
      </button>

      <input
        type="text"
        className="input input-sm input-bordered flex-1 min-w-48"
        placeholder="Search labels..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
