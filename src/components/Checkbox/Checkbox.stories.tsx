import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Lets people select one or more options from a set, or toggle a single setting that is confirmed on submit.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Text beside the box' },
    isChecked: { control: 'boolean', description: 'Controlled checked state' },
    isIndeterminate: { control: 'boolean', description: 'Mixed state (dash)' },
    isInvalid: { control: 'boolean', description: 'Error state (danger border)' },
    isDisabled: { control: 'boolean', description: 'Disabled state' },
    isRequired: { control: 'boolean', description: 'Appends a danger asterisk' },
  },
  args: {
    label: 'Label',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { isChecked: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox')).toBeChecked();
  },
};

/** Mixed state — a dash, not a check. Use on a "select all" parent when only some children are selected. */
export const Indeterminate: Story = {
  args: { isIndeterminate: true },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('checkbox') as HTMLInputElement;
    await expect(input.indeterminate).toBe(true);
  },
};

/** Error state — danger.500 border, `aria-invalid`. The forest fill stays when checked. */
export const Invalid: Story = {
  args: { isInvalid: true, isChecked: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  },
};

export const Required: Story = {
  args: { isRequired: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox')).toBeRequired();
  },
};

export const Disabled: Story = {
  args: { isDisabled: true, isChecked: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox')).toBeDisabled();
  },
};

/** The full Figma matrix: each check state in its valid and invalid form. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: 16 }}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Unchecked, invalid" isInvalid />
      <Checkbox label="Checked" isChecked />
      <Checkbox label="Checked, invalid" isChecked isInvalid />
      <Checkbox label="Indeterminate" isIndeterminate />
      <Checkbox label="Indeterminate, invalid" isIndeterminate isInvalid />
      <Checkbox label="Disabled" isDisabled />
      <Checkbox label="Disabled, checked" isDisabled isChecked />
    </div>
  ),
};

/**
 * CSS proof: the checked box resolves to forest.500 (#2e7061 = rgb(46, 112, 97)).
 * If tokens.css failed to load in the preview, this resolves to a default and fails.
 */
export const CssCheck: Story = {
  args: { isChecked: true },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('checkbox');
    const box = input.nextElementSibling as HTMLElement;
    await expect(getComputedStyle(box).backgroundColor).toBe('rgb(46, 112, 97)');
  },
};
