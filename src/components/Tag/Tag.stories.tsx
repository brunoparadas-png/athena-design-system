import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Tag, type TagAppearance } from './Tag';

const appearances: TagAppearance[] = ['gray', 'green', 'red', 'purple', 'blue', 'orange'];

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Labels an object with a short keyword — a category, status, or piece of metadata — for quick recognition.',
      },
    },
  },
  argTypes: {
    appearance: { control: 'inline-radio', options: appearances },
    children: { control: 'text', description: 'Tag text' },
  },
  args: {
    appearance: 'gray',
    children: 'Tag',
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** All six appearances. "green" is the teal palette. */
export const Appearances: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {appearances.map((a) => (
        <Tag key={a} appearance={a}>
          {a}
        </Tag>
      ))}
    </div>
  ),
};

/** Removable chips — `isRemovable` shows the × button; `onRemove` handles the click. */
export const Removable: Story = {
  args: { appearance: 'blue', children: 'Removable', isRemovable: true, onRemove: fn() },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Remove' }));
    await expect(args.onRemove).toHaveBeenCalledOnce();
  },
};

/** `isRemovable` without an `onRemove` handler — button is visible but clicking is a no-op. */
export const RemovableNoHandler: Story = {
  args: { appearance: 'gray', children: 'No handler', isRemovable: true },
};

/** The full matrix: each appearance, static and removable. */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: 8 }}>
      {appearances.map((a) => (
        <Tag key={`${a}-s`} appearance={a}>
          {a}
        </Tag>
      ))}
      {appearances.map((a) => (
        <Tag key={`${a}-r`} appearance={a} isRemovable onRemove={() => {}}>
          {a}
        </Tag>
      ))}
    </div>
  ),
};

/**
 * CSS proof: the green tag text resolves to teal.800 (#00705c = rgb(0, 112, 92)) —
 * darkened from teal.700 to meet AA on the teal.100 fill. If tokens.css failed to
 * load in the preview, this resolves to a default and fails.
 */
export const CssCheck: Story = {
  args: { appearance: 'green', children: 'Tag' },
  play: async ({ canvas }) => {
    const tag = canvas.getByText('Tag');
    await expect(getComputedStyle(tag).color).toBe('rgb(0, 112, 92)');
  },
};
