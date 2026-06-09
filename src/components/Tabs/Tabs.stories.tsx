import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Tabs } from './Tabs';

const sampleTabs = [
  { id: 'overview', label: 'Overview', content: 'Overview content — the big picture.' },
  { id: 'activity', label: 'Activity', content: 'Activity content — recent events.' },
  { id: 'settings', label: 'Settings', content: 'Settings content — configuration.' },
];

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Organizes related content into selectable panels within a single page.',
      },
    },
  },
  args: {
    tabs: sampleTabs,
    label: 'Project sections',
  },
  decorators: [(Story) => <div style={{ width: 480 }}><Story /></div>],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const overview = canvas.getByRole('tab', { name: 'Overview' });
    await expect(overview).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Overview content');
  },
};

/** Clicking a tab swaps the visible panel. */
export const SelectByClick: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('tab', { name: 'Activity' }));
    await expect(canvas.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Activity content');
  },
};

/** Arrow keys move and activate tabs (roving tabindex). */
export const KeyboardNav: Story = {
  play: async ({ canvas }) => {
    const overview = canvas.getByRole('tab', { name: 'Overview' });
    overview.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
  },
};

/** A disabled tab is skipped by keyboard navigation. */
export const WithDisabled: Story = {
  args: {
    tabs: [
      { id: 'a', label: 'Enabled', content: 'First panel.' },
      { id: 'b', label: 'Disabled', content: 'Hidden.', isDisabled: true },
      { id: 'c', label: 'Also enabled', content: 'Third panel.' },
    ],
  },
};

/**
 * CSS proof: the selected tab text resolves to forest.500 (#2e7061 = rgb(46, 112, 97)).
 * If tokens.css failed to load in the preview, this resolves to a default and fails.
 */
export const CssCheck: Story = {
  play: async ({ canvas }) => {
    const selected = canvas.getByRole('tab', { name: 'Overview' });
    await expect(getComputedStyle(selected).color).toBe('rgb(46, 112, 97)');
  },
};
