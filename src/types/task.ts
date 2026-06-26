/** Domain types shared across the app. Mirrors the backend's task schema. */

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

/** Aggregate counts for the current user's tasks. */
export interface TaskStats {
  total: number;
  active: number;
  completed: number;
}

/** Paginated list envelope returned by `GET /tasks`. */
export interface TaskListResponse {
  items: Task[];
  total: number;
  limit: number;
  offset: number;
}

/** Payload for creating a task. */
export interface CreateTaskInput {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  due_date?: string | null;
}

/** Partial payload for updating a task (PATCH semantics). */
export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  is_completed?: boolean;
  priority?: TaskPriority;
  due_date?: string | null;
}

/** Which tasks the user is currently viewing. */
export type TaskFilter = 'all' | 'active' | 'completed';
