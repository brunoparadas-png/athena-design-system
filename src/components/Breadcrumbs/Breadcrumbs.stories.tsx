import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Breadcrumbs } from './Breadcrumbs';

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A navigation trail that shows where the user is in the page hierarchy and lets them step back up it.',
      },
    },
  },
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Articles', href: '/articles' },
      { label: 'Editorial standards' },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    // Links for ancestors, current page marked and non-link.
    await expect(canvas.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    const current = canvas.getByText('Editorial standards');
    await expect(current).toHaveAttribute('aria-current', 'page');
    await expect(canvas.queryByRole('link', { name: 'Editorial standards' })).toBeNull();
  },
};

/** Two levels. */
export const TwoLevels: Story = {
  args: {
    items: [
      { label: 'Settings', href: '/settings' },
      { label: 'Profile' },
    ],
  },
};

/** Long labels truncate to a max width with an ellipsis. */
export const Truncated: Story = {
  args: {
    maxItemWidth: 120,
    items: [
      { label: 'Home', href: '/' },
      { label: 'A very long section name that should truncate', href: '/section' },
      { label: 'Another long current page title' },
    ],
  },
};

/** Custom separator. */
export const CustomSeparator: Story = {
  args: {
    separator: '›',
    items: [
      { label: 'Home', href: '/' },
      { label: 'Library', href: '/library' },
      { label: 'Item' },
    ],
  },
};

/**
 * CSS proof: link crumbs resolve to neutral.600 (#525252 = rgb(82, 82, 82)).
 * If tokens.css failed to load in the preview, this resolves to a default and fails.
 */
export const CssCheck: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Home' });
    await expect(getComputedStyle(link).color).toBe('rgb(82, 82, 82)');
  },
};
