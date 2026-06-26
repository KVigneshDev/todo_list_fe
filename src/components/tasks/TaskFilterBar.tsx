import { SearchIcon } from '@/components/icons';
import { SortMenu } from '@/components/tasks/SortMenu';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/cn';
import type { TaskFilter, TaskSort } from '@/types/task';

interface TaskFilterBarProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  search: string;
  onSearchChange: (search: string) => void;
  sort: TaskSort;
  onSortChange: (sort: TaskSort) => void;
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
  sort,
  onSortChange,
  counts,
}: TaskFilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
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

      <div className="flex items-center justify-between gap-2">
        <div
          role="group"
          aria-label="Filter tasks"
          className="inline-flex rounded-lg border border-border bg-surface p-0.5"
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
                  'flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors sm:px-3',
                  isActive
                    ? 'bg-accent-soft text-accent shadow-sm'
                    : 'text-content-secondary hover:text-content',
                )}
              >
                {item.label}
                {count !== undefined && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 text-xs tabular-nums',
                      isActive
                        ? 'bg-accent/15 text-accent'
                        : 'bg-surface-muted text-content-muted',
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <SortMenu value={sort} onChange={onSortChange} />
      </div>
    </div>
  );
}
