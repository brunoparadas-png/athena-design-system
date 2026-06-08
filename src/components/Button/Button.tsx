import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'neutral' | 'text' | 'danger';
export type ButtonSize = 'default' | 'small';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /**
   * Visual weight. `primary` carries the single forest.500 moment per view —
   * never render two `primary` buttons on the same view.
   */
  variant?: ButtonVariant;
  /** `default` is 32px tall, `small` is 24px. */
  size?: ButtonSize;
  /** Sentence-case label. Required unless the button is icon-only (then set `aria-label`). */
  children?: ReactNode;
  /** Optional 16px icon before the label. */
  iconLeft?: ReactNode;
  /** Optional 16px icon after the label. */
  iconRight?: ReactNode;
  /** Locks width and swaps the label for a spinner; announced via aria-live. */
  loading?: boolean;
}

export function Button({
  variant = 'neutral',
  size = 'default',
  children,
  iconLeft,
  iconRight,
  loading = false,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const className = [
    styles.button,
    styles[variant],
    styles[size],
    loading ? styles.loading : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={className}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={styles.content} aria-live="polite">
        {iconLeft && (
          <span className={styles.icon} aria-hidden="true">
            {iconLeft}
          </span>
        )}
        {children}
        {iconRight && (
          <span className={styles.icon} aria-hidden="true">
            {iconRight}
          </span>
        )}
      </span>
    </button>
  );
}
