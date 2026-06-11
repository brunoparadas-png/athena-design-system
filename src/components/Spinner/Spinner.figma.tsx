import { Spinner } from "./Spinner";
import figma from "@figma/code-connect";

figma.connect(
  Spinner,
  "https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=832-4816",
  {
    props: {
      size: figma.enum("size", {
        xsmall: "xsmall",
        small: "small",
        medium: "medium",
        large: "large",
        xlarge: "xlarge",
      }),
    },
    example: ({ size }) => <Spinner size={size} />,
  },
);
