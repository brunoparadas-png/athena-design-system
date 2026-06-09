import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Banner } from './Banner';
import { iconNames } from '../Icon';

const meta = {
  title: 'Components/Banner',
  component: Banner,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A prominent, full-width message strip that communicates a page-level status — an error to resolve or contextual information.',
      },
    },
  },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['info', 'error'] },
    children: { control: 'text', description: 'Message' },
    icon: {
      control: 'select',
      options: iconNames,
      description: 'Leading icon (defaults to warning for error, info for info)',
    },
  },
  args: {
    appearance: 'info',
    children: 'Banner message',
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toBeInTheDocument();
  },
};

export const Error: Story = {
  args: {
    appearance: 'error',
    children: 'We couldn’t save your changes. Check your connection and try again.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toBeInTheDocument();
  },
};

/** Long messages wrap to multiple lines (no truncation). */
export const Wrapping: Story = {
  args: {
    appearance: 'error',
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum neque, vel vivamus neque tristique faucibus habitant in. Ipsum egestas lorem eget eget vel vel. Euismod nibh ac duis vitae mauris pellentesque augue tortor.',
  },
};

/** Both appearances stacked. */
export const Appearances: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Banner appearance="info">Heads up — your trial ends in 3 days.</Banner>
      <Banner appearance="error">Payment failed. Update your billing details to continue.</Banner>
    </div>
  ),
};

/**
 * CSS proof: the error banner fill resolves to danger.700 (#c42419 = rgb(196, 36, 25)).
 * If tokens.css failed to load in the preview, this resolves to a default and fails.
 */
export const CssCheck: Story = {
  args: { appearance: 'error', children: 'Error' },
  play: async ({ canvas }) => {
    const banner = canvas.getByRole('alert');
    await expect(getComputedStyle(banner).backgroundColor).toBe('rgb(196, 36, 25)');
  },
};
