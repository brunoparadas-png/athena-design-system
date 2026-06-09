import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { useState } from 'react';
import { RadioGroup } from './RadioGroup';

const planOptions = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
];

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Presents a set of related options where only one may be selected.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Group label' },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    isDisabled: { control: 'boolean', description: 'Disable all options' },
    isInvalid: { control: 'boolean', description: 'Mark all options invalid' },
    isRequired: { control: 'boolean', description: 'Require a selection' },
  },
  args: {
    label: 'Plan',
    options: planOptions,
    defaultValue: 'free',
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
};

/** One option disabled via the option-level `isDisabled`; the rest stay selectable. */
export const OptionDisabled: Story = {
  args: {
    defaultValue: 'free',
    options: [
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Pro' },
      { value: 'enterprise', label: 'Enterprise (contact sales)', isDisabled: true },
    ],
  },
};

export const AllDisabled: Story = {
  args: { isDisabled: true },
};

/** Group-level error — e.g. nothing selected on submit. */
export const Invalid: Story = {
  args: { defaultValue: undefined, isInvalid: true, isRequired: true },
};

/** Selecting an option moves the choice; only one is ever checked. */
export const SingleSelection: Story = {
  play: async ({ canvas }) => {
    const pro = canvas.getByRole('radio', { name: 'Pro' });
    await userEvent.click(pro);
    await expect(pro).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Free' })).not.toBeChecked();
  },
};

/** Controlled usage: parent owns the value. */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('pro');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <RadioGroup {...args} value={value} onChange={(v) => setValue(v)} defaultValue={undefined} />
        <small style={{ fontFamily: 'var(--font-main)', color: 'var(--text-neutral-default)' }}>
          Selected: {value}
        </small>
      </div>
    );
  },
};
