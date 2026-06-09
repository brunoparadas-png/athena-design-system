import { forwardRef, useEffect, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import styles from './Checkbox.module.css';

/**
 * Prop names mirror the Figma "❖ Checkbox" component properties:
 * isChecked, isIndeterminate, isInvalid, isDisabled, isRequired, label.
 *
 * Like Button, the Figma `state` property (default/hover/press/focus) is NOT a
 * prop — those are real CSS pseudo-states (:hover, :active, :focus-visible).
 */
export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'className' | 'size' | 'checked' | 'disabled' | 'required'
  > {
  /** Text beside the box. Omit only for standalone checkboxes (then set `aria-label`). */
  label?: ReactNode;
  /** Controlled checked state. Leave undefined and use `defaultChecked` for uncontrolled. (Figma: isChecked) */
  isChecked?: boolean;
  /**
   * Mixed state — renders a dash instead of a check and sets the native
   * `indeterminate` flag (which is DOM-only, never an attribute). (Figma: isIndeterminate)
   */
  isIndeterminate?: boolean;
  /** Error state — danger.500 border + `aria-invalid`. The fill stays forest when checked. (Figma: isInvalid) */
  isInvalid?: boolean;
  /** Disabled state. (Figma: isDisabled) */
  isDisabled?: boolean;
  /** Appends a danger asterisk after the label and sets `required`. (Figma: isRequired) */
  isRequired?: boolean;
}

const CheckMark = () => (
  <svg className={styles.mark} viewBox="0 0 14 14" aria-hidden="true" focusable="false">
    <path d="M3 7.5l2.5 2.5L11 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DashMark = () => (
  <svg className={styles.mark} viewBox="0 0 14 14" aria-hidden="true" focusable="false">
    <path d="M3.5 7h7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    isChecked,
    isIndeterminate = false,
    isInvalid = false,
    isDisabled = false,
    isRequired = false,
    onChange,
    readOnly,
    ...rest
  },
  forwardedRef,
) {
  const innerRef = useRef<HTMLInputElement>(null);

  // A controlled checkbox (isChecked set) with no handler is read-only by
  // intent — mark it so, which also silences React's controlled-input warning.
  const resolvedReadOnly = readOnly ?? (isChecked !== undefined && !onChange);

  // `indeterminate` is a DOM property only — it cannot be set via JSX attribute.
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = isIndeterminate;
  }, [isIndeterminate]);

  const setRefs = (node: HTMLInputElement | null) => {
    innerRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  const boxClassName = [styles.box, isInvalid ? styles.invalid : '']
    .filter(Boolean)
    .join(' ');

  return (
    <label className={styles.root}>
      <span className={styles.control}>
        <input
          ref={setRefs}
          type="checkbox"
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
          <span className={styles.check}>
            <CheckMark />
          </span>
          <span className={styles.dash}>
            <DashMark />
          </span>
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
