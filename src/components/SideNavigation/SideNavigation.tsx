import { useState, useCallback } from 'react';
import { Icon, type IconName } from '../Icon';

export interface NavLeafItem {
  id: string;
  label: string;
  icon?: IconName;
}

export interface NavSection {
  id: string;
  label: string;
  icon?: IconName;
  items: NavLeafItem[];
  /** Expand on initial render. Defaults to true. */
  defaultExpanded?: boolean;
  /** Renders an add (+) button at the trailing edge of the section heading row. */
  onAdd?: () => void;
}

export interface SideNavigationUser {
  name: string;
  email: string;
  /** Avatar initials — auto-derived from first + last word of name when omitted. */
  initials?: string;
}

export interface SideNavigationProps {
  /** Top-level sections, each containing leaf nav items. */
  sections: NavSection[];
  /** Id of the currently active leaf item. Section headings are never active. */
  activeItemId?: string;
  /** Fired when a leaf item is clicked. */
  onNavigate?: (itemId: string) => void;
  /** Text beside the logo mark in the header. */
  appTitle?: string;
  /** 56px icon-only collapsed mode vs 280px expanded. */
  isCollapsed?: boolean;
  /** Fired when the collapse / expand toggle button is clicked. */
  onToggleCollapse?: () => void;
  /** Logged-in user shown in the pinned footer. */
  user?: SideNavigationUser;
  /** Fired when the footer overflow (…) button is clicked. */
  onUserMenuOpen?: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const HuffpostLogoMark = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="24" height="24" fill="#2E7061" />
    <path
      d="M12.6963 19.1024H17.2448L19.6875 5.10001H15.1379L14.2467 10.1149H10.2987L11.1899 5.10001H6.64262L4.19995 19.1024H8.7484L9.6644 13.8639H13.6123L12.6963 19.1024Z"
      fill="white"
    />
  </svg>
);

// Shared focus ring used on every interactive element
const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest-500 focus-visible:outline-offset-[-2px]';

/**
 * Global navigation shell — 280px expanded / 56px collapsed.
 * Only leaf items carry the active state; section headings never do.
 */
export function SideNavigation({
  sections,
  activeItemId,
  onNavigate,
  appTitle = 'Huffpost Athena',
  isCollapsed = false,
  onToggleCollapse,
  user,
  onUserMenuOpen,
}: SideNavigationProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const s = new Set<string>();
    for (const section of sections) {
      if (section.defaultExpanded !== false) s.add(section.id);
    }
    return s;
  });

  const toggleSection = useCallback((id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const userInitials = user ? (user.initials ?? getInitials(user.name)) : '';

  return (
    <nav
      className={`relative flex flex-col h-full bg-white border-r border-neutral-200 transition-[width] duration-200 ease-in-out font-[var(--font-main)] ${
        isCollapsed ? 'w-14' : 'w-[280px]'
      }`}
      aria-label={appTitle}
    >
      {/* Collapsed: floating circular toggle straddling the right edge.
          Lives outside the header flow so it can overflow the rail. */}
      {isCollapsed && onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Expand sidebar"
          // Transform + shadow are set inline rather than via Tailwind utilities
          // so they survive in consumers whose Tailwind `content` globs do not
          // scan this design-system source (e.g. cms_ui). translateX(50%) makes
          // the button straddle the rail's right edge; the shadow is Figma's
          // elevation.shadow.overlay.
          style={{
            transform: 'translateX(calc(50% + 4px))',
            boxShadow:
              '0 0 1px rgba(30, 31, 33, 0.31), 0 8px 12px rgba(30, 31, 33, 0.15)',
          }}
          className={`absolute top-3 right-0 z-10 flex items-center justify-center w-8 h-8 appearance-none rounded-full bg-white border border-neutral-200 cursor-pointer text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors ${focusRing}`}
        >
          {/* Mirror the collapse glyph so the arrow points right (expand). */}
          <Icon
            name="sidebar-collapse"
            size={20}
            style={{ transform: 'scaleX(-1)' }}
          />
        </button>
      )}

      {/* ── Header ─────────────────────────────────────────── */}
      <div
        className={`flex items-center flex-shrink-0 h-14 overflow-hidden ${
          isCollapsed ? 'justify-center px-0' : 'gap-2 px-3'
        }`}
      >
        <span className="flex-shrink-0">
          <HuffpostLogoMark />
        </span>

        {!isCollapsed && (
          <>
            <span className="flex-1 min-w-0 text-sm font-bold leading-5 text-neutral-800 truncate">
              {appTitle}
            </span>

            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Collapse sidebar"
                className={`flex-shrink-0 flex items-center justify-center w-6 h-6 appearance-none border-0 bg-transparent cursor-pointer text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50 transition-colors duration-[120ms] ${focusRing}`}
              >
                <Icon name="sidebar-collapse" size={20} />
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Sections ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          // In collapsed mode, bubble active state up to the section icon
          const sectionHasActiveItem = section.items.some(
            (item) => item.id === activeItemId
          );
          const showSectionActive = isCollapsed && sectionHasActiveItem;

          const sectionActiveClass = showSectionActive
            ? 'bg-forest-50 text-forest-700 font-bold border-r-2 border-forest-700'
            : 'bg-transparent text-neutral-800 border-0 hover:bg-neutral-50';

          return (
            <div key={section.id}>
              {/* Section heading row */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                aria-expanded={isCollapsed ? undefined : isExpanded}
                aria-controls={
                  isCollapsed ? undefined : `sidenav-section-${section.id}`
                }
                title={isCollapsed ? section.label : undefined}
                className={`w-full flex items-center appearance-none m-0 cursor-pointer text-sm font-semibold leading-5 font-[inherit] text-left transition-colors duration-[120ms] ${focusRing} ${
                  isCollapsed
                    ? 'justify-center px-0 py-2 min-h-8'
                    : 'gap-2 px-4 py-2 min-h-8'
                } ${sectionActiveClass}`}
              >
                {section.icon && (
                  <span
                    className={`flex-shrink-0 ${
                      showSectionActive ? 'text-forest-700' : 'text-neutral-600'
                    }`}
                  >
                    <Icon name={section.icon} size={20} />
                  </span>
                )}

                {!isCollapsed && (
                  <>
                    <span className="flex-1 min-w-0 truncate">
                      {section.label}
                    </span>

                    {section.onAdd && (
                      <span
                        role="none"
                        onClick={(e) => {
                          e.stopPropagation();
                          section.onAdd?.();
                        }}
                        className="flex-shrink-0 flex items-center justify-center w-5 h-5 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 cursor-pointer"
                        aria-label={`Add to ${section.label}`}
                      >
                        <Icon name="add" size={16} />
                      </span>
                    )}

                    <span className="flex-shrink-0 text-neutral-500">
                      <Icon
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={16}
                      />
                    </span>
                  </>
                )}
              </button>

              {/* Leaf items — hidden in collapsed mode, hidden when section is closed */}
              {!isCollapsed && isExpanded && (
                <ul
                  id={`sidenav-section-${section.id}`}
                  role="list"
                  className="list-none m-0 p-0"
                >
                  {section.items.map((item) => {
                    const isActive = item.id === activeItemId;
                    const leafActiveClass = isActive
                      ? 'bg-forest-50 text-forest-700 font-bold border-r-2 border-forest-700'
                      : 'bg-transparent text-neutral-800 font-semibold border-0 hover:bg-neutral-50';

                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => onNavigate?.(item.id)}
                          aria-current={isActive ? 'page' : undefined}
                          className={`w-full flex items-center gap-2 pl-12 pr-4 py-2 min-h-8 appearance-none m-0 cursor-pointer text-sm leading-5 font-[inherit] text-left transition-colors duration-[120ms] ${focusRing} ${leafActiveClass}`}
                        >
                          {item.icon && (
                            <span
                              className={`flex-shrink-0 ${
                                isActive ? 'text-forest-700' : 'text-neutral-600'
                              }`}
                            >
                              <Icon name={item.icon} size={20} />
                            </span>
                          )}
                          <span className="min-w-0 truncate">{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      {user && (
        <div className="flex-shrink-0 border-t border-neutral-200">
          <div
            className={`flex items-center ${
              isCollapsed ? 'justify-center px-0 py-3' : 'gap-2 px-4 py-3'
            }`}
          >
            <span
              className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-forest-500 text-white text-[10px] font-semibold leading-none select-none"
              aria-hidden="true"
            >
              {userInitials}
            </span>

            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold leading-5 text-neutral-800 truncate">
                    {user.name}
                  </div>
                  <div className="text-xs leading-4 text-neutral-500 truncate">
                    {user.email}
                  </div>
                </div>

                {onUserMenuOpen && (
                  <button
                    type="button"
                    onClick={onUserMenuOpen}
                    aria-label="User menu"
                    className={`flex-shrink-0 flex items-center justify-center w-6 h-6 appearance-none border-0 bg-transparent cursor-pointer text-neutral-600 hover:text-neutral-800 transition-colors duration-[120ms] ${focusRing}`}
                  >
                    <Icon name="more-horizontal" size={16} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
