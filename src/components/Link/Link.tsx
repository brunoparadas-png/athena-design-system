import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../Icon';
import styles from './Link.module.css';

export type LinkAppearance = 'default' | 'subtle' | 'inverse';

/**
 * Prop names mirror the Figma "Link" component: appearance, target=outside
 * (→ `isExternal`). Figma `state` (default/hover/press) → CSS pseudo-states.
 *
 * Takes people to a new location in the app or another site. Renders a real
 * <a>, so all anchor attributes (href, target, rel, download…) pass through.
 */
export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> {
  /** `default` (blue), `subtle` (neutral), or `inverse` (white, for dark surfaces). (Figma: appearance) */
  appearance?: LinkAppearance;
  /** Marks an offsite link: appends the external icon and opens in a new tab. (Figma: target=outside) */
  isExternal?: boolean;
  /** Link text. */
  children: ReactNode;
}

export function Link({
  appearance = 'default',
  isExternal = false,
  children,
  target,
  rel,
  ...rest
}: LinkProps) {
  const className = [styles.link, styles[appearance], isExternal ? styles.external : '']
    .filter(Boolean)
    .join(' ');

  // External links open in a new tab and need safe rel defaults (overridable).
  const resolvedTarget = target ?? (isExternal ? '_blank' : undefined);
  const resolvedRel =
    rel ?? (isExternal && resolvedTarget === '_blank' ? 'noopener noreferrer' : undefined);

  return (
    <a className={className} target={resolvedTarget} rel={resolvedRel} {...rest}>
      <span className={styles.text}>{children}</span>
      {isExternal && (
        <>
          <span className={styles.icon} aria-hidden="true">
            <Icon name="external-link" size={14} />
          </span>
          <span className={styles.srOnly}>(opens in a new tab)</span>
        </>
      )}
    </a>
  );
}
