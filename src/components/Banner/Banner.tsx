import type { HTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';

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

const appearanceClasses: Record<BannerAppearance, string> = {
  info: 'bg-neutral-50 text-neutral-800',
  error: 'bg-danger-700 text-white',
};

export function Banner({ appearance = 'info', children, icon, role, ...rest }: BannerProps) {
  const iconName = icon === undefined ? DEFAULT_ICON[appearance] : icon;
  // error interrupts (assertive); info is polite.
  const resolvedRole = role ?? (appearance === 'error' ? 'alert' : 'status');

  return (
    <div
      className={`flex items-start gap-1 w-full box-border p-3 rounded-sm font-[var(--font-main)] text-sm leading-5 font-normal ${appearanceClasses[appearance]}`}
      role={resolvedRole}
      {...rest}
    >
      {iconName && (
        <span className="inline-flex items-center justify-center flex-shrink-0 size-5" aria-hidden="true">
          <Icon name={iconName} size={20} />
        </span>
      )}
      <span className="flex-1 min-w-0 break-words">{children}</span>
    </div>
  );
}
