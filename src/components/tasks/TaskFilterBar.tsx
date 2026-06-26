import { SearchIcon } from '@/components/icons';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/cn';
import type { TaskFilter } from '@/types/task';

interface TaskFilterBarProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  search: string;
  onSearchChange: (search: string) => void;
  /** Optional per-filter counts shown as small badges on each tab. */
  counts?: Record<TaskFilter, number>;
}

const FILTERS: ReadonlyArray<{ value: TaskFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export function TaskFilterBar({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  counts,
}: TaskFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="group"
        aria-label="Filter tasks"
        className="inline-flex rounded-md border border-border bg-surface p-0.5"
      >
        {FILTERS.map((item) => {
          const isActive = filter === item.value;
          const count = counts?.[item.value];
          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onFilterChange(item.value)}
              className={cn(
                'flex h-8 items-center gap-1.5 rounded px-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent-soft text-accent'
                  : 'text-content-secondary hover:text-content',
              )}
            >
              {item.label}
              {count !== undefined && (
                <span
                  className={cn(
                    'tabular-nums text-xs',
                    isActive ? 'text-accent/70' : 'text-content-muted',
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="relative sm:w-64">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted" />
        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks…"
          aria-label="Search tasks"
          className="pl-9"
        />
      </div>
    </div>
  );
}
