import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Lets people enter and edit a single line of text.',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    isInvalid: { control: 'boolean' },
    isValid: { control: 'boolean' },
    isCompact: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    iconBefore: { control: 'text' },
    iconAfter: { control: 'text' },
  },
  args: {
    label: 'Field label',
    placeholder: 'Placeholder',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: { helperText: 'Message content' },
};

export const WithIcon: Story = {
  args: { iconBefore: 'search', placeholder: 'Search' },
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
    defaultValue: 'wrong@',
    helperText: 'Enter a valid email address',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByRole('alert')).toHaveTextContent('Enter a valid email address');
  },
};

export const Valid: Story = {
  args: {
    isValid: true,
    defaultValue: 'name@buzzfeed.com',
    helperText: 'Looks good',
  },
};

export const Required: Story = {
  args: { isRequired: true, helperText: 'This field is required' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox')).toBeRequired();
  },
};

export const Compact: Story = {
  args: { isCompact: true, helperText: 'Compact 32px input' },
};

export const Disabled: Story = {
  args: { isDisabled: true, defaultValue: 'Read only', helperText: 'You cannot edit this' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox')).toBeDisabled();
  },
};

/** Typing updates the value; the label is wired to the input via htmlFor. */
export const Typing: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Field label') as HTMLInputElement;
    await userEvent.type(input, 'Hello');
    await expect(input).toHaveValue('Hello');
  },
};

/** The full Figma matrix of states. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 240 }}>
      <TextField label="Default" placeholder="Placeholder" />
      <TextField label="Filled" defaultValue="Value" />
      <TextField label="With icon" iconBefore="search" placeholder="Search" />
      <TextField label="Invalid" defaultValue="Value" isInvalid helperText="Something’s wrong" />
      <TextField label="Valid" defaultValue="Value" isValid helperText="All good" />
      <TextField label="Disabled" placeholder="Placeholder" isDisabled />
    </div>
  ),
};

/**
 * CSS proof: an invalid field's border resolves to danger.500 (#fe3d2e =
 * rgb(254, 61, 46)). If tokens.css failed to load this falls back and fails.
 */
export const CssCheck: Story = {
  args: { isInvalid: true, defaultValue: 'x', helperText: 'Error' },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox');
    const container = input.parentElement as HTMLElement;
    await expect(getComputedStyle(container).borderTopColor).toBe('rgb(254, 61, 46)');
  },
};
