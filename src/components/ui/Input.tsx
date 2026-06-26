import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-content',
          'placeholder:text-content-muted',
          'transition-colors focus:border-accent',
          className,
        )}
        {...props}
      />
    );
  },
);
