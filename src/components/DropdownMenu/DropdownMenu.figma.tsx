import { DropdownMenu } from "./DropdownMenu";
import figma from "@figma/code-connect";

figma.connect(
  DropdownMenu,
  "https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=677-6012",
  {
    props: {
      triggerType: figma.enum("trigger", {
        Button: "button",
        Icon: "icon",
      }),
      buttonSpacing: figma.enum("<Button> spacing", {
        Default: "default",
        Compact: "compact",
      }),
      placement: figma.enum("placement", {
        "bottom-start": "bottom-start",
        "bottom-end": "bottom-end",
      }),
      spacing: figma.enum("spacing", {
        Default: "default",
        Compact: "compact",
      }),
    },
    example: (props) => (
      <DropdownMenu
        triggerType={props.triggerType}
        triggerLabel="Options"
        buttonSpacing={props.buttonSpacing}
        placement={props.placement}
        spacing={props.spacing}
        items={[
          { id: "edit", label: "Edit" },
          { id: "duplicate", label: "Duplicate" },
          { type: "separator" },
          { id: "delete", label: "Delete" },
        ]}
      />
    ),
  },
);
