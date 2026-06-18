import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Icon, type IconName } from '../Icon';
import { Menu, type MenuItem, type MenuNode } from '../Menu';

export type DropdownMenuPlacement = 'bottom-start' | 'bottom-end';

export interface DropdownMenuProps {
  /** Rows to render in the menu — actions, checkboxes, radios, groups, separators. */
  items: MenuNode[];
  /** Trigger style: a labelled `button` or an icon-only `icon` button. (Figma: trigger) */
  triggerType?: 'button' | 'icon';
  /** Trigger text for `button` triggers. (Figma: trigger="Choices") */
  triggerLabel?: ReactNode;
  /** Icon for `icon` triggers (e.g. `more-horizontal`); ignored for `button`. */
  triggerIcon?: IconName;
  /**
   * Trigger visual weight: bordered `neutral` (default) or borderless `text`.
   * Mirrors the Button / IconButton appearance of the same names.
   */
  triggerAppearance?: 'neutral' | 'text';
  /** Accessible name for an `icon` trigger (required when there's no visible label). */
  'aria-label'?: string;
  /** Trigger height: `default` (40px) or `compact` (32px). (Figma: <Button> spacing) */
  buttonSpacing?: 'default' | 'compact';
  /** Which corner the menu aligns to under the trigger. (Figma: placement) */
  placement?: DropdownMenuPlacement;
  /** Row density inside the menu. (Figma: spacing) */
  spacing?: 'default' | 'compact';
  /** Cap the menu height and scroll past it. */
  maxHeight?: number;
  /** Accessible label for the menu surface. */
  menuLabel?: string;
  /** Controlled open state. Pair with `onOpenChange`. */
  isOpen?: boolean;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Fires when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Bubbles every row selection: (id, item) => void. */
  onSelect?: (id: string, item: MenuItem) => void;
  /**
   * Close the menu after a row is chosen. Defaults to true, except the menu
   * stays open after toggling a `checkbox` row (matching native multi-select).
   */
  closeOnSelect?: boolean;
  /**
   * When true, the trigger is disabled and rendered in a loading state.
   * Mirrors the Figma `isLoading` variant prop (currently stubbed; visual spec
   * is not finalised — defaults to `false` and disables the trigger for now).
   */
  isLoading?: boolean;
}

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    width={16}
    height={16}
    aria-hidden="true"
    focusable="false"
    className={`block flex-shrink-0 transition-transform duration-[120ms] ease-[ease] motion-reduce:transition-none${open ? ' rotate-180' : ''}`}
  >
    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Mirrors the Figma "❖ Dropdown menu" — a trigger that opens a Menu of actions
 * or options. Wraps the Menu surface, owns open state, outside-click/Escape
 * dismissal, and focus return. The chevron flips up and the trigger takes the
 * forest tint while open.
 */
export function DropdownMenu({
  items,
  triggerType = 'button',
  triggerLabel = 'Select',
  triggerIcon = 'more-horizontal',
  triggerAppearance = 'neutral',
  'aria-label': ariaLabel,
  buttonSpacing = 'default',
  placement = 'bottom-start',
  spacing = 'default',
  maxHeight,
  menuLabel,
  isOpen,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  closeOnSelect,
  isLoading = false,
}: DropdownMenuProps) {
  const baseId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const isControlled = isOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? isOpen : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const close = useCallback(
    (returnFocus = true) => {
      setOpen(false);
      if (returnFocus) triggerRef.current?.focus();
    },
    [setOpen],
  );

  // Dismiss on outside pointer-down.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open, setOpen]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'Tab') {
      // Tabbing away dismisses without stealing focus back.
      setOpen(false);
    }
  };

  const handleSelect = (id: string, item: MenuItem) => {
    onSelect?.(id, item);
    const type = item.type ?? 'action';
    const shouldClose = closeOnSelect ?? type !== 'checkbox';
    if (shouldClose) close();
  };

  const menuId = `${baseId}-menu`;

  // Trigger base classes — mirrors the neutral Button
  const triggerBase =
    'appearance-none m-0 cursor-pointer inline-flex items-center justify-center gap-1.5 border rounded-none font-semibold text-sm leading-5 whitespace-nowrap px-3 transition-[background-color,border-color,color] duration-[120ms] ease-[ease] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-forest-700 focus-visible:outline-offset-2 font-[var(--font-main)]';

  const triggerStateClasses =
    triggerAppearance === 'text'
      ? isLoading
        ? 'bg-transparent border-transparent text-neutral-400 cursor-not-allowed opacity-60'
        : open
          ? 'bg-forest-50 border-transparent text-forest-700'
          : 'bg-transparent border-transparent text-neutral-600 hover:bg-forest-100 hover:text-forest-700 active:bg-forest-200 active:text-forest-700'
      : isLoading
        ? 'bg-white border-[var(--border-neutral-default)] text-neutral-400 cursor-not-allowed opacity-60'
        : open
          ? 'bg-forest-50 border-forest-700 text-forest-700'
          : 'bg-white border-[var(--border-neutral-default)] text-neutral-600 hover:bg-forest-100 hover:border-forest-500 hover:text-forest-700 active:bg-forest-200 active:border-forest-500 active:text-forest-700';

  const triggerSizeClass = buttonSpacing === 'compact' ? 'min-h-8' : 'min-h-10';

  const triggerIconClass = triggerType === 'icon' ? 'px-0 aspect-square' : '';

  const triggerClassName = `${triggerBase} ${triggerStateClasses} ${triggerSizeClass} ${triggerIconClass}`.trim();

  const popoverAlignClass = placement === 'bottom-end' ? 'right-0' : 'left-0';

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        className={triggerClassName}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={triggerType === 'icon' ? ariaLabel : undefined}
        aria-disabled={isLoading || undefined}
        disabled={isLoading}
        onClick={() => !isLoading && setOpen(!open)}
        onKeyDown={handleTriggerKeyDown}
      >
        {triggerType === 'icon' ? (
          <Icon name={triggerIcon} size={20} />
        ) : (
          <>
            <span className="inline-block">{triggerLabel}</span>
            <ChevronDown open={open} />
          </>
        )}
      </button>

      {open && (
        <div
          id={menuId}
          className={`absolute top-[calc(100%+4px)] z-20 ${popoverAlignClass}`}
        >
          <Menu
            items={items}
            spacing={spacing}
            maxHeight={maxHeight}
            label={menuLabel}
            autoFocusFirst
            onSelect={handleSelect}
            onKeyDown={handleMenuKeyDown}
          />
        </div>
      )}
    </div>
  );
}
