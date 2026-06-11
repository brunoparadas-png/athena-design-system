import React from "react"
import figma from "@figma/code-connect"
import { ProgressBar } from "./ProgressBar"

figma.connect(
  ProgressBar,
  "https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=703-13482",
  {
    props: {
      appearance: figma.enum("type", {
        "Progress bar": "default",
        "Success progress bar": "success",
        "Transparent progress bar": "inverse",
      }),
    },
    example: ({ appearance }) => (
      <ProgressBar
        value={0.6}
        appearance={appearance}
        label="Loading progress"
      />
    ),
  },
)
