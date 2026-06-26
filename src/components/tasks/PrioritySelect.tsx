import { cn } from '@/lib/cn';
import { PRIORITY_LABEL, PRIORITY_ORDER, priorityColor } from '@/lib/priority';
import type { TaskPriority } from '@/types/task';

interface PrioritySelectProps {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
  /** Smaller variant for inline use inside a task row. */
  size?: 'sm' | 'md';
}

/** A segmented control for picking a priority, with a colored dot per option. */
export function PrioritySelect({ value, onChange, size = 'md' }: PrioritySelectProps) {
  return (
    <div
      role="group"
      aria-label="Priority"
      className="inline-flex rounded-lg border border-border bg-surface p-0.5"
    >
      {PRIORITY_ORDER.map((priority) => {
        const isActive = value === priority;
        return (
          <button
            key={priority}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(priority)}
            className={cn(
              'flex items-center gap-1.5 rounded-md font-medium transition-colors',
              size === 'sm' ? 'h-6 px-2 text-xs' : 'h-7 px-2.5 text-xs',
              isActive
                ? 'bg-accent-soft text-accent'
                : 'text-content-muted hover:text-content',
            )}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: priorityColor[priority] }}
            />
            {PRIORITY_LABEL[priority]}
          </button>
        );
      })}
    </div>
  );
}
