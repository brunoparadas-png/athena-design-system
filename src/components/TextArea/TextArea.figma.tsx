import React from 'react'
import figma from '@figma/code-connect'
import { TextArea } from './TextArea'

figma.connect(
  TextArea,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=32-1639',
  {
    props: {
      isCompact: figma.boolean('isCompact'),
      isDisabled: figma.boolean('isDisabled'),
      isInvalid: figma.boolean('isInvalid'),
      isMonospaced: figma.boolean('isMonospaced'),
    },
    example: ({ isCompact, isDisabled, isInvalid, isMonospaced }) => (
      <TextArea
        label="Description"
        placeholder="Enter text…"
        isCompact={isCompact}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        isMonospaced={isMonospaced}
      />
    ),
  },
)
