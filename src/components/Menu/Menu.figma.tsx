import React from 'react'
import { Menu } from './Menu'
import figma from '@figma/code-connect'

figma.connect(
  Menu,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=113-839',
  {
    props: {},
    example: () => (
      <Menu
        items={[
          { id: 'edit', label: 'Edit', iconBefore: 'pencil' },
          { id: 'duplicate', label: 'Duplicate', iconBefore: 'copy' },
          { type: 'separator' },
          { id: 'delete', label: 'Delete', iconBefore: 'trash' },
        ]}
        onSelect={id => console.log('selected', id)}
      />
    ),
  },
)
