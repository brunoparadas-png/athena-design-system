import figma from '@figma/code-connect';
import { Accordion } from './Accordion';

figma.connect(
  Accordion,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70920-11',
  {
    props: {
      defaultExpanded: figma.boolean('isExpanded'),
      icon: figma.boolean('hasIcon', { true: 'settings', false: undefined }),
    },
    example: ({ defaultExpanded, icon }) => (
      <Accordion title="Advanced Settings" icon={icon} defaultExpanded={defaultExpanded}>
        <p>Slot content</p>
      </Accordion>
    ),
  },
);
