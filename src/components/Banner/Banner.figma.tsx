import figma from '@figma/code-connect'
import { Banner } from './Banner'

figma.connect(
  Banner,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=679-1301',
  {
    props: {
      appearance: figma.enum('appearance', {
        info: 'info',
        error: 'error',
      }),
    },
    example: ({ appearance }) => (
      <Banner appearance={appearance}>Your message here.</Banner>
    ),
  },
)
