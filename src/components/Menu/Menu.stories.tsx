import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { useState } from 'react';
import { Menu, type MenuNode } from './Menu';

const meta = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A popup surface that presents a list of actions or options to choose from.',
      },
    },
  },
  argTypes: {
    spacing: { control: 'inline-radio', options: ['default', 'compact'] },
    maxHeight: { control: 'number', description: 'Cap height + scroll (the Scrollable variant)' },
  },
  args: {
    label: 'Example menu',
    spacing: 'default',
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

const actionItems: MenuNode[] = [
  { id: 'edit', label: 'Edit', iconBefore: 'edit' },
  { id: 'duplicate', label: 'Duplicate', iconBefore: 'add' },
  { id: 'search', label: 'Find', iconBefore: 'search', iconAfter: 'chevron-right' },
  { type: 'separator' },
  { id: 'delete', label: 'Delete', iconBefore: 'trash' },
  { id: 'archive', label: 'Archive', isDisabled: true },
];

export const Default: Story = {
  args: { items: actionItems },
};

/** Action rows with a leading icon, a trailing icon, a separator, and a disabled row. */
export const Simple: Story = {
  args: {
    items: [
      { id: 'a', label: 'Profile' },
      { id: 'b', label: 'Settings' },
      { type: 'separator' },
      { id: 'c', label: 'Sign out' },
    ],
  },
};

export const Checkboxes: Story = {
  render: (args) => {
    const [on, setOn] = useState<Record<string, boolean>>({ comments: true });
    const items: MenuNode[] = (
      [
        { id: 'comments', type: 'checkbox', label: 'Comments', isSelected: on.comments },
        { id: 'mentions', type: 'checkbox', label: 'Mentions', isSelected: on.mentions },
        { id: 'updates', type: 'checkbox', label: 'Updates', isSelected: on.updates },
      ] as MenuNode[]
    ).map((it) => ({ ...it, onSelect: (id: string) => setOn((s) => ({ ...s, [id]: !s[id] })) }));
    return <Menu {...args} items={items} />;
  },
  args: { items: [] },
};

export const Radios: Story = {
  render: (args) => {
    const [value, setValue] = useState('list');
    const options = [
      { id: 'list', label: 'List' },
      { id: 'board', label: 'Board' },
      { id: 'calendar', label: 'Calendar' },
    ];
    const items: MenuNode[] = options.map((o) => ({
      ...o,
      type: 'radio' as const,
      isSelected: value === o.id,
      onSelect: (id: string) => setValue(id),
    }));
    return <Menu {...args} items={items} />;
  },
  args: { items: [] },
};

/** Grouped rows with category headings — the Figma RadioGroup / CheckboxGroup parts. */
export const Grouped: Story = {
  args: {
    items: [
      {
        label: 'Sort by',
        items: [
          { id: 'name', type: 'radio', label: 'Name', isSelected: true },
          { id: 'date', type: 'radio', label: 'Date modified' },
        ],
      },
      {
        label: 'Filters',
        items: [
          { id: 'open', type: 'checkbox', label: 'Open', isSelected: true },
          { id: 'closed', type: 'checkbox', label: 'Closed' },
        ],
      },
    ],
  },
};

/** Scrollable — a capped height with overflow, mirroring the Figma "Scrollable" variant. */
export const Scrollable: Story = {
  args: {
    maxHeight: 200,
    items: Array.from({ length: 12 }, (_, i) => ({
      id: String(i),
      label: `Option ${i + 1}`,
    })),
  },
};

export const Compact: Story = {
  args: { spacing: 'compact', items: actionItems },
};

/** Arrow keys move focus across enabled rows (roving tabindex), skipping disabled ones. */
export const KeyboardNav: Story = {
  args: { items: actionItems },
  play: async ({ canvas }) => {
    const rows = canvas.getAllByRole('menuitem');
    rows[0].focus();
    await expect(rows[0]).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(rows[1]).toHaveFocus();
    await userEvent.keyboard('{End}');
    // last enabled row is "Delete" (Archive is disabled and skipped)
    await expect(canvas.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  },
};

/**
 * CSS proof: a selected row resolves to the forest.50 tint (#e9f7f3 =
 * rgb(233, 247, 243)). If tokens.css failed to load this falls back and fails.
 */
export const CssCheck: Story = {
  args: {
    items: [{ id: 'on', type: 'checkbox', label: 'Selected', isSelected: true }],
  },
  play: async ({ canvas }) => {
    const row = canvas.getByRole('menuitemcheckbox', { name: 'Selected' });
    await expect(row).toHaveAttribute('aria-checked', 'true');
    await expect(getComputedStyle(row).backgroundColor).toBe('rgb(233, 247, 243)');
  },
};
