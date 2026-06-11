import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../Icon';
import type { ButtonAppearance, ButtonSize } from '../Button';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'disabled'> {
  /**
   * Visual weight. `primary` carries the single forest.500 moment per view —
   * never render two `primary` buttons on the same view. (Figma: appearance)
   */
  appearance?: ButtonAppearance;
  /** `default` is 40×40px, `small` is 32×32px. */
  size?: ButtonSize;
  /**
   * The icon to render. Required — an icon button has no text label, so the
   * icon name and `aria-label` are the only description of the action.
   */
  icon: IconName;
  /**
   * Toggle-on state. Renders the forest tint (forest.50 fill + forest.700
   * border/text) and exposes `aria-pressed`. (Figma: isSelected)
   */
  isSelected?: boolean;
  /** Disabled state. (Figma: isDisabled) */
  isDisabled?: boolean;
  /**
   * Required accessible name. Since there is no visible text label, this string
   * is what screen readers announce when focus lands on the button.
   */
  'aria-label': string;
}

// Base classes — same as Button but square (aspect-square, p-0, explicit w/h)
const BASE =
  'appearance-none m-0 inline-flex items-center justify-center relative border cursor-pointer rounded-none transition-[background-color,border-color,color] duration-[120ms] ease-[ease] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-forest-700 focus-visible:outline-offset-2 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-transparent disabled:cursor-not-allowed aspect-square p-0 shrink-0';

const SIZE_CLASSES: Record<ButtonSize, { button: string; iconSize: number }> = {
  default: { button: 'w-10 h-10', iconSize: 20 },
  small: { button: 'w-8 h-8', iconSize: 16 },
};

// Same variant classes as Button
const VARIANT_CLASSES: Record<ButtonAppearance, string> = {
  primary:
    'bg-forest-500 text-white border-transparent hover:enabled:bg-forest-700 active:enabled:bg-forest-900',
  neutral:
    'bg-white text-neutral-600 border-neutral-300 hover:enabled:bg-forest-100 hover:enabled:border-forest-500 hover:enabled:text-forest-700 active:enabled:bg-forest-200 active:enabled:border-forest-500 active:enabled:text-forest-700',
  text: 'bg-transparent text-neutral-600 border-transparent disabled:bg-transparent hover:enabled:bg-forest-100 hover:enabled:text-forest-700 active:enabled:bg-forest-200 active:enabled:text-forest-700',
  danger:
    'bg-danger-700 text-white border-transparent hover:enabled:bg-danger-800 active:enabled:bg-danger-900',
};

// Selected state overrides variant colours — identical to Button
const SELECTED_CLASSES =
  'bg-forest-50 border-forest-700 text-forest-700 hover:enabled:bg-forest-50 hover:enabled:border-forest-700 hover:enabled:text-forest-700 active:enabled:bg-forest-50 active:enabled:border-forest-700 active:enabled:text-forest-700';

export function IconButton({
  appearance = 'neutral',
  size = 'default',
  icon,
  isSelected = false,
  isDisabled = false,
  type = 'button',
  'aria-label': ariaLabel,
  ...rest
}: IconButtonProps) {
  const { button: sizeClass, iconSize } = SIZE_CLASSES[size];
  const variantClass = isSelected ? SELECTED_CLASSES : VARIANT_CLASSES[appearance];
  const className = `${BASE} ${sizeClass} ${variantClass}`;

  return (
    <button
      type={type}
      className={className}
      disabled={isDisabled}
      aria-pressed={isSelected || undefined}
      aria-label={ariaLabel}
      title={ariaLabel}
      {...rest}
    >
      <Icon name={icon} size={iconSize} aria-hidden={true} />
    </button>
  );
}
