import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Spinner, type SpinnerSize } from './Spinner';

const sizes: SpinnerSize[] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Signals that content is loading when the wait time is unknown.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    label: { control: 'text', description: 'Accessible loading label' },
  },
  args: {
    size: 'medium',
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  },
};

/** All five sizes. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {sizes.map((s) => (
        <Spinner key={s} size={s} />
      ))}
    </div>
  ),
};

/** Inherits currentColor — here forest, danger, and white on a dark surface. */
export const Color: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <span style={{ color: 'var(--forest-500)' }}>
        <Spinner />
      </span>
      <span style={{ color: 'var(--danger-700)' }}>
        <Spinner />
      </span>
      <span style={{ color: 'var(--neutral-0)', background: 'var(--neutral-800)', padding: 12, display: 'inline-flex' }}>
        <Spinner />
      </span>
    </div>
  ),
};

/** Centered in a loading panel — the common "content loading" placement. */
export const InPanel: Story = {
  render: () => (
    <div
      style={{
        width: 280,
        height: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--border-neutral-default)',
        color: 'var(--text-neutral-default)',
      }}
    >
      <Spinner size="large" label="Loading results" />
    </div>
  ),
};

/**
 * CSS proof: the arc inherits currentColor — forced to forest.500
 * (#2e7061 = rgb(46, 112, 97)) by the wrapper. If the spinner ignored
 * currentColor this would fail.
 */
export const CssCheck: Story = {
  render: () => (
    <span style={{ color: 'var(--forest-500)' }}>
      <Spinner />
    </span>
  ),
  play: async ({ canvas }) => {
    const circle = canvas.getByRole('status').querySelector('circle') as SVGCircleElement;
    await expect(getComputedStyle(circle).stroke).toBe('rgb(46, 112, 97)');
  },
};
