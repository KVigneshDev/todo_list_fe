import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

// All colors resolve to theme tokens (see src/theme/theme.ts).
const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-contrast shadow-sm hover:bg-accent-hover hover:shadow-glow',
  secondary:
    'border border-border bg-surface text-content hover:border-border-strong hover:bg-surface-muted',
  ghost: 'bg-transparent text-content-secondary hover:bg-surface-muted hover:text-content',
  danger: 'bg-danger text-white shadow-sm hover:bg-danger-hover',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', isLoading = false, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 rounded-lg font-medium',
        'transition-all duration-150 active:scale-[0.97]',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {isLoading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
});
