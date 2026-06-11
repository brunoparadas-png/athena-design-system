import type { ReactNode } from 'react';

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

  const truncateItemClasses = maxItemWidth
    ? 'inline-block overflow-hidden text-ellipsis whitespace-nowrap align-bottom'
    : '';
  const truncateItemStyle = maxItemWidth
    ? { maxWidth: 'var(--bc-max-item-width, none)' }
    : undefined;

  return (
    <nav aria-label={label} className="font-[var(--font-main)] text-sm leading-5">
      <ol
        className="flex flex-wrap items-center gap-2 m-0 p-0 list-none"
        style={style}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center gap-2 min-h-6">
              {index > 0 && (
                <span className="text-neutral-500 select-none" aria-hidden="true">
                  {separator}
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  className={`${isLast ? 'text-neutral-800' : 'text-neutral-600'} ${truncateItemClasses}`}
                  style={truncateItemStyle}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  className={`text-neutral-600 no-underline cursor-pointer rounded-none transition-colors duration-[120ms] ease-[ease] hover:text-neutral-800 hover:underline hover:[text-underline-offset:2px] active:text-neutral-800 focus-visible:outline-2 focus-visible:outline-forest-700 focus-visible:outline-offset-2 motion-reduce:transition-none ${truncateItemClasses}`}
                  style={truncateItemStyle}
                  href={item.href}
                >
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
