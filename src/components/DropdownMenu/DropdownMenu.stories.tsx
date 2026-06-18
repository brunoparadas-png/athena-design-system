import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { useState } from 'react';
import { DropdownMenu } from './DropdownMenu';
import type { MenuNode } from '../Menu';

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A trigger that opens a menu of actions or options anchored to it.',
      },
      // Give the docs canvas enough vertical room so the open popover is visible.
      story: { height: '260px' },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 200 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    triggerType: { control: 'inline-radio', options: ['button', 'icon'] },
    placement: { control: 'inline-radio', options: ['bottom-start', 'bottom-end'] },
    spacing: { control: 'inline-radio', options: ['default', 'compact'] },
    buttonSpacing: { control: 'inline-radio', options: ['default', 'compact'] },
  },
  args: {
    triggerType: 'button',
    triggerLabel: 'Select',
    placement: 'bottom-start',
    spacing: 'default',
    buttonSpacing: 'default',
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const actionItems: MenuNode[] = [
  { id: 'edit', label: 'Edit', iconBefore: 'edit' },
  { id: 'duplicate', label: 'Duplicate', iconBefore: 'add' },
  { type: 'separator' },
  { id: 'delete', label: 'Delete', iconBefore: 'trash' },
];

export const Default: Story = {
  args: { items: actionItems, menuLabel: 'Actions', defaultOpen: true },
};

/** Opening the menu, then Escape closes it and returns focus to the trigger. */
export const OpensAndCloses: Story = {
  args: { items: actionItems, menuLabel: 'Actions' },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /select/i });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(canvas.getByRole('menu')).toBeInTheDocument());
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();
  },
};

/** Icon-only trigger (e.g. a row's overflow menu). Requires an aria-label. */
export const IconTrigger: Story = {
  args: {
    triggerType: 'icon',
    triggerIcon: 'more-horizontal',
    'aria-label': 'More actions',
    items: actionItems,
    menuLabel: 'More actions',
  },
};

export const PlacementEnd: Story = {
  args: { items: actionItems, placement: 'bottom-end', menuLabel: 'Actions' },
};

/** Checkbox rows keep the menu open as you toggle; the menu closes on an action. */
export const MultiSelect: Story = {
  render: (args) => {
    const [on, setOn] = useState<Record<string, boolean>>({ wifi: true });
    const items: MenuNode[] = (
      [
        { id: 'wifi', type: 'checkbox', label: 'Wi-Fi', isSelected: on.wifi },
        { id: 'bt', type: 'checkbox', label: 'Bluetooth', isSelected: on.bt },
        { id: 'air', type: 'checkbox', label: 'Airplane mode', isSelected: on.air },
      ] as MenuNode[]
    ).map((it) => ({ ...it, onSelect: (id: string) => setOn((s) => ({ ...s, [id]: !s[id] })) }));
    return <DropdownMenu {...args} triggerLabel="Connections" items={items} menuLabel="Connections" />;
  },
  args: { items: [] },
};

/**
 * When `isLoading` is true the trigger is disabled and rendered with a muted
 * appearance. Mirrors the Figma `isLoading` variant prop (visual spec not yet
 * finalised; this story will update once Figma completes the loading variant).
 */
export const Loading: Story = {
  args: { items: actionItems, menuLabel: 'Actions', isLoading: true },
};

export const Scrollable: Story = {
  args: {
    menuLabel: 'Pick one',
    maxHeight: 200,
    items: Array.from({ length: 12 }, (_, i) => ({ id: String(i), label: `Option ${i + 1}` })),
  },
};

/**
 * Borderless trigger — use when the dropdown sits inside a toolbar or table row
 * where a bordered button would add too much visual noise.
 */
export const TextTrigger: Story = {
  args: {
    items: actionItems,
    menuLabel: 'Actions',
    triggerAppearance: 'text',
    triggerLabel: 'More',
    defaultOpen: true,
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /more/i });
    // Text appearance: no border (transparent), open state tints forest.50.
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(getComputedStyle(trigger).borderColor).toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(trigger).backgroundColor).toBe('rgb(233, 247, 243)');
  },
};

/**
 * CSS proof: while open the trigger resolves to the forest.50 tint (#e9f7f3 =
 * rgb(233, 247, 243)). If tokens.css failed to load this falls back and fails.
 */
export const CssCheck: Story = {
  args: { items: actionItems, defaultOpen: true, menuLabel: 'Actions' },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /select/i });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(getComputedStyle(trigger).backgroundColor).toBe('rgb(233, 247, 243)');
  },
};
