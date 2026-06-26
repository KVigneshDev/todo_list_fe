import { CheckIcon } from '@/components/icons';
import { cn } from '@/lib/cn';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  /** Accessible label, e.g. "Mark 'Buy milk' as complete". */
  label: string;
  disabled?: boolean;
}

/** Round, accent-filled completion toggle. */
export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        checked
          ? 'border-accent bg-accent text-accent-contrast'
          : 'border-border-strong bg-surface text-transparent hover:border-accent',
      )}
    >
      <CheckIcon className="h-3 w-3" strokeWidth={3} />
    </button>
  );
}
