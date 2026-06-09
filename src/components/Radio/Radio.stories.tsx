import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Radio } from './Radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Lets people select exactly one option from a set.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Text beside the dial' },
    isChecked: { control: 'boolean', description: 'Controlled selected state' },
    isInvalid: { control: 'boolean', description: 'Error state' },
    isDisabled: { control: 'boolean', description: 'Disabled state' },
    isRequired: { control: 'boolean', description: 'Appends a danger asterisk' },
  },
  args: {
    label: 'Label',
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { isChecked: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio')).toBeChecked();
  },
};

/** Error state — danger.500 fill when checked, danger.500 border when empty; sets aria-invalid. */
export const Invalid: Story = {
  args: { isInvalid: true, isChecked: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio')).toHaveAttribute('aria-invalid', 'true');
  },
};

export const Required: Story = {
  args: { isRequired: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio')).toBeRequired();
  },
};

export const Disabled: Story = {
  args: { isDisabled: true, isChecked: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio')).toBeDisabled();
  },
};

/**
 * A grouped set sharing one `name` — only one can be selected at a time.
 * This is the canonical usage; a lone radio is rare.
 */
export const Group: Story = {
  render: () => (
    <div role="radiogroup" aria-label="Plan" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Radio name="plan" value="free" label="Free" defaultChecked />
      <Radio name="plan" value="pro" label="Pro" />
      <Radio name="plan" value="enterprise" label="Enterprise" />
    </div>
  ),
};

/** The full Figma matrix: each state side by side. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: 16 }}>
      <Radio name="s1" label="Unchecked" />
      <Radio name="s2" label="Checked" isChecked />
      <Radio name="s3" label="Checked, invalid" isChecked isInvalid />
      <Radio name="s4" label="Unchecked, invalid" isInvalid />
      <Radio name="s5" label="Disabled" isDisabled />
      <Radio name="s6" label="Disabled, checked" isDisabled isChecked />
    </div>
  ),
};

/**
 * CSS proof: the selected dial resolves to forest.500 (#2e7061 = rgb(46, 112, 97)).
 * If tokens.css failed to load in the preview, this resolves to a default and fails.
 */
export const CssCheck: Story = {
  args: { isChecked: true },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('radio');
    const box = input.nextElementSibling as HTMLElement;
    await expect(getComputedStyle(box).backgroundColor).toBe('rgb(46, 112, 97)');
  },
};
