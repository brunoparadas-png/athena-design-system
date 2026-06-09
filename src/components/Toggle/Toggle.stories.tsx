import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Toggle } from './Toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A switch for an on/off setting that takes effect instantly.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['default', 'large'], description: 'Track size' },
    isChecked: { control: 'boolean', description: 'Controlled on/off state' },
    isDisabled: { control: 'boolean', description: 'Disabled state' },
    label: { control: 'text', description: 'Optional text after the switch' },
  },
  args: {
    label: 'Email notifications',
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const On: Story = {
  args: { isChecked: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('switch')).toBeChecked();
  },
};

export const Large: Story = {
  args: { size: 'large', isChecked: true },
};

export const Disabled: Story = {
  args: { isDisabled: true, isChecked: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('switch')).toBeDisabled();
  },
};

/** Standalone switch (no label) — requires an aria-label for an accessible name. */
export const NoLabel: Story = {
  args: { label: undefined, 'aria-label': 'Dark mode' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('switch', { name: 'Dark mode' })).toBeInTheDocument();
  },
};

/** Both sizes, on and off. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: 16, alignItems: 'center' }}>
      <Toggle size="default" label="Default, off" />
      <Toggle size="default" label="Default, on" isChecked />
      <Toggle size="large" label="Large, off" />
      <Toggle size="large" label="Large, on" isChecked />
      <Toggle size="default" label="Disabled, off" isDisabled />
      <Toggle size="default" label="Disabled, on" isDisabled isChecked />
    </div>
  ),
};

/**
 * CSS proof: the on-state track resolves to forest.500 (#2e7061 = rgb(46, 112, 97)).
 * If tokens.css failed to load in the preview, this resolves to a default and fails.
 */
export const CssCheck: Story = {
  args: { isChecked: true },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('switch');
    const track = input.nextElementSibling as HTMLElement;
    await expect(getComputedStyle(track).backgroundColor).toBe('rgb(46, 112, 97)');
  },
};
