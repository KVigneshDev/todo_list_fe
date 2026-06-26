import { AlertIcon, CheckCircleIcon, CircleIcon, ListIcon } from '@/components/icons';
import { cn } from '@/lib/cn';
import type { TaskStats } from '@/types/task';

/** A circular SVG progress ring with the percentage in the middle. */
function ProgressRing({ percent }: { percent: number }) {
  const size = 76;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-surface-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-accent transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold tabular-nums text-content">{percent}%</span>
      </div>
    </div>
  );
}

interface StatChipProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  tone?: 'default' | 'accent' | 'success' | 'danger';
}

const chipTone: Record<NonNullable<StatChipProps['tone']>, string> = {
  default: 'text-content-secondary',
  accent: 'text-accent',
  success: 'text-success',
  danger: 'text-danger',
};

function StatChip({ icon, value, label, tone = 'default' }: StatChipProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background/40 px-3 py-2">
      <span className={cn('shrink-0', chipTone[tone])}>{icon}</span>
      <div className="min-w-0 leading-tight">
        <div className="text-base font-semibold tabular-nums text-content">{value}</div>
        <div className="truncate text-xs text-content-muted">{label}</div>
      </div>
    </div>
  );
}

interface StatsPanelProps {
  stats: TaskStats;
  /** Overdue tasks among the ones currently loaded. */
  overdue: number;
}

/** Headline progress card: completion ring + a row of count chips. */
export function StatsPanel({ stats, overdue }: StatsPanelProps) {
  const percent =
    stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  const allDone = stats.total > 0 && stats.active === 0;

  return (
    <section className="rounded-2xl border border-border bg-surface p-4 shadow-card animate-fade-in-up">
      <div className="flex items-center gap-4">
        <ProgressRing percent={percent} />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-content">
            {allDone ? '🎉 All caught up!' : 'Your progress'}
          </p>
          <p className="mt-0.5 text-xs text-content-secondary">
            {allDone
              ? 'Every task is complete — nice work.'
              : `${stats.active} task${stats.active === 1 ? '' : 's'} left to do`}
          </p>

          <div
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatChip
          icon={<ListIcon className="h-4 w-4" />}
          value={stats.total}
          label="Total"
        />
        <StatChip
          icon={<CircleIcon className="h-4 w-4" />}
          value={stats.active}
          label="Active"
          tone="accent"
        />
        <StatChip
          icon={<CheckCircleIcon className="h-4 w-4" />}
          value={stats.completed}
          label="Done"
          tone="success"
        />
        <StatChip
          icon={<AlertIcon className="h-4 w-4" />}
          value={overdue}
          label="Overdue"
          tone={overdue > 0 ? 'danger' : 'default'}
        />
      </div>
    </section>
  );
}
