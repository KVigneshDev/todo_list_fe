import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-content',
          'placeholder:text-content-muted',
          'transition-colors hover:border-border-strong focus:border-accent',
          className,
        )}
        {...props}
      />
    );
  },
);
