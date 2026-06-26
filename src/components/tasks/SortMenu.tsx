import { useEffect, useRef, useState } from 'react';

import { CheckIcon, ChevronDownIcon, SortIcon } from '@/components/icons';
import { cn } from '@/lib/cn';
import type { TaskSort } from '@/types/task';

interface SortMenuProps {
  value: TaskSort;
  onChange: (sort: TaskSort) => void;
}

const SORT_OPTIONS: ReadonlyArray<{ value: TaskSort; label: string }> = [
  { value: 'created_desc', label: 'Newest first' },
  { value: 'created_asc', label: 'Oldest first' },
  { value: 'due_date', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title_asc', label: 'Alphabetical' },
];

/** A compact popover for choosing how the task list is ordered. */
export function SortMenu({ value, onChange }: SortMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const activeLabel =
    SORT_OPTIONS.find((option) => option.value === value)?.label ?? 'Sort';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-sm font-medium text-content-secondary transition-colors hover:border-border-strong hover:text-content"
      >
        <SortIcon className="h-4 w-4" />
        <span className="hidden sm:inline">{activeLabel}</span>
        <ChevronDownIcon
          className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-pop animate-scale-in"
        >
          {SORT_OPTIONS.map((option) => {
            const isActive = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-accent-soft text-accent'
                    : 'text-content-secondary hover:bg-surface-muted hover:text-content',
                )}
              >
                {option.label}
                {isActive && <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
