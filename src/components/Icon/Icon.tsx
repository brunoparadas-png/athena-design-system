import type { SVGProps } from 'react';
import { icons, iconViewBox, type IconName } from './icons';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  /** Icon name from the Athena set. */
  name: IconName;
  /** Pixel size of the square icon. Defaults to 20; buttons use 16. */
  size?: number;
  /**
   * Accessible label. When set, the icon is exposed to screen readers as an
   * image with this label. When omitted, the icon is `aria-hidden` (decorative)
   * — correct when it sits next to a text label, as in a Button.
   */
  title?: string;
}

export function Icon({ name, size = 20, title, ...rest }: IconProps) {
  return (
    <svg
      viewBox={iconViewBox[name] ?? '0 0 24 24'}
      width={size}
      height={size}
      fill="none"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {icons[name]}
    </svg>
  );
}
