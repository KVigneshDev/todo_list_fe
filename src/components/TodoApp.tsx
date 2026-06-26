import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Header } from '@/components/layout/Header';
import { StatsPanel } from '@/components/tasks/StatsPanel';
import { TaskComposer } from '@/components/tasks/TaskComposer';
import type { TaskComposerHandle } from '@/components/tasks/TaskComposer';
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
import { describeDueDate } from '@/lib/date';
import type {
  CreateTaskInput,
  TaskFilter,
  TaskSort,
  UpdateTaskInput,
} from '@/types/task';

/** The authenticated todo experience. */
export function TodoApp() {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sort, setSort] = useState<TaskSort>('created_desc');
  const [searchInput, setSearchInput] = useState('');
  const search = useDebouncedValue(searchInput.trim(), 300);

  const composerRef = useRef<TaskComposerHandle>(null);

  // The query/mutation params identify the cache entry; memoised so the query
  // key stays referentially stable between renders.
  const params = useMemo(() => ({ filter, search, sort }), [filter, search, sort]);

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

  // Press "n" (outside a text field) to jump to the add-task box.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;
      if (!typing && (event.key === 'n' || event.key === 'N')) {
        event.preventDefault();
        composerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
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

  // Overdue count, computed from the tasks currently loaded.
  const overdue = useMemo(() => {
    const items = tasksQuery.data?.items ?? [];
    return items.filter(
      (task) =>
        !task.is_completed &&
        task.due_date &&
        describeDueDate(task.due_date).overdue,
    ).length;
  }, [tasksQuery.data]);

  return (
    <div className="min-h-full">
      <Header />

      <main className="mx-auto w-full max-w-2xl px-4 py-6 sm:py-8">
        <div className="space-y-5">
          <TaskComposer
            ref={composerRef}
            onCreate={handleCreate}
            isCreating={createMutation.isPending}
          />

          {stats && stats.total > 0 && <StatsPanel stats={stats} overdue={overdue} />}

          <div className="space-y-4">
            <TaskFilterBar
              filter={filter}
              onFilterChange={setFilter}
              search={searchInput}
              onSearchChange={setSearchInput}
              sort={sort}
              onSortChange={setSort}
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
