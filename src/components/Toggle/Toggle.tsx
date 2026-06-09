import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import styles from './Toggle.module.css';

/**
 * Prop names mirror the Figma "❖ Toggle" component properties:
 * size, isChecked, isDisabled (Figma `state` → CSS pseudo-states).
 *
 * A toggle is a slide switch for an instantly-applied on/off setting. Rendered
 * as a native checkbox with role="switch" so it keeps keyboard, focus, and form
 * semantics. Unlike Checkbox, the change takes effect immediately (no submit).
 */
export interface ToggleProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'className' | 'size' | 'checked' | 'disabled' | 'role'
  > {
  /** Track + dot size. `default` is 32×16, `large` is 40×20. (Figma: size) */
  size?: 'default' | 'large';
  /** Controlled on/off state. Leave undefined and use `defaultChecked` for uncontrolled. (Figma: isChecked) */
  isChecked?: boolean;
  /** Disabled state. (Figma: isDisabled) */
  isDisabled?: boolean;
  /**
   * Optional text rendered after the switch. If omitted, you MUST pass
   * `aria-label` so the switch has an accessible name.
   */
  label?: ReactNode;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { size = 'default', isChecked, isDisabled = false, label, onChange, readOnly, ...rest },
  forwardedRef,
) {
  // A controlled toggle (isChecked set) with no handler is read-only by intent —
  // mark it so, which also silences React's controlled-input warning.
  const resolvedReadOnly = readOnly ?? (isChecked !== undefined && !onChange);

  const rootClassName = [styles.root, styles[size]].join(' ');

  return (
    <label className={rootClassName}>
      <span className={styles.control}>
        <input
          ref={forwardedRef}
          type="checkbox"
          role="switch"
          className={styles.input}
          checked={isChecked}
          disabled={isDisabled}
          readOnly={resolvedReadOnly}
          onChange={onChange}
          {...rest}
        />
        <span className={styles.track} aria-hidden="true">
          <span className={styles.dot} />
        </span>
      </span>
      {label != null && <span className={styles.label}>{label}</span>}
    </label>
  );
});
