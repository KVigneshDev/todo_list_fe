import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type Tone = 'default' | 'danger';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
  /** Required: icon-only buttons must be labelled for screen readers. */
  label: string;
}

const toneClasses: Record<Tone, string> = {
  default: 'text-content-muted hover:bg-surface-muted hover:text-content',
  danger: 'text-content-muted hover:bg-danger-soft hover:text-danger',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ tone = 'default', label, className, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors',
          'disabled:cursor-not-allowed disabled:opacity-50',
          toneClasses[tone],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
