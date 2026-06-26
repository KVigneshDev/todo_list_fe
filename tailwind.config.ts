import type { Config } from 'tailwindcss';

// The theme tokens are the single source of truth (see src/theme/theme.ts).
// Tailwind's utility classes are generated from them here.
import { theme as tokens } from './src/theme/theme';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: tokens.colors,
      borderRadius: tokens.radius,
      boxShadow: tokens.shadow,
      // Spread into a mutable array (tokens are `as const` / readonly).
      fontFamily: { sans: [...tokens.font.sans] },
      // Make the bare `border` utility use our token color by default.
      borderColor: {
        DEFAULT: tokens.colors.border.DEFAULT,
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(3px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.16s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
