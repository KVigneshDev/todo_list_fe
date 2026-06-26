import { useState } from 'react';
import type { KeyboardEvent } from 'react';

import { CalendarIcon, PencilIcon, TrashIcon } from '@/components/icons';
import { PrioritySelect } from '@/components/tasks/PrioritySelect';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/lib/cn';
import { describeDueDate, dateInputToIso, isoToDateInput } from '@/lib/date';
import { nextPriority, PRIORITY_LABEL, priorityColor } from '@/lib/priority';
import type { Task, TaskPriority, UpdateTaskInput } from '@/types/task';

/** Small due-date badge, coloured by urgency (unless the task is done). */
function DueBadge({ iso, completed }: { iso: string; completed: boolean }) {
  const { label, overdue, soon } = describeDueDate(iso);
  const tone =
    completed || (!overdue && !soon)
      ? 'border-border bg-surface-muted text-content-secondary'
      : overdue
        ? 'border-danger/30 bg-danger-soft text-danger'
        : 'border-accent/30 bg-accent-soft text-accent';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs font-medium',
        tone,
      )}
    >
      <CalendarIcon className="h-3 w-3" />
      {overdue && !completed ? `Overdue · ${label}` : label}
    </span>
  );
}

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, input: UpdateTaskInput) => void;
  onDelete: (id: string) => void;
}

interface Draft {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
}

function draftFromTask(task: Task): Draft {
  return {
    title: task.title,
    description: task.description ?? '',
    priority: task.priority,
    dueDate: isoToDateInput(task.due_date),
  };
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => draftFromTask(task));

  const beginEdit = () => {
    setDraft(draftFromTask(task));
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  const saveEdit = () => {
    const title = draft.title.trim();
    if (!title) return;

    const patch: UpdateTaskInput = {};
    if (title !== task.title) patch.title = title;
    const description = draft.description.trim() || null;
    if (description !== (task.description ?? null)) patch.description = description;
    if (draft.priority !== task.priority) patch.priority = draft.priority;
    const dueIso = dateInputToIso(draft.dueDate);
    if (dueIso !== task.due_date) patch.due_date = dueIso;

    if (Object.keys(patch).length > 0) onUpdate(task.id, patch);
    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveEdit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cancelEdit();
    }
  };

  const cyclePriority = () =>
    onUpdate(task.id, { priority: nextPriority(task.priority) });

  if (isEditing) {
    return (
      <li className="rounded-xl border border-accent/40 bg-surface p-3 shadow-glow animate-scale-in">
        <input
          value={draft.title}
          onChange={(event) => setDraft((d) => ({ ...d, title: event.target.value }))}
          onKeyDown={handleKeyDown}
          autoFocus
          aria-label="Edit task title"
          placeholder="Task title"
          className="w-full rounded-lg border border-border bg-surface px-2.5 py-2 text-sm font-medium text-content transition-colors focus:border-accent focus:outline-none"
        />
        <textarea
          value={draft.description}
          onChange={(event) =>
            setDraft((d) => ({ ...d, description: event.target.value }))
          }
          placeholder="Add details (optional)"
          aria-label="Edit task description"
          rows={2}
          className="mt-2 w-full resize-none rounded-lg border border-border bg-surface px-2.5 py-2 text-sm text-content placeholder:text-content-muted transition-colors focus:border-accent focus:outline-none"
        />

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <PrioritySelect
            value={draft.priority}
            onChange={(priority) => setDraft((d) => ({ ...d, priority }))}
          />
          <div className="relative">
            <CalendarIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-content-muted" />
            <input
              type="date"
              value={draft.dueDate}
              onChange={(event) =>
                setDraft((d) => ({ ...d, dueDate: event.target.value }))
              }
              aria-label="Edit due date"
              className="h-7 rounded-lg border border-border bg-surface pl-8 pr-2 text-xs font-medium text-content-secondary transition-colors focus:border-accent"
            />
          </div>
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={cancelEdit}>
            Cancel
          </Button>
          <Button size="sm" onClick={saveEdit} disabled={!draft.title.trim()}>
            Save
          </Button>
        </div>
      </li>
    );
  }

  return (
    <li className="group relative flex items-start gap-3 overflow-hidden rounded-xl border border-border bg-surface py-3 pl-4 pr-3 shadow-sm transition-all animate-fade-in-up hover:border-border-strong hover:shadow-card">
      {/* Priority accent bar down the left edge. */}
      <span
        aria-hidden
        className="absolute inset-y-2 left-0 w-1 rounded-full transition-opacity"
        style={{
          backgroundColor: priorityColor[task.priority],
          opacity: task.is_completed ? 0.25 : 1,
        }}
      />

      <div className="pt-0.5">
        <Checkbox
          checked={task.is_completed}
          onChange={() => onUpdate(task.id, { is_completed: !task.is_completed })}
          label={`Mark "${task.title}" as ${task.is_completed ? 'active' : 'complete'}`}
        />
      </div>

      <button
        type="button"
        onClick={cyclePriority}
        aria-label={`Priority: ${PRIORITY_LABEL[task.priority]}. Click to change.`}
        title={`Priority: ${PRIORITY_LABEL[task.priority]} (click to change)`}
        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-offset-2 ring-offset-surface transition-transform hover:scale-125"
        style={{ backgroundColor: priorityColor[task.priority] }}
      />

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={beginEdit}
          className={cn(
            'block w-full truncate text-left text-sm transition-colors',
            task.is_completed
              ? 'text-content-muted line-through'
              : 'text-content hover:text-accent',
          )}
        >
          {task.title}
        </button>

        {(task.due_date || task.description) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            {task.due_date && (
              <DueBadge iso={task.due_date} completed={task.is_completed} />
            )}
            {task.description && (
              <p className="truncate text-xs text-content-muted">{task.description}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <IconButton label={`Edit "${task.title}"`} onClick={beginEdit}>
          <PencilIcon className="h-4 w-4" />
        </IconButton>
        <IconButton
          label={`Delete "${task.title}"`}
          tone="danger"
          onClick={() => onDelete(task.id)}
        >
          <TrashIcon className="h-4 w-4" />
        </IconButton>
      </div>
    </li>
  );
}
