/** Small date helpers for displaying and editing due dates. */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export interface DueDateInfo {
  label: string;
  /** Past due and still relevant (caller decides whether to dim if completed). */
  overdue: boolean;
  /** Due today or tomorrow. */
  soon: boolean;
}

/** Turn an ISO timestamp into a friendly relative label + urgency flags. */
export function describeDueDate(iso: string): DueDateInfo {
  const due = new Date(iso);
  const diffDays = Math.round(
    (startOfDay(due).getTime() - startOfDay(new Date()).getTime()) / MS_PER_DAY,
  );

  let label: string;
  if (diffDays === 0) label = 'Today';
  else if (diffDays === 1) label = 'Tomorrow';
  else if (diffDays === -1) label = 'Yesterday';
  else {
    label = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  return { label, overdue: diffDays < 0, soon: diffDays === 0 || diffDays === 1 };
}

/** ISO timestamp -> `yyyy-mm-dd` for a native `<input type="date">`. */
export function isoToDateInput(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** `yyyy-mm-dd` from a date input -> ISO timestamp (local midnight), or null. */
export function dateInputToIso(value: string): string | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
