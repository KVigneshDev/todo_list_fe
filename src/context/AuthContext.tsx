/**
 * Authentication state for the whole app.
 *
 * Exposes the current user and `login` / `register` / `logout` actions. On
 * startup it validates any stored token by calling `/auth/me`, so a refresh
 * keeps the session (or cleanly drops an expired one). A 401 on any
 * authenticated request also logs the user out (via `onUnauthorized`).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import * as authApi from '@/api/auth';
import {
  clearToken,
  getToken,
  onUnauthorized,
  setToken,
} from '@/lib/authStorage';
import { queryClient } from '@/lib/queryClient';
import type { Credentials, User } from '@/types/auth';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (credentials: Credentials) => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  // Drop the session locally and clear any cached (now-inaccessible) data.
  const resetSession = useCallback(() => {
    clearToken();
    setUser(null);
    setStatus('unauthenticated');
    queryClient.clear();
  }, []);

  // React to a 401 on an authenticated request (expired/revoked token).
  useEffect(() => {
    onUnauthorized(() => {
      setUser(null);
      setStatus('unauthenticated');
      queryClient.clear();
    });
  }, []);

  // Validate a stored token on first load.
  useEffect(() => {
    let active = true;
    async function bootstrap() {
      if (!getToken()) {
        setStatus('unauthenticated');
        return;
      }
      try {
        const me = await authApi.getCurrentUser();
        if (active) {
          setUser(me);
          setStatus('authenticated');
        }
      } catch {
        if (active) resetSession();
      }
    }
    void bootstrap();
    return () => {
      active = false;
    };
  }, [resetSession]);

  const login = useCallback(async (credentials: Credentials) => {
    const result = await authApi.login(credentials);
    setToken(result.access_token);
    setUser(result.user);
    setStatus('authenticated');
  }, []);

  const register = useCallback(async (credentials: Credentials) => {
    const result = await authApi.register(credentials);
    setToken(result.access_token);
    setUser(result.user);
    setStatus('authenticated');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout: resetSession }),
    [user, status, login, register, resetSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
