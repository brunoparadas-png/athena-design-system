import React from "react";
import { Toggle } from "./Toggle";
import figma from "@figma/code-connect";

figma.connect(
  Toggle,
  "https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=671-5884",
  {
    props: {
      size: figma.enum("size", {
        default: "default",
        large: "large",
      }),
      isChecked: figma.boolean("isChecked"),
      isDisabled: figma.boolean("isDisabled"),
    },
    example: ({ size, isChecked, isDisabled }) => (
      <Toggle
        size={size}
        isChecked={isChecked}
        isDisabled={isDisabled}
        onChange={() => {}}
      />
    ),
  },
);
