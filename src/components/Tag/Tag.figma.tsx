import React from 'react'
import { Tag } from './Tag'
import figma from '@figma/code-connect'

const sharedProps = {
  appearance: figma.enum('appearance', {
    gray: 'gray',
    green: 'green',
    magenta: 'red',
    purple: 'purple',
    blue: 'blue',
    orange: 'orange',
  }),
  text: figma.string('✏️ Text'),
}

figma.connect(
  Tag,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=410-10023',
  {
    variant: { isRemovable: 'False' },
    props: sharedProps,
    example: ({ appearance, text }) => (
      <Tag appearance={appearance}>{text}</Tag>
    ),
  },
)

figma.connect(
  Tag,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=410-10023',
  {
    variant: { isRemovable: 'True' },
    props: sharedProps,
    example: ({ appearance, text }) => (
      <Tag appearance={appearance} onRemove={() => {}}>{text}</Tag>
    ),
  },
)
