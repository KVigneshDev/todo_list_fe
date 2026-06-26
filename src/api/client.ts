/**
 * Thin HTTP client around `fetch`.
 *
 * Responsibilities:
 *   - prefix requests with the configured API base URL,
 *   - serialise/deserialise JSON,
 *   - turn non-2xx responses into a typed `ApiError` with a friendly message,
 *     so callers (and the UI) have one consistent error shape to handle.
 */

import { clearToken, getToken, notifyUnauthorized } from '@/lib/authStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }

  /** True when the server rejected us for sending requests too quickly. */
  get isRateLimited(): boolean {
    return this.status === 429;
  }
}

/** Map a failed response to a human-friendly message. */
async function buildError(response: Response): Promise<ApiError> {
  if (response.status === 429) {
    return new ApiError(429, 'You are doing that too often. Please slow down.');
  }

  let detail = `Request failed (${response.status}).`;
  try {
    const body = (await response.json()) as { detail?: unknown };
    if (typeof body.detail === 'string') {
      detail = body.detail;
    } else if (Array.isArray(body.detail) && body.detail.length > 0) {
      // FastAPI validation errors come back as a list of {msg, loc, ...}.
      const first = body.detail[0] as { msg?: string };
      if (first?.msg) detail = first.msg;
    }
  } catch {
    // Response had no JSON body; keep the default message.
  }
  return new ApiError(response.status, detail);
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, signal } = options;

  const token = getToken();
  const headers: Record<string, string> = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  // If we sent a token and it was rejected, the session is no longer valid:
  // clear it and let the auth layer log the user out. (Login/register send no
  // token, so a 401 there is just bad credentials and is handled by the form.)
  if (response.status === 401 && token) {
    clearToken();
    notifyUnauthorized();
  }

  if (!response.ok) {
    throw await buildError(response);
  }

  // 204 No Content (e.g. DELETE) has an empty body.
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
