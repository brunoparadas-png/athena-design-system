import figma from '@figma/code-connect'
import { Icon } from './Icon'

/**
 * The code `Icon` is a single name-driven component, but Figma has no single
 * "Icon" component — every glyph on the Figma "Icons" page (391:3458) is its own
 * symbol. So we connect each Figma icon symbol to `<Icon name="…" />`, one
 * `figma.connect` per icon, covering the curated code icon set.
 *
 * Most names match the Figma symbol exactly. The divergent ones are aliased to
 * the closest Figma symbol:
 *   check           → checkmark
 *   check-circle    → checkmark-circle
 *   warning         → exclamation-triangle
 *   settings        → gear-outlined
 *   more-horizontal → triple-dots
 *   edit            → pencil-edit
 *   diamond         → indicator-diamond
 *
 * `file` is intentionally omitted: it has no symbol on the Icons page (it lives
 * as a separate "Parts / File Icon" component).
 */

// ── chevrons ─────────────────────────────────────────────
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-235',
  { example: () => <Icon name="chevron-down" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-234',
  { example: () => <Icon name="chevron-up" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-233',
  { example: () => <Icon name="chevron-left" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-232',
  { example: () => <Icon name="chevron-right" /> }
)

// ── arrows ───────────────────────────────────────────────
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-45',
  { example: () => <Icon name="arrow-right" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-46',
  { example: () => <Icon name="arrow-left" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-47',
  { example: () => <Icon name="arrow-up" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-48',
  { example: () => <Icon name="arrow-down" /> }
)

// ── core actions ─────────────────────────────────────────
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-216',
  { example: () => <Icon name="close" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-219',
  { example: () => <Icon name="check" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-217',
  { example: () => <Icon name="add" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-218',
  { example: () => <Icon name="remove" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-169',
  { example: () => <Icon name="search" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-87',
  { example: () => <Icon name="trash" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-33',
  { example: () => <Icon name="edit" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-80',
  { example: () => <Icon name="external-link" /> }
)

// ── status ───────────────────────────────────────────────
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-230',
  { example: () => <Icon name="info" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-227',
  { example: () => <Icon name="warning" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-223',
  { example: () => <Icon name="check-circle" /> }
)

// ── files / media ────────────────────────────────────────
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-64',
  { example: () => <Icon name="image" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-205',
  { example: () => <Icon name="cloud-upload" /> }
)

// ── navigation / sections ────────────────────────────────
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-101',
  { example: () => <Icon name="bell" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-25',
  { example: () => <Icon name="book" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-212',
  { example: () => <Icon name="settings" /> }
)

// ── misc ─────────────────────────────────────────────────
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-103',
  { example: () => <Icon name="more-horizontal" /> }
)
figma.connect(
  Icon,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=70870-249',
  { example: () => <Icon name="diamond" /> }
)
