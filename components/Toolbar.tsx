import { SORT_OPTIONS, type SortMode } from '@/utils/tabs';

interface ToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
  tabCount: number;
}

/** Search box and sort selector, pinned to the top of the panel. */
export function Toolbar({
  query,
  onQueryChange,
  sortMode,
  onSortChange,
  tabCount,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <input
        type="search"
        placeholder={`Search ${tabCount} tabs`}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && onQueryChange('')}
        autoFocus
      />
      <select
        aria-label="Sort tabs"
        value={sortMode}
        onChange={(e) => onSortChange(e.target.value as SortMode)}
      >
        {SORT_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
