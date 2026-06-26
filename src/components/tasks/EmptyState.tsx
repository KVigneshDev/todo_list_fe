import { ClipboardIcon, SearchIcon } from '@/components/icons';
import type { TaskFilter } from '@/types/task';

interface EmptyStateProps {
  filter: TaskFilter;
  hasSearch: boolean;
}

function contentFor(filter: TaskFilter, hasSearch: boolean) {
  if (hasSearch) {
    return { title: 'No matches', body: 'No tasks match your search.', search: true };
  }
  if (filter === 'completed') {
    return { title: 'Nothing done yet', body: 'Completed tasks will show up here.', search: false };
  }
  if (filter === 'active') {
    return { title: "You're all caught up", body: 'No active tasks — enjoy the calm.', search: false };
  }
  return { title: 'No tasks yet', body: 'Add your first task using the box above.', search: false };
}

export function EmptyState({ filter, hasSearch }: EmptyStateProps) {
  const { title, body, search } = contentFor(filter, hasSearch);
  const Icon = search ? SearchIcon : ClipboardIcon;

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-14 text-center animate-fade-in-up">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-content-muted">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-content">{title}</p>
        <p className="mt-1 text-sm text-content-secondary">{body}</p>
      </div>
    </div>
  );
}
