/**
 * Global design tokens -- the SINGLE SOURCE OF TRUTH for the app's theme.
 *
 * Everything visual derives from this file:
 *   - `tailwind.config.ts` imports these tokens, so utility classes like
 *     `bg-surface`, `text-content`, `border-border`, `bg-accent` are generated
 *     directly from the values below.
 *   - Components import `theme` (or the helpers at the bottom) when they need a
 *     raw value in a non-className context (inline styles, canvas, charts...).
 *
 * To re-theme the whole application, change the values here -- nothing else.
 *
 * The palette is intentionally minimal: a neutral gray surface system plus a
 * single indigo accent, so the UI stays calm and consistent throughout.
 */

export const theme = {
  colors: {
    /** App canvas behind cards. */
    background: '#F7F7F8',
    /** Card / elevated surfaces. */
    surface: {
      DEFAULT: '#FFFFFF',
      muted: '#F2F2F4',
    },
    /** Hairline borders and dividers. */
    border: {
      DEFAULT: '#E7E7EA',
      strong: '#D7D7DC',
    },
    /** Text colors, from most to least prominent. */
    content: {
      DEFAULT: '#1A1A1E',
      secondary: '#56565F',
      muted: '#9A9AA3',
      inverted: '#FFFFFF',
    },
    /** Single brand accent used for primary actions and focus. */
    accent: {
      DEFAULT: '#4F46E5',
      hover: '#4338CA',
      soft: '#EEF0FF',
      contrast: '#FFFFFF',
    },
    success: {
      DEFAULT: '#15A34A',
      soft: '#F0FDF4',
    },
    danger: {
      DEFAULT: '#DC2626',
      hover: '#B91C1C',
      soft: '#FEF2F2',
    },
    /** Per-priority accent dots. */
    priority: {
      low: '#94969F',
      medium: '#E0A100',
      high: '#E5484D',
    },
  },

  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  shadow: {
    sm: '0 1px 2px rgba(16, 17, 26, 0.04)',
    card: '0 1px 3px rgba(16, 17, 26, 0.06), 0 1px 2px rgba(16, 17, 26, 0.04)',
    pop: '0 8px 24px rgba(16, 17, 26, 0.12)',
  },

  font: {
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
  },
} as const;

export type Theme = typeof theme;
export type TaskPriorityKey = keyof typeof theme.colors.priority;

/**
 * Priority -> color, for use directly in TS (e.g. the colored dot on a task).
 * Derived from the theme so it stays in sync automatically.
 */
export const priorityColor: Record<TaskPriorityKey, string> = theme.colors.priority;
