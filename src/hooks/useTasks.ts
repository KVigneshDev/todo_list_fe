/**
 * Data hooks for tasks, built on TanStack Query.
 *
 * Reads are cached and de-duplicated; writes use optimistic updates so the UI
 * responds instantly and rolls back automatically if the request fails. Every
 * mutation invalidates the list on settle to reconcile with the server.
 */

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  clearCompletedTasks,
  createTask,
  deleteTask,
  getTaskStats,
  listTasks,
  updateTask,
} from '@/api/tasks';
import type { ListTasksParams } from '@/api/tasks';
import type {
  CreateTaskInput,
  Task,
  TaskListResponse,
  UpdateTaskInput,
} from '@/types/task';

/** Centralised, type-safe query keys. */
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (params: ListTasksParams) => [...taskKeys.lists(), params] as const,
  stats: () => [...taskKeys.all, 'stats'] as const,
};

/** Counts (total / active / completed) for the summary UI. */
export function useTaskStats() {
  return useQuery({
    queryKey: taskKeys.stats(),
    queryFn: ({ signal }) => getTaskStats(signal),
  });
}

/** Fetch a (filtered/searched) page of tasks. */
export function useTasks(params: ListTasksParams) {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: ({ signal }) => listTasks(params, signal),
    // Keep showing the previous results while the next query loads, so
    // switching filters or typing a search doesn't blank the list.
    placeholderData: keepPreviousData,
  });
}

/** Snapshot used to roll an optimistic update back on error. */
interface MutationContext {
  previous: TaskListResponse | undefined;
  key: ReturnType<typeof taskKeys.list>;
}

export function useCreateTask(params: ListTasksParams) {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, CreateTaskInput, MutationContext>({
    mutationFn: createTask,
    onMutate: async (input) => {
      const key = taskKeys.list(params);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<TaskListResponse>(key);

      const now = new Date().toISOString();
      const optimisticTask: Task = {
        id: `optimistic-${crypto.randomUUID()}`,
        title: input.title,
        description: input.description ?? null,
        is_completed: false,
        priority: input.priority ?? 'medium',
        due_date: input.due_date ?? null,
        created_at: now,
        updated_at: now,
      };

      if (previous) {
        queryClient.setQueryData<TaskListResponse>(key, {
          ...previous,
          items: [optimisticTask, ...previous.items],
          total: previous.total + 1,
        });
      }
      return { previous, key };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.key, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
    },
  });
}

export interface UpdateTaskArgs {
  id: string;
  input: UpdateTaskInput;
}

export function useUpdateTask(params: ListTasksParams) {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, UpdateTaskArgs, MutationContext>({
    mutationFn: ({ id, input }) => updateTask(id, input),
    onMutate: async ({ id, input }) => {
      const key = taskKeys.list(params);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<TaskListResponse>(key);

      if (previous) {
        queryClient.setQueryData<TaskListResponse>(key, {
          ...previous,
          items: previous.items.map((task) =>
            task.id === id
              ? { ...task, ...input, updated_at: new Date().toISOString() }
              : task,
          ),
        });
      }
      return { previous, key };
    },
    onError: (_error, _args, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.key, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
    },
  });
}

export function useDeleteTask(params: ListTasksParams) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, MutationContext>({
    mutationFn: deleteTask,
    onMutate: async (id) => {
      const key = taskKeys.list(params);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<TaskListResponse>(key);

      if (previous) {
        queryClient.setQueryData<TaskListResponse>(key, {
          ...previous,
          items: previous.items.filter((task) => task.id !== id),
          total: Math.max(0, previous.total - 1),
        });
      }
      return { previous, key };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.key, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
    },
  });
}

/** Bulk-delete all completed tasks, then refresh lists and counts. */
export function useClearCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCompletedTasks,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
    },
  });
}
