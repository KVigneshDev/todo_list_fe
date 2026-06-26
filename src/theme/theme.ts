/**
 * Global design tokens -- the SINGLE SOURCE OF TRUTH for the app's theme.
 *
 * Everything visual derives from this file:
 *   - Colors are defined as RGB channel triplets (e.g. "255 255 255") for both
 *     the `light` and `dark` palettes below. A Tailwind plugin (see
 *     `tailwind.config.ts`) injects them as CSS custom properties on `:root`
 *     and `.dark`, so switching themes is a single class toggle on <html>.
 *   - Tailwind utility classes (`bg-surface`, `text-content`, `bg-accent`, …)
 *     map to `rgb(var(--token) / <alpha-value>)`, so alpha modifiers like
 *     `bg-accent/15` keep working and every color is theme-aware automatically.
 *   - Components import the helpers at the bottom when they need a raw value in
 *     a non-className context (inline styles for the priority dots, etc.).
 *
 * To re-theme the whole application, change the values here -- nothing else.
 */

/** The set of semantic color tokens shared by every theme. */
export interface Palette {
  /** App canvas behind cards. */
  background: string;
  /** Card / elevated surfaces. */
  surface: string;
  'surface-muted': string;
  /** Hairline borders and dividers. */
  border: string;
  'border-strong': string;
  /** Text colors, from most to least prominent. */
  content: string;
  'content-secondary': string;
  'content-muted': string;
  'content-inverted': string;
  /** Single brand accent used for primary actions and focus. */
  accent: string;
  'accent-hover': string;
  'accent-soft': string;
  'accent-contrast': string;
  /** Positive / destructive feedback. */
  success: string;
  'success-soft': string;
  danger: string;
  'danger-hover': string;
  'danger-soft': string;
  /** Per-priority accent dots / badges. */
  'priority-low': string;
  'priority-medium': string;
  'priority-high': string;
}

/** Light theme (default). Calm neutral surfaces + an indigo accent. */
const light: Palette = {
  background: '248 249 251',
  surface: '255 255 255',
  'surface-muted': '243 244 247',
  border: '230 231 236',
  'border-strong': '213 215 222',
  content: '17 18 24',
  'content-secondary': '82 84 96',
  'content-muted': '146 148 160',
  'content-inverted': '255 255 255',
  accent: '79 70 229',
  'accent-hover': '67 56 202',
  'accent-soft': '238 240 255',
  'accent-contrast': '255 255 255',
  success: '21 163 74',
  'success-soft': '240 253 244',
  danger: '220 38 38',
  'danger-hover': '185 28 28',
  'danger-soft': '254 242 242',
  'priority-low': '148 150 160',
  'priority-medium': '217 119 6',
  'priority-high': '225 29 72',
};

/** Dark theme. Deep zinc surfaces with a brighter indigo accent. */
const dark: Palette = {
  background: '9 9 12',
  surface: '24 24 27',
  'surface-muted': '39 39 43',
  border: '38 38 43',
  'border-strong': '63 63 70',
  content: '244 244 245',
  'content-secondary': '161 161 170',
  'content-muted': '113 113 122',
  'content-inverted': '9 9 12',
  accent: '129 140 248',
  'accent-hover': '165 180 252',
  'accent-soft': '37 38 64',
  'accent-contrast': '12 12 16',
  success: '52 211 153',
  'success-soft': '12 39 33',
  danger: '248 113 113',
  'danger-hover': '252 165 165',
  'danger-soft': '48 21 24',
  'priority-low': '161 161 170',
  'priority-medium': '245 158 11',
  'priority-high': '251 113 133',
};

export const palettes = { light, dark } as const;
export type ThemeName = keyof typeof palettes;

/** Token names, derived from the light palette so the two stay in lockstep. */
export const colorTokens = Object.keys(light) as Array<keyof Palette>;

export const radius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
} as const;

export const shadow = {
  sm: '0 1px 2px rgb(9 9 12 / 0.06)',
  card: '0 1px 3px rgb(9 9 12 / 0.07), 0 1px 2px rgb(9 9 12 / 0.04)',
  pop: '0 12px 32px rgb(9 9 12 / 0.18), 0 2px 8px rgb(9 9 12 / 0.10)',
  glow: '0 0 0 1px rgb(79 70 229 / 0.18), 0 8px 24px rgb(79 70 229 / 0.22)',
} as const;

export const font = {
  sans: [
    'Inter',
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Roboto',
    'Helvetica',
    'Arial',
    'sans-serif',
  ],
} as const;

export type TaskPriorityKey = 'low' | 'medium' | 'high';

/**
 * Priority -> CSS color, for use directly in TS (e.g. the colored dot on a
 * task). References the theme-aware CSS variables so the dots recolor with the
 * active theme automatically.
 */
export const priorityColor: Record<TaskPriorityKey, string> = {
  low: 'rgb(var(--priority-low))',
  medium: 'rgb(var(--priority-medium))',
  high: 'rgb(var(--priority-high))',
};
