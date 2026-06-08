# Athena Design System

Design tokens, components, and AI-consumable metadata for **Athena** — HuffPost's
internal editorial tooling suite. Built on Inter, a 4px-ish spacing grid, sharp
(zero-radius) shapes, and a single deep **forest green** (`#2e7061`) accent on an
otherwise white/neutral canvas.

Storybook is the development surface and the living documentation.

## Quick start

```bash
npm install
npm run storybook        # dev surface at http://localhost:6006
```

| Script | What it does |
|---|---|
| `npm run storybook` / `npm run dev` | Start Storybook on :6006 |
| `npm run build-storybook` | Static Storybook build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npx vitest --project storybook run` | Run every story as a browser test |

## What's in here

```
DESIGN.md                     # The design system spec (tokens + rules) — source of truth for AI tools
tokens.json                   # Primitive color/type/spacing tokens (Tokens Studio format)
component-metadata-template.json  # Blank schema for AI-consumable component metadata
metadata/
  button.json                 # Button's AI metadata (variants, tokens, a11y, Figma divergences)
src/
  tokens/tokens.css           # Tokens as CSS variables (primitives + semantic layer)
  components/
    Button/                   # Button component, stories, CSS module
    Icon/                     # Icon component + normalized SVG set
.storybook/                   # Storybook 10 config (a11y + vitest addons)
```

## Design tokens

Tokens live in two places that mirror each other:

- **[tokens.json](tokens.json)** — primitive scales (forest, neutral, danger, blue…) in
  Tokens Studio format, the Figma-side source.
- **[src/tokens/tokens.css](src/tokens/tokens.css)** — the same primitives as CSS custom
  properties, plus a **semantic layer** (`--bg-primary-default`, `--text-neutral-strong`,
  `--border-primary-strong`, …). **Components consume the semantic layer, never raw primitives.**

The full design language — color rules, typography scale, spacing, accessibility
requirements — is documented in **[DESIGN.md](DESIGN.md)**, written to be readable by both
people and AI coding tools.

## Components

### Button — [`src/components/Button`](src/components/Button)

Synced to the Figma "❖ Button" component (node `31:2137`). Props mirror the Figma
component properties:

| Prop | Type | Notes |
|---|---|---|
| `appearance` | `primary \| neutral \| text \| danger` | `primary` is the single forest moment per view |
| `size` | `default (40px) \| small (32px)` | Both use body-m (14px); only height differs |
| `label` | `ReactNode` | Sentence-case text |
| `iconBefore` / `iconAfter` | `IconName` | Leading / trailing icon (trailing is often a chevron) |
| `isSelected` | `boolean` | Toggle-on state — forest tint + `aria-pressed` |
| `isDisabled` | `boolean` | Disabled state |
| `loading` | `boolean` | Spinner + `aria-busy`; label stays in the a11y tree |

```tsx
<Button appearance="primary" label="Save changes" />
<Button appearance="neutral" label="Filter" iconAfter="chevron-down" />
<Button appearance="danger" label="Delete article" />
```

Behaviour notes: neutral & text appearances go **forest-tinted on hover** (not gray);
`isSelected` applies the forest tint across all appearances; focus is a 2px forest.700
ring. The **danger** fill uses `danger.700` (white text → 5.81:1, passes WCAG AA) rather
than Figma's `danger.500` (3.54:1, fails AA) — the one deliberate divergence, recorded in
the metadata.

### Icon — [`src/components/Icon`](src/components/Icon)

Normalized 24×24 SVG icons in the Figma icon style (2px stroke, round caps), recolored via
`currentColor` and sized via a `size` prop. Decorative by default (`aria-hidden`); pass a
`title` for standalone icons.

```tsx
<Icon name="chevron-down" />
<Icon name="search" size={24} title="Search" />
```

Currently a **curated ~20-icon starter set** (chevrons, arrows, close, check, add, remove,
search, trash, edit, external-link, info, warning, more-horizontal, diamond) sourced from
the Figma "Icons" page (node `391:3458`). The remaining ~230 icons will be imported as
needed.

## AI-consumable metadata

Each component ships a JSON metadata file ([metadata/](metadata/)) describing variants,
token usage, common/anti-patterns, accessibility, Athena constraints (the `forestMoment`
flag, `radius.none`, sentence-case), and any `figmaDivergences`. The blank schema is
[component-metadata-template.json](component-metadata-template.json); regenerate a file with
the `/ai-component-metadata` skill. This lets AI tools reason about *when and how* to use a
component, not just read its props.

## Testing & accessibility

Every story is a browser test via the Storybook **vitest** addon (`npx vitest --project
storybook run`), and the **a11y** addon runs axe on each story with `test: 'error'` — so a
WCAG AA violation **fails the suite**. That gate is what surfaced (and forced fixes for) the
danger-button contrast and the loading-label issues. Each component file carries a `CssCheck`
story that asserts a resolved computed style, proving the tokens load in the preview.

## Conventions

- **Storybook is the dev surface** — there's no separate app shell.
- **Semantic tokens in components**, primitives only inside `tokens.css`.
- **Prop names match Figma** component properties so design and code share vocabulary.
- **Sentence case** everywhere; **sharp corners** (`radius.none`) on all interactive containers.
- One **forest moment** per view (one primary button or the active nav, not both).
