import type { HTMLAttributes } from 'react';

export type SpinnerSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

const SIZE_PX: Record<SpinnerSize, number> = {
  xsmall: 12,
  small: 16,
  medium: 24,
  large: 48,
  xlarge: 96,
};

/**
 * Mirrors the Figma "❖ Spinner": size (xsmall/small/medium/large/xlarge) and
 * appearance=inherit — the arc always draws in the current text color
 * (currentColor), so it adapts to whatever it sits inside (a button, dark
 * surface, etc.).
 */
export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'className'> {
  /** 12 / 16 / 24 / 48 / 96px. (Figma: size) */
  size?: SpinnerSize;
  /** Accessible label announced while loading. Defaults to "Loading". */
  label?: string;
}

export function Spinner({ size = 'medium', label = 'Loading', ...rest }: SpinnerProps) {
  const px = SIZE_PX[size];
  return (
    <span
      className="inline-flex items-center justify-center color-inherit flex-shrink-0 leading-none"
      role="status"
      aria-label={label}
      style={{ width: px, height: px }}
      {...rest}
    >
      <svg
        className="block [transform-origin:center] [animation:spin_0.7s_linear_infinite] motion-reduce:[animation-duration:2s]"
        viewBox="0 0 16 16"
        width={px}
        height={px}
        aria-hidden="true"
      >
        {/* ~75% arc with round caps; the SVG spins via CSS. */}
        <circle
          cx="8"
          cy="8"
          r="7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="33 44"
        />
      </svg>
    </span>
  );
}
