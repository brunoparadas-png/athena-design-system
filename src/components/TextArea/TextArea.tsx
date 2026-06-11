import { forwardRef, useId, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';

/**
 * Prop names mirror the Figma "❖ Text area" properties: label, placeholder,
 * isCompact, isDisabled, isInvalid, isMonospaced, plus the helper `<Message>`
 * (helperText + its error/valid tone).
 *
 * The multi-line sibling of TextField. Like Button/TextField, the Figma `state`
 * property (default/hover/focus/typing/filled) is NOT a prop — those are real
 * CSS states (:hover, :focus-within, and the value the user types).
 */
export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'disabled' | 'required'> {
  /** Field label above the textarea. Omit only if you set `aria-label`. */
  label?: ReactNode;
  /** Helper / status message below the textarea (the Figma `<Message>`). */
  helperText?: ReactNode;
  /** Error state — danger.500 border, danger message with a warning icon, `aria-invalid`. (Figma: isInvalid) */
  isInvalid?: boolean;
  /** Success tone for the helper message — forest text + check icon. */
  isValid?: boolean;
  /** Tighter vertical padding. (Figma: isCompact) */
  isCompact?: boolean;
  /** Disabled state. (Figma: isDisabled) */
  isDisabled?: boolean;
  /** Appends a danger asterisk to the label and sets `required`. */
  isRequired?: boolean;
  /** Render the value in the code font (IBM Plex Mono). (Figma: isMonospaced) */
  isMonospaced?: boolean;
  /** How the textarea may be resized. Defaults to `vertical`. */
  resize?: 'vertical' | 'horizontal' | 'both' | 'none';
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    label,
    helperText,
    isInvalid = false,
    isValid = false,
    isCompact = false,
    isDisabled = false,
    isRequired = false,
    isMonospaced = false,
    resize = 'vertical',
    rows = 4,
    id,
    'aria-describedby': ariaDescribedby,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const fieldId = id ?? `${reactId}-textarea`;
  const messageId = `${reactId}-message`;

  // error tone wins over success
  const tone = isInvalid ? 'error' : isValid ? 'success' : 'neutral';
  const messageIcon: IconName | null =
    tone === 'error' ? 'warning' : tone === 'success' ? 'check-circle' : null;

  const containerClass = [
    'box-border flex w-full bg-white border rounded-none transition-[border-color,box-shadow] duration-[120ms] ease-[ease] motion-reduce:transition-none',
    // border color: invalid always danger, disabled neutral-300, default neutral-300
    isInvalid
      ? 'border-danger-500 focus-within:border-danger-500 focus-within:outline-2 focus-within:outline focus-within:[outline-color:theme(colors.danger-700)] focus-within:[outline-offset:1px]'
      : isDisabled
        ? 'border-neutral-300'
        : 'border-neutral-300 hover:border-neutral-400 focus-within:border-forest-500 focus-within:outline-2 focus-within:outline focus-within:[outline-color:theme(colors.forest-700)] focus-within:[outline-offset:1px]',
    isDisabled ? 'bg-neutral-50 cursor-not-allowed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const fieldClass = [
    'flex-1 min-w-0 w-full border-0 bg-transparent font-[inherit] text-sm leading-5 text-neutral-800 placeholder:text-neutral-500 focus:outline-none disabled:text-neutral-400 disabled:cursor-not-allowed disabled:[-webkit-text-fill-color:theme(colors.neutral-400)] disabled:placeholder:text-neutral-400',
    isCompact ? 'p-1.5 min-h-16' : 'p-2 min-h-20',
    isMonospaced ? 'font-[var(--font-code)]' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const messageClass =
    tone === 'error'
      ? 'flex items-start gap-1.5 text-xs leading-4 text-danger-700'
      : tone === 'success'
        ? 'flex items-start gap-1.5 text-xs leading-4 text-forest-500'
        : 'flex items-start gap-1.5 text-xs leading-4 text-neutral-500';

  const describedBy =
    [helperText != null ? messageId : null, ariaDescribedby].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1 font-[var(--font-main)] w-full">
      {label != null && (
        <label htmlFor={fieldId} className="text-xs leading-4 font-semibold text-neutral-600">
          {label}
          {isRequired && (
            <span className="text-danger-500" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      <div className={containerClass}>
        <textarea
          ref={ref}
          id={fieldId}
          className={fieldClass}
          rows={rows}
          disabled={isDisabled}
          required={isRequired}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          style={{ resize: isDisabled ? 'none' : resize }}
          {...rest}
        />
      </div>
      {helperText != null && (
        <div
          id={messageId}
          className={messageClass}
          role={tone === 'error' ? 'alert' : undefined}
        >
          {messageIcon && (
            <span className="inline-flex flex-shrink-0" aria-hidden="true">
              <Icon name={messageIcon} size={16} />
            </span>
          )}
          <span className="flex-1 min-w-0 break-words">{helperText}</span>
        </div>
      )}
    </div>
  );
});
