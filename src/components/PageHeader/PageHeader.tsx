import type { ReactNode } from 'react';
import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  /** The page title (Heading/L — Inter bold 24/28). */
  children: ReactNode;
  /** Breadcrumb trail above the title — typically a `<Breadcrumbs />`. (Figma: breadcrumbs) */
  breadcrumbs?: ReactNode;
  /** Actions aligned to the right of the title — typically Buttons. (Figma: actions) */
  actions?: ReactNode;
  /** A row below the title for search / filters. (Figma: bottomBar) */
  bottomBar?: ReactNode;
  /** Truncate the title to one line with an ellipsis instead of wrapping. (Figma: truncateTitle) */
  truncateTitle?: boolean;
  /** Override the heading level for document outline (visual size is unchanged). Defaults to h1. */
  headingLevel?: 1 | 2 | 3;
}

/**
 * Mirrors the Figma "❖ Page header" (node 515:10093). Defines the top of a page:
 * an optional breadcrumb trail, a title with optional right-aligned actions, and
 * an optional bottom bar (search / filters). A pure composition shell — pass
 * Breadcrumbs, Buttons, and a TextField as slot content.
 */
export function PageHeader({
  children,
  breadcrumbs,
  actions,
  bottomBar,
  truncateTitle = false,
  headingLevel = 1,
}: PageHeaderProps) {
  const Heading = `h${headingLevel}` as 'h1' | 'h2' | 'h3';

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        {breadcrumbs}
        <div className={styles.main}>
          <Heading className={[styles.title, truncateTitle ? styles.truncate : ''].filter(Boolean).join(' ')}>
            {children}
          </Heading>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      </div>
      {bottomBar && <div className={styles.bottomBar}>{bottomBar}</div>}
    </div>
  );
}
