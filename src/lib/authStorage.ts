/**
 * Persists the access token and lets the API client signal "session expired".
 *
 * The token lives in localStorage so a refresh keeps you logged in. The
 * `onUnauthorized` hook lets the auth provider react to a 401 on an
 * authenticated request (token expired/revoked) by logging the user out.
 */

const TOKEN_KEY = 'todo.auth.token';

let unauthorizedHandler: (() => void) | null = null;

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/** Register the callback fired when an authenticated request returns 401. */
export function onUnauthorized(handler: () => void): void {
  unauthorizedHandler = handler;
}

export function notifyUnauthorized(): void {
  unauthorizedHandler?.();
}
