import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';

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
  /**
   * Success tone for the helper message — forest text + check icon.
   * @code-extension Not yet reflected in Figma. The Figma Parts/<Message>
   * component only exposes valid='false'; there is no valid='true' variant in
   * the design spec. Add a valid='true' variant to Parts/<Message> in Figma
   * before relying on this prop in production.
   */
  isValid?: boolean;
  /** Shorter input (32px instead of 40px). (Figma: isCompact) */
  isCompact?: boolean;
  /** Disabled state. (Figma: isDisabled) */
  isDisabled?: boolean;
  /**
   * Appends a danger asterisk to the label and sets `required`.
   * @code-extension Not yet reflected in Figma. The Figma component set has no
   * 'isRequired' property. Add an isRequired variant to the Figma component
   * before relying on this prop in production.
   */
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

  // Build container class from state conditions
  const containerClass = [
    'box-border flex items-center gap-2 w-full px-2 bg-white border rounded-none transition-[border-color,box-shadow] duration-[120ms] motion-reduce:transition-none',
    isCompact ? 'min-h-8' : 'min-h-10',
    isDisabled
      ? 'bg-neutral-50 border-[var(--border-neutral-default)] cursor-not-allowed'
      : isInvalid
        ? 'border-danger-500 hover:border-danger-500 focus-within:border-danger-500 focus-within:outline-2 focus-within:outline-danger-700 [focus-within:outline-offset:1px]'
        : 'border-[var(--border-neutral-default)] hover:border-neutral-400 focus-within:border-forest-500 focus-within:outline-2 focus-within:outline-forest-700 [focus-within:outline-offset:1px]',
  ]
    .filter(Boolean)
    .join(' ');

  const iconClass = `inline-flex flex-shrink-0 ${isDisabled ? 'text-neutral-400' : 'text-neutral-500'}`;

  const messageClass = [
    'flex items-start gap-1.5 text-xs leading-4',
    tone === 'error' ? 'text-danger-700' : tone === 'success' ? 'text-forest-500' : 'text-neutral-500',
  ].join(' ');

  const describedBy = [helperText != null ? messageId : null, ariaDescribedby]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1 font-[var(--font-main)] w-full">
      {label != null && (
        <label htmlFor={inputId} className="text-xs leading-4 font-semibold text-neutral-600">
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
        {iconBefore && (
          <span className={iconClass} aria-hidden="true">
            <Icon name={iconBefore} size={20} />
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type="text"
          className="flex-1 min-w-0 border-0 p-0 bg-transparent text-sm leading-5 text-neutral-800 placeholder:text-neutral-500 focus:outline-none disabled:text-neutral-400 disabled:cursor-not-allowed disabled:[-webkit-text-fill-color:theme(colors.neutral-400)]"
          disabled={isDisabled}
          required={isRequired}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {iconAfter && (
          <span className={iconClass} aria-hidden="true">
            <Icon name={iconAfter} size={20} />
          </span>
        )}
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
