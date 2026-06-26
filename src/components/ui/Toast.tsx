import { useEffect } from 'react';

import { XIcon } from '@/components/icons';

interface ToastProps {
  message: string;
  onClose: () => void;
  /** Auto-dismiss delay in ms. */
  duration?: number;
}

/** A single, transient notification (used here for error feedback). */
export function Toast({ message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-6 z-50 mx-auto flex w-fit max-w-[90%] items-center gap-3 rounded-xl border border-border bg-content px-4 py-2.5 text-sm text-content-inverted shadow-pop animate-fade-in-up"
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="text-content-inverted/60 transition-colors hover:text-content-inverted"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
