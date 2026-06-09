import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { PageHeader } from './PageHeader';
import { Breadcrumbs } from '../Breadcrumbs';
import { Button } from '../Button';
import { TextField } from '../TextField';

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Defines the top of a page with its title and, optionally, breadcrumbs, actions, and a search or filter bar.',
      },
    },
  },
  argTypes: {
    truncateTitle: { control: 'boolean' },
    headingLevel: { control: 'inline-radio', options: [1, 2, 3] },
  },
  args: { children: 'Title' },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const crumbs = (
  <Breadcrumbs
    items={[{ label: 'Item', href: '#' }, { label: 'Item', href: '#' }, { label: 'Item' }]}
  />
);

const actions = (
  <>
    <Button appearance="primary">Primary Action</Button>
    <Button appearance="neutral">Secondary</Button>
    <Button appearance="neutral" iconBefore="more-horizontal" aria-label="More actions" />
  </>
);

const bottomBar = (
  <>
    <TextField aria-label="Search" placeholder="Placeholder" iconBefore="search" isCompact />
    <Button appearance="neutral">Filter</Button>
  </>
);

/** The full Figma example — breadcrumbs, title, actions, and a search/filter bar. */
export const Default: Story = {
  args: { breadcrumbs: crumbs, actions, bottomBar },
};

/** Just a title — the minimum. */
export const TitleOnly: Story = {};

/** Title with right-aligned actions, no breadcrumbs or bottom bar. */
export const WithActions: Story = {
  args: { actions },
};

/** Breadcrumbs + title, no actions. */
export const WithBreadcrumbs: Story = {
  args: { breadcrumbs: crumbs },
};

/** A long title truncates to one line with an ellipsis. */
export const TruncatedTitle: Story = {
  args: {
    truncateTitle: true,
    actions,
    children: 'A very long page title that should be truncated with an ellipsis when it overflows',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 520 }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * CSS proof: the title resolves to neutral.800 (#252525 = rgb(37, 37, 37)) at
 * 24px bold. If tokens.css failed to load this falls back and fails.
 */
export const CssCheck: Story = {
  args: { children: 'Title' },
  play: async ({ canvas }) => {
    const title = canvas.getByRole('heading', { level: 1, name: 'Title' });
    const cs = getComputedStyle(title);
    await expect(cs.color).toBe('rgb(37, 37, 37)');
    await expect(cs.fontSize).toBe('24px');
  },
};
