import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from './Table';
import { Tag } from '../Tag';
import { IconButton } from '../IconButton';

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A data table built from native <table> semantics. Compose it from TableHead / TableBody / TableRow with TableHeaderCell (the neutral-weak column header) and TableCell. Cells come in three appearances — `text` (label, optional leading media and a mono subheading), `tag` (a status Tag), and `action` (trailing icon controls). Sharp corners; 40px row height; semantic neutral tokens throughout.',
      },
    },
  },
  argTypes: {
    isRowHoverable: { control: 'boolean' },
  },
  args: { isRowHoverable: false, children: null },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Mirrors the Figma "❖ Table" ready-made: four text columns + a trailing actions column. */
export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Title</TableHeaderCell>
          <TableHeaderCell>Title</TableHeaderCell>
          <TableHeaderCell>Title</TableHeaderCell>
          <TableHeaderCell>Title</TableHeaderCell>
          <TableHeaderCell align="end" width="96px">
            Actions
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>Cell label</TableCell>
            <TableCell>Cell label</TableCell>
            <TableCell>Cell label</TableCell>
            <TableCell>Cell label</TableCell>
            <TableCell appearance="action">
              <IconButton icon="edit" appearance="text" size="small" aria-label="Edit row" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** A richer table: leading media + mono subheading, a status Tag, and two trailing actions. */
export const RichCells: Story = {
  args: { isRowHoverable: true },
  render: (args) => (
    <Table {...args}>
      <TableHead>
        <TableRow>
          <TableHeaderCell width="320px">Article</TableHeaderCell>
          <TableHeaderCell>Author</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell align="end" width="112px">
            Actions
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[
          { title: 'The Future of Local News', slug: '/the-future-of-local-news', author: 'Jane Doe', status: 'Published', tone: 'green' as const },
          { title: 'Election Coverage 2026', slug: '/election-coverage-2026', author: 'Sam Rivera', status: 'Draft', tone: 'gray' as const },
          { title: 'Op-Ed: Climate Policy', slug: '/op-ed-climate-policy', author: 'A. Patel', status: 'In review', tone: 'orange' as const },
        ].map((row) => (
          <TableRow key={row.slug}>
            <TableCell subheading={row.slug}>{row.title}</TableCell>
            <TableCell>{row.author}</TableCell>
            <TableCell appearance="tag">
              <Tag appearance={row.tone}>{row.status}</Tag>
            </TableCell>
            <TableCell appearance="action">
              <IconButton icon="edit" appearance="text" size="small" aria-label={`Edit ${row.title}`} />
              <IconButton icon="trash" appearance="text" size="small" aria-label={`Delete ${row.title}`} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** Verifies the structural tokens: header fill, cell border, text color, and row height. */
export const CssCheck: Story = {
  parameters: { docs: { disable: true } },
  render: () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Title</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Cell label</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  play: async ({ canvas }) => {
    // Header: neutral-weak fill (#f5f5f5), bold 12px neutral-default text.
    const header = canvas.getByRole('columnheader', { name: 'Title' });
    const hStyle = getComputedStyle(header);
    await expect(hStyle.backgroundColor).toBe('rgb(245, 245, 245)');
    await expect(hStyle.fontWeight).toBe('700');
    await expect(hStyle.fontSize).toBe('12px');
    await expect(hStyle.color).toBe('rgb(82, 82, 82)');

    // Cell: 1px neutral-default bottom border, 14px neutral-default text, 40px row.
    const cell = canvas.getByRole('cell', { name: 'Cell label' });
    const cStyle = getComputedStyle(cell);
    await expect(cStyle.borderBottomWidth).toBe('1px');
    await expect(cStyle.borderBottomColor).toBe('rgb(184, 184, 184)');
    await expect(cStyle.fontSize).toBe('14px');
    await expect(cStyle.color).toBe('rgb(82, 82, 82)');
    await expect(cStyle.height).toBe('40px');
  },
};
