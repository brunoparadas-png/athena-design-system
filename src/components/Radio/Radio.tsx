import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

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

  return (
    <label
      className={`inline-flex items-start gap-1 font-[var(--font-main)] text-sm leading-5 ${isDisabled ? 'cursor-not-allowed text-neutral-400' : 'cursor-pointer text-neutral-800'}`}
    >
      {/*
       * Control wrapper — `group/ctrl` lets the box use group-has-[] variants
       * to target compound pseudo-state combinations (checked+hover, etc.)
       * that cannot be expressed with a single peer modifier.
       */}
      <span className="group/ctrl inline-flex relative flex-shrink-0 mt-[3px]">
        {/* Visually-hidden native input — keeps keyboard, focus, grouping, and the a11y tree. */}
        <input
          ref={forwardedRef}
          type="radio"
          className="peer/radio absolute inset-0 m-0 w-full h-full opacity-0 cursor-[inherit]"
          checked={isChecked}
          disabled={isDisabled}
          required={isRequired}
          readOnly={resolvedReadOnly}
          onChange={onChange}
          aria-invalid={isInvalid || undefined}
          {...rest}
        />

        {/*
         * Visible dial.
         *
         * Peer modifiers handle single-state conditions (checked, focus-visible, disabled).
         * group-has-[] handles compound conditions (checked+hover, checked+active, etc.)
         * because Tailwind cannot stack two peer-* conditions on one class.
         *
         * Normal states (not invalid):
         *   default unchecked → border-neutral-300, bg-white
         *   hover unchecked   → bg-neutral-100
         *   active unchecked  → bg-neutral-200
         *   checked           → bg-forest-500, border-forest-500
         *   checked+hover     → bg-forest-700, border-forest-700
         *   checked+active    → bg-forest-900, border-forest-900
         *
         * Invalid states:
         *   unchecked → border-danger-500 (bg stays white)
         *   checked   → bg-danger-500, border-danger-500
         *   checked+hover  → bg-danger-700, border-danger-700
         *   checked+active → bg-danger-900, border-danger-900
         *
         * Shared states:
         *   focus-visible → outline-2, forest-700, offset-2
         *   disabled      → bg-neutral-100, border-neutral-300, text-neutral-400
         */}
        <span
          aria-hidden="true"
          className={[
            // Layout & shape
            'box-border w-[14px] h-[14px] inline-flex items-center justify-center',
            'border rounded-full',
            // color of the check mark SVG stroke
            'text-white',
            // Transition
            'transition-[background-color,border-color] duration-[120ms] ease-[ease] motion-reduce:transition-none',
            // Focus ring
            'peer-focus-visible/radio:outline-2 peer-focus-visible/radio:outline-forest-700 peer-focus-visible/radio:outline-offset-2',
            // Disabled (highest priority — placed last so it wins)
            'peer-disabled/radio:bg-neutral-100 peer-disabled/radio:border-neutral-300 peer-disabled/radio:text-neutral-400',

            isInvalid
              ? [
                  // Unchecked invalid default
                  'bg-white border-danger-500',
                  // Checked invalid
                  'peer-checked/radio:bg-danger-500 peer-checked/radio:border-danger-500',
                  // Checked+hover (not disabled) — use group-has-[] on group/ctrl
                  'group-has-[input:checked:not(:disabled):hover]/ctrl:bg-danger-700',
                  'group-has-[input:checked:not(:disabled):hover]/ctrl:border-danger-700',
                  // Checked+active (not disabled)
                  'group-has-[input:checked:not(:disabled):active]/ctrl:bg-danger-900',
                  'group-has-[input:checked:not(:disabled):active]/ctrl:border-danger-900',
                ].join(' ')
              : [
                  // Default unchecked
                  'bg-white border-neutral-300',
                  // Hover unchecked (not disabled) — group-has-[] for compound state
                  'group-has-[input:not(:checked):not(:disabled):hover]/ctrl:bg-neutral-100',
                  // Active unchecked (not disabled)
                  'group-has-[input:not(:checked):not(:disabled):active]/ctrl:bg-neutral-200',
                  // Checked
                  'peer-checked/radio:bg-forest-500 peer-checked/radio:border-forest-500',
                  // Checked+hover (not disabled)
                  'group-has-[input:checked:not(:disabled):hover]/ctrl:bg-forest-700',
                  'group-has-[input:checked:not(:disabled):hover]/ctrl:border-forest-700',
                  // Checked+active (not disabled)
                  'group-has-[input:checked:not(:disabled):active]/ctrl:bg-forest-900',
                  'group-has-[input:checked:not(:disabled):active]/ctrl:border-forest-900',
                ].join(' '),
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {/* Mark — hidden until checked. The SVG is NESTED inside the dial, so
              peer-* (siblings only) can't reach it; group-has-[] reflects the
              real :checked DOM state and works for nested elements. */}
          <svg
            className="w-[14px] h-[14px] hidden group-has-[:checked]/ctrl:block"
            viewBox="0 0 14 14"
            aria-hidden="true"
            focusable={false}
          >
            <path
              d="M3 7.5l2.5 2.5L11 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>

      {label != null && (
        <span className="inline-block break-words">
          {label}
          {isRequired && (
            <span className="text-danger-500 text-xs" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </span>
      )}
    </label>
  );
});
