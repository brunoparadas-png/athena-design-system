import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Shows how far along a task with a known duration has progressed.',
      },
    },
  },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 1, step: 0.01 }, description: 'Completion 0–1' },
    appearance: { control: 'inline-radio', options: ['default', 'success', 'inverse'] },
    label: { control: 'text', description: 'Accessible name' },
  },
  args: {
    value: 0.4,
    appearance: 'default',
    label: 'Upload progress',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Upload progress' });
    await expect(bar).toHaveAttribute('aria-valuenow', '40');
  },
};

/** Completed process. */
export const Success: Story = {
  args: { appearance: 'success', value: 1 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  },
};

/** White fill on a translucent track — for dark or colored surfaces. */
export const Inverse: Story = {
  args: { appearance: 'inverse', value: 0.6 },
  decorators: [
    (Story) => (
      <div style={{ width: 320, background: 'var(--forest-500)', padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

/** Out-of-range values are clamped to 0–1. */
export const Clamped: Story = {
  args: { value: 5 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  },
};

/** A range of completion values. */
export const Steps: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <ProgressBar key={v} value={v} label={`${v * 100}%`} />
      ))}
    </div>
  ),
};

/**
 * CSS proof: the default fill resolves to forest.500 (#2e7061 = rgb(46, 112, 97)).
 * If tokens.css failed to load in the preview, this resolves to a default and fails.
 */
export const CssCheck: Story = {
  args: { value: 0.5 },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar').firstElementChild as HTMLElement;
    await expect(getComputedStyle(bar).backgroundColor).toBe('rgb(46, 112, 97)');
  },
};
