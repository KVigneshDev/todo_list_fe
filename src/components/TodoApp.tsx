import { useCallback, useMemo, useState } from 'react';

import { Header } from '@/components/layout/Header';
import { ProgressSummary } from '@/components/tasks/ProgressSummary';
import { TaskComposer } from '@/components/tasks/TaskComposer';
import { TaskFilterBar } from '@/components/tasks/TaskFilterBar';
import { TaskList } from '@/components/tasks/TaskList';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  useClearCompleted,
  useCreateTask,
  useDeleteTask,
  useTaskStats,
  useTasks,
  useUpdateTask,
} from '@/hooks/useTasks';
import type { CreateTaskInput, TaskFilter, UpdateTaskInput } from '@/types/task';

/** The authenticated todo experience. */
export function TodoApp() {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchInput, setSearchInput] = useState('');
  const search = useDebouncedValue(searchInput.trim(), 300);

  // The query/mutation params identify the cache entry; memoised so the query
  // key stays referentially stable between renders.
  const params = useMemo(() => ({ filter, search }), [filter, search]);

  const tasksQuery = useTasks(params);
  const statsQuery = useTaskStats();
  const createMutation = useCreateTask(params);
  const updateMutation = useUpdateTask(params);
  const deleteMutation = useDeleteTask(params);
  const clearCompleted = useClearCompleted();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const reportError = useCallback((error: unknown) => {
    setErrorMessage(error instanceof Error ? error.message : 'Something went wrong.');
  }, []);

  const handleCreate = useCallback(
    (input: CreateTaskInput) => createMutation.mutate(input, { onError: reportError }),
    [createMutation, reportError],
  );

  const handleUpdate = useCallback(
    (id: string, input: UpdateTaskInput) =>
      updateMutation.mutate({ id, input }, { onError: reportError }),
    [updateMutation, reportError],
  );

  const handleDelete = useCallback(
    (id: string) => deleteMutation.mutate(id, { onError: reportError }),
    [deleteMutation, reportError],
  );

  const handleClearCompleted = useCallback(
    () => clearCompleted.mutate(undefined, { onError: reportError }),
    [clearCompleted, reportError],
  );

  const stats = statsQuery.data;
  const counts: Record<TaskFilter, number> | undefined = stats
    ? { all: stats.total, active: stats.active, completed: stats.completed }
    : undefined;

  return (
    <div className="min-h-full">
      <Header />

      <main className="mx-auto w-full max-w-2xl px-4 py-8">
        <div className="space-y-5">
          <TaskComposer onCreate={handleCreate} isCreating={createMutation.isPending} />

          {stats && stats.total > 0 && <ProgressSummary stats={stats} />}

          <div className="space-y-4">
            <TaskFilterBar
              filter={filter}
              onFilterChange={setFilter}
              search={searchInput}
              onSearchChange={setSearchInput}
              counts={counts}
            />

            <TaskList
              query={tasksQuery}
              filter={filter}
              hasSearch={search.length > 0}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </div>

          {stats && stats.completed > 0 && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                isLoading={clearCompleted.isPending}
                onClick={handleClearCompleted}
              >
                Clear completed
              </Button>
            </div>
          )}
        </div>
      </main>

      {errorMessage && (
        <Toast message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
    </div>
  );
}
