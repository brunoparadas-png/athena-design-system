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
import styles from './Menu.module.css';

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
  /** Trailing icon — action rows only. (Figma: iconAfter) */
  iconAfter?: IconName;
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
  /** Section heading shown above the rows (neutral.500, 12px). */
  label?: ReactNode;
  items: MenuItem[];
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
  /** `default` rows are 40px tall, `compact` are 32px. (Figma: spacing) */
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

const RadioDot = () => <span className={styles.radioDot} aria-hidden="true" />;

const CheckMark = () => (
  <svg className={styles.checkMark} viewBox="0 0 14 14" aria-hidden="true" focusable="false">
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

  // Walk the original nodes, threading a running interactive-item index so refs
  // and roving tabindex line up with the flattened list.
  let cursor = -1;
  const renderItem = (item: MenuItem): ReactNode => {
    cursor += 1;
    const index = cursor;
    const type = item.type ?? 'action';
    const id = item.id ?? String(index);
    const isInteractiveSelected = type !== 'action' && item.isSelected;

    const className = [styles.item, item.isSelected ? styles.selected : '']
      .filter(Boolean)
      .join(' ');

    return (
      <li key={id} role="none">
        <button
          ref={(node) => {
            itemRefs.current[index] = node;
          }}
          type="button"
          role={roleFor(type)}
          className={className}
          disabled={item.isDisabled}
          tabIndex={index === activeIndex ? 0 : -1}
          aria-checked={type === 'action' ? undefined : Boolean(item.isSelected)}
          onClick={() => choose(item, index)}
          onMouseEnter={() => !item.isDisabled && setActiveIndex(index)}
        >
          {type === 'radio' && (
            <span className={styles.indicator} aria-hidden="true">
              <span className={[styles.radio, isInteractiveSelected ? styles.indicatorOn : ''].filter(Boolean).join(' ')}>
                {isInteractiveSelected && <RadioDot />}
              </span>
            </span>
          )}
          {type === 'checkbox' && (
            <span className={styles.indicator} aria-hidden="true">
              <span className={[styles.checkbox, isInteractiveSelected ? styles.indicatorOn : ''].filter(Boolean).join(' ')}>
                {isInteractiveSelected && <CheckMark />}
              </span>
            </span>
          )}
          {type === 'action' && item.iconBefore && (
            <span className={styles.icon}>
              <Icon name={item.iconBefore} size={20} />
            </span>
          )}
          <span className={styles.content}>
            <span className={styles.label}>{item.label}</span>
            {item.description != null && (
              <span className={styles.description}>{item.description}</span>
            )}
          </span>
          {type === 'action' && item.iconAfter && (
            <span className={styles.icon}>
              <Icon name={item.iconAfter} size={20} />
            </span>
          )}
        </button>
      </li>
    );
  };

  const renderNode = (node: MenuNode, key: number): ReactNode => {
    if (isSeparator(node)) {
      return <li key={node.id ?? `sep-${key}`} role="separator" className={styles.separator} />;
    }
    if (isGroup(node)) {
      const groupId = node.id ?? `group-${key}`;
      const labelId = `${baseId}-${groupId}`;
      return (
        <li key={groupId} role="none">
          {node.label != null && (
            <span id={labelId} className={styles.groupLabel}>
              {node.label}
            </span>
          )}
          <ul
            role="group"
            className={styles.group}
            aria-labelledby={node.label != null ? labelId : undefined}
          >
            {node.items.map((item) => renderItem(item))}
          </ul>
        </li>
      );
    }
    return renderItem(node);
  };

  return (
    <div
      className={[styles.menu, styles[spacing], maxHeight != null ? styles.scrollable : '']
        .filter(Boolean)
        .join(' ')}
      style={maxHeight != null ? { maxHeight } : undefined}
      onKeyDown={handleKeyDown}
    >
      <ul
        role="menu"
        className={styles.list}
        aria-label={ariaLabelledby ? undefined : label}
        aria-labelledby={ariaLabelledby}
      >
        {items.map((node, i) => renderNode(node, i))}
      </ul>
    </div>
  );
}
