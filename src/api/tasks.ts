/** Task API calls. One function per backend endpoint, fully typed. */

import { request } from '@/api/client';
import type {
  CreateTaskInput,
  Task,
  TaskFilter,
  TaskListResponse,
  TaskStats,
  UpdateTaskInput,
} from '@/types/task';

const TASKS_PATH = '/api/v1/tasks';

export interface ListTasksParams {
  filter?: TaskFilter;
  search?: string;
  limit?: number;
  offset?: number;
}

/** Translate UI params into a query string the backend understands. */
function buildListQuery(params: ListTasksParams): string {
  const query = new URLSearchParams();

  if (params.filter === 'active') query.set('is_completed', 'false');
  if (params.filter === 'completed') query.set('is_completed', 'true');

  const search = params.search?.trim();
  if (search) query.set('search', search);

  query.set('limit', String(params.limit ?? 50));
  query.set('offset', String(params.offset ?? 0));

  return query.toString();
}

export function listTasks(
  params: ListTasksParams,
  signal?: AbortSignal,
): Promise<TaskListResponse> {
  return request<TaskListResponse>(`${TASKS_PATH}?${buildListQuery(params)}`, {
    signal,
  });
}

export function createTask(input: CreateTaskInput): Promise<Task> {
  return request<Task>(TASKS_PATH, { method: 'POST', body: input });
}

export function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  return request<Task>(`${TASKS_PATH}/${id}`, { method: 'PATCH', body: input });
}

export function deleteTask(id: string): Promise<void> {
  return request<void>(`${TASKS_PATH}/${id}`, { method: 'DELETE' });
}

export function getTaskStats(signal?: AbortSignal): Promise<TaskStats> {
  return request<TaskStats>(`${TASKS_PATH}/stats`, { signal });
}

export function clearCompletedTasks(): Promise<{ deleted: number }> {
  return request<{ deleted: number }>(`${TASKS_PATH}/completed`, {
    method: 'DELETE',
  });
}
