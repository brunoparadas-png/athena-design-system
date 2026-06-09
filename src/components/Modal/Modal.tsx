import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon, type IconName } from '../Icon';
import styles from './Modal.module.css';

export type ModalAppearance = 'default' | 'danger';
export type ModalSize = 'small' | 'medium' | 'large' | 'x-large' | 'full-screen';

interface ModalContextValue {
  onClose?: () => void;
  appearance: ModalAppearance;
  titleId: string;
  bodyId: string;
}

const ModalContext = createContext<ModalContextValue | null>(null);
const useModalContext = () => useContext(ModalContext);

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalProps {
  /** Whether the modal is rendered. */
  isOpen: boolean;
  /** Called on Escape, blanket click, or the header close button. */
  onClose?: () => void;
  /** `default` confirms; `danger` is for destructive confirmation. (Figma: appearance) */
  appearance?: ModalAppearance;
  /** Width preset: small 400 / medium 600 / large 760 / x-large 968 / full-screen. (Figma: size) */
  size?: ModalSize;
  /** Modal contents — typically ModalHeader, ModalBody, ModalFooter. */
  children: ReactNode;
  /**
   * Scroll the whole viewport instead of the body. Default false: the body
   * scrolls while the header and footer stay pinned.
   */
  shouldScrollInViewport?: boolean;
  /** Close when the blanket (the dimmed backdrop) is clicked. Defaults to true. */
  shouldCloseOnBlanketClick?: boolean;
  /** Close on Escape. Defaults to true. */
  shouldCloseOnEscape?: boolean;
  /** Accessible label when there is no ModalHeader title to point at. */
  'aria-label'?: string;
}

/**
 * Mirrors the Figma "❖ Modal dialog" (node 35:2877). A dialog layered over a
 * dimmed blanket, portalled to the body. Traps focus, locks body scroll, closes
 * on Escape / blanket click, and restores focus to the trigger on close. Compose
 * with ModalHeader / ModalBody / ModalFooter.
 */
export function Modal({
  isOpen,
  onClose,
  appearance = 'default',
  size = 'medium',
  children,
  shouldScrollInViewport = false,
  shouldCloseOnBlanketClick = true,
  shouldCloseOnEscape = true,
  'aria-label': ariaLabel,
}: ModalProps) {
  const baseId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<Element | null>(null);

  // Lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Move focus into the dialog on open; restore it on close.
  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement;
    const dialog = dialogRef.current;
    const first = dialog?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? dialog)?.focus();
    return () => {
      (previouslyFocused.current as HTMLElement | null)?.focus?.();
    };
  }, [isOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && shouldCloseOnEscape) {
      event.stopPropagation();
      onClose?.();
      return;
    }
    if (event.key !== 'Tab') return;
    // Focus trap — keep Tab cycling within the dialog.
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    );
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!isOpen) return null;

  const ctx: ModalContextValue = {
    onClose,
    appearance,
    titleId: `${baseId}-title`,
    bodyId: `${baseId}-body`,
  };

  const overlayClass = [
    styles.overlay,
    size === 'full-screen' ? styles.overlayFull : '',
    shouldScrollInViewport ? styles.viewportScroll : '',
  ]
    .filter(Boolean)
    .join(' ');

  const dialogClass = [styles.dialog, styles[sizeClass(size)]].filter(Boolean).join(' ');

  return createPortal(
    <div
      className={overlayClass}
      onMouseDown={(e) => {
        // Only the blanket itself (not bubbling from the dialog) closes.
        if (e.target === e.currentTarget && shouldCloseOnBlanketClick) onClose?.();
      }}
    >
      <ModalContext.Provider value={ctx}>
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabel ? undefined : ctx.titleId}
          aria-label={ariaLabel}
          className={dialogClass}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          {children}
        </div>
      </ModalContext.Provider>
    </div>,
    document.body,
  );
}

const sizeClass = (size: ModalSize): string =>
  ({
    small: 'small',
    medium: 'medium',
    large: 'large',
    'x-large': 'xlarge',
    'full-screen': 'fullscreen',
  })[size];

export interface ModalHeaderProps {
  /** Heading text (Inter bold 20/24). Sets the dialog's accessible name. */
  title: ReactNode;
  /** Optional leading icon. Defaults to a danger `warning` icon when appearance=danger. (Figma: hasIcon) */
  icon?: IconName;
  /** Override the close handler (defaults to the Modal's onClose). Pass null to hide the close button. */
  onClose?: (() => void) | null;
  /** Accessible label for the close button. */
  closeLabel?: string;
}

/** Title row with an optional leading icon and a close button. (Figma: <ModalHeader>) */
export function ModalHeader({ title, icon, onClose, closeLabel = 'Close' }: ModalHeaderProps) {
  const ctx = useModalContext();
  const resolvedIcon = icon ?? (ctx?.appearance === 'danger' ? 'warning' : undefined);
  const close = onClose === null ? null : (onClose ?? ctx?.onClose);

  return (
    <div className={styles.header}>
      <div className={styles.titleRow}>
        {resolvedIcon && (
          <span
            className={[styles.headerIcon, ctx?.appearance === 'danger' ? styles.dangerIcon : '']
              .filter(Boolean)
              .join(' ')}
          >
            <Icon name={resolvedIcon} size={20} />
          </span>
        )}
        <h2 id={ctx?.titleId} className={styles.title}>
          {title}
        </h2>
      </div>
      {close && (
        <button type="button" className={styles.close} aria-label={closeLabel} onClick={close}>
          <Icon name="close" size={24} />
        </button>
      )}
    </div>
  );
}

export interface ModalBodyProps {
  children: ReactNode;
}

/** Scrollable content region; sets the dialog's accessible description. (Figma: ModalBody) */
export function ModalBody({ children }: ModalBodyProps) {
  const ctx = useModalContext();
  // tabIndex makes the scroll region reachable by keyboard (axe: scrollable-region-focusable).
  return (
    <div id={ctx?.bodyId} className={styles.body} tabIndex={0}>
      {children}
    </div>
  );
}

export interface ModalFooterProps {
  children: ReactNode;
}

/** Actions row, right-aligned (e.g. Cancel + Confirm). (Figma: <ModalFooter>) */
export function ModalFooter({ children }: ModalFooterProps) {
  return <div className={styles.footer}>{children}</div>;
}
