import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Icon, type IconName } from '../Icon';

export type MenuItemType = 'action' | 'checkbox' | 'radio';

/** A single interactive row in a Menu. */
export interface MenuItem {
  /** Stable id; falls back to the index. Passed back to onSelect. */
  id?: string;
  /** Row kind. `action` runs a command; `checkbox`/`radio` show a selection indicator. */
  type?: MenuItemType;
  /** Primary text. */
  label: ReactNode;
  /** Optional secondary line under the label (neutral.500, 12px). */
  description?: ReactNode;
  /** Leading icon — action rows only (checkbox/radio render their indicator here). (Figma: iconBefore) */
  iconBefore?: IconName;
  /** First trailing icon — action rows only. (Figma: iconAfter-1) */
  iconAfter?: IconName;
  /** Second trailing icon — action rows only. (Figma: iconAfter-2) */
  iconAfter2?: IconName;
  /** Selected/checked. Drives the forest tint and the checkbox/radio indicator. (Figma: isSelected) */
  isSelected?: boolean;
  /** Disable just this row. (Figma: isDisabled) */
  isDisabled?: boolean;
  /** Fires when the row is chosen (click / Enter / Space). */
  onSelect?: (id: string) => void;
}

/** A labelled section of rows (the Figma "Category" heading + its items). */
export interface MenuGroup {
  id?: string;
  /** Section heading shown above the rows (neutral.600, 14px semibold). */
  label?: ReactNode;
  items: MenuItem[];
  /**
   * Render a separator line after this group's rows.
   * Mirrors Figma's per-section `hasSeparator` BOOLEAN prop.
   * The standalone `MenuSeparator` node is an alternative; both approaches work.
   */
  hasSeparator?: boolean;
}

/** A horizontal divider between rows. */
export interface MenuSeparator {
  type: 'separator';
  id?: string;
}

export type MenuNode = MenuItem | MenuGroup | MenuSeparator;

export interface MenuProps {
  /** Rows to render, in order. Items, groups, and separators may be mixed. */
  items: MenuNode[];
  /** `default` rows are 40px tall, `compact` are 32px. Code-only extension — no corresponding Figma variant. */
  spacing?: 'default' | 'compact';
  /** Cap the height and scroll the rows past it (the Figma "Scrollable" variant). */
  maxHeight?: number;
  /** Accessible label for the menu (use when there is no external labelledby). */
  label?: string;
  /** Point the menu at an external label element. */
  'aria-labelledby'?: string;
  /** Focus the first enabled row on mount — set by DropdownMenu when it opens. */
  autoFocusFirst?: boolean;
  /** Bubbles every row selection: (id, item) => void. */
  onSelect?: (id: string, item: MenuItem) => void;
  /** Forwarded to the surface element (e.g. DropdownMenu's Escape handler). */
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
}

const isSeparator = (node: MenuNode): node is MenuSeparator =>
  (node as MenuSeparator).type === 'separator';
const isGroup = (node: MenuNode): node is MenuGroup =>
  Array.isArray((node as MenuGroup).items);

/** Flatten nodes into the ordered interactive rows, tracking enablement for roving focus. */
function flattenItems(nodes: MenuNode[]): MenuItem[] {
  const out: MenuItem[] = [];
  for (const node of nodes) {
    if (isSeparator(node)) continue;
    if (isGroup(node)) out.push(...node.items);
    else out.push(node);
  }
  return out;
}

const roleFor = (type: MenuItemType): string =>
  type === 'checkbox' ? 'menuitemcheckbox' : type === 'radio' ? 'menuitemradio' : 'menuitem';

const RadioDot = () => (
  <span
    className="block w-2 h-2 rounded-full bg-forest-500"
    aria-hidden="true"
  />
);

const CheckMark = () => (
  <svg className="block w-3.5 h-3.5" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
    <path
      d="M3 7.5l2.5 2.5L11 4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Mirrors the Figma "❖ Menu" — the popup surface that holds a list of actions
 * or options. Rows are action / checkbox / radio; selected rows take the forest
 * tint (forest.50, forest.700 text). Owns roving-tabindex arrow-key navigation.
 * Usually rendered inside DropdownMenu, but works standalone too.
 */
export function Menu({
  items,
  spacing = 'default',
  maxHeight,
  label,
  'aria-labelledby': ariaLabelledby,
  autoFocusFirst = false,
  onSelect,
  onKeyDown,
}: MenuProps) {
  const baseId = useId();
  const flat = flattenItems(items);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const enabledIndices = flat
    .map((item, index) => ({ index, disabled: item.isDisabled }))
    .filter((entry) => !entry.disabled)
    .map((entry) => entry.index);

  const [activeIndex, setActiveIndex] = useState<number>(enabledIndices[0] ?? -1);

  const focusIndex = useCallback((index: number) => {
    setActiveIndex(index);
    itemRefs.current[index]?.focus();
  }, []);

  useEffect(() => {
    if (autoFocusFirst && enabledIndices.length > 0) {
      focusIndex(enabledIndices[0]);
    }
    // Run once on mount; enabledIndices is derived from props for that render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocusFirst]);

  const choose = (item: MenuItem, index: number) => {
    if (item.isDisabled) return;
    const id = item.id ?? String(index);
    item.onSelect?.(id);
    onSelect?.(id, item);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (enabledIndices.length === 0) return;

    const pos = enabledIndices.indexOf(activeIndex);
    let nextPos = pos;
    switch (event.key) {
      case 'ArrowDown':
        nextPos = pos < 0 ? 0 : (pos + 1) % enabledIndices.length;
        break;
      case 'ArrowUp':
        nextPos = pos < 0 ? enabledIndices.length - 1 : (pos - 1 + enabledIndices.length) % enabledIndices.length;
        break;
      case 'Home':
        nextPos = 0;
        break;
      case 'End':
        nextPos = enabledIndices.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    focusIndex(enabledIndices[nextPos]);
  };

  // Base item classes shared across all rows
  const itemBase =
    'group appearance-none m-0 border-0 cursor-pointer box-border w-full flex items-center gap-3 px-4 font-[inherit] text-sm leading-5 text-neutral-600 text-left transition-[background-color,color] duration-[120ms] ease-[ease] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-forest-700 focus-visible:outline-offset-[-2px] disabled:text-neutral-400 disabled:cursor-not-allowed';

  const itemSizeClass = spacing === 'compact' ? 'min-h-8 py-1.5' : 'min-h-10 py-2';

  // Walk the original nodes, threading a running interactive-item index so refs
  // and roving tabindex line up with the flattened list.
  let cursor = -1;
  const renderItem = (item: MenuItem): ReactNode => {
    cursor += 1;
    const index = cursor;
    const type = item.type ?? 'action';
    const id = item.id ?? String(index);
    const isInteractiveSelected = type !== 'action' && item.isSelected;

    // Selected rows carry a 2px forest.700 left border (Figma 113:774); hover/press
    // tint every row forest.100/forest.200 and deepen the text to forest.800.
    const selectedClass = item.isSelected
      ? 'bg-forest-50 text-forest-700 border-l-2 border-forest-700 hover:enabled:bg-forest-100 hover:enabled:text-forest-800 active:enabled:bg-forest-200 active:enabled:text-forest-800'
      : 'bg-transparent hover:enabled:bg-forest-100 hover:enabled:text-forest-800 active:enabled:bg-forest-200 active:enabled:text-forest-800';

    const itemClassName = `${itemBase} ${itemSizeClass} ${selectedClass}`;

    return (
      <li key={id} role="none">
        <button
          ref={(node) => {
            itemRefs.current[index] = node;
          }}
          type="button"
          role={roleFor(type)}
          className={itemClassName}
          disabled={item.isDisabled}
          tabIndex={index === activeIndex ? 0 : -1}
          aria-checked={type === 'action' ? undefined : Boolean(item.isSelected)}
          onClick={() => choose(item, index)}
          onMouseEnter={() => !item.isDisabled && setActiveIndex(index)}
        >
          {type === 'radio' && (
            <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5" aria-hidden="true">
              <span
                className={`box-border inline-flex items-center justify-center w-3.5 h-3.5 border rounded-full ${
                  isInteractiveSelected
                    ? 'bg-white border-forest-500'
                    : 'bg-white border-neutral-300'
                } disabled:border-neutral-300 disabled:bg-neutral-100`}
              >
                {isInteractiveSelected && <RadioDot />}
              </span>
            </span>
          )}
          {type === 'checkbox' && (
            <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5" aria-hidden="true">
              <span
                className={`box-border inline-flex items-center justify-center w-3.5 h-3.5 border rounded-none ${
                  isInteractiveSelected
                    ? 'bg-forest-500 border-forest-500 text-white'
                    : 'bg-white border-neutral-300 text-white'
                } disabled:border-neutral-300 disabled:bg-neutral-100`}
              >
                {isInteractiveSelected && <CheckMark />}
              </span>
            </span>
          )}
          {type === 'action' && item.iconBefore && (
            <span className="inline-flex flex-shrink-0 text-current">
              <Icon name={item.iconBefore} size={20} />
            </span>
          )}
          <span className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="break-words font-semibold">{item.label}</span>
            {item.description != null && (
              <span
                className={`text-xs leading-4 group-disabled:text-neutral-400 ${
                  item.isSelected
                    ? 'text-current'
                    : 'text-neutral-500 group-hover:group-enabled:text-current group-active:group-enabled:text-current'
                }`}
              >
                {item.description}
              </span>
            )}
          </span>
          {type === 'action' && item.iconAfter && (
            <span className="inline-flex flex-shrink-0 text-current">
              <Icon name={item.iconAfter} size={20} />
            </span>
          )}
          {type === 'action' && item.iconAfter2 && (
            <span className="inline-flex flex-shrink-0 text-current">
              <Icon name={item.iconAfter2} size={20} />
            </span>
          )}
        </button>
      </li>
    );
  };

  const renderNode = (node: MenuNode, key: number): ReactNode => {
    if (isSeparator(node)) {
      return (
        <li
          key={node.id ?? `sep-${key}`}
          role="separator"
          className="h-px my-1 bg-neutral-100"
        />
      );
    }
    if (isGroup(node)) {
      const groupId = node.id ?? `group-${key}`;
      const labelId = `${baseId}-${groupId}`;
      return (
        <li key={groupId} role="none">
          {node.label != null && (
            <span
              id={labelId}
              className="block px-4 pt-3 pb-1.5 text-sm leading-5 font-semibold text-neutral-600"
            >
              {node.label}
            </span>
          )}
          <ul
            role="group"
            className="list-none m-0 p-0"
            aria-labelledby={node.label != null ? labelId : undefined}
          >
            {node.items.map((item) => renderItem(item))}
          </ul>
          {node.hasSeparator && (
            <div role="separator" aria-hidden="true" className="h-px my-1 bg-neutral-100" />
          )}
        </li>
      );
    }
    return renderItem(node);
  };

  const menuClassName = `box-border min-w-[180px] bg-white border border-neutral-200 rounded shadow-[0_8px_16px_-4px_rgba(9,30,66,0.25),0_0_0_1px_rgba(9,30,66,0.06)] py-1 font-[var(--font-main)]${maxHeight != null ? ' overflow-y-auto [scrollbar-gutter:stable]' : ''}`;

  return (
    <div
      className={menuClassName}
      style={maxHeight != null ? { maxHeight } : undefined}
      onKeyDown={handleKeyDown}
    >
      <ul
        role="menu"
        className="list-none m-0 p-0"
        aria-label={ariaLabelledby ? undefined : label}
        aria-labelledby={ariaLabelledby}
      >
        {items.map((node, i) => renderNode(node, i))}
      </ul>
    </div>
  );
}
