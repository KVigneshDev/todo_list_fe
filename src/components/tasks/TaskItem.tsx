import { useState } from 'react';
import type { KeyboardEvent } from 'react';

import { CalendarIcon, TrashIcon } from '@/components/icons';
import { Checkbox } from '@/components/ui/Checkbox';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/lib/cn';
import { describeDueDate } from '@/lib/date';
import { priorityColor } from '@/theme/theme';
import type { Task, TaskPriority, UpdateTaskInput } from '@/types/task';

/** Small due-date badge, coloured by urgency (unless the task is done). */
function DueBadge({ iso, completed }: { iso: string; completed: boolean }) {
  const { label, overdue, soon } = describeDueDate(iso);
  const tone =
    completed || (!overdue && !soon)
      ? 'text-content-muted'
      : overdue
        ? 'text-danger'
        : 'text-accent';

  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium', tone)}>
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

const PRIORITY_ORDER: readonly TaskPriority[] = ['low', 'medium', 'high'];
const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const beginEdit = () => {
    setDraft(task.title);
    setIsEditing(true);
  };

  const commitEdit = () => {
    setIsEditing(false);
    const next = draft.trim();
    if (next && next !== task.title) {
      onUpdate(task.id, { title: next });
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setDraft(task.title);
  };

  const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitEdit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cancelEdit();
    }
  };

  const cyclePriority = () => {
    const currentIndex = PRIORITY_ORDER.indexOf(task.priority);
    const next = PRIORITY_ORDER[(currentIndex + 1) % PRIORITY_ORDER.length] ?? 'medium';
    onUpdate(task.id, { priority: next });
  };

  return (
    <li className="group flex items-start gap-3 rounded-lg border border-border bg-surface px-3 py-3 shadow-sm transition-colors animate-fade-in-up hover:border-border-strong">
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
        title={`Priority: ${PRIORITY_LABEL[task.priority]}`}
        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-offset-2 ring-offset-surface"
        style={{ backgroundColor: priorityColor[task.priority] }}
      />

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleEditKeyDown}
            autoFocus
            aria-label="Edit task title"
            className="h-7 w-full rounded border border-accent bg-surface px-2 text-sm text-content focus:outline-none"
          />
        ) : (
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
        )}

        {!isEditing && (task.due_date || task.description) && (
          <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            {task.due_date && (
              <DueBadge iso={task.due_date} completed={task.is_completed} />
            )}
            {task.description && (
              <p className="truncate text-xs text-content-muted">{task.description}</p>
            )}
          </div>
        )}
      </div>

      <IconButton
        label={`Delete "${task.title}"`}
        tone="danger"
        onClick={() => onDelete(task.id)}
        className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      >
        <TrashIcon className="h-4 w-4" />
      </IconButton>
    </li>
  );
}
