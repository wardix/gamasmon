type FilterBarProps = {
  operators: string[];
  selectedOperator: string | null;
  onSelectOperator: (op: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hideAcked: boolean;
  onToggleHideAcked: () => void;
};

export function FilterBar({
  operators,
  selectedOperator,
  onSelectOperator,
  searchQuery,
  onSearchChange,
  hideAcked,
  onToggleHideAcked,
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
        className={`btn btn-xs ${hideAcked ? 'btn-success' : 'btn-ghost border-success/20'}`}
        onClick={onToggleHideAcked}
      >
        {hideAcked ? '✓ Hide Acked' : 'Hide Acked'}
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
