import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../Icon';

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

const appearanceClasses: Record<LinkAppearance, string> = {
  default: 'text-blue-500 hover:text-blue-700 active:text-blue-800',
  subtle: 'text-neutral-500 active:text-neutral-800',
  inverse: 'text-white hover:text-blue-100 active:text-blue-100',
};

const focusClasses: Record<LinkAppearance, string> = {
  default: 'focus-visible:outline-2 focus-visible:outline-forest-700 focus-visible:outline-offset-2',
  subtle: 'focus-visible:outline-2 focus-visible:outline-forest-700 focus-visible:outline-offset-2',
  inverse: 'focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2',
};

export function Link({
  appearance = 'default',
  isExternal = false,
  children,
  target,
  rel,
  ...rest
}: LinkProps) {
  const baseClasses =
    'inline-flex items-center gap-1 font-[var(--font-main)] text-sm leading-5 font-normal cursor-pointer rounded-none transition-[color] duration-[120ms] ease-[ease] motion-reduce:transition-none';

  const className = `${baseClasses} ${appearanceClasses[appearance]} ${focusClasses[appearance]}`;

  // Underline lives on the text span so the external icon stays un-underlined.
  const textClasses =
    appearance === 'subtle'
      ? 'no-underline hover:underline underline-offset-[2px] break-words [a:active_&]:underline'
      : 'underline underline-offset-[2px] break-words';

  // External links open in a new tab and need safe rel defaults (overridable).
  const resolvedTarget = target ?? (isExternal ? '_blank' : undefined);
  const resolvedRel =
    rel ?? (isExternal && resolvedTarget === '_blank' ? 'noopener noreferrer' : undefined);

  return (
    <a className={className} target={resolvedTarget} rel={resolvedRel} {...rest}>
      <span className={textClasses}>{children}</span>
      {isExternal && (
        <>
          <span className="inline-flex flex-shrink-0 w-[14px] h-[14px]" aria-hidden="true">
            <Icon name="external-link" size={14} />
          </span>
          <span className="absolute w-px h-px p-0 -m-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0">
            (opens in a new tab)
          </span>
        </>
      )}
    </a>
  );
}
