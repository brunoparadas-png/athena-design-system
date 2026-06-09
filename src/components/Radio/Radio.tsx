import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import styles from './Radio.module.css';

/**
 * Prop names mirror the Figma "❖ Radio" component properties:
 * isChecked, isInvalid, isDisabled, isRequired, label.
 *
 * Like Button/Checkbox, the Figma `state` property (default/hover/press/focus)
 * is NOT a prop — those are real CSS pseudo-states. A radio has no indeterminate
 * state. Group radios by giving them a shared `name`.
 */
export interface RadioProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'className' | 'size' | 'checked' | 'disabled' | 'required'
  > {
  /** Text beside the dial. Omit only for standalone radios (then set `aria-label`). */
  label?: ReactNode;
  /** Controlled selected state. Leave undefined and use `defaultChecked` for uncontrolled. (Figma: isChecked) */
  isChecked?: boolean;
  /**
   * Error state. Unchecked → danger.500 border; checked → danger.500 fill.
   * Usually driven by the parent RadioGroup's validation. (Figma: isInvalid)
   */
  isInvalid?: boolean;
  /** Disabled state. (Figma: isDisabled) */
  isDisabled?: boolean;
  /** Appends a danger asterisk after the label and sets `required`. (Figma: isRequired) */
  isRequired?: boolean;
}

const CheckMark = () => (
  <svg className={styles.mark} viewBox="0 0 14 14" aria-hidden="true" focusable="false">
    <path
      d="M3 7.5l2.5 2.5L11 4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    label,
    isChecked,
    isInvalid = false,
    isDisabled = false,
    isRequired = false,
    onChange,
    readOnly,
    ...rest
  },
  forwardedRef,
) {
  // A controlled radio (isChecked set) with no handler is read-only by intent —
  // mark it so, which also silences React's controlled-input warning.
  const resolvedReadOnly = readOnly ?? (isChecked !== undefined && !onChange);

  const boxClassName = [styles.box, isInvalid ? styles.invalid : '']
    .filter(Boolean)
    .join(' ');

  return (
    <label className={styles.root}>
      <span className={styles.control}>
        <input
          ref={forwardedRef}
          type="radio"
          className={styles.input}
          checked={isChecked}
          disabled={isDisabled}
          required={isRequired}
          readOnly={resolvedReadOnly}
          onChange={onChange}
          aria-invalid={isInvalid || undefined}
          {...rest}
        />
        <span className={boxClassName} aria-hidden="true">
          <CheckMark />
        </span>
      </span>
      {label != null && (
        <span className={styles.label}>
          {label}
          {isRequired && (
            <span className={styles.required} aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </span>
      )}
    </label>
  );
});
