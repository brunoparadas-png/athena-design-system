import type { ReactNode } from 'react';
import styles from './Breadcrumbs.module.css';

export interface BreadcrumbItem {
  /** Visible text. */
  label: ReactNode;
  /** Destination. Omit on the current (last) page, or for a non-link crumb. */
  href?: string;
}

/**
 * Mirrors the Figma "❖ Breadcrumbs": a row of <BreadcrumbItem> links separated
 * by "/", showing the user's location. The last item is treated as the current
 * page (aria-current, non-link). Item hover/press/focus are CSS pseudo-states.
 */
export interface BreadcrumbsProps {
  /** Ordered trail, root → current. The last item is the current page. */
  items: BreadcrumbItem[];
  /** Accessible label for the nav landmark. Defaults to "Breadcrumb". */
  label?: string;
  /** Separator between items. Defaults to "/". */
  separator?: ReactNode;
  /** Truncate each item to this pixel width with an ellipsis. */
  maxItemWidth?: number;
}

export function Breadcrumbs({
  items,
  label = 'Breadcrumb',
  separator = '/',
  maxItemWidth,
}: BreadcrumbsProps) {
  const style = maxItemWidth
    ? ({ ['--bc-max-item-width' as string]: `${maxItemWidth}px` } as React.CSSProperties)
    : undefined;

  return (
    <nav aria-label={label} className={styles.nav}>
      <ol className={[styles.list, maxItemWidth ? styles.truncate : ''].filter(Boolean).join(' ')} style={style}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className={styles.item}>
              {index > 0 && (
                <span className={styles.separator} aria-hidden="true">
                  {separator}
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  className={isLast ? styles.current : styles.text}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <a className={styles.link} href={item.href}>
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
