import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { TextArea } from './TextArea';

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Lets people enter and edit multi-line, long-form text.',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    rows: { control: 'number' },
    isInvalid: { control: 'boolean' },
    isValid: { control: 'boolean' },
    isCompact: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    isMonospaced: { control: 'boolean' },
    resize: { control: 'inline-radio', options: ['vertical', 'horizontal', 'both', 'none'] },
  },
  args: {
    label: 'Field label',
    placeholder: 'Text',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHelperText: Story = {
  args: { helperText: 'Add as much detail as you like' },
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
    defaultValue: 'Too short',
    helperText: 'Description must be at least 50 characters',
  },
  play: async ({ canvas }) => {
    const field = canvas.getByRole('textbox');
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByRole('alert')).toHaveTextContent('at least 50 characters');
  },
};

export const Valid: Story = {
  args: { isValid: true, defaultValue: 'Looks great', helperText: 'Looks good' },
};

export const Required: Story = {
  args: { isRequired: true, helperText: 'This field is required' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox')).toBeRequired();
  },
};

export const Compact: Story = {
  args: { isCompact: true, helperText: 'Tighter padding' },
};

export const Monospaced: Story = {
  args: { isMonospaced: true, defaultValue: 'const greet = () => "hi";', label: 'Code' },
};

export const Disabled: Story = {
  args: { isDisabled: true, defaultValue: 'Read only', helperText: 'You cannot edit this' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox')).toBeDisabled();
  },
};

/** Typing updates the value; the label is wired to the textarea via htmlFor. */
export const Typing: Story = {
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText('Field label') as HTMLTextAreaElement;
    await userEvent.type(field, 'Line one\nLine two');
    await expect(field).toHaveValue('Line one\nLine two');
  },
};

/**
 * CSS proof: an invalid textarea's border resolves to danger.500 (#fe3d2e =
 * rgb(254, 61, 46)). If tokens.css failed to load this falls back and fails.
 */
export const CssCheck: Story = {
  args: { isInvalid: true, defaultValue: 'x', helperText: 'Error' },
  play: async ({ canvas }) => {
    const field = canvas.getByRole('textbox');
    const container = field.parentElement as HTMLElement;
    await expect(getComputedStyle(container).borderTopColor).toBe('rgb(254, 61, 46)');
  },
};
