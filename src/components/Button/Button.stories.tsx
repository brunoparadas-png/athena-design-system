import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button } from './Button';
import { Icon } from '../Icon';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Triggers an action or navigation. The `primary` variant carries the single ' +
          'forest.500 moment per view — never render two primary buttons on one view.',
      },
    },
  },
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
    label: { control: 'text' },
  },
  args: {
    variant: 'neutral',
    size: 'default',
    label: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', label: 'Save changes' },
};

export const Neutral: Story = {
  args: { variant: 'neutral', label: 'Cancel' },
};

export const Text: Story = {
  args: { variant: 'text', label: 'Edit' },
};

export const Danger: Story = {
  args: { variant: 'danger', label: 'Delete article' },
};

/** All four variants side by side. Note: in a real view, only one `primary` may appear. */
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} variant="primary" label="Save changes" />
      <Button {...args} variant="neutral" label="Cancel" />
      <Button {...args} variant="text" label="Edit" />
      <Button {...args} variant="danger" label="Delete" />
    </div>
  ),
};

/** Default (40px) and small (32px). Both use body-m (14px); only height differs. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} variant="primary" size="default" label="Default" />
      <Button {...args} variant="primary" size="small" label="Small" />
    </div>
  ),
};

/** Matches the Figma demo: a leading icon and a trailing chevron around the label. */
export const WithIcons: Story = {
  args: {
    variant: 'neutral',
    label: 'Button',
    iconLeft: <Icon name="diamond" />,
    iconRight: <Icon name="chevron-down" />,
  },
};

/**
 * Toggle-on state (`selected`). Forest tint + forest.700 border/text across all
 * appearances, exposed as aria-pressed. Used for segmented / toggle controls.
 */
export const Selected: Story = {
  args: { variant: 'neutral', selected: true, label: 'Button' },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: /button/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  },
};

/**
 * Loading locks the button and swaps the label for a spinner — but the label
 * stays in the accessibility tree (opacity, not visibility) so the button keeps
 * a discernible name. Proven here via aria-busy + retained accessible name.
 */
export const Loading: Story = {
  args: { variant: 'primary', loading: true, label: 'Saving' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /saving/i });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toBeDisabled();
  },
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, label: 'Save changes' },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: /save changes/i }),
    ).toBeDisabled();
  },
};

/**
 * Canonical pattern: one primary action pinned right, paired with a neutral Cancel.
 * This is the page-header / modal-footer shape.
 */
export const ActionPair: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="neutral" label="Cancel" />
      <Button variant="primary" label="Publish" />
    </div>
  ),
};

/**
 * The single project-wide CSS proof. Asserts the resolved background of the
 * primary button is forest.500 (#2e7061 = rgb(46, 112, 97)). If tokens.css
 * failed to load in the preview, this resolves to a default and the test fails.
 */
export const CssCheck: Story = {
  args: { variant: 'primary', label: 'Submit' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /submit/i });
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(46, 112, 97)');
  },
};
