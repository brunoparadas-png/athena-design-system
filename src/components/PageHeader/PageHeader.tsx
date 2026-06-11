import type { ReactNode } from 'react';

export interface PageHeaderProps {
  /** The page title (Heading/L — Inter bold 24/28). */
  children: ReactNode;
  /** Breadcrumb trail above the title — typically a `<Breadcrumbs />`. (Figma: breadcrumbs) */
  breadcrumbs?: ReactNode;
  /** Actions aligned to the right of the title — typically Buttons. (Figma: actions) */
  actions?: ReactNode;
  /** A row below the title for search / filters. (Figma: bottomBar) */
  bottomBar?: ReactNode;
  /**
   * Truncate the title to one line with an ellipsis instead of wrapping.
   * CODE-ONLY — not represented in the Figma PageHeader component set (truncation
   * exists only on the child BreadcrumbItem variant, not at the PageHeader level).
   * Intentionally kept as a layout/UX convenience prop.
   */
  truncateTitle?: boolean;
  /**
   * Override the semantic heading level for the document outline.
   * Visual size is always Heading/L (24 px bold) regardless of this value.
   * CODE-ONLY — Figma exposes no heading-level control on the PageHeader component
   * set. Kept as an accessibility-only prop so the page outline can be correct
   * without changing the visual design.
   */
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
    <div className="flex flex-col w-full pt-8 font-[var(--font-main)]">
      <div className="flex flex-col gap-1 w-full">
        {breadcrumbs}
        <div className="flex items-start justify-between gap-4 w-full">
          <Heading className={`m-0 min-w-0 text-2xl leading-7 font-bold text-neutral-800${truncateTitle ? ' truncate' : ''}`}>
            {children}
          </Heading>
          {actions && (
            <div className="flex items-start gap-2 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
      {bottomBar && (
        <div className="flex items-start gap-2 w-full pt-4">
          {bottomBar}
        </div>
      )}
    </div>
  );
}
