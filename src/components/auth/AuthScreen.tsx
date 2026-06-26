import { useState } from 'react';
import type { FormEvent } from 'react';

import { CheckIcon, EyeIcon, EyeOffIcon } from '@/components/icons';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

type Mode = 'login' | 'register';

export function AuthScreen() {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === 'register';

  const switchMode = () => {
    setMode(isRegister ? 'login' : 'register');
    setError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (isRegister && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const credentials = { email: email.trim(), password };
      if (isRegister) {
        await register(credentials);
      } else {
        await login(credentials);
      }
      // On success the auth state flips and this screen unmounts.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-full items-center justify-center px-4 py-12">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-hover text-accent-contrast shadow-glow">
            <CheckIcon className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-content">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-1.5 text-sm text-content-secondary">
            {isRegister
              ? 'Start organising your tasks in seconds.'
              : 'Sign in to pick up where you left off.'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-card"
        >
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-content">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-content">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={isRegister ? 'At least 8 characters' : '••••••••'}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-content-muted transition-colors hover:bg-surface-muted hover:text-content"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-danger/20 bg-danger-soft px-3 py-2 text-sm text-danger animate-scale-in"
            >
              {error}
            </p>
          )}

          <Button type="submit" isLoading={submitting} className="w-full">
            {isRegister ? 'Create account' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-content-secondary">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={switchMode}
            className="font-medium text-accent transition-colors hover:text-accent-hover"
          >
            {isRegister ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
