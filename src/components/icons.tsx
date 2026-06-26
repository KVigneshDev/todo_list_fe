/** Minimal inline icon set (no icon dependency). Color follows `currentColor`. */

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const baseProps: IconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function PlusIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m1 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function ClipboardIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <rect x="8" y="4" width="8" height="4" rx="1" />
      <path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18M8 2v4M16 2v4" />
    </svg>
  );
}

export function LogOutIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

export function SortIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <path d="M3 6h12M3 12h9M3 18h6M17 8l4-4 4 4M21 4v16" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

export function FlagIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
    </svg>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

export function CircleIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <svg {...baseProps} aria-hidden {...props}>
      <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20" />
    </svg>
  );
}
