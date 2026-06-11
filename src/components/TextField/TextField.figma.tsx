import React from "react";
import figma from "@figma/code-connect";
import { TextField } from "./TextField";

figma.connect(
  TextField,
  "https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=586-9784",
  {
    props: {
      label: figma.string("✏️ label"),
      placeholder: figma.string("✏️ placeholder"),
      isCompact: figma.boolean("isCompact"),
      isDisabled: figma.boolean("isDisabled"),
      isInvalid: figma.boolean("isInvalid"),
    },
    example: ({ label, placeholder, isCompact, isDisabled, isInvalid }) => (
      <TextField
        label={label}
        placeholder={placeholder}
        isCompact={isCompact}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
      />
    ),
  },
);
