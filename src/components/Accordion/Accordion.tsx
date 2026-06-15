import { useId, useState, type ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';

export interface AccordionProps {
  /** Header label, shown next to the expand/collapse chevron. */
  title: ReactNode;
  /** Content slot — revealed when the accordion is expanded. */
  children: ReactNode;
  /** Optional leading icon rendered before the title. */
  icon?: IconName;
  /**
   * Controlled expanded state. Leave undefined and use `defaultExpanded` for an
   * uncontrolled accordion.
   */
  isExpanded?: boolean;
  /** Initial expanded state when uncontrolled. Defaults to false (collapsed). */
  defaultExpanded?: boolean;
  /** Called with the next expanded state whenever the header is toggled. */
  onToggle?: (expanded: boolean) => void;
  /**
   * Heading level wrapping the trigger button (WAI-ARIA accordion pattern).
   * Defaults to 3.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Hide the divider rendered at the end of the accordion. Defaults to false. */
  hideSeparator?: boolean;
  /** Optional id used to wire the trigger button to its content region. */
  id?: string;
}

/**
 * A titled, collapsible section. The header row shows the title (with an
 * optional leading icon) and a chevron that toggles between expanded
 * (chevron-up) and collapsed (chevron-down); the content slot below is revealed
 * when expanded, and a divider is rendered at the end to separate it from the
 * next section.
 *
 * Modelled on the "Advanced Settings" disclosure from the article-create form.
 * Follows the WAI-ARIA Accordion pattern: a <button> with aria-expanded /
 * aria-controls, wrapped in a heading, controlling a labelled region.
 *
 * Controlled (pass `isExpanded` + `onToggle`) or uncontrolled (`defaultExpanded`).
 */
export function Accordion({
  title,
  children,
  icon,
  isExpanded,
  defaultExpanded = false,
  onToggle,
  headingLevel = 3,
  hideSeparator = false,
  id,
}: AccordionProps) {
  const reactId = useId();
  const baseId = id ?? reactId;
  const triggerId = `${baseId}-trigger`;
  const regionId = `${baseId}-region`;

  const isControlled = isExpanded !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const expanded = isControlled ? isExpanded : internalExpanded;

  const handleToggle = () => {
    const next = !expanded;
    if (!isControlled) setInternalExpanded(next);
    onToggle?.(next);
  };

  const Heading = `h${headingLevel}` as const;

  return (
    <div className="font-[var(--font-main)]">
      <Heading className="m-0">
        <button
          type="button"
          id={triggerId}
          aria-expanded={expanded}
          aria-controls={regionId}
          onClick={handleToggle}
          className="group appearance-none w-full box-border m-0 border-0 bg-transparent cursor-pointer flex items-center justify-between gap-4 py-4 text-left text-xl leading-6 font-bold text-[var(--text-neutral-strong)] focus-visible:outline-2 focus-visible:outline-[var(--border-primary-strong)] focus-visible:[outline-offset:-2px]"
        >
          <span className="flex items-center gap-2 min-w-0">
            {icon && (
              <span className="inline-flex flex-shrink-0 text-[var(--text-neutral-default)]" aria-hidden="true">
                <Icon name={icon} size={20} />
              </span>
            )}
            <span className="min-w-0 break-words">{title}</span>
          </span>
          <span
            className="inline-flex flex-shrink-0 text-[var(--text-neutral-default)] transition-colors duration-[120ms] ease-[ease] group-hover:text-[var(--text-neutral-strong)] motion-reduce:transition-none"
            aria-hidden="true"
          >
            <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={20} />
          </span>
        </button>
      </Heading>

      <div
        id={regionId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!expanded}
        className="pb-4 text-sm leading-5 text-[var(--text-neutral-strong)]"
      >
        {children}
      </div>

      {!hideSeparator && <div role="separator" className="h-px bg-[var(--border-neutral-weak)]" />}
    </div>
  );
}
