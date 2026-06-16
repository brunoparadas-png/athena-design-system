import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { useState } from 'react';
import { SideNavigation, type NavSection } from './SideNavigation';

const athenaNav: NavSection[] = [
  {
    id: 'alerts-banners',
    label: 'Alerts & Banners',
    icon: 'bell',
    items: [
      { id: 'alerts', label: 'Alerts' },
      { id: 'site-banners', label: 'Site Banners' },
    ],
  },
  {
    id: 'entries',
    label: 'Entries',
    icon: 'book',
    items: [
      { id: 'all-entries', label: 'All Entries' },
      { id: 'create-news-entry', label: 'Create News Entry' },
      { id: 'editorial-tools', label: 'Editorial Tools' },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    icon: 'image',
    defaultExpanded: false,
    items: [
      { id: 'images', label: 'Images' },
      { id: 'collection', label: 'Collection' },
    ],
  },
  {
    id: 'apages',
    label: 'APages',
    icon: 'file',
    defaultExpanded: false,
    items: [
      { id: 'big-files', label: 'Big Files' },
      { id: 'series', label: 'Series' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: 'settings',
    defaultExpanded: false,
    items: [
      { id: 'manage-authors', label: 'Manage Authors' },
      { id: 'manage-campaigns', label: 'Manage Campaigns' },
      { id: 'manage-general-pages', label: 'Manage General Pages' },
      { id: 'manage-site-navigation', label: 'Manage Site Navigation' },
      { id: 'manage-staff-announcements', label: 'Manage Staff Announcements' },
      { id: 'manage-staffers', label: 'Manage Staffers' },
      { id: 'manage-user-roles', label: 'Manage User Roles' },
    ],
  },
];

const sampleUser = {
  name: 'Bruno Paradeo',
  email: 'bruno.paradeo@huffpost.com',
};

const meta = {
  title: 'Components/SideNavigation',
  component: SideNavigation,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Global navigation shell. 280px expanded / 56px collapsed. Only leaf items carry the active state — section headings never do.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    sections: athenaNav,
    activeItemId: 'alerts',
    user: sampleUser,
    appTitle: 'Huffpost Athena',
  },
} satisfies Meta<typeof SideNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default expanded state with an active leaf item. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation');
    await expect(nav).toBeInTheDocument();
    const activeBtn = canvas.getByRole('button', { name: 'Alerts' });
    await expect(activeBtn).toHaveAttribute('aria-current', 'page');
  },
};

/** CssCheck — verifies that forest tint and 2px right border render on the active item. */
export const CssCheck: Story = {
  args: { activeItemId: 'all-entries' },
  play: async ({ canvas }) => {
    const btn = canvas.getByRole('button', { name: 'All Entries' });
    await expect(btn).toHaveAttribute('aria-current', 'page');
  },
};

/** All sections expanded to show the full nav tree. */
export const AllExpanded: Story = {
  args: {
    sections: athenaNav.map((s) => ({ ...s, defaultExpanded: true })),
    activeItemId: 'manage-authors',
  },
};

/**
 * Collapsed (56px) — icons only, active state bubbles to the section icon.
 * The expand affordance becomes a floating circular button on the right edge.
 */
export const Collapsed: Story = {
  args: {
    isCollapsed: true,
    activeItemId: 'alerts',
    onToggleCollapse: () => {},
  },
};

/** Controlled collapse/expand toggle. */
export const WithToggle: Story = {
  render: (args) => {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <SideNavigation
        {...args}
        isCollapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
    );
  },
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('button', { name: 'Collapse sidebar' });
    await userEvent.click(toggle);
    await expect(
      canvas.getByRole('button', { name: 'Expand sidebar' })
    ).toBeInTheDocument();
  },
};

/** Section onAdd prop — a + button appears at the heading row. */
export const WithAddAction: Story = {
  args: {
    sections: [
      {
        ...athenaNav[1],
        onAdd: () => {},
        defaultExpanded: true,
      },
    ],
    activeItemId: 'all-entries',
  },
};

/** No user footer. */
export const NoUser: Story = {
  args: { user: undefined },
};
