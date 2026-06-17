import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
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
import { Icon, type IconName } from '../Icon';

/** Real Table props plus story-only knobs for generating the demo grid. */
type TableStoryArgs = ComponentProps<typeof Table> & { columns: number; rows: number };

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs', 'ai-generated'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A data table built from native <table> semantics. Compose it from TableHead / TableBody / TableRow with TableHeaderCell (the neutral-weak column header) and TableCell. There are exactly three cell appearances — `text` (a label, with an optional leading media node and a mono subheading), `tag` (a status Tag), and `action` (trailing icon controls). The number of columns is whatever you render — drive it from your data. Sharp corners; 40px row height; semantic neutral tokens throughout.',
      },
    },
  },
  argTypes: {
    columns: {
      control: { type: 'number', min: 1, max: 8 },
      description: 'Story-only: how many text columns to render before the Status and Actions columns.',
    },
    rows: { control: { type: 'number', min: 1, max: 12 } },
    isRowHoverable: { control: 'boolean' },
  },
  args: { columns: 3, rows: 4, isRowHoverable: false, children: null },
} satisfies Meta<TableStoryArgs>;

export default meta;
type Story = StoryObj<TableStoryArgs>;

/** A 24px clickable icon for the `action` cell (Figma action cells host bare icons). */
function ActionIcon({ icon, label }: { icon: IconName; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-0 text-[var(--text-neutral-default)] hover:text-[var(--text-primary-strong)]"
    >
      <Icon name={icon} size={24} />
    </button>
  );
}

/**
 * The configurable table. Use the `columns` control to add or remove text
 * columns; the trailing Status (tag) and Actions columns demonstrate the other
 * two cell appearances.
 */
export const Playground: Story = {
  render: ({ columns, rows, ...args }) => {
    const statuses = [
      { label: 'Published', tone: 'green' as const },
      { label: 'Draft', tone: 'gray' as const },
      { label: 'In review', tone: 'orange' as const },
    ];
    return (
      <Table {...args}>
        <TableHead>
          <TableRow>
            {Array.from({ length: columns }).map((_, c) => (
              <TableHeaderCell key={c}>Title</TableHeaderCell>
            ))}
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell align="end" width="112px">
              Actions
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, r) => (
            <TableRow key={r}>
              {Array.from({ length: columns }).map((_, c) => (
                <TableCell key={c}>Cell label</TableCell>
              ))}
              <TableCell appearance="tag">
                <Tag appearance={statuses[r % statuses.length].tone}>
                  {statuses[r % statuses.length].label}
                </Tag>
              </TableCell>
              <TableCell appearance="action">
                <ActionIcon icon="edit" label={`Edit row ${r + 1}`} />
                <ActionIcon icon="trash" label={`Delete row ${r + 1}`} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
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

    // Cell: 1px neutral-weak bottom border, 14px neutral-default text, 40px row.
    const cell = canvas.getByRole('cell', { name: 'Cell label' });
    const cStyle = getComputedStyle(cell);
    await expect(cStyle.borderBottomWidth).toBe('1px');
    await expect(cStyle.borderBottomColor).toBe('rgb(212, 212, 212)');
    await expect(cStyle.fontSize).toBe('14px');
    await expect(cStyle.color).toBe('rgb(82, 82, 82)');
    await expect(cStyle.height).toBe('40px');
  },
};
