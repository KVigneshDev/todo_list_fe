import { CheckIcon } from '@/components/icons';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { UserMenu } from '@/components/layout/UserMenu';

/** Sticky top bar: brand mark on the left, theme toggle + account on the right. */
export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-hover text-accent-contrast shadow-glow">
            <CheckIcon className="h-4 w-4" strokeWidth={3} />
          </div>
          <span className="text-base font-bold tracking-tight text-gradient">Tasks</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
