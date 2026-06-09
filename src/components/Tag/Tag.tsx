import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../Icon';
import styles from './Tag.module.css';

export type TagAppearance = 'gray' | 'green' | 'red' | 'purple' | 'blue' | 'orange';

/**
 * Prop names mirror the Figma "Tag" component properties: appearance,
 * isRemovable (Figma `state` → CSS pseudo-states).
 *
 * A tag labels UI objects for quick recognition. Static by default; pass
 * `href` to make the whole tag a link, or `onRemove` to add a remove button.
 */
export interface TagProps {
  /** Color family. "green" maps to the teal palette. (Figma: appearance) */
  appearance?: TagAppearance;
  /** Tag text. */
  children: ReactNode;
  /** Shows a trailing remove (×) button that calls `onRemove`. (Figma: isRemovable) */
  onRemove?: () => void;
  /** Accessible label for the remove button. Defaults to "Remove". */
  removeLabel?: string;
  /** Renders the tag as a link. */
  href?: string;
  /** Link target, only used with `href`. */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
}

export function Tag({
  appearance = 'gray',
  children,
  onRemove,
  removeLabel = 'Remove',
  href,
  target,
}: TagProps) {
  const isRemovable = onRemove != null;
  const isLink = href != null;

  const className = [
    styles.tag,
    styles[appearance],
    isRemovable ? styles.removable : '',
    isLink && !isRemovable ? styles.interactive : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Link-only tag: the whole chip is the anchor.
  if (isLink && !isRemovable) {
    return (
      <a className={className} href={href} target={target}>
        <span className={styles.text}>{children}</span>
      </a>
    );
  }

  return (
    <span className={className}>
      {isLink ? (
        <a className={styles.link} href={href} target={target}>
          {children}
        </a>
      ) : (
        <span className={styles.text}>{children}</span>
      )}
      {isRemovable && (
        <button type="button" className={styles.remove} onClick={onRemove} aria-label={removeLabel}>
          <Icon name="close" size={12} />
        </button>
      )}
    </span>
  );
}
