import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button } from './Button';
import { iconNames } from '../Icon';

const iconOptions = ['none', ...iconNames];
const iconControl = {
  control: 'select' as const,
  options: iconOptions,
  mapping: { none: undefined },
};

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Triggers an action or navigation. The `primary` appearance carries the single ' +
          'forest.500 moment per view — never render two primary buttons on one view.',
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
      description: 'Height',
    },
    iconBefore: { ...iconControl, description: 'Leading icon' },
    iconAfter: { ...iconControl, description: 'Trailing icon' },
    isSelected: { control: 'boolean', description: 'Toggle-on state' },
    isDisabled: { control: 'boolean', description: 'Disabled state' },
    loading: { control: 'boolean', description: 'Loading state' },
    label: { control: 'text', description: 'Button text' },
  },
  args: {
    appearance: 'neutral',
    size: 'default',
    label: 'Button text',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { appearance: 'primary' },
};

export const Neutral: Story = {
  args: { appearance: 'neutral' },
};

export const Text: Story = {
  args: { appearance: 'text' },
};

export const Danger: Story = {
  args: { appearance: 'danger' },
};

/** All four appearances side by side. Note: in a real view, only one `primary` may appear. */
export const Appearances: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} appearance="primary" />
      <Button {...args} appearance="neutral" />
      <Button {...args} appearance="text" />
      <Button {...args} appearance="danger" />
    </div>
  ),
};

/** Default (40px) and small (32px). Both use body-m (14px); only height differs. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} appearance="primary" size="default" />
      <Button {...args} appearance="primary" size="small" />
    </div>
  ),
};

/**
 * Leading icon + trailing chevron, matching the Figma demo. Pick icons from the
 * `iconBefore` / `iconAfter` dropdowns in the Controls panel.
 */
export const WithIcons: Story = {
  args: {
    appearance: 'neutral',
    iconBefore: 'diamond',
    iconAfter: 'chevron-down',
  },
};

/**
 * Toggle-on state (`isSelected`). Forest tint + forest.700 border/text across all
 * appearances, exposed as aria-pressed. Used for segmented / toggle controls.
 */
export const Selected: Story = {
  args: { appearance: 'neutral', isSelected: true },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: /button text/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  },
};

/**
 * Loading locks the button and swaps the label for a spinner — but the label
 * stays in the accessibility tree (opacity, not visibility) so the button keeps
 * a discernible name. Proven here via aria-busy + retained accessible name.
 */
export const Loading: Story = {
  args: { appearance: 'primary', loading: true },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /button text/i });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toBeDisabled();
  },
};

export const Disabled: Story = {
  args: { appearance: 'primary', isDisabled: true },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: /button text/i }),
    ).toBeDisabled();
  },
};

/**
 * Canonical pattern: one primary action pinned right, paired with a neutral
 * secondary. This is the page-header / modal-footer shape.
 */
export const ActionPair: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button appearance="neutral" label="Button text" />
      <Button appearance="primary" label="Button text" />
    </div>
  ),
};

/**
 * The single project-wide CSS proof. Asserts the resolved background of the
 * primary button is forest.500 (#2e7061 = rgb(46, 112, 97)). If tokens.css
 * failed to load in the preview, this resolves to a default and the test fails.
 */
export const CssCheck: Story = {
  args: { appearance: 'primary' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /button text/i });
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(46, 112, 97)');
  },
};
