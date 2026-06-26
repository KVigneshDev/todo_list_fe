import type { UseQueryResult } from '@tanstack/react-query';

import { EmptyState } from '@/components/tasks/EmptyState';
import { TaskItem } from '@/components/tasks/TaskItem';
import { Button } from '@/components/ui/Button';
import type { TaskFilter, TaskListResponse, UpdateTaskInput } from '@/types/task';

interface TaskListProps {
  query: UseQueryResult<TaskListResponse>;
  filter: TaskFilter;
  hasSearch: boolean;
  onUpdate: (id: string, input: UpdateTaskInput) => void;
  onDelete: (id: string) => void;
}

/** Placeholder rows shown during the very first load. */
function ListSkeleton() {
  return (
    <ul className="space-y-2" aria-hidden>
      {Array.from({ length: 3 }).map((_, index) => (
        <li
          key={index}
          className="h-[52px] animate-pulse rounded-lg border border-border bg-surface-muted"
        />
      ))}
    </ul>
  );
}

export function TaskList({
  query,
  filter,
  hasSearch,
  onUpdate,
  onDelete,
}: TaskListProps) {
  if (query.isPending) {
    return <ListSkeleton />;
  }

  if (query.isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface px-6 py-12 text-center">
        <p className="text-sm text-content-secondary">
          {query.error.message || 'Could not load tasks.'}
        </p>
        <Button variant="secondary" size="sm" onClick={() => query.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const tasks = query.data.items;
  if (tasks.length === 0) {
    return <EmptyState filter={filter} hasSearch={hasSearch} />;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
