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
import styles from './DropdownMenu.module.css';

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
}

const ChevronDown = () => (
  <svg className={styles.chevron} viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" focusable="false">
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

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        ref={triggerRef}
        type="button"
        className={[
          styles.trigger,
          styles[buttonSpacing],
          triggerType === 'icon' ? styles.iconTrigger : '',
          open ? styles.open : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={triggerType === 'icon' ? ariaLabel : undefined}
        onClick={() => setOpen(!open)}
        onKeyDown={handleTriggerKeyDown}
      >
        {triggerType === 'icon' ? (
          <Icon name={triggerIcon} size={20} />
        ) : (
          <>
            <span className={styles.triggerLabel}>{triggerLabel}</span>
            <ChevronDown />
          </>
        )}
      </button>

      {open && (
        <div
          id={menuId}
          className={[styles.popover, placement === 'bottom-end' ? styles.end : styles.start]
            .filter(Boolean)
            .join(' ')}
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
