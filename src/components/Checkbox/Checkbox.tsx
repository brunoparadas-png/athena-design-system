import { forwardRef, useLayoutEffect, useRef, type InputHTMLAttributes, type ReactNode } from 'react';

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
  <svg className="block w-[14px] h-[14px]" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
    <path d="M3 7.5l2.5 2.5L11 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DashMark = () => (
  <svg className="block w-[14px] h-[14px]" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
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
  // useLayoutEffect (not useEffect) so it runs synchronously after the DOM
  // commits and before the browser paints — guaranteeing the property is set
  // before Storybook/Chromatic play functions read it.
  useLayoutEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = isIndeterminate;
  }, [isIndeterminate]);

  const setRefs = (node: HTMLInputElement | null) => {
    innerRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  // Whether the control is in the "on" state (checked or indeterminate).
  // Used for data-on attribute so group-data-[on] variants can style
  // hover/active on the filled state — Tailwind cannot chain multiple
  // peer conditions (e.g. peer-checked:peer-hover:) on a single utility.
  const isOn = (isChecked === true) || isIndeterminate;

  // Mark visibility: indeterminate wins over checked.
  const checkClassName = isIndeterminate
    ? 'hidden leading-[0]'
    : 'hidden leading-[0] peer-checked:block';

  const dashClassName = isIndeterminate
    ? 'block leading-[0]'
    : 'hidden leading-[0]';

  return (
    <label
      className={`inline-flex items-start gap-1 font-[var(--font-main)] text-sm leading-5 ${isDisabled ? 'cursor-not-allowed text-neutral-400' : 'cursor-pointer text-neutral-800'}`}
    >
      {/*
        Control wrapper:
        - group/ctrl lets child box use group-data-[on]/ctrl: and group-data-[invalid]/ctrl:
          for compound state styling that peer alone cannot express.
        - mt-[3px] centers the 14px box on the 20px text first-line: (20 - 14) / 2 = 3px.
      */}
      <span
        className="group/ctrl inline-flex relative flex-shrink-0 mt-[3px]"
        data-on={isOn ? '' : undefined}
        data-invalid={isInvalid && !isDisabled ? '' : undefined}
      >
        {/* Visually-hidden native input — keeps keyboard, focus, and the a11y tree intact. */}
        <input
          ref={setRefs}
          type="checkbox"
          className="peer absolute inset-0 m-0 w-full h-full opacity-0 cursor-[inherit]"
          checked={isChecked}
          disabled={isDisabled}
          required={isRequired}
          readOnly={resolvedReadOnly}
          onChange={onChange}
          aria-invalid={isInvalid || undefined}
          {...rest}
        />

        {/*
          Visual box — styled via peer-* (real CSS pseudo-states from sibling input)
          and group-data-[on]/ctrl / group-data-[invalid]/ctrl (JS-prop-driven state).

          State layering (later rules override earlier via Tailwind source order):
          1. Base: transparent bg, neutral-300 border, white text (for SVG stroke)
          2. Hover unchecked (not disabled): neutral-50 bg
          3. Active unchecked (not disabled): neutral-200 bg
          4. On (checked/indeterminate via group-data): forest-500 bg + border
          5. On + hover (not disabled): forest-700 bg + border
          6. On + active (not disabled): forest-900 bg + border
          7. Invalid (not disabled via group-data): danger-500 border
          8. Focus visible: forest-700 outline ring
          9. Disabled: neutral-100 bg, transparent border, neutral-400 text (gray mark)
          Disabled unchecked (static, !isOn && isDisabled): restore neutral-300 border
        */}
        <span
          aria-hidden="true"
          className={[
            'box-border w-[14px] h-[14px] inline-flex items-center justify-center',
            'bg-transparent border border-neutral-300 rounded-none text-white',
            'transition-[background-color,border-color] duration-[120ms] ease-[ease] motion-reduce:transition-none',
            // Hover unchecked (not disabled)
            'peer-hover:peer-[&:not(:disabled)]:bg-neutral-50',
            // Active unchecked (not disabled)
            'peer-active:peer-[&:not(:disabled)]:bg-neutral-200',
            // On state: forest fill + border (overrides hover/active above via later source order)
            'group-data-[on]/ctrl:bg-forest-500 group-data-[on]/ctrl:border-forest-500',
            // On + hover (not disabled)
            'group-data-[on]/ctrl:peer-hover:peer-[&:not(:disabled)]:bg-forest-700',
            'group-data-[on]/ctrl:peer-hover:peer-[&:not(:disabled)]:border-forest-700',
            // On + active (not disabled)
            'group-data-[on]/ctrl:peer-active:peer-[&:not(:disabled)]:bg-forest-900',
            'group-data-[on]/ctrl:peer-active:peer-[&:not(:disabled)]:border-forest-900',
            // Invalid border (not disabled) — danger.500 overrides everything except disabled
            'group-data-[invalid]/ctrl:border-danger-500',
            // Invalid active press unchecked/not-indeterminate: danger-100 bg
            isInvalid && !isDisabled && !isOn
              ? 'peer-active:bg-[var(--danger-100,#ffe6e6)]'
              : '',
            // Focus ring — 2px forest.700 outline, offset 2px
            'peer-focus-visible:outline-2 peer-focus-visible:outline-forest-700 peer-focus-visible:outline-offset-2',
            // Disabled: neutral-100 bg, transparent border, neutral-400 text (gray mark when checked)
            'peer-disabled:bg-neutral-100 peer-disabled:border-transparent peer-disabled:text-neutral-400',
            // Disabled unchecked: restore faint border for the empty box
            !isOn && isDisabled ? 'border-neutral-300' : '',
          ].filter(Boolean).join(' ')}
        >
          <span className={checkClassName}>
            <CheckMark />
          </span>
          <span className={dashClassName}>
            <DashMark />
          </span>
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
