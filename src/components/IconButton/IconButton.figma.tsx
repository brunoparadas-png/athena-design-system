import figma from "@figma/code-connect"
import { IconButton } from "./IconButton"
import type { ButtonAppearance, ButtonSize } from "../Button"

figma.connect(
  IconButton,
  "https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=413-11601",
  {
    props: {
      appearance: figma.enum<ButtonAppearance>("appearance", {
        primary: "primary",
        neutral: "neutral",
        text: "text",
        danger: "danger",
      }),
      size: figma.enum<ButtonSize>("size", {
        default: "default",
        small: "small",
      }),
      isSelected: figma.boolean("isSelected"),
      isDisabled: figma.boolean("isDisabled"),
      icon: figma.instance("Icon"),
    },
    example: ({ appearance, size, isSelected, isDisabled }) => (
      <IconButton
        appearance={appearance}
        size={size}
        isSelected={isSelected}
        isDisabled={isDisabled}
        icon="edit"
        aria-label="Edit"
      />
    ),
  },
)
