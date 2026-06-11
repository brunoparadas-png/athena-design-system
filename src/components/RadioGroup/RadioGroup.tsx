import { useId, useState, type ReactNode } from 'react';
import { Radio } from '../Radio';

export interface RadioGroupOption {
  /** Submitted value, unique within the group. */
  value: string;
  /** Visible label beside the dial. */
  label: ReactNode;
  /** Disable just this option. */
  isDisabled?: boolean;
}

/**
 * Presents a list of options where only one may be selected. Wraps the Radio
 * atom, shares one `name`, and manages selection. Mirrors the Figma
 * "❖ Radio group" — declarative `options` + `onChange`.
 */
export interface RadioGroupProps {
  /** Options to render. (Figma: options) */
  options: RadioGroupOption[];
  /** Group name shared by every radio. Auto-generated if omitted. */
  name?: string;
  /** Controlled selected value. Pair with `onChange`. */
  value?: string;
  /** Initial selected value for uncontrolled usage. */
  defaultValue?: string;
  /** Fires with the newly-selected value. (Figma: onChange) */
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Visible group label, wired to the group via aria-labelledby. */
  label?: ReactNode;
  /** Disable every option. (Figma: isDisabled) */
  isDisabled?: boolean;
  /** Mark every option invalid (e.g. nothing selected on submit). */
  isInvalid?: boolean;
  /** Appends a danger asterisk to the group label and requires a selection. */
  isRequired?: boolean;
  /** Lay options out in a row instead of a column. */
  orientation?: 'vertical' | 'horizontal';
  /** Use when there is no visible `label`. */
  'aria-label'?: string;
  /** Point the group at an external label element. */
  'aria-labelledby'?: string;
}

export function RadioGroup({
  options,
  name,
  value,
  defaultValue,
  onChange,
  label,
  isDisabled = false,
  isInvalid = false,
  isRequired = false,
  orientation = 'vertical',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: RadioGroupProps) {
  const reactId = useId();
  const groupName = name ?? reactId;
  const labelId = `${reactId}-label`;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = isControlled ? value : internalValue;

  const handleChange = (next: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next, event);
  };

  const labelledBy = ariaLabelledby ?? (label != null ? labelId : undefined);

  return (
    <div
      role="radiogroup"
      className="flex flex-col gap-2"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : ariaLabel}
      aria-required={isRequired || undefined}
      aria-invalid={isInvalid || undefined}
    >
      {label != null && (
        <span id={labelId} className="font-[var(--font-main)] text-sm leading-5 font-semibold text-neutral-800">
          {label}
          {isRequired && (
            <span className="text-danger-500 text-xs font-normal" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </span>
      )}
      <div className={orientation === 'horizontal' ? 'flex flex-row flex-wrap gap-4' : 'flex flex-col gap-1'}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={groupName}
            value={option.value}
            label={option.label}
            isChecked={selectedValue === option.value}
            isDisabled={isDisabled || option.isDisabled}
            isInvalid={isInvalid}
            onChange={handleChange(option.value)}
          />
        ))}
      </div>
    </div>
  );
}
