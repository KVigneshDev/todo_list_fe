import { CheckIcon } from '@/components/icons';
import { UserMenu } from '@/components/layout/UserMenu';

/** Sticky top bar: brand mark on the left, account menu on the right. */
export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-contrast">
            <CheckIcon className="h-4 w-4" strokeWidth={3} />
          </div>
          <span className="text-sm font-semibold tracking-tight text-content">Tasks</span>
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
