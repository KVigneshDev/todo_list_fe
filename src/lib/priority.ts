/** Shared priority metadata used by the composer, badges, and task rows. */

import { priorityColor } from '@/theme/theme';
import type { TaskPriority } from '@/types/task';

export const PRIORITY_ORDER: readonly TaskPriority[] = ['low', 'medium', 'high'];

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export { priorityColor };

/** The next priority in the low -> medium -> high -> low cycle. */
export function nextPriority(current: TaskPriority): TaskPriority {
  const index = PRIORITY_ORDER.indexOf(current);
  return PRIORITY_ORDER[(index + 1) % PRIORITY_ORDER.length] ?? 'medium';
}
