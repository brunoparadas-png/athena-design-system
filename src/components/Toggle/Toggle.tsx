import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

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
  /** Track + dot size. `regular` is 32×16, `large` is 40×20. (Figma: size) */
  size?: 'regular' | 'large';
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
  { size = 'regular', isChecked, isDisabled = false, label, onChange, readOnly, ...rest },
  forwardedRef,
) {
  // A controlled toggle (isChecked set) with no handler is read-only by intent —
  // mark it so, which also silences React's controlled-input warning.
  const resolvedReadOnly = readOnly ?? (isChecked !== undefined && !onChange);

  // Size-specific dimensions for track and dot
  const isLarge = size === 'large';

  // Track: default 32×16, large 40×20
  const trackSizeClasses = isLarge ? 'w-10 h-5' : 'w-8 h-4';

  // Dot: default 12px, large 16px; travel: default 16px, large 20px
  // dot top/left = 2px in both sizes
  // translateX on checked: default 16px = translate-x-4, large 20px = translate-x-5
  const dotSizeClasses = isLarge ? 'w-4 h-4' : 'w-3 h-3';
  const dotCheckedTranslate = isLarge ? 'peer-checked:translate-x-5' : 'peer-checked:translate-x-4';

  const rootClasses = `inline-flex items-center gap-2 cursor-pointer font-[var(--font-main)] text-sm leading-5 text-neutral-800 has-[:disabled]:cursor-not-allowed has-[:disabled]:text-neutral-400`;

  const inputClasses = `peer absolute inset-0 m-0 w-full h-full opacity-0 cursor-[inherit] z-[1]`;

  const trackClasses = [
    'block w-full h-full rounded-full',
    // Off state
    'bg-neutral-500',
    // On state
    'peer-checked:bg-forest-500',
    // Hover off (not disabled)
    'peer-not-disabled:peer-hover:bg-neutral-600',
    // Hover on (not disabled)
    'peer-checked:peer-not-disabled:peer-hover:bg-forest-600',
    // Disabled (both on and off)
    'peer-disabled:bg-neutral-100',
    // Focus-visible ring
    'peer-focus-visible:outline-2 peer-focus-visible:outline-forest-700 peer-focus-visible:outline-offset-2',
    // Transition
    'transition-[background-color] duration-[120ms] ease-[ease] motion-reduce:transition-none',
  ].join(' ');

  const dotClasses = [
    'absolute top-[2px] left-[2px] rounded-full bg-white shadow-[0_1px_2px_rgba(9,30,66,0.25)]',
    dotSizeClasses,
    // Slide on checked
    dotCheckedTranslate,
    // Transition
    'transition-transform duration-[120ms] ease-[ease] motion-reduce:transition-none',
  ].join(' ');

  return (
    <label className={rootClasses}>
      <span className={`inline-flex relative flex-shrink-0 ${trackSizeClasses}`}>
        <input
          ref={forwardedRef}
          type="checkbox"
          role="switch"
          className={inputClasses}
          checked={isChecked}
          disabled={isDisabled}
          readOnly={resolvedReadOnly}
          onChange={onChange}
          {...rest}
        />
        <span className={trackClasses} aria-hidden="true">
          <span className={dotClasses} />
        </span>
      </span>
      {label != null && <span className="inline-block break-words">{label}</span>}
    </label>
  );
});
