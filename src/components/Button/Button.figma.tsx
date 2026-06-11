import React from "react";
import { Button } from "./Button";
import figma from "@figma/code-connect";

figma.connect(
  Button,
  "https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=31-2137",
  {
    props: {
      appearance: figma.enum("appearance", {
        primary: "primary",
        neutral: "neutral",
        text: "text",
        danger: "danger",
      }),
      size: figma.enum("size", {
        medium: "default",
        small: "small",
      }),
      isSelected: figma.boolean("isSelected"),
      isDisabled: figma.boolean("isDisabled"),
      children: figma.string("✏️ label"),
    },
    example: ({ appearance, size, isSelected, isDisabled, children }) => (
      <Button
        appearance={appearance}
        size={size}
        isSelected={isSelected}
        isDisabled={isDisabled}
      >
        {children}
      </Button>
    ),
  },
);
