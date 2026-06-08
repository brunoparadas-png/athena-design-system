import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';
import { Icon, type IconName } from '../Icon';

export type ButtonAppearance = 'primary' | 'neutral' | 'text' | 'danger';
export type ButtonSize = 'default' | 'small';

/**
 * Prop names mirror the Figma "❖ Button" component properties:
 * appearance, size, label, iconBefore, iconAfter, isSelected, isDisabled.
 * (`loading` is an implementation extra, not a Figma property.)
 */
export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'disabled'> {
  /**
   * Visual weight. `primary` carries the single forest.500 moment per view —
   * never render two `primary` buttons on the same view. (Figma: appearance)
   */
  appearance?: ButtonAppearance;
  /** `default` is 40px tall, `small` is 32px. Both use body-m (14px). */
  size?: ButtonSize;
  /** Sentence-case label. Required unless the button is icon-only (then set `aria-label`). */
  label?: ReactNode;
  /** Leading icon, by name from the Athena set. (Figma: iconBefore) */
  iconBefore?: IconName;
  /** Trailing icon, by name — often a chevron. (Figma: iconAfter) */
  iconAfter?: IconName;
  /**
   * Toggle-on state. Renders the forest tint (forest.50 fill + forest.700
   * border/text) across all appearances and exposes `aria-pressed`. (Figma: isSelected)
   */
  isSelected?: boolean;
  /** Disabled state. (Figma: isDisabled) */
  isDisabled?: boolean;
  /** Locks the button and swaps the label for a spinner; sets aria-busy. */
  loading?: boolean;
}

export function Button({
  appearance = 'neutral',
  size = 'default',
  label,
  iconBefore,
  iconAfter,
  isSelected = false,
  isDisabled = false,
  loading = false,
  type = 'button',
  ...rest
}: ButtonProps) {
  const className = [
    styles.button,
    styles[appearance],
    styles[size],
    isSelected ? styles.selected : '',
    loading ? styles.loading : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={className}
      disabled={isDisabled || loading}
      aria-busy={loading || undefined}
      aria-pressed={isSelected || undefined}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={styles.content} aria-live="polite">
        {iconBefore && (
          <span className={styles.icon} aria-hidden="true">
            <Icon name={iconBefore} size={16} />
          </span>
        )}
        {label}
        {iconAfter && (
          <span className={styles.icon} aria-hidden="true">
            <Icon name={iconAfter} size={16} />
          </span>
        )}
      </span>
    </button>
  );
}
