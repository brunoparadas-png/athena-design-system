import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import styles from './Tabs.module.css';

export interface TabItem {
  /** Stable id; falls back to the index. */
  id?: string;
  /** Tab label. */
  label: ReactNode;
  /** Panel content shown when the tab is selected. */
  content: ReactNode;
  /** Disable this tab. */
  isDisabled?: boolean;
}

/**
 * Mirrors the Figma "❖ Tabs" (🧬 <Tabs tabs={[{label, content}]} />). Organizes
 * content into selectable panels. Selected tab: forest text + 3px forest
 * underline; others neutral. Hover/press/focus are CSS pseudo-states. Full
 * tablist/tabpanel semantics with roving-tabindex arrow-key navigation.
 */
export interface TabsProps {
  /** Tabs to render, in order. */
  tabs: TabItem[];
  /** Controlled selected tab id. Pair with onChange. */
  selectedId?: string;
  /** Initial selected tab id (uncontrolled). Defaults to the first enabled tab. */
  defaultSelectedId?: string;
  /** Fires with the newly-selected tab id. */
  onChange?: (id: string) => void;
  /** Accessible label for the tablist. */
  label?: string;
}

const idOf = (tab: TabItem, index: number) => tab.id ?? String(index);

export function Tabs({ tabs, selectedId, defaultSelectedId, onChange, label }: TabsProps) {
  const baseId = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const firstEnabled = tabs.find((t) => !t.isDisabled);
  const fallbackId = firstEnabled ? idOf(firstEnabled, tabs.indexOf(firstEnabled)) : undefined;

  const isControlled = selectedId !== undefined;
  const [internalId, setInternalId] = useState(defaultSelectedId ?? fallbackId);
  const activeId = isControlled ? selectedId : internalId;

  const select = (id: string) => {
    if (!isControlled) setInternalId(id);
    onChange?.(id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const enabled = tabs
      .map((t, i) => ({ id: idOf(t, i), disabled: t.isDisabled }))
      .filter((t) => !t.disabled);
    const current = enabled.findIndex((t) => t.id === activeId);
    if (current === -1) return;

    let next = current;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (current + 1) % enabled.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (current - 1 + enabled.length) % enabled.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = enabled.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const nextId = enabled[next].id;
    select(nextId);
    tabRefs.current[nextId]?.focus();
  };

  return (
    <div className={styles.tabs}>
      <div className={styles.tablist} role="tablist" aria-label={label}>
        {tabs.map((tab, index) => {
          const id = idOf(tab, index);
          const isSelected = id === activeId;
          return (
            <button
              key={id}
              ref={(node) => {
                tabRefs.current[id] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${id}`}
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel-${id}`}
              tabIndex={isSelected ? 0 : -1}
              disabled={tab.isDisabled}
              className={[styles.tab, isSelected ? styles.selected : ''].filter(Boolean).join(' ')}
              onClick={() => select(id)}
              onKeyDown={handleKeyDown}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab, index) => {
        const id = idOf(tab, index);
        const isSelected = id === activeId;
        return (
          <div
            key={id}
            role="tabpanel"
            id={`${baseId}-panel-${id}`}
            aria-labelledby={`${baseId}-tab-${id}`}
            hidden={!isSelected}
            tabIndex={0}
            className={styles.panel}
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
}
