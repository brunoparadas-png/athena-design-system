import type { HTMLAttributes } from 'react';

export type ProgressBarAppearance = 'default' | 'success' | 'inverse';

/**
 * Mirrors the Figma "❖ Progress bar" types:
 * - default  → "Progress bar" (forest fill on a subtle track)
 * - inverse  → "Transparent progress bar" (white fill on a translucent dark
 *   track, for dark/colored surfaces)
 * - success  → "Success progress bar" (the completed state; forest, since
 *   forest IS the system green)
 *
 * Displays the status of a determinate process. `value` is 0–1.
 */
export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Completion from 0 to 1. Clamped. (Figma: value) */
  value?: number;
  /** Visual treatment. (Figma: type) */
  appearance?: ProgressBarAppearance;
  /** Accessible name for the progress bar (recommended). */
  label?: string;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

const trackClasses: Record<ProgressBarAppearance, string> = {
  default: '[background-color:rgba(5,21,36,0.06)]',
  success: '[background-color:rgba(5,21,36,0.06)]',
  inverse: '[background-color:rgba(0,0,0,0.16)]',
};

const fillClasses: Record<ProgressBarAppearance, string> = {
  default: 'bg-forest-500',
  success: 'bg-forest-500',
  inverse: 'bg-white',
};

export function ProgressBar({
  value = 0,
  appearance = 'default',
  label,
  ...rest
}: ProgressBarProps) {
  const fraction = clamp01(value);
  const pct = Math.round(fraction * 100);

  return (
    <div
      className={`relative w-full h-1.5 rounded-full overflow-hidden ${trackClasses[appearance]}`}
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      {...rest}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-200 ease-[ease] motion-reduce:transition-none ${fillClasses[appearance]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
