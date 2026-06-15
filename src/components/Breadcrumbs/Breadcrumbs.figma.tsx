import figma from '@figma/code-connect'
import { Breadcrumbs } from './Breadcrumbs'

figma.connect(
  Breadcrumbs,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=515-9126',
  {
    props: {},
    example: () => (
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Articles', href: '/articles' },
          { label: 'Current page' },
        ]}
      />
    ),
  }
)
