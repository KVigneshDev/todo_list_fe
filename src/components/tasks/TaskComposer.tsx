import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { FormEvent } from 'react';

import { CalendarIcon, PlusIcon } from '@/components/icons';
import { PrioritySelect } from '@/components/tasks/PrioritySelect';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { dateInputToIso } from '@/lib/date';
import type { CreateTaskInput, TaskPriority } from '@/types/task';

interface TaskComposerProps {
  onCreate: (input: CreateTaskInput) => void;
  isCreating: boolean;
}

/** Imperative handle so a keyboard shortcut elsewhere can focus the input. */
export interface TaskComposerHandle {
  focus: () => void;
}

/** The "add a task" card: title + priority + optional details & due date. */
export const TaskComposer = forwardRef<TaskComposerHandle, TaskComposerProps>(
  function TaskComposer({ onCreate, isCreating }, ref) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [dueDate, setDueDate] = useState('');
    const [expanded, setExpanded] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }), []);

    const trimmed = title.trim();

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      if (!trimmed) return;
      onCreate({
        title: trimmed,
        description: description.trim() || null,
        priority,
        due_date: dateInputToIso(dueDate),
      });
      // Reset everything except priority, so similar tasks are quick to add.
      setTitle('');
      setDescription('');
      setDueDate('');
      inputRef.current?.focus();
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-surface p-2.5 shadow-card transition-shadow focus-within:shadow-glow"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <PlusIcon className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <input
            ref={inputRef}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onFocus={() => setExpanded(true)}
            placeholder="Add a task…"
            aria-label="Task title"
            autoFocus
            className="h-9 flex-1 bg-transparent text-sm text-content placeholder:text-content-muted focus:outline-none"
          />
          <Button type="submit" size="sm" isLoading={isCreating} disabled={!trimmed}>
            Add
          </Button>
        </div>

        <div
          className={cn(
            'grid transition-all duration-200 ease-out',
            expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="overflow-hidden">
            <div className="mt-2 space-y-2.5 border-t border-border pt-2.5">
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add details (optional)"
                aria-label="Task description"
                rows={2}
                className="w-full resize-none rounded-lg border border-border bg-surface px-2.5 py-2 text-sm text-content placeholder:text-content-muted transition-colors hover:border-border-strong focus:border-accent focus:outline-none"
              />

              <div className="flex flex-wrap items-center gap-2">
                <PrioritySelect value={priority} onChange={setPriority} />

                <div className="relative">
                  <CalendarIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-content-muted" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    aria-label="Due date"
                    className="h-7 rounded-lg border border-border bg-surface pl-8 pr-2 text-xs font-medium text-content-secondary transition-colors hover:border-border-strong focus:border-accent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  },
);
