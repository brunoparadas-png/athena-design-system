import type { ReactNode } from 'react';

/**
 * Athena icon set — normalized to a 24×24 viewBox, currentColor, in the Figma
 * icon style (2px stroke, round caps/joins; filled variants where the source is
 * solid). Sourced from the Figma "Icons" page (node 391:3458).
 *
 * This is a curated starter subset covering button + common UI needs. Add more
 * by appending entries here; the IconName union updates automatically.
 */

const stroke = {
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

const fill = { fill: 'currentColor' };

export const icons = {
  // chevrons
  'chevron-down': <path d="M6 9l6 6 6-6" {...stroke} />,
  'chevron-up': <path d="M6 15l6-6 6 6" {...stroke} />,
  'chevron-left': <path d="M15 6l-6 6 6 6" {...stroke} />,
  'chevron-right': <path d="M9 6l6 6-6 6" {...stroke} />,

  // arrows
  'arrow-right': <><path d="M5 12h14" {...stroke} /><path d="M13 6l6 6-6 6" {...stroke} /></>,
  'arrow-left': <><path d="M19 12H5" {...stroke} /><path d="M11 6l-6 6 6 6" {...stroke} /></>,
  'arrow-up': <><path d="M12 19V5" {...stroke} /><path d="M6 11l6-6 6 6" {...stroke} /></>,
  'arrow-down': <><path d="M12 5v14" {...stroke} /><path d="M6 13l6 6 6-6" {...stroke} /></>,

  // core actions
  close: <><path d="M6 6l12 12" {...stroke} /><path d="M18 6L6 18" {...stroke} /></>,
  check: <path d="M5 13l4 4 10-10" {...stroke} />,
  add: <><path d="M12 5v14" {...stroke} /><path d="M5 12h14" {...stroke} /></>,
  remove: <path d="M5 12h14" {...stroke} />,
  search: <><circle cx="11" cy="11" r="6" {...stroke} /><path d="M20 20l-4.3-4.3" {...stroke} /></>,
  trash: <><path d="M4 7h16" {...stroke} /><path d="M9 7V4h6v3" {...stroke} /><path d="M6 7l1 13h10l1-13" {...stroke} /></>,
  edit: <><path d="M4 20l.5-3.5L15 6l3 3L7.5 19.5 4 20z" {...stroke} /><path d="M13.5 7.5l3 3" {...stroke} /></>,
  'external-link': <><path d="M14 5h5v5" {...stroke} /><path d="M19 5l-8 8" {...stroke} /><path d="M18 13v6H5V6h6" {...stroke} /></>,

  // status
  info: <><circle cx="12" cy="12" r="9" {...stroke} /><path d="M12 11v5" {...stroke} /><path d="M12 8h.01" {...stroke} /></>,
  warning: <><path d="M12 4l9 16H3z" {...stroke} /><path d="M12 10v4" {...stroke} /><path d="M12 17h.01" {...stroke} /></>,
  'check-circle': <><circle cx="12" cy="12" r="9" {...stroke} /><path d="M8.5 12l2.5 2.5 4.5-5" {...stroke} /></>,

  // files / media
  file: <><path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z" {...stroke} /><path d="M14 3v4h4" {...stroke} /></>,
  image: <><rect x="3" y="5" width="18" height="14" rx="1" {...stroke} /><circle cx="8.5" cy="10" r="1.5" {...stroke} /><path d="M21 16l-5-5L5 19" {...stroke} /></>,
  'cloud-upload': <><path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.3A3.5 3.5 0 0 1 17.5 18" {...stroke} /><path d="M12 21v-8" {...stroke} /><path d="M9 16l3-3 3 3" {...stroke} /></>,

  // misc
  'more-horizontal': <><circle cx="5" cy="12" r="1.6" {...fill} /><circle cx="12" cy="12" r="1.6" {...fill} /><circle cx="19" cy="12" r="1.6" {...fill} /></>,
  diamond: <path d="M12 3l9 9-9 9-9-9z" {...fill} />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof icons;

export const iconNames = Object.keys(icons) as IconName[];
