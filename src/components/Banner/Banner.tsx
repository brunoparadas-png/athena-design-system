import type { HTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';
import styles from './Banner.module.css';

export type BannerAppearance = 'info' | 'error';

/**
 * Mirrors the Figma "❖ Banner": appearance = info | error. A prominent,
 * full-width message strip (typically pinned to the top of a view or section).
 *
 * error → danger.700 fill, white text + warning icon.
 * info  → neutral.50 fill, neutral.800 text + info icon.
 */
export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Severity / visual treatment. (Figma: appearance) */
  appearance?: BannerAppearance;
  /** Message content. */
  children: ReactNode;
  /**
   * Override the leading icon. Defaults to `warning` for error and `info` for
   * info. Pass `null` to force no icon.
   */
  icon?: IconName | null;
}

const DEFAULT_ICON: Record<BannerAppearance, IconName | null> = {
  error: 'warning',
  info: 'info',
};

export function Banner({ appearance = 'info', children, icon, role, ...rest }: BannerProps) {
  const iconName = icon === undefined ? DEFAULT_ICON[appearance] : icon;
  // error interrupts (assertive); info is polite.
  const resolvedRole = role ?? (appearance === 'error' ? 'alert' : 'status');

  return (
    <div className={[styles.banner, styles[appearance]].join(' ')} role={resolvedRole} {...rest}>
      {iconName && (
        <span className={styles.icon} aria-hidden="true">
          <Icon name={iconName} size={20} />
        </span>
      )}
      <span className={styles.text}>{children}</span>
    </div>
  );
}
