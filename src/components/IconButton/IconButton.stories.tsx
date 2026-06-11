import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { IconButton } from './IconButton';
import { iconNames } from '../Icon';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A square icon-only button. No text label — `aria-label` is required and carries the accessible name. Use for compact toolbars, action icons, or toggle controls.',
      },
    },
  },
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: ['primary', 'neutral', 'text', 'danger'],
      description: 'Visual style',
    },
    size: {
      control: 'inline-radio',
      options: ['default', 'small'],
      description: 'Square size: default=40px, small=32px',
    },
    icon: {
      control: 'select',
      options: iconNames,
      description: 'Icon from the Athena icon set',
    },
    isSelected: { control: 'boolean', description: 'Toggle-on state (aria-pressed)' },
    isDisabled: { control: 'boolean', description: 'Disabled state' },
    'aria-label': { control: 'text', description: 'Required accessible name (no visible label)' },
  },
  args: {
    appearance: 'neutral',
    size: 'default',
    icon: 'edit',
    'aria-label': 'Edit',
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** All four appearances side by side. Note: in a real view, only one `primary` may appear. */
export const Appearances: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <IconButton {...args} appearance="primary" aria-label="Primary action" />
      <IconButton {...args} appearance="neutral" aria-label="Neutral action" />
      <IconButton {...args} appearance="text" aria-label="Text action" />
      <IconButton {...args} appearance="danger" aria-label="Danger action" />
    </div>
  ),
};

/** Default (40×40px) and small (32×32px). */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <IconButton {...args} size="default" aria-label="Default size" />
      <IconButton {...args} size="small" aria-label="Small size" />
    </div>
  ),
};

/** Toggle-on state. Forest tint + forest.700 border/text, exposed as aria-pressed. */
export const Selected: Story = {
  args: { isSelected: true, icon: 'edit', 'aria-label': 'Edit (selected)' },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: /edit/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  },
};

/** Disabled state — cursor-not-allowed, muted palette. */
export const Disabled: Story = {
  args: { appearance: 'primary', isDisabled: true, icon: 'trash', 'aria-label': 'Delete' },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: /delete/i }),
    ).toBeDisabled();
  },
};

/** Full matrix: all appearances × both sizes. */
export const AllVariants: Story = {
  render: () => {
    const appearances = ['primary', 'neutral', 'text', 'danger'] as const;
    const sizes = ['default', 'small'] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sizes.map((size) => (
          <div key={size} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ width: 56, fontSize: 12, color: '#666' }}>{size}</span>
            {appearances.map((appearance) => (
              <IconButton
                key={appearance}
                appearance={appearance}
                size={size}
                icon="edit"
                aria-label={`${appearance} ${size}`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  },
};

/** Toolbar pattern: a row of neutral icon buttons. */
export const Toolbar: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      <IconButton appearance="neutral" icon="edit" aria-label="Edit" />
      <IconButton appearance="neutral" icon="trash" aria-label="Delete" />
      <IconButton appearance="neutral" icon="add" aria-label="Add" />
      <IconButton appearance="neutral" icon="search" aria-label="Search" />
      <IconButton appearance="neutral" icon="more-horizontal" aria-label="More options" />
    </div>
  ),
};
