import { useState } from 'react';
import type { FormEvent } from 'react';

import { CalendarIcon, PlusIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { dateInputToIso } from '@/lib/date';
import type { CreateTaskInput, TaskPriority } from '@/types/task';

interface TaskComposerProps {
  onCreate: (input: CreateTaskInput) => void;
  isCreating: boolean;
}

/** The "add a task" card: title + priority + optional due date. */
export function TaskComposer({ onCreate, isCreating }: TaskComposerProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  const trimmed = title.trim();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!trimmed) return;
    onCreate({
      title: trimmed,
      priority,
      due_date: dateInputToIso(dueDate),
    });
    // Reset the title/date but keep priority for adding similar tasks quickly.
    setTitle('');
    setDueDate('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-surface p-3 shadow-card"
    >
      <div className="flex items-center gap-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a task…"
          aria-label="Task title"
          autoFocus
          className="h-9 flex-1 bg-transparent px-2 text-sm text-content placeholder:text-content-muted focus:outline-none"
        />
        <Button type="submit" size="sm" isLoading={isCreating} disabled={!trimmed}>
          <PlusIcon className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-border pt-2">
        <label className="sr-only" htmlFor="composer-priority">
          Priority
        </label>
        <select
          id="composer-priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value as TaskPriority)}
          className="h-8 rounded-md border border-border bg-surface px-2 text-xs font-medium text-content-secondary transition-colors focus:border-accent"
        >
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>

        <div className="relative">
          <CalendarIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-content-muted" />
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            aria-label="Due date"
            className="h-8 rounded-md border border-border bg-surface pl-8 pr-2 text-xs font-medium text-content-secondary transition-colors focus:border-accent"
          />
        </div>
      </div>
    </form>
  );
}
