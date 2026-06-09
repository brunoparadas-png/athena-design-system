import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Link } from './Link';

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Takes people to another location in the app or on the web.',
      },
    },
  },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['default', 'subtle', 'inverse'] },
    isExternal: { control: 'boolean', description: 'Offsite link (icon + new tab)' },
    children: { control: 'text', description: 'Link text' },
  },
  args: {
    appearance: 'default',
    children: 'Link',
    href: '#',
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Subtle: Story = {
  args: { appearance: 'subtle' },
};

/** Offsite link — external icon + opens a new tab with safe rel. */
export const External: Story = {
  args: { isExternal: true, href: 'https://example.com', children: 'Documentation' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: /documentation/i });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    // The icon is decorative; the new-tab hint is announced via visually-hidden text.
    await expect(canvas.getByText('(opens in a new tab)')).toBeInTheDocument();
  },
};

/** Inverse sits on a dark surface. */
export const Inverse: Story = {
  args: { appearance: 'inverse', children: 'Inverse link' },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--neutral-800)', padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

/** All appearances, internal and external. */
export const Appearances: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <Link href="#">Default internal</Link>
      <Link href="https://example.com" isExternal>
        Default external
      </Link>
      <Link href="#" appearance="subtle">
        Subtle internal
      </Link>
      <Link href="https://example.com" appearance="subtle" isExternal>
        Subtle external
      </Link>
      <div style={{ background: 'var(--neutral-800)', padding: '8px 12px' }}>
        <Link href="#" appearance="inverse">
          Inverse internal
        </Link>
      </div>
    </div>
  ),
};

/** Links live naturally inside body copy. */
export const InText: Story = {
  render: () => (
    <p style={{ fontFamily: 'var(--font-main)', fontSize: 14, lineHeight: '20px', maxWidth: 360 }}>
      Read the{' '}
      <Link href="https://example.com" isExternal>
        full report
      </Link>{' '}
      or jump to the <Link href="#summary">summary</Link> for the highlights.
    </p>
  ),
};

/**
 * CSS proof: the default link resolves to blue.500 (#2f68ff = rgb(47, 104, 255)).
 * If tokens.css failed to load in the preview, this resolves to a default and fails.
 */
export const CssCheck: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Link' });
    await expect(getComputedStyle(link).color).toBe('rgb(47, 104, 255)');
  },
};
