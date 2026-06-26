import { ClipboardIcon } from '@/components/icons';
import type { TaskFilter } from '@/types/task';

interface EmptyStateProps {
  filter: TaskFilter;
  hasSearch: boolean;
}

function messageFor(filter: TaskFilter, hasSearch: boolean): string {
  if (hasSearch) return 'No tasks match your search.';
  if (filter === 'completed') return 'No completed tasks yet.';
  if (filter === 'active') return "No active tasks — you're all caught up.";
  return 'No tasks yet. Add your first one above.';
}

export function EmptyState({ filter, hasSearch }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-surface/60 px-6 py-14 text-center">
      <ClipboardIcon className="h-8 w-8 text-content-muted" />
      <p className="text-sm text-content-secondary">{messageFor(filter, hasSearch)}</p>
    </div>
  );
}
