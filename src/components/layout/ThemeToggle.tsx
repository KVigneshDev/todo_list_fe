import { MoonIcon, SunIcon } from '@/components/icons';
import { useTheme } from '@/context/ThemeContext';

/** Compact sun/moon button that flips the app between light and dark. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-content-secondary transition-colors hover:border-border-strong hover:text-content"
    >
      <SunIcon
        className={`h-4 w-4 transition-all duration-300 ${
          isDark ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      />
      <MoonIcon
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'
        }`}
      />
    </button>
  );
}
