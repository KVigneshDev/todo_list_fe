/** Auth-related domain types. Mirrors the backend's auth schemas. */

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
