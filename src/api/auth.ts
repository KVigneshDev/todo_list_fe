/** Auth API calls. One function per backend endpoint, fully typed. */

import { request } from '@/api/client';
import type { AuthResponse, Credentials, User } from '@/types/auth';

const AUTH_PATH = '/api/v1/auth';

export function login(credentials: Credentials): Promise<AuthResponse> {
  return request<AuthResponse>(`${AUTH_PATH}/login`, {
    method: 'POST',
    body: credentials,
  });
}

export function register(credentials: Credentials): Promise<AuthResponse> {
  return request<AuthResponse>(`${AUTH_PATH}/register`, {
    method: 'POST',
    body: credentials,
  });
}

export function getCurrentUser(): Promise<User> {
  return request<User>(`${AUTH_PATH}/me`);
}
