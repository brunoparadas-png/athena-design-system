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

  // Mark visibility. The mark spans are NESTED inside the box, so peer-* (which
  // only matches siblings of the input) can't reach them — use group-has-[],
  // which reflects the real DOM :checked / :indeterminate state for both
  // controlled and uncontrolled use. Indeterminate (a controlled-only prop)
  // wins over checked.
  const checkClassName = isIndeterminate
    ? 'hidden'
    : 'hidden leading-[0] group-has-[:checked]/ctrl:block';

  const dashClassName = isIndeterminate
    ? 'block leading-[0]'
    : 'hidden';

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
      <span className="group/ctrl inline-flex relative flex-shrink-0 mt-[3px]">
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
            'bg-white border border-neutral-300 rounded-none text-white',
            'transition-[background-color,border-color] duration-[120ms] ease-[ease] motion-reduce:transition-none',
            // Hover / active while unchecked — the box is a direct sibling of the
            // input, so peer-* applies here (unlike the nested mark spans above).
            'peer-hover:peer-enabled:bg-neutral-50',
            'peer-active:peer-enabled:bg-neutral-200',
            // On state: forest fill + border, driven by the real :checked /
            // :indeterminate DOM state. Registered after hover in Tailwind's
            // cascade, so the filled state wins when both apply.
            'peer-checked:bg-forest-500 peer-checked:border-forest-500',
            'peer-indeterminate:bg-forest-500 peer-indeterminate:border-forest-500',
            // On + hover / active (not disabled) — darker forest
            'peer-checked:peer-hover:peer-enabled:bg-forest-700 peer-checked:peer-hover:peer-enabled:border-forest-700',
            'peer-indeterminate:peer-hover:peer-enabled:bg-forest-700 peer-indeterminate:peer-hover:peer-enabled:border-forest-700',
            'peer-checked:peer-active:peer-enabled:bg-forest-900 peer-checked:peer-active:peer-enabled:border-forest-900',
            // Invalid border (not disabled) — danger.500
            isInvalid && !isDisabled ? 'border-danger-500' : '',
            // Focus ring — 2px forest.700 outline, offset 2px
            'peer-focus-visible:outline-2 peer-focus-visible:outline-forest-700 peer-focus-visible:outline-offset-2',
            // Disabled wins last: neutral-100 fill, faint border, gray mark
            'peer-disabled:bg-neutral-100 peer-disabled:border-neutral-300 peer-disabled:text-neutral-400',
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
