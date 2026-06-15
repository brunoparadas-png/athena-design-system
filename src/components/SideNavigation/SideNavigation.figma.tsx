import figma from '@figma/code-connect'
import { SideNavigation } from './SideNavigation'

figma.connect(
  SideNavigation,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=406-3295',
  {
    // The Figma `Menu` variant (Alerts/Entries/Media/APages/Admin) only swaps
    // demo content — it has no code equivalent, so it is intentionally unmapped.
    props: {
      isCollapsed: figma.boolean('isCollapsed'),
    },
    example: ({ isCollapsed }) => (
      <SideNavigation
        isCollapsed={isCollapsed}
        appTitle="Huffpost Athena"
        activeItemId="alerts-all"
        sections={[
          {
            id: 'alerts',
            label: 'Alerts',
            icon: 'bell',
            items: [
              { id: 'alerts-all', label: 'All alerts', icon: 'bell' },
              { id: 'alerts-banners', label: 'Banners' },
            ],
          },
          {
            id: 'entries',
            label: 'Entries',
            icon: 'edit',
            items: [{ id: 'entries-drafts', label: 'Drafts' }],
          },
        ]}
        user={{ name: 'Jane Editor', email: 'jane@huffpost.com' }}
        onNavigate={id => console.log('navigate', id)}
        onToggleCollapse={() => {}}
        onUserMenuOpen={() => {}}
      />
    ),
  }
)
