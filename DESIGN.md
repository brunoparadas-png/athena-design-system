---
version: alpha
name: Athena
description: "An internal editorial tools suite for HuffPost built on the Athena Design System, with a deep forest green (#2e7061) primary accent across a white and light-gray canvas. The system serves the HuffPost newsroom — alerts, banners, push notifications, and content management — with a clean two-column layout: a collapsible sidebar for navigation and a focused body column for content and forms. Typography uses Inter throughout. The visual language is editorial-utilitarian: task-focused and undecorated, with the forest accent used sparingly to signal active states and primary actions, keeping the interface calm and scannable for fast-moving editorial workflows."

colors:
  teal:
    "25": "#f2fbfa"
    "50": "#e6f8f5"
    "100": "#ccf1ea"
    "200": "#9ee4d7"
    "300": "#68d5c2"
    "400": "#33c5ab"
    "500": "#00b796"
    "600": "#009c80"
    "700": "#008069"
    "800": "#006553"
    "900": "#004639"
  forest:
    "25": "#f4faf9"
    "50": "#e9f7f3"
    "100": "#ceeee6"
    "200": "#a1ded0"
    "300": "#6bc7b1"
    "400": "#40a08a"
    "500": "#2e7061"
    "600": "#255b4e"
    "700": "#1d443b"
    "800": "#152e28"
    "900": "#0d1c18"
  purple:
    "25": "#f9f5fe"
    "50": "#f4eafc"
    "100": "#e8d5f9"
    "200": "#d4aff4"
    "300": "#b085ee"
    "400": "#a557e8"
    "500": "#8e2de2"
    "600": "#7926c0"
    "700": "#63209e"
    "800": "#4e197c"
    "900": "#361156"
  blue:
    "25": "#f5f8ff"
    "50": "#eaf0ff"
    "100": "#d5e1ff"
    "200": "#b0c7ff"
    "300": "#86a9ff"
    "400": "#5989ff"
    "500": "#2f68ff"
    "600": "#285bd9"
    "700": "#214bb3"
    "800": "#1a3b8c"
    "900": "#122961"
  orange:
    "25": "#fef8f5"
    "50": "#fef0eb"
    "100": "#fce1d8"
    "200": "#fac7b5"
    "300": "#f7a090"
    "400": "#f48962"
    "500": "#f16b38"
    "600": "#cd5b32"
    "700": "#a94b29"
    "800": "#853b20"
    "900": "#5c2916"
  neutral:
    "0": "#ffffff"
    "25": "#fafafa"
    "50": "#f5f5f5"
    "100": "#e8e8e8"
    "200": "#d4d4d4"
    "300": "#b8b8b8"
    "400": "#a1a1a1"
    "500": "#737373"
    "600": "#525252"
    "700": "#3b3b3b"
    "800": "#252525"
    "900": "#141414"
  danger:
    "25": "#fff7f6"
    "50": "#ffece9"
    "100": "#ffd2cd"
    "200": "#ffa89f"
    "300": "#ff7e73"
    "400": "#ff5c4e"
    "500": "#fe3d2e"
    "600": "#e52f22"
    "700": "#c42419"
    "800": "#921a12"
    "900": "#5e100a"
    
  background:
    primary:
      weak: forest.50              
      weak.hovered: forest.100
      weak.pressed: forest.200
      default: forest.500          
      strong: forest.700           
      strong.hovered: forest.600
      strong.pressed: forest.700
      strongest: forest.900
    neutral:
      default: neutral.0
      weak: neutral.50             
      weak.hovered: neutral.100
      weak.pressed: neutral.200
      strong: neutral.300          
      strong.hovered: neutral.300
      strong.pressed: neutral.400
      strongest: neutral.500
      strongest.hovered: neutral.600
      strongest.pressed: neutral.700
      disabled: neutral.100
      inverse: neutral.900
    secondary:
      weak: blue.200
      default: blue.500           
      medium: blue.700
      strong: blue.900
    danger:
      weak: danger.100             
      default: danger.500          
      medium: danger.700
      strong: danger.900
      button: danger.700           # fill behind WHITE text — danger.500 is only 3.54:1 (fails AA); danger.700 is 5.81:1
      button.hovered: danger.800
      button.pressed: danger.900
    input:
      default: neutral.0
      hovered: teal.25
      focused: teal.50
      disabled: neutral.100
    tag:
      hover: rgba(neutral.900, 10%)
      pressed: rgba(neutral.900, 20%)

  text:
    primary:
      weak: forest.200
      default: forest.500          
      strong: forest.700           
      strongest: forest.800
    neutral:
      weak: neutral.500           
      default: neutral.600        
      strong: neutral.800          
      inverse: neutral.0          
      disabled: neutral.400
    secondary:
      weak: blue.200
      default: blue.500
      strong: blue.700
      strongest: blue.900
    danger:
      weak: danger.100
      default: danger.500         
      strong: danger.700
      strongest: danger.900
    link:
      default: blue.500
      hover: blue.700
      pressed: blue.800

  border:
    primary:
      weak: forest.200
      default: forest.500          
      strong: forest.700           
      strongest: forest.800
    neutral:
      weak: neutral.200           
      default: neutral.300         
      medium: neutral.500
      strong: neutral.600
      inverse: neutral.0
      disabled: neutral.300
    secondary:
      weak: blue.200
      default: blue.500
      strong: blue.700
      strongest: blue.900
    danger:
      weak: danger.100
      default: danger.500          
      strong: danger.700
      strongest: danger.900

  icon:
    primary:
      weak: forest.200
      default: forest.500          
      strong: forest.700
      strongest: forest.800
    neutral:
      inverse: neutral.0           
      weak: neutral.500
      default: neutral.600         
      strong: neutral.800
      disabled: neutral.400
    secondary:
      weak: blue.200
      default: blue.500
      strong: blue.700
      strongest: blue.900
    danger:
      weak: danger.100
      default: danger.500
      strong: danger.700
      strongest: danger.900
    link:
      default: blue.500
      hover: blue.700
      pressed: blue.800

typography:
  fontFamily:
    main: "Inter"
    code: "IBM Plex Mono"
  fontSize:
    2xs: 12px
    xs: 14px
    sm: 16px
    md: 18px
    lg: 20px
    xl: 24px
    2xl: 28px
    3xl: 32px
    4xl: 40px
    5xl: 48px
    6xl: 56px
  fontWeight:
    light: Light
    regular: Regular
    medium: Medium
    semibold: Semibold
    bold: Bold
    extrabold: Extrabold
  lineHeight:
    xxs: 16px
    xs: 20px
    sm: 24px
    md: 28px
    lg: 32px
    xl: 36px
    2xl: 40px
    3xl: 48px
    4xl: 56px
    5xl: 64px
  
    heading-xs:
      description: "Deep headings and for highlighting important pieces of information."
      fontFamily: "{typography.fontFamily.main}"
      fontSize: "{typography.fontSize.xs}"
      fontWeight: "{typography.fontWeight.bold}"
      lineHeight: "{typography.lineHeight.xs}"
    heading-sm:
      description: "Sub-section and field group headings."
      fontFamily: "{typography.fontFamily.main}"
      fontSize: "{typography.fontSize.sm}"
      fontWeight: "{typography.fontWeight.bold}"
      lineHeight: "{typography.lineHeight.xs}"
    heading-md:
      description: "Headings that identify key functionality."
      fontFamily: "{typography.fontFamily.main}"
      fontSize: "{typography.fontSize.lg}"
      fontWeight: "{typography.fontWeight.bold}"
      lineHeight: "{typography.lineHeight.sm}"
    heading-l:
      description: "Main titles, use only once per page."
      fontFamily: "{typography.fontFamily.main}"
      fontSize: "{typography.fontSize.xl}"
      fontWeight: "{typography.fontWeight.bold}"
      lineHeight: "{typography.lineHeight.md}"
    heading-xl:
      description: "Empty states and feature introductions. Top level headers."
      fontFamily: "{typography.fontFamily.main}"
      fontSize: "{typography.fontSize.2xl}"
      fontWeight: "{typography.fontWeight.bold}"
      lineHeight: "{typography.lineHeight.lg}"
    heading-xxl:
      description: "Oversized screen titles. Use in moderation."
      fontFamily: "{typography.fontFamily.main}"
      fontSize: "{typography.fontSize.3xl}"
      fontWeight: "{typography.fontWeight.bold}"
      lineHeight: "{typography.lineHeight.xl}"
      body-s:
      description: "Use primarily on help text under form fields and as secondary supporting text."
      fontFamily: "{typography.fontFamily.main}"
      fontSize: "{typography.fontSize.2xs}"
      fontWeight: "{typography.fontWeight.regular}"
      lineHeight: "{typography.lineHeight.xxs}"
    body-m:
      description: "Default body text. For longer-form content that is not part of the UI chrome."
      fontFamily: "{typography.fontFamily.main}"
      fontSize: "{typography.fontSize.xs}"
      fontWeight: "{typography.fontWeight.regular}"
      lineHeight: "{typography.lineHeight.xs}"
    body-l:
      description: "Long-form content. Use in generic paragraphs to contrast with headings."
      fontFamily: "{typography.fontFamily.main}"
      fontSize: "{typography.fontSize.sm}"
      fontWeight: "{typography.fontWeight.regular}"
      lineHeight: "{typography.lineHeight.sm}"

spacing:
  none: 0px
  3xs: 2px
  2xs: 4px
  xs: 6px
  base: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  2xl: 28px
  3xl: 32px
  4xl: 36px
  5xl: 40px
  6xl: 44px
  7xl: 48px
  8xl: 52px
  9xl: 56px
  10xl: 60px
  11xl: 64px

radius:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 9999px

borderWidth:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px

iconSize:
  2xs: 12px
  xs: 16px
  sm: 20px
  md: 24px
  lg: 28px
  xl: 32px
  2xl: 36px
  3xl: 40px
  4xl: 44px
  5xl: 48px
  6xl: 52px
  7xl: 56px
  8xl: 60px
  9xl: 64px

shadows:
  card: "0 1px 1px rgba(9,30,66,0.25), 0 0 0 1px rgba(9,30,66,0.08)"
  elevated: "0 4px 8px -2px rgba(9,30,66,0.25), 0 0 0 1px rgba(9,30,66,0.08)"
  overlay: "0 8px 16px -4px rgba(9,30,66,0.25), 0 0 0 1px rgba(9,30,66,0.06)"

components:
  button-primary:
    backgroundColor: "{colors.background.primary.default}"
    textColor: "{colors.text.neutral.inverse}"
    typography: "{typography.textStyles.body-m}"
    fontWeight: "{typography.fontWeight.semibold}"
    borderRadius: "{radius.none}"
    padding: "{spacing.xs} {spacing.sm}"
  button-neutral:
    backgroundColor: "{colors.background.neutral.default}"
    textColor: "{colors.text.neutral.default}"
    borderColor: "{colors.border.neutral.default}"
    typography: "{typography.textStyles.body-m}"
    fontWeight: "{typography.fontWeight.semibold}"
    borderRadius: "{radius.none}"
    padding: "{spacing.xs} {spacing.sm}"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.text.neutral.default}"
    typography: "{typography.textStyles.body-m}"
    fontWeight: "{typography.fontWeight.semibold}"
    borderRadius: "{radius.none}"
    padding: "{spacing.xs} {spacing.sm}"
  button-danger:
    backgroundColor: "{colors.background.danger.button}"
    textColor: "{colors.text.neutral.inverse}"
    typography: "{typography.textStyles.body-m}"
    fontWeight: "{typography.fontWeight.semibold}"
    borderRadius: "{radius.none}"
    padding: "{spacing.xs} {spacing.sm}"
  text-field:
    backgroundColor: "{colors.background.input.default}"
    borderColor: "{colors.border.neutral.default}"
    borderWidth: "1px"
    borderRadius: "{radius.none}"
    labelTypography: "{typography.textStyles.body-s}"
    labelFontWeight: "{typography.fontWeight.semibold}"
    labelColor: "{colors.text.neutral.default}"
    inputTypography: "{typography.textStyles.body-m}"
    placeholderColor: "{colors.text.neutral.weak}"
    messageTypography: "{typography.textStyles.body-s}"
    padding: "{spacing.base}"
  text-area:
    backgroundColor: "{colors.background.input.default}"
    borderColor: "{colors.border.neutral.default}"
    borderWidth: "1px"
    borderRadius: "{radius.none}"
    labelTypography: "{typography.textStyles.body-s}"
    labelFontWeight: "{typography.fontWeight.semibold}"
    labelColor: "{colors.text.neutral.default}"
    inputTypography: "{typography.textStyles.body-m}"
    placeholderColor: "{colors.text.neutral.weak}"
    messageTypography: "{typography.textStyles.body-s}"
    padding: "{spacing.base}"
  side-navigation:
    width: "280px"
    collapsedWidth: "56px"
    backgroundColor: "{colors.background.neutral.default}"
    borderRight: "1px {colors.border.neutral.weak}"
    header:
      logoBg: "{colors.background.primary.default}"
      titleTypography: "{typography.textStyles.body-l}"
      titleFontWeight: "{typography.fontWeight.bold}"
      titleColor: "{colors.text.neutral.strong}"
    section:
      separatorColor: "{colors.border.neutral.default}"
      headingTypography: "{typography.textStyles.body-m}"
      headingFontWeight: "{typography.fontWeight.semibold}"
      headingColor: "{colors.text.neutral.strong}"
      paddingY: "{spacing.xs}"
    nav-item:
      minHeight: "32px"
      paddingX: "{spacing.md}"
      paddingY: "{spacing.base}"
      typography: "{typography.textStyles.body-m}"
      fontWeight: "{typography.fontWeight.semibold}"
      color: "{colors.text.neutral.strong}"
      iconSize: "{iconSize.sm}"
      iconColor: "{colors.icon.neutral.default}"
    nav-item-active:
      backgroundColor: "{colors.background.primary.weak}"
      borderRight: "2px {colors.border.primary.strong}"
      fontWeight: "{typography.fontWeight.bold}"
      color: "{colors.text.primary.strong}"
      iconColor: "{colors.icon.primary.strong}"
    footer:
      separatorColor: "{colors.border.neutral.default}"
      avatarSize: "20px"
      avatarBg: "{colors.background.primary.default}"
      avatarColor: "{colors.text.neutral.inverse}"
      nameTypography: "{typography.textStyles.body-m}"
      nameFontWeight: "{typography.fontWeight.semibold}"
      nameColor: "{colors.text.neutral.default}"
      emailTypography: "{typography.textStyles.body-s}"
      emailColor: "{colors.text.neutral.weak}"
  table-header:
    backgroundColor: "{colors.background.neutral.weak}"
    minHeight: "40px"
    paddingX: "{spacing.xl}"
    paddingY: "{spacing.2xs}"
    typography: "{typography.textStyles.body-s}"
    fontWeight: "{typography.fontWeight.bold}"
    color: "{colors.text.neutral.default}"
  table-cell:
    borderBottom: "1px {colors.border.neutral.default}"
    minHeight: "40px"
    paddingX: "{spacing.xl}"
    paddingY: "{spacing.base}"
    typography: "{typography.textStyles.body-m}"
    fontWeight: "{typography.fontWeight.regular}"
    color: "{colors.text.neutral.default}"
    subheadingFontFamily: "{typography.fontFamily.code}"
    subheadingTypography: "{typography.textStyles.body-s}"
    subheadingColor: "{colors.text.neutral.default}"

---

## Overview
Athena is HuffPost's internal editorial tooling suite — a CMS built for the newsroom. The base canvas is **pure white** (`{colors.neutral.0}` — #ffffff) with near-black charcoal ink (`{colors.neutral.900}` — #141414) for body and headings, and light neutral surfaces (`{colors.neutral.25}` — #fafafa, `{colors.neutral.50}` — #f5f5f5) for page backgrounds and panel differentiation. A single deep **forest green** (`{colors.forest.500}` — #2e7061) carries every primary CTA, active navigation state, toggle-on state, checkbox-checked state, and the brand logomark. No secondary brand color — the remaining palettes (teal, purple, blue, orange) are reserved for semantic or categorical use, not decoration.

Type runs **Inter** (`{typography.fontFamily.main}`) throughout, with **IBM Plex Mono** (`{typography.fontFamily.code}`) for any code or technical content. Body text sits at 14px (`{typography.fontSize.xs}`) at regular weight — a deliberate density choice suited to editorial workflows where users scan long lists and dense forms. Page titles step up to 20–24px (`{typography.fontSize.lg}` / `{typography.fontSize.xl}`) at semibold. There is no display font or heavy marketing weight — the system trusts layout structure, not typographic muscle, to create hierarchy.

The shape language is **sharp**. Buttons, input fields, text areas, and section panels all use zero border radius — every interactive container is a hard rectangle. Toggles are the only fully rounded element (`{radius.pill}`), and avatar/icon marks use a near-pill circle. The absence of corner softening gives the interface a precise, editorial quality — closer to a print layout sensibility than a typical rounded consumer tool.

**Key Characteristics:**
- Single accent: `{colors.forest.500}` (#2e7061) on all interactive active states, primary buttons, toggles, checkboxes, and the "H" brand mark. Used sparingly — most surfaces are neutral with one forest moment per view.
- Active nav state uses `{colors.forest.25}` (#f4faf9) as a tint background with a `{colors.forest.700}` (#1d443b) left border — the only surface-level color departure in the sidebar.
- Two-column shell: a collapsible sidebar for global navigation with grouped, expandable sections, and a centered body column with a persistent page header carrying breadcrumb context and a primary action button.
- Inter at 14px body with 8px base spacing (`{spacing.base}`) — dense enough for list-heavy editorial workflows without feeling cramped.
- Status tags use small pill-shaped badges to categorize content type (e.g. "Push Alert", "Site Banner") — the primary scanning aid on list views.
- Danger feedback (`{colors.danger.600}` — #e52f22) appears inline at the field level; no full-page error states.
- Elevation is minimal — one shadow tier for cards and overlaid panels; flat surfaces dominate.

## Color System

### Brand & Accent
- **Primary** : `{colors.forest.500}` - `#2e7061` - CTAs, toggles, checkboxes, and the "H" logomark. The single green accent — never decorative.
- **Active nav** : `{colors.forest.50}` - `#e9f7f3` - Background tint of the selected nav item.

### Surface
- **Canvas** : `{colors.neutral.0}` - `#ffffff` - Default surface for content, forms, and modals.
- **Background** : `{colors.neutral.50}` - `#f5f5f5` - Page-level background behind content panels.

### Text
- **Primary** : `{colors.neutral.900}` - `#141414` - Headings and page titles.
- **Body** : `{colors.neutral.800}` - `#252525` - Labels and body copy.
- **Secondary** : `{colors.neutral.600}` - `#525252` - Supporting metadata and helper text.
- **Disabled** : `{colors.neutral.400}` - `#a1a1a1` - Placeholder text and disabled states.
- **Link** : `{colors.blue.500}` - `#2f68ff` - Inline hyperlinks.

### Semantic
- **Error** : `{colors.danger.600}` - `#e52f22` - Validation errors and destructive actions.
- **Success**: `{colors.danger.600}` - `#e52f22` - Validation errors and destructive actions.

### Rules

1. **One green moment per view.** Forest.500 on the primary CTA or the active nav — not both.
2. **Forest is interactive/brand only.** Never apply it to decorative or categorical elements.
3. **Neutral dominates.** White and near-white surfaces account for 90%+ of any view.
4. **Danger is field-scoped.** Never used as a banner or global state indicator.
5. **Secondary palettes label, not decorate.** Blue, orange, and purple signal category meaning only.

## Typography
The system runs **Inter** for everything — display, body, navigation, captions, microcopy.

- **Default body** is `body-m` — 14px regular, 20px line height. Most UI text (form labels, list content, metadata) lives at this size. Drop to `body-s` for secondary/help text; step up to `body-l` only for longer prose passages.
- **Headings are always bold** (700). Never use semibold or regular for heading styles — weight consistency is what creates the visual hierarchy between headings and body text.
- **Sentence case throughout.** Page titles, section headings, labels, nav items, and button labels all use sentence case. Title case only appears in proper nouns.
- **No decorative type.** There are no display sizes, no italic, no underline outside of links, and no letter-spacing adjustments. Hierarchy comes from size and weight only.

**Rules**
1. Use `heading-l` once per page — for the main page title. Use `heading-md` or `heading-sm` for section and group headings within the page.
2. Never skip heading levels for visual effect. `heading-xs` → `heading-sm` → `heading-md` → `heading-l` follow a logical document structure.
3. `heading-xl` and `heading-xxl` are for empty states and feature introductions only — not regular page content.
4. Body text defaults to `{typography.fontWeight.regular}`. Use `semibold` only for emphasis within body copy (e.g. an inline label or a row action), never for full paragraphs.
5. Line length for body copy should stay between 60–80 characters. The 726px body column with `body-m` at 14px naturally falls in this range — don't override it.

## Components

### Button
Two sizes: **default** (32px) and **small** (24px).
- `{button-primary}` — The main CTA. Use once per view.
- `{button-neutral}` — Secondary actions alongside a primary, or standalone low-emphasis actions.
- `{button-text}` — Tertiary actions and inline controls where a filled button would be too heavy.
- `{button-danger}` — Destructive actions (delete, remove, revoke). Always pair with a confirmation step. Filled with `{colors.background.danger.button}` (danger.700, not danger.500) so white label text meets AA contrast.

### Text Field
Two sizes: **default** and **compact**.
- `{components.text-field}` — Single-line input for short structured values (name, URL, title). Includes a semibold label above and optional helper/error message below.

### Text Area
Two sizes: **default** and **compact**. Supports a **monospaced** variant for code or technical content.
- `{components.text-area}` — Multi-line input for longer free-form content (bio, description, notes).

### Side Navigation
Two states: **expanded** (280px) and **collapsed** (56px).
- `{components.side-navigation}` — Global navigation shell. Always visible on the left edge; never scrolls off-screen.

**Structure (top to bottom):**
1. **Header** — Forest.500 logo mark (24px square) + "Huffpost Athena" app title + collapse/expand toggle icon. Collapsed state shows logo only.
2. **Nav sections** — Each section opens with a 1px `{colors.border.neutral.default}` separator. A heading item (icon + label + optional action badge + collapse chevron) expands or collapses its child items below it. Child items are indented to 48px left padding.
3. **Footer** — Pinned to the bottom. Shows a user avatar (initials in a `{colors.background.primary.default}` pill, 20px) + full name (semibold) + email (12px, `{colors.text.neutral.weak}`) + overflow menu icon. Collapsed state shows only the avatar.

**Active item** — `{components.side-navigation.nav-item-active}`: `{colors.background.primary.weak}` (#e9f7f3) fill + 2px right border `{colors.border.primary.strong}` (#1d443b). Text and icon shift to `{colors.text.primary.strong}` bold. Only leaf child items carry the active state — section headings never do.

**Collapsed behavior** — 56px wide; icons only, centered. All labels, the app title, and the user email are hidden entirely (never truncated with ellipsis). The active icon item retains its forest tint and 2px border. An overlay pill button at the top-right lets users expand the sidebar.

**Rules**
1. Only one active item across all sections at any time — single forest moment in the nav.
2. Section headings collapse/expand their children; they are not navigable links and do not carry an active state.
3. Collapsed mode hides all text — never use truncation or tooltips as a substitute for the expanded label.
4. The 2px `{colors.border.primary.strong}` right border on the active item is the only colored border in the sidebar.

### Table

- `{components.table-header}` — Column header cell. `neutral.weak` (#f5f5f5) background, 12px bold, `{colors.text.neutral.default}`. Min height 40px, 24px horizontal padding.
- `{components.table-cell}` — Data cell. 1px `{colors.border.neutral.default}` bottom border. Min height 40px, 24px horizontal padding.

**Cell `appearance` prop:**
- `text` — Default. Primary label at 14px regular. Accepts an optional `subheading` line in IBM Plex Mono 12px below it.
- `tag` — Status tag in place of the label: `teal.100` background, `teal.500` border, `teal.700` text, 12px semibold, 20px height.
- `action` — Icon-only cell for row-level actions (16px icons, no label). Use `actions=1` or `actions=2` to control icon count.

## Spacing & Layout

Task-dense editorial tool. Every gap is purposeful — list rows are compact, form columns are narrow, nothing decorates.

### Shell
- **Two-column**: 280px fixed sidebar + 1160px body. Content centers at **726px wide** inside the body, with equal 217px margins on each side.
- **Viewport**: designed at 1440px. The 726px column lands at 60–80 chars of body-m at 14px — no override needed.
- **Page background**: `{colors.neutral.50}` (#f5f5f5) behind both columns; sidebar and content panels sit on `{colors.neutral.0}` white.

### Page header
- Fixed at the top of the body column, **64px tall**.
- Top row: breadcrumb trail in `body-s`, `{colors.text.neutral.weak}` — hierarchy signal, zero visual weight.
- Bottom row: page title in `heading-l` (24px bold) + primary action button(s) pinned to the right edge of the 726px column.
- Gap from header bottom to first content block: `{spacing.md}` 16px.

### List pages
- **Filter / tab bar**: 32px tall, `{spacing.md}` 16px below the header. Pill or text-button filters with `{spacing.base}` 8px gap between siblings.
- **Gap from filter bar to list**: `{spacing.md}` 16px.
- **Table header row**: 40px tall, `{colors.background.neutral.weak}` fill, `body-s` bold label at `{spacing.xl}` 24px left padding.
- **List rows**: minimum 40px; multi-line content rows expand naturally. Internal layout: status tag 16px from row top + 24px from left edge, primary text below, metadata (12px, `{colors.text.neutral.weak}`) below that. Left/right padding: `{spacing.xl}` 24px. 1px `{colors.border.neutral.default}` separator between rows.
- **Toggle / action controls**: pinned to the right edge of the row.

### Form pages
- **Field stack**: single column at 726px, fields gap at `{spacing.md}` 16px vertically.
- **Two-column grid**: paired fields (e.g. Twitter + Facebook) split the 726px width into two equal columns with a `{spacing.md}` 16px gutter between them.
- **Section heading → first field**: `{spacing.base}` 8px gap.
- **Between sections**: `{spacing.3xl}` 32px top padding on the incoming section heading; a 1px `{colors.border.neutral.default}` divider line precedes each new section.
- **Labels live inside the field component** — never place a freestanding label above a field as a separate layout element.

### Rules
1. **726px is the content width hardcap.** Form fields, list tables, and content panels never stretch to fill the full body.
2. **16px is the default inter-block gap.** Header → filters, filters → list, field → field, and button rows all use `{spacing.md}`.
3. **24px horizontal cell padding on all list rows and table cells.** Don't reduce it for density.
4. **No decorative whitespace.** Don't add padding to a section just to add breathing room — if the grid is right, the spacing takes care of itself.

## Accessibility

### Contrast
- Body and heading text must use `neutral.800` or darker on white surfaces.
- Secondary and supporting text must use `neutral.600` or darker.
- `neutral.400` and lighter are reserved for disabled labels and placeholder text — never for functional text.
- Error text must appear at `body-m` semibold or bolder, or use `danger.700` at regular weight.
- Borders and dividers are decorative — never use a neutral border as the sole visual indicator of an interactive element.

### Focus
- All interactive elements must expose a visible focus ring.
- Use a **2px `forest.500` outline, offset 2px** when the browser default is removed or insufficient.
- Never suppress `outline` without providing an equivalent custom indicator.
- Tab order must follow reading order: sidebar before body column, header before content, top-to-bottom within each region.

### Target sizes
- Minimum interactive target height: **32px**.
- Icon-only actions must carry an `aria-label` or visually-hidden text label.

### Color independence
- Never use color as the sole conveyor of state — always pair it with a second signal (text, icon, border, or pattern).
- Error fields require both a danger border and an inline error message.
- Disabled elements must have both reduced color and a `disabled` attribute.

### Type
- **12px (`body-s`) is the minimum size.** Never go smaller.
- At 12px, only semibold or bold weight is acceptable at regular contrast levels.

## Do's and Don'ts

### Do
- Use `{colors.forest.500}` (`#2e7061`) for **one primary CTA per view** — a page header Save/Create button or a modal confirm. Never two forest CTAs on screen at once.
- Keep `forest.500` strictly interactive/brand: primary buttons, toggles-on, checkboxes-checked, the logo mark, and the active nav tint. That's the full list.
- Apply `{radius.none}` to every interactive container — buttons, inputs, text areas, dropdowns, and section panels are all hard rectangles.
- Set all visible text in **sentence case**: page titles, section headings, field labels, nav items, button labels, table headers.
- Use `heading-l` exactly once per page for the main title. Use `heading-md` or `heading-sm` for section headings within the page.
- Keep all content within the **726px column**. Form fields, tables, and panels all share this constraint.
- Use `neutral.50` (#f5f5f5) as the page background. Content panels, the sidebar, and forms sit on `neutral.0` white.
- Pair every status tag with a visible text label — color fill alone is not enough.
- Show error state with both a `{colors.border.danger.default}` field border **and** an inline error message below the field.
- Use `IBM Plex Mono` only for code or technical string content. Inter everywhere else.

### Don't
- Don't place a second `forest.500` primary button on the same view. Use `button-neutral` or `button-text` for secondary actions.
- Don't use `forest.500` decoratively — never as a background band, highlight, or illustration accent.
- Don't use teal, purple, blue, or orange for UI chrome or decoration — these palettes are reserved for semantic and categorical meaning only.
- Don't round buttons, inputs, cards, or panels. Toggles are the only pill-shaped element.
- Don't use all-caps text. Sentence case is the voice throughout; uppercase is for rare abbreviations only.
- Don't use `heading-xl` or `heading-xxl` for regular page content — they are for empty states and feature introductions only.
- Don't use `neutral.400` or lighter for any functional text — it is reserved for disabled labels and placeholder text.
- Don't put primary navigation or page-level CTAs inside the sidebar — the sidebar is global navigation only.
- Don't introduce font sizes outside the defined scale or weights outside the defined set.

