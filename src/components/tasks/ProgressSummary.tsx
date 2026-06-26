import type { TaskStats } from '@/types/task';

/** A slim progress bar showing how much of the list is done. */
export function ProgressSummary({ stats }: { stats: TaskStats }) {
  const percent =
    stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs text-content-secondary">
        <span>
          {stats.completed} of {stats.total} done
        </span>
        <span className="tabular-nums">{percent}%</span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
