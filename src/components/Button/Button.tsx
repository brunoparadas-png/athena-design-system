import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../Icon';

export type ButtonAppearance = 'primary' | 'neutral' | 'text' | 'danger';
export type ButtonSize = 'default' | 'small';

/**
 * Prop names mirror the Figma "❖ Button" component properties:
 * appearance, size, iconBefore, iconAfter, isSelected, isDisabled.
 * (`loading` is an implementation extra, not a Figma property.)
 */
export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'disabled'> {
  /**
   * Visual weight. `primary` carries the single forest.500 moment per view —
   * never render two `primary` buttons on the same view. (Figma: appearance)
   */
  appearance?: ButtonAppearance;
  /** `default` is 40px tall, `small` is 32px. Both use body-m (14px). */
  size?: ButtonSize;
  /** Leading icon, by name from the Athena set. (Figma: iconBefore) */
  iconBefore?: IconName;
  /** Trailing icon, by name — often a chevron. (Figma: iconAfter) */
  iconAfter?: IconName;
  /**
   * Toggle-on state. Renders the forest tint (forest.50 fill + forest.700
   * border/text) across all appearances and exposes `aria-pressed`. (Figma: isSelected)
   */
  isSelected?: boolean;
  /** Disabled state. (Figma: isDisabled) */
  isDisabled?: boolean;
  /** Locks the button and swaps the label for a spinner; sets aria-busy. */
  loading?: boolean;
}

// Base classes shared by all variants and sizes
const BASE =
  'appearance-none m-0 inline-flex items-center justify-center relative border cursor-pointer rounded-none font-semibold text-sm leading-5 whitespace-nowrap px-3 transition-[background-color,border-color,color] duration-[120ms] ease-[ease] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-forest-700 focus-visible:outline-offset-2 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-transparent disabled:cursor-not-allowed';

const SIZE_CLASSES: Record<ButtonSize, string> = {
  default: 'min-h-10',
  small: 'min-h-8',
};

// Icon sizing per button size: 20px on default (medium), 16px on small.
const ICON_SIZE: Record<ButtonSize, number> = {
  default: 20,
  small: 16,
};
const ICON_BOX: Record<ButtonSize, string> = {
  default: 'size-5',
  small: 'size-4',
};

// Variant classes (hover/active use enabled: modifier so disabled state is unaffected)
const VARIANT_CLASSES: Record<ButtonAppearance, string> = {
  primary:
    'bg-forest-500 text-white border-transparent hover:enabled:bg-forest-700 active:enabled:bg-forest-900',
  neutral:
    'bg-white text-neutral-600 border-neutral-300 hover:enabled:bg-forest-100 hover:enabled:border-forest-500 hover:enabled:text-forest-700 active:enabled:bg-forest-200 active:enabled:border-forest-500 active:enabled:text-forest-700',
  text: 'bg-transparent text-neutral-600 border-transparent disabled:bg-transparent hover:enabled:bg-forest-100 hover:enabled:text-forest-700 active:enabled:bg-forest-200 active:enabled:text-forest-700',
  danger:
    'bg-danger-700 text-white border-transparent hover:enabled:bg-danger-800 active:enabled:bg-danger-900',
};

// Selected state overrides variant colours (forest tint across all appearances)
const SELECTED_CLASSES =
  'bg-forest-50 border-forest-700 text-forest-700 hover:enabled:bg-forest-50 hover:enabled:border-forest-700 hover:enabled:text-forest-700 active:enabled:bg-forest-50 active:enabled:border-forest-700 active:enabled:text-forest-700';

export function Button({
  appearance = 'neutral',
  size = 'default',
  children,
  iconBefore,
  iconAfter,
  isSelected = false,
  isDisabled = false,
  loading = false,
  type = 'button',
  ...rest
}: ButtonProps) {
  const className = `${BASE} ${SIZE_CLASSES[size]} ${isSelected ? SELECTED_CLASSES : VARIANT_CLASSES[appearance]}`;
  const iconSize = ICON_SIZE[size];
  const iconBox = ICON_BOX[size];

  return (
    <button
      type={type}
      className={className}
      disabled={isDisabled || loading}
      aria-busy={loading || undefined}
      aria-pressed={isSelected || undefined}
      {...rest}
    >
      {loading && (
        <span
          className="absolute size-4 border-2 border-current border-r-transparent rounded-full [animation:spin_0.6s_linear_infinite] motion-reduce:[animation-duration:1.5s]"
          aria-hidden="true"
        />
      )}
      <span className={`inline-flex items-center gap-1.5${loading ? ' opacity-0' : ''}`} aria-live="polite">
        {iconBefore && (
          <span className={`inline-flex ${iconBox}`} aria-hidden="true">
            <Icon name={iconBefore} size={iconSize} />
          </span>
        )}
        {children}
        {iconAfter && (
          <span className={`inline-flex ${iconBox}`} aria-hidden="true">
            <Icon name={iconAfter} size={iconSize} />
          </span>
        )}
      </span>
    </button>
  );
}
