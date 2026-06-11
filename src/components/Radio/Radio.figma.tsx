import React from "react"
import { Radio } from "./Radio"
import figma from "@figma/code-connect"

figma.connect(
  Radio,
  "https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=514-2154",
  {
    props: {
      label: figma.string("✏️ label"),
      isChecked: figma.boolean("isChecked"),
      isInvalid: figma.boolean("isInvalid"),
      isDisabled: figma.boolean("isDisabled"),
      isRequired: figma.boolean("isRequired"),
    },
    example: (props) => (
      <Radio
        label={props.label}
        isChecked={props.isChecked}
        isInvalid={props.isInvalid}
        isDisabled={props.isDisabled}
        isRequired={props.isRequired}
      />
    ),
  },
)
