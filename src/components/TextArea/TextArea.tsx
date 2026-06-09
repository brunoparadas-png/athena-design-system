import { forwardRef, useId, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';
import styles from './TextArea.module.css';

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
    styles.container,
    isCompact ? styles.compact : '',
    isInvalid ? styles.invalid : '',
    isDisabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  const fieldClass = [styles.field, isMonospaced ? styles.monospaced : ''].filter(Boolean).join(' ');

  const describedBy =
    [helperText != null ? messageId : null, ariaDescribedby].filter(Boolean).join(' ') || undefined;

  return (
    <div className={styles.root}>
      {label != null && (
        <label htmlFor={fieldId} className={styles.label}>
          {label}
          {isRequired && (
            <span className={styles.required} aria-hidden="true">
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
          className={[styles.message, styles[tone]].join(' ')}
          role={tone === 'error' ? 'alert' : undefined}
        >
          {messageIcon && (
            <span className={styles.messageIcon} aria-hidden="true">
              <Icon name={messageIcon} size={16} />
            </span>
          )}
          <span className={styles.messageText}>{helperText}</span>
        </div>
      )}
    </div>
  );
});
