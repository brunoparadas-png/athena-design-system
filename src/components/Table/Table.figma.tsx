import figma from '@figma/code-connect';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from './Table';

// Column header cell — Figma "Parts / <Header>".
figma.connect(
  TableHeaderCell,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=409-4649',
  {
    props: {
      label: figma.string('label'),
    },
    example: ({ label }) => <TableHeaderCell>{label}</TableHeaderCell>,
  },
);

// Data cell — Figma "Parts / <Cell>" (appearance text | tag | action).
figma.connect(
  TableCell,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=409-4656',
  {
    props: {
      appearance: figma.enum('appearance', {
        text: 'text',
        tag: 'tag',
        action: 'action',
      }),
      label: figma.string('label'),
    },
    example: ({ appearance, label }) => <TableCell appearance={appearance}>{label}</TableCell>,
  },
);

// Ready-made full table — Figma "❖ Table" (node 525:6408).
figma.connect(
  Table,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=525-6408',
  {
    example: () => (
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Title</TableHeaderCell>
            <TableHeaderCell align="end">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Cell label</TableCell>
            <TableCell appearance="action">{/* IconButton(s) */}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
  },
);
