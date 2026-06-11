import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Icon } from '../Icon';

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

interface AppearanceConfig {
  classes: string;
  hoverBg: string;
  pressBg: string;
}

// Per-appearance color classes + hover/press values for the remove button
const appearanceConfig: Record<TagAppearance, AppearanceConfig> = {
  gray: {
    classes: 'bg-neutral-100 border-neutral-300 text-neutral-600',
    hoverBg: 'var(--neutral-200)',
    pressBg: 'var(--neutral-300)',
  },
  green: {
    classes: 'bg-teal-100 border-teal-500 text-teal-800',
    hoverBg: 'var(--teal-200)',
    pressBg: 'var(--teal-300)',
  },
  red: {
    classes: 'bg-danger-50 border-danger-400 text-danger-700',
    hoverBg: 'var(--danger-100)',
    pressBg: 'var(--danger-200)',
  },
  purple: {
    classes: 'bg-purple-50 border-purple-400 text-purple-700',
    hoverBg: 'var(--purple-100)',
    pressBg: 'var(--purple-200)',
  },
  blue: {
    classes: 'bg-blue-50 border-blue-400 text-blue-700',
    hoverBg: 'var(--blue-100)',
    pressBg: 'var(--blue-200)',
  },
  orange: {
    classes: 'bg-orange-50 border-orange-400 text-orange-700',
    hoverBg: 'var(--orange-100)',
    pressBg: 'var(--orange-200)',
  },
};

// Per-appearance interactive (whole-chip link) hover/active classes
const interactiveHoverClasses: Record<TagAppearance, string> = {
  gray: 'hover:bg-neutral-200 active:bg-neutral-300',
  green: 'hover:bg-teal-200 active:bg-teal-300',
  red: 'hover:bg-danger-100 active:bg-danger-200',
  purple: 'hover:bg-purple-100 active:bg-purple-200',
  blue: 'hover:bg-blue-100 active:bg-blue-200',
  orange: 'hover:bg-orange-100 active:bg-orange-200',
};

// Base classes shared by all tag variants
const baseClasses =
  'box-border inline-flex items-center justify-center gap-1.5 h-5 px-1 border rounded-none text-xs leading-4 font-semibold whitespace-nowrap overflow-clip no-underline font-[var(--font-main)]';

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

  const { classes: colorClasses, hoverBg, pressBg } = appearanceConfig[appearance];

  // Removable tags trim right padding so the 16px button sits flush
  const paddingClasses = isRemovable ? 'pr-0.5' : '';

  // CSS variables on the tag root so the remove button can reference them
  const tagStyle: CSSProperties = isRemovable
    ? ({ '--tag-bg-hover': hoverBg, '--tag-bg-press': pressBg } as CSSProperties)
    : {};

  // Link-only tag: the whole chip is the anchor — add interactive states
  if (isLink && !isRemovable) {
    return (
      <a
        className={`${baseClasses} ${colorClasses} ${interactiveHoverClasses[appearance]} cursor-pointer transition-[background-color] duration-[120ms] ease-[ease] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-forest-700 focus-visible:outline-offset-2`}
        href={href}
        target={target}
      >
        <span className="inline-block break-words">{children}</span>
      </a>
    );
  }

  return (
    <span className={`${baseClasses} ${colorClasses} ${paddingClasses}`} style={tagStyle}>
      {isLink ? (
        <a className="text-inherit no-underline hover:underline" href={href} target={target}>
          {children}
        </a>
      ) : (
        <span className="inline-block break-words">{children}</span>
      )}
      {isRemovable && (
        <button
          type="button"
          className="appearance-none m-0 p-0 border-0 bg-transparent text-inherit inline-flex items-center justify-center w-4 h-4 flex-shrink-0 cursor-pointer rounded-none transition-[background-color] duration-[120ms] ease-[ease] motion-reduce:transition-none hover:bg-[var(--tag-bg-hover)] active:bg-[var(--tag-bg-press)] focus-visible:outline-2 focus-visible:outline-forest-700 focus-visible:outline-offset-[1px]"
          onClick={onRemove}
          aria-label={removeLabel}
        >
          <Icon name="close" size={12} />
        </button>
      )}
    </span>
  );
}
