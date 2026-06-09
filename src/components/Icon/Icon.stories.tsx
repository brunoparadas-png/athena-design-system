import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Icon } from './Icon';
import { iconNames } from './icons';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A small visual glyph that reinforces meaning or labels an action where space is limited.',
      },
    },
  },
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: { type: 'range', min: 12, max: 64, step: 2 } },
    title: { control: 'text' },
  },
  args: { name: 'chevron-down', size: 24 },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Icons inherit the surrounding text color via currentColor. */
export const Colored: Story = {
  args: { name: 'check', size: 32 },
  render: (args) => (
    <span style={{ color: '#2e7061' }}>
      <Icon {...args} />
    </span>
  ),
};

/** The full curated set. */
export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20, color: '#252525' }}>
      {iconNames.map((n) => (
        <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'Inter, sans-serif' }}>
          <Icon name={n} size={24} />
          <span style={{ color: '#737373' }}>{n}</span>
        </div>
      ))}
    </div>
  ),
};

/** Decorative icons must not expose a label; titled icons must. */
export const Accessibility: Story = {
  args: { name: 'search', title: 'Search' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Search' })).toBeInTheDocument();
  },
};
