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
  /**
   * When true, the dimmed blanket overlay is not rendered. The dialog appears
   * without a backdrop. (Figma: isBlanketHidden)
   */
  isBlanketHidden?: boolean;
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
  isBlanketHidden = false,
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

  const isFullScreen = size === 'full-screen';

  // Overlay: fixed blanket, centers the dialog. viewport-scroll mode aligns top and scrolls.
  // When isBlanketHidden, the overlay is transparent and pointer-events are disabled on it
  // so only the dialog itself receives clicks.
  const overlayClass = `fixed inset-0 z-[1000] flex items-center justify-content ${
    isBlanketHidden ? 'bg-transparent pointer-events-none' : 'bg-[rgba(5,12,31,0.46)]'
  } ${isFullScreen ? 'p-0' : 'p-8'} ${shouldScrollInViewport ? 'items-start overflow-y-auto' : ''}`.trim();

  // Dialog: sizing variants
  const sizeClass = {
    small: 'max-w-[400px]',
    medium: 'max-w-[600px]',
    large: 'max-w-[760px]',
    'x-large': 'max-w-[968px]',
    'full-screen': 'max-w-none w-full h-full max-h-screen shadow-none',
  }[size];

  const dialogMaxHeight = shouldScrollInViewport ? '' : isFullScreen ? '' : 'max-h-[calc(100vh-64px)]';

  const dialogClass = `box-border flex flex-col w-full bg-white rounded-none outline-none font-[var(--font-main)] shadow-[0_8px_16px_-4px_rgba(9,30,66,0.25),0_0_0_1px_rgba(9,30,66,0.06)] ${isBlanketHidden ? 'pointer-events-auto' : ''} ${sizeClass} ${dialogMaxHeight}`.trim();

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

export interface ModalHeaderProps {
  /** Heading text (Inter bold 20/24). Sets the dialog's accessible name. */
  title: ReactNode;
  /** Optional leading icon. Defaults to a danger `warning` icon when appearance=danger. (Figma: hasIcon) */
  icon?: IconName;
  /** Override the close handler (defaults to the Modal's onClose). Pass null to hide the close button. */
  onClose?: (() => void) | null;
  /**
   * Explicitly show or hide the close button. When false the button is hidden regardless
   * of whether onClose is set. When true (default) the button is shown if a close handler
   * is available. (Figma: hasCloseButton)
   */
  hasCloseButton?: boolean;
  /** Accessible label for the close button. */
  closeLabel?: string;
}

/** Title row with an optional leading icon and a close button. (Figma: <ModalHeader>) */
export function ModalHeader({ title, icon, onClose, hasCloseButton = true, closeLabel = 'Close' }: ModalHeaderProps) {
  const ctx = useModalContext();
  const resolvedIcon = icon ?? (ctx?.appearance === 'danger' ? 'warning' : undefined);
  const resolvedClose = onClose === null ? null : (onClose ?? ctx?.onClose);
  // hasCloseButton=false hides the button regardless of whether a handler is available.
  const close = hasCloseButton ? resolvedClose : null;

  return (
    <div className="flex items-start gap-4 flex-shrink-0 px-6 pt-6 pb-4">
      <div className="flex items-center gap-2 flex-1 min-w-0 min-h-8">
        {resolvedIcon && (
          <span
            className={`inline-flex flex-shrink-0 ${ctx?.appearance === 'danger' ? 'text-danger-500' : 'text-neutral-600'}`}
          >
            <Icon name={resolvedIcon} size={20} />
          </span>
        )}
        <h2 id={ctx?.titleId} className="m-0 flex-1 min-w-0 break-words text-xl leading-6 font-bold text-neutral-800">
          {title}
        </h2>
      </div>
      {close && (
        <button
          type="button"
          className="appearance-none m-0 border-0 bg-transparent cursor-pointer flex-shrink-0 inline-flex items-center justify-center p-1 rounded-none text-neutral-600 transition-[background-color,color] duration-[120ms] ease-[ease] hover:bg-forest-100 hover:text-forest-700 active:bg-forest-200 focus-visible:outline-2 focus-visible:outline-forest-700 focus-visible:outline-offset-2 motion-reduce:transition-none"
          aria-label={closeLabel}
          onClick={close}
        >
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
    <div
      id={ctx?.bodyId}
      className="flex-1 overflow-y-auto px-6 py-0 text-sm leading-5 text-neutral-800 focus-visible:outline-2 focus-visible:outline-forest-700 focus-visible:[-outline-offset:2px]"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

export interface ModalFooterProps {
  children: ReactNode;
}

/** Actions row, right-aligned (e.g. Cancel + Confirm). (Figma: <ModalFooter>) */
export function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div className="flex-shrink-0 flex items-center justify-end gap-2 px-6 pt-4 pb-6 bg-white">
      {children}
    </div>
  );
}
