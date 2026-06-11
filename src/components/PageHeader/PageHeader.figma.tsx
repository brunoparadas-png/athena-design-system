import React from "react"
import figma from "@figma/code-connect"
import { PageHeader } from "./PageHeader"

figma.connect(
  PageHeader,
  "https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=515-10093",
  {
    props: {
      breadcrumbs: figma.instance("breadcrumbs"),
      actions: figma.instance("actions"),
      bottomBar: figma.instance("bottomBar"),
    },
    example: ({ breadcrumbs, actions, bottomBar }) => (
      <PageHeader
        breadcrumbs={breadcrumbs}
        actions={actions}
        bottomBar={bottomBar}
      >
        Page Title
      </PageHeader>
    ),
  },
)
