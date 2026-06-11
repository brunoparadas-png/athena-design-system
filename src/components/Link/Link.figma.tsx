import React from "react"
import figma from "@figma/code-connect"
import { Link } from "./Link"

figma.connect(
  Link,
  "https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=76-1252",
  {
    props: {
      appearance: figma.enum("appearance", {
        default: "default",
        subtle: "subtle",
        inverse: "inverse",
      }),
      isExternal: figma.enum("target", {
        outside: true,
        internal: false,
      }),
      children: figma.string("✏️ label"),
    },
    example: ({ appearance, isExternal, children }) => (
      <Link
        href="#"
        appearance={appearance}
        isExternal={isExternal}
      >
        {children}
      </Link>
    ),
  },
)
