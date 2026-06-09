import type { HTMLAttributes } from 'react';
import styles from './ProgressBar.module.css';

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

export function ProgressBar({
  value = 0,
  appearance = 'default',
  label,
  ...rest
}: ProgressBarProps) {
  const fraction = clamp01(value);
  const pct = Math.round(fraction * 100);

  const className = [styles.track, styles[appearance]].join(' ');

  return (
    <div
      className={className}
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      {...rest}
    >
      <div className={styles.bar} style={{ width: `${pct}%` }} />
    </div>
  );
}
