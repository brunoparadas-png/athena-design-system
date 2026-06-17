import type { ReactNode, TableHTMLAttributes } from 'react';

/* ------------------------------------------------------------------ *
 * Table — data table built from the Athena DS Figma "Table" page
 * (node 409:3926). Native <table> semantics; sharp corners.
 *
 * Composition mirrors the Figma parts:
 *   <Table>            the <table> surface
 *     <TableHead>      <thead>
 *       <TableRow>     <tr>
 *         <TableHeaderCell>   Figma "Parts / <Header>"
 *     <TableBody>      <tbody>
 *       <TableRow>     <tr>  (one of the "rows=N" variants)
 *         <TableCell>  Figma "Parts / <Cell>"  (appearance text|tag|action)
 *
 * Semantic tokens only (never raw primitives):
 *   header fill  --bg-neutral-weak       (neutral.50  #f5f5f5)
 *   row border   --border-neutral-weak
 *   all text     --text-neutral-default  (neutral.600 #525252)
 * ------------------------------------------------------------------ */

export type TableCellAppearance = 'text' | 'tag' | 'action';
export type TableAlign = 'start' | 'end';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  /**
   * Tint body rows on hover with the neutral-weak surface. Off by default —
   * the Figma Cell has no hover state, so this is an opt-in affordance for
   * interactive (clickable / selectable) rows.
   */
  isRowHoverable?: boolean;
}

/** The table surface: full-width, collapsed borders, Inter (--font-main). */
export function Table({ children, className, isRowHoverable = false, ...rest }: TableProps) {
  return (
    <table
      className={`w-full border-collapse text-left font-[var(--font-main)] ${
        isRowHoverable ? '[&_tbody_tr:hover]:bg-[var(--bg-neutral-weak)]' : ''
      } ${className ?? ''}`}
      {...rest}
    >
      {children}
    </table>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({
  children,
  ...rest
}: { children: ReactNode } & React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...rest}>{children}</tr>;
}

export interface TableHeaderCellProps {
  children?: ReactNode;
  /** Text alignment within the cell. Defaults to 'start'. */
  align?: TableAlign;
  /** Fixed column width, e.g. '200px'. Omitted columns size to content/fluid. */
  width?: string;
}

/**
 * Column header cell — Figma "Parts / <Header>". neutral-weak fill,
 * 40px min-height, 24px / 4px padding, Inter bold 12/16, neutral-default text.
 */
export function TableHeaderCell({ children, align = 'start', width }: TableHeaderCellProps) {
  return (
    <th
      scope="col"
      style={width ? { width } : undefined}
      className={`h-10 bg-[var(--bg-neutral-weak)] px-6 py-1 align-middle text-[12px] leading-4 font-bold text-[var(--text-neutral-default)] ${
        align === 'end' ? 'text-right' : 'text-left'
      }`}
    >
      {children}
    </th>
  );
}

export interface TableCellProps {
  children?: ReactNode;
  /**
   * `text` (label + optional media/subheading), `tag` (renders a Tag), or
   * `action` (trailing icon controls, right-aligned). (Figma: appearance)
   */
  appearance?: TableCellAppearance;
  /** Leading node for `text` cells — e.g. a thumbnail. */
  media?: ReactNode;
  /** Secondary line below the label in a `text` cell — IBM Plex Mono per spec. */
  subheading?: ReactNode;
  align?: TableAlign;
  /** Fixed column width, e.g. '200px'. */
  width?: string;
}

/**
 * Data cell — Figma "Parts / <Cell>". 1px neutral-weak bottom border,
 * 40px min-height, body 14/20 neutral-default text.
 */
export function TableCell({
  children,
  appearance = 'text',
  media,
  subheading,
  align = 'start',
  width,
}: TableCellProps) {
  const base =
    'h-10 border-b border-[var(--border-neutral-weak)] px-6 py-2 align-middle text-[14px] leading-5 text-[var(--text-neutral-default)]';

  // Action cell — trailing icon controls, right-aligned with 8px gaps.
  if (appearance === 'action') {
    return (
      <td style={width ? { width } : undefined} className={base}>
        <div className="flex items-center justify-end gap-2">{children}</div>
      </td>
    );
  }

  // Tag cell — hosts a Tag (or any inline node); no body text styling needed.
  if (appearance === 'tag') {
    return (
      <td
        style={width ? { width } : undefined}
        className={`${base} ${align === 'end' ? 'text-right' : ''}`}
      >
        <span className={`inline-flex ${align === 'end' ? 'justify-end' : ''}`}>{children}</span>
      </td>
    );
  }

  // Text cell — label, optional leading media, optional mono subheading.
  return (
    <td style={width ? { width } : undefined} className={base}>
      <div className="flex min-w-0 items-center gap-3">
        {media && <span className="flex-shrink-0">{media}</span>}
        <div className="min-w-0">
          <div className="min-w-0">{children}</div>
          {subheading && (
            <div className="mt-0.5 truncate font-[var(--font-code)] text-[12px] leading-4 text-[var(--text-neutral-default)]">
              {subheading}
            </div>
          )}
        </div>
      </div>
    </td>
  );
}
