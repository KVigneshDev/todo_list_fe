/**
 * Tiny className combiner. Filters out falsy values so components can write
 * conditional classes inline: `cn('base', isActive && 'active')`.
 *
 * Kept dependency-free on purpose -- it covers everything this app needs.
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
