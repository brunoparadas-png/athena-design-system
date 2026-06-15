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

  // files / media — exported from Figma at native 20×20 (see iconViewBox)
  file: <>
    <path d="M12.1875 4.0625L12.7178 3.53217C12.5772 3.39152 12.3864 3.3125 12.1875 3.3125V4.0625ZM15.9375 7.8125H16.6875C16.6875 7.61359 16.6085 7.42282 16.4678 7.28217L15.9375 7.8125ZM14.75 15.9375V15.1875H5.25V15.9375V16.6875H14.75V15.9375ZM4.0625 14.75H4.8125V5.25H4.0625H3.3125V14.75H4.0625ZM5.25 15.9375V15.1875C5.00838 15.1875 4.8125 14.9916 4.8125 14.75H4.0625H3.3125C3.3125 15.8201 4.17995 16.6875 5.25 16.6875V15.9375ZM5.25 4.0625V3.3125C4.17995 3.3125 3.3125 4.17995 3.3125 5.25H4.0625H4.8125C4.8125 5.00838 5.00838 4.8125 5.25 4.8125V4.0625ZM5.25 4.0625V4.8125H12.1875V4.0625V3.3125H5.25V4.0625ZM15.9375 7.8125H15.1875V14.75H15.9375H16.6875V7.8125H15.9375ZM12.1875 4.0625L11.6572 4.59283C12.2822 5.21783 15.0947 8.03033 15.4072 8.34283L15.9375 7.8125L16.4678 7.28217C16.1553 6.96967 13.3428 4.15717 12.7178 3.53217L12.1875 4.0625ZM14.75 15.9375V16.6875C15.8201 16.6875 16.6875 15.8201 16.6875 14.75H15.9375H15.1875C15.1875 14.9916 14.9916 15.1875 14.75 15.1875V15.9375Z" fill="currentColor" />
    <path d="M11.875 4.6875V8.125H15.3125" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
  </>,
  image: <path d="M3.125 14.1493V6.18056C3.125 5.52855 3.68464 5 4.375 5H15.625C16.3154 5 16.875 5.52855 16.875 6.18056V14.1493M3.125 14.1493L7.90423 9.35348C8.02506 9.23223 8.22811 9.22932 8.35277 9.34706L11.029 11.8746C11.1511 11.9899 11.3489 11.9899 11.471 11.8746L12.6002 10.8082C12.7188 10.6961 12.9099 10.6925 13.0331 10.8L16.875 14.1493M3.125 14.1493V14.4444C3.125 15.0964 3.68464 15.625 4.375 15.625H15.625C16.3154 15.625 16.875 15.0964 16.875 14.4444V14.1493" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />,
  'cloud-upload': <><path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.3A3.5 3.5 0 0 1 17.5 18" {...stroke} /><path d="M12 21v-8" {...stroke} /><path d="M9 16l3-3 3 3" {...stroke} /></>,

  // navigation / sections — exported from Figma at native 20×20 (see iconViewBox)
  bell: <>
    <path d="M6.05903 7.96669V11.9982C6.05903 12.2208 5.90678 12.4124 5.69527 12.4561C5.01844 12.5957 4.53125 13.209 4.53125 13.9213V14.5226C4.53125 14.9071 4.83329 15.2188 5.20588 15.2188C8.39631 15.4891 11.6038 15.4908 14.7946 15.2239L14.8566 15.2188C15.2292 15.2188 15.5313 14.9071 15.5313 14.5226V13.9213C15.5313 13.209 15.0441 12.5957 14.3672 12.4561C14.1557 12.4124 14.0035 12.2208 14.0035 11.9982V7.96669C13.5693 2.96944 6.4932 2.96944 6.05903 7.96669Z" stroke="currentColor" strokeWidth={2} />
    <path d="M9.33838 17.3169C9.33838 17.3169 9.32495 17.3071 9.32495 17.363C9.32495 17.7203 9.62388 17.9688 10.0068 17.9688C10.3897 17.9688 10.7007 17.7203 10.7007 17.363C10.7007 17.3071 10.686 17.3169 10.686 17.3169H9.33838Z" stroke="currentColor" strokeWidth={2} />
  </>,
  book: <path d="M10 6.67673C10 6.67673 11.9021 4.21448 15.6598 5.25754C16.0872 5.37616 16.25 5.81076 16.25 6.22647V13.1474C16.25 13.2978 16.1227 13.4139 15.9783 13.398M10 6.67673C10 6.67673 8.64131 4.21436 4.38683 5.26796C3.86729 5.39662 3.75 5.8294 3.75 6.26543V13.1472C3.75 13.2977 3.87733 13.4139 4.02181 13.398M10 6.67673V15.119M4.02181 13.398C4.02181 13.7428 3.96589 14.0021 4.29348 14.0638L10 15.119L15.7065 14.0638C16.0341 14.0021 15.9783 13.7428 15.9783 13.398M10 15.119C10.0105 15.1098 11.6305 11.7421 15.9783 13.398M10 15.119C10 15.119 7.973 11.7408 4.02181 13.398" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />,
  settings: <path fillRule="evenodd" clipRule="evenodd" d="M8.76973 3.75C8.76973 3.40483 9.04514 3.125 9.38487 3.125H10.6151C10.9549 3.125 11.2303 3.40483 11.2303 3.75V4.93588C11.2303 5.06639 11.318 5.17956 11.4417 5.21801C12.1634 5.44235 12.8146 5.8307 13.3531 6.34031C13.4481 6.43021 13.5903 6.45052 13.7029 6.38446L14.7121 5.79247C15.0063 5.61989 15.3825 5.72231 15.5524 6.02123L16.1675 7.10377C16.3373 7.40271 16.2365 7.78494 15.9423 7.95754L14.9318 8.55035C14.8203 8.61573 14.7673 8.74841 14.796 8.87516C14.8778 9.23671 14.9211 9.61322 14.9211 10C14.9211 10.3868 14.8778 10.7633 14.796 11.1248C14.7673 11.2516 14.8203 11.3843 14.9318 11.4496L15.9423 12.0425C16.2365 12.2151 16.3373 12.5973 16.1675 12.8962L15.5524 13.9788C15.3825 14.2777 15.0063 14.3801 14.7121 14.2075L13.7029 13.6155C13.5903 13.5495 13.4481 13.5698 13.3531 13.6597C12.8146 14.1693 12.1634 14.5577 11.4417 14.782C11.318 14.8204 11.2303 14.9336 11.2303 15.0641V16.25C11.2303 16.5952 10.9549 16.875 10.6151 16.875H9.38487C9.04514 16.875 8.76973 16.5952 8.76973 16.25V15.0641C8.76973 14.9336 8.68195 14.8204 8.55826 14.782C7.83659 14.5577 7.18544 14.1693 6.6469 13.6597C6.55189 13.5698 6.40972 13.5495 6.2971 13.6155L5.28793 14.2075C4.99372 14.3801 4.61751 14.2777 4.44765 13.9788L3.83251 12.8962C3.66265 12.5973 3.76346 12.2151 4.05767 12.0425L5.06824 11.4497C5.17969 11.3843 5.23266 11.2516 5.20398 11.1249C5.12217 10.7633 5.07894 10.3868 5.07894 10C5.07894 9.61322 5.12217 9.23671 5.20397 8.87516C5.23265 8.74841 5.17969 8.61573 5.06824 8.55035L4.05767 7.95754C3.76346 7.78494 3.66265 7.40271 3.83251 7.10377L4.44765 6.02123C4.61751 5.72231 4.99372 5.61989 5.28793 5.79247L6.2971 6.38445C6.40972 6.45052 6.55189 6.43021 6.6469 6.34031C7.18543 5.8307 7.83659 5.44235 8.55826 5.21801C8.68195 5.17956 8.76973 5.06639 8.76973 4.93588V3.75ZM10 12.0052C11.1364 12.0052 11.9886 11.1248 11.9886 10C11.9886 8.87516 11.1364 7.95754 10 7.95754C8.86363 7.95754 8.01136 8.87516 8.01136 10C8.01136 11.1248 8.86364 12.0052 10 12.0052Z" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />,

  // misc
  'more-horizontal': <><circle cx="5" cy="12" r="1.6" {...fill} /><circle cx="12" cy="12" r="1.6" {...fill} /><circle cx="19" cy="12" r="1.6" {...fill} /></>,
  diamond: <path d="M12 3l9 9-9 9-9-9z" {...fill} />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof icons;

export const iconNames = Object.keys(icons) as IconName[];

/**
 * Per-icon viewBox overrides. Most icons are normalized to 24×24, but icons
 * exported directly from the Figma icon library keep their native 20×20 grid
 * so the vector geometry matches the source exactly. The Icon component falls
 * back to '0 0 24 24' for any name not listed here.
 */
export const iconViewBox: Partial<Record<IconName, string>> = {
  bell: '0 0 20 20',
  book: '0 0 20 20',
  image: '0 0 20 20',
  file: '0 0 20 20',
  settings: '0 0 20 20',
};
