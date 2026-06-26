import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

// The theme tokens are the single source of truth (see src/theme/theme.ts).
// Tailwind's utility classes are generated from them here, and the actual color
// values are injected as CSS variables (per theme) by the base plugin below.
import {
  colorTokens,
  font,
  palettes,
  radius,
  shadow,
} from './src/theme/theme';
import type { Palette } from './src/theme/theme';

/** `bg-surface`, `text-content`, `bg-accent/15`, … all resolve to a CSS var. */
const colors = Object.fromEntries(
  colorTokens.map((token) => [token, `rgb(var(--${token}) / <alpha-value>)`]),
);

/** Emit `--token: R G B;` declarations for one palette. */
function cssVars(palette: Palette): Record<string, string> {
  return Object.fromEntries(
    Object.entries(palette).map(([token, value]) => [`--${token}`, value]),
  );
}

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors,
      borderRadius: radius,
      boxShadow: shadow,
      // Spread into a mutable array (tokens are `as const` / readonly).
      fontFamily: { sans: [...font.sans] },
      // Make the bare `border` utility use our token color by default.
      borderColor: { DEFAULT: 'rgb(var(--border) / <alpha-value>)' },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'pop': {
          '0%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.18)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.2s ease-out',
        'scale-in': 'scale-in 0.14s ease-out',
        pop: 'pop 0.28s ease-out',
      },
    },
  },
  plugins: [
    // Inject the per-theme CSS variables once, at the base layer.
    plugin(({ addBase }) => {
      addBase({
        ':root': cssVars(palettes.light),
        '.dark': cssVars(palettes.dark),
      });
    }),
  ],
} satisfies Config;
