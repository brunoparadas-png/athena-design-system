import figma from "@figma/code-connect";
import { Checkbox } from "./Checkbox";

figma.connect(
  Checkbox,
  "https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=507-90021",
  {
    props: {
      label: figma.string("✏️ label"),
      isChecked: figma.boolean("isChecked"),
      isIndeterminate: figma.boolean("isIndeterminate"),
      isInvalid: figma.boolean("isInvalid"),
      isDisabled: figma.boolean("isDisabled"),
      isRequired: figma.boolean("isRequired"),
    },
    example: (props) => (
      <Checkbox
        label={props.label}
        isChecked={props.isChecked}
        isIndeterminate={props.isIndeterminate}
        isInvalid={props.isInvalid}
        isDisabled={props.isDisabled}
        isRequired={props.isRequired}
      />
    ),
  },
);
