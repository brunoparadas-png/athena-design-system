import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Triggers an action or navigation. The `primary` variant carries the single ' +
          'forest.500 moment per view — never render two primary buttons on one view. ' +
          'Always a hard rectangle (radius.none), sentence-case label, 32px min target.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'neutral', 'text', 'danger'],
      description: 'Visual weight. `primary` = the forest moment.',
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'small'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    variant: 'neutral',
    size: 'default',
    children: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Save changes' },
};

export const Neutral: Story = {
  args: { variant: 'neutral', children: 'Cancel' },
};

export const Text: Story = {
  args: { variant: 'text', children: 'Edit' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete article' },
};

/** All four variants side by side. Note: in a real view, only one `primary` may appear. */
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} variant="primary">Save changes</Button>
      <Button {...args} variant="neutral">Cancel</Button>
      <Button {...args} variant="text">Edit</Button>
      <Button {...args} variant="danger">Delete</Button>
    </div>
  ),
};

/** Default (32px) and small (24px). */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} variant="primary" size="default">Default</Button>
      <Button {...args} variant="primary" size="small">Small</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Saving' },
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: 'Save changes' },
};

/**
 * Canonical pattern: one primary action pinned right, paired with a neutral Cancel.
 * This is the page-header / modal-footer shape.
 */
export const ActionPair: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="neutral">Cancel</Button>
      <Button variant="primary">Publish</Button>
    </div>
  ),
};
