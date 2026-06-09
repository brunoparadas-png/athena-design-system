import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';
import styles from './TextField.module.css';

/**
 * Prop names mirror the Figma "❖ Text field" properties: label, placeholder,
 * iconBefore, iconAfter, isCompact, isDisabled, isInvalid, plus the helper
 * `<Message>` (helperText + its error/valid tone).
 *
 * Like Button/Checkbox, the Figma `state` property (default/hover/focus/typing/
 * filled) is NOT a prop — those are real CSS states (:hover, :focus-within, and
 * the value the user types).
 */
export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'size' | 'disabled' | 'required'> {
  /** Field label above the input. Omit only if you set `aria-label`. */
  label?: ReactNode;
  /** Helper / status message below the input (the Figma `<Message>`). */
  helperText?: ReactNode;
  /** Error state — danger.500 border, danger message with a warning icon, `aria-invalid`. (Figma: isInvalid) */
  isInvalid?: boolean;
  /** Success tone for the helper message — forest text + check icon. */
  isValid?: boolean;
  /** Shorter input (32px instead of 40px). (Figma: isCompact) */
  isCompact?: boolean;
  /** Disabled state. (Figma: isDisabled) */
  isDisabled?: boolean;
  /** Appends a danger asterisk to the label and sets `required`. */
  isRequired?: boolean;
  /** Leading icon, by name. (Figma: iconBefore) */
  iconBefore?: IconName;
  /** Trailing icon, by name. (Figma: iconAfter) */
  iconAfter?: IconName;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    helperText,
    isInvalid = false,
    isValid = false,
    isCompact = false,
    isDisabled = false,
    isRequired = false,
    iconBefore,
    iconAfter,
    id,
    'aria-describedby': ariaDescribedby,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? `${reactId}-input`;
  const messageId = `${reactId}-message`;

  // error tone wins over success
  const tone = isInvalid ? 'error' : isValid ? 'success' : 'neutral';
  const messageIcon: IconName | null =
    tone === 'error' ? 'warning' : tone === 'success' ? 'check-circle' : null;

  const inputClass = [
    styles.input,
    isCompact ? styles.compact : '',
    isInvalid ? styles.invalid : '',
    isDisabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  const describedBy = [helperText != null ? messageId : null, ariaDescribedby]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={styles.root}>
      {label != null && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {isRequired && (
            <span className={styles.required} aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      <div className={inputClass}>
        {iconBefore && (
          <span className={styles.icon} aria-hidden="true">
            <Icon name={iconBefore} size={20} />
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type="text"
          className={styles.field}
          disabled={isDisabled}
          required={isRequired}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {iconAfter && (
          <span className={styles.icon} aria-hidden="true">
            <Icon name={iconAfter} size={20} />
          </span>
        )}
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
