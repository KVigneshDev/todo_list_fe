import { useEffect, useRef, useState } from 'react';

import { LogOutIcon } from '@/components/icons';
import { useAuth } from '@/context/AuthContext';

/** Avatar button that opens a small menu with the email + sign out. */
export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const email = user?.email ?? '';
  const initials = email.slice(0, 2).toUpperCase() || '?';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent transition-colors hover:bg-accent/15"
      >
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-surface shadow-pop animate-fade-in-up"
        >
          <div className="border-b border-border px-3 py-2.5">
            <p className="text-xs text-content-muted">Signed in as</p>
            <p className="truncate text-sm font-medium text-content">{email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={logout}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-content-secondary transition-colors hover:bg-surface-muted hover:text-content"
          >
            <LogOutIcon className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
