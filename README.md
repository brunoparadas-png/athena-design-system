# Athena Design System

Design tokens, components, and AI-consumable metadata for **Athena** — HuffPost's
internal editorial tooling suite. Built on Inter, a 4px-ish spacing grid, sharp
(zero-radius) shapes, and a single deep **forest green** (`#2e7061`) accent on an
otherwise white/neutral canvas.

Storybook is the development surface and the living documentation.

New here? Start with the **[Onboarding guide](docs/ONBOARDING.md)** — clone to first
component in a few minutes.

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
| `npm run chromatic` | Publish Storybook to Chromatic for visual review |

## What's in here

```
docs/ONBOARDING.md            # Getting-started guide: install, use, and ship a component
DESIGN.md                     # The design system spec (tokens + rules) — source of truth for AI tools
tokens.json                   # Primitive color/type/spacing tokens (Tokens Studio format)
component-metadata-template.json  # Blank schema for AI-consumable component metadata
metadata/                     # One AI-metadata JSON per component (13 files)
src/
  tokens/tokens.css           # Tokens as CSS variables (primitives + semantic layer)
  components/                 # 13 components, each with .tsx, .module.css, .stories.tsx, index.ts
    Button/  Icon/            # Actions / iconography
    Checkbox/  Radio/  RadioGroup/  Toggle/   # Form controls
    Tag/  Link/  Spinner/  ProgressBar/       # Display / status / navigation
    Banner/  Breadcrumbs/  Tabs/              # Composites
.storybook/                   # Storybook 10 config (a11y + vitest addons)
```

## Components

Every component is **synced to its Figma source**, names its props after the Figma
component properties, consumes the **semantic token layer**, and ships a Storybook story
set (including a `CssCheck` story) plus an AI-metadata file. Interactive components are
built on native elements for accessibility, and the Figma `state` property
(default/hover/press/focus) is always expressed as real CSS pseudo-states rather than a
prop.

### Atoms

| Component | Figma node | Summary |
|---|---|---|
| **[Button](src/components/Button)** | `31:2137` | `appearance` primary/neutral/text/danger × `size` default/small; icons, `isSelected`, `loading`. One forest moment per view. |
| **[Icon](src/components/Icon)** | `391:3458` | Normalized 24×24 SVG set, `currentColor`, `size` prop. Curated ~20-icon starter subset. |
| **[Checkbox](src/components/Checkbox)** | `507:90021` | 14px sharp box, forest fill, white check. `isChecked`/`isIndeterminate`/`isInvalid`/`isDisabled`/`isRequired`. Native `:indeterminate`. |
| **[Radio](src/components/Radio)** | `514:2154` | 14px circular dial, forest fill + white **check** (not a dot). Checked+invalid → danger fill. |
| **[Toggle](src/components/Toggle)** | `671:5884` | Slide switch, `size` default/large. `role="switch"`, white dot, instant on/off. |
| **[Tag](src/components/Tag)** | `410:10023` | 6 appearances (gray/green/red/purple/blue/orange), `onRemove` (removable), `href` (link). |
| **[Link](src/components/Link)** | `76:1252` | `appearance` default/subtle/inverse; `isExternal` adds the icon + new-tab behaviour. |
| **[Spinner](src/components/Spinner)** | `832:4816` | Animated arc, 5 sizes (12–96px), `currentColor`, `role="status"`. |
| **[ProgressBar](src/components/ProgressBar)** | `703:13482` | Determinate `value` 0–1; `appearance` default/inverse/success; `role="progressbar"`. |

### Molecules

| Component | Figma node | Summary |
|---|---|---|
| **[RadioGroup](src/components/RadioGroup)** | `514:2212` | Wraps Radio; declarative `options`, shared name, single selection, group-level `isInvalid`/`isRequired`, vertical/horizontal. |
| **[Banner](src/components/Banner)** | `679:1301` | Full-width message strip; `appearance` info/error (error = danger.700 + warning icon). `role` alert/status. |
| **[Breadcrumbs](src/components/Breadcrumbs)** | `515:9126` | `nav > ol` trail; declarative `items`, last = current page (`aria-current`), optional truncation. |
| **[Tabs](src/components/Tabs)** | `183:3466` | tablist/tabpanel; declarative `tabs`, forest underline indicator, roving-tabindex arrow-key nav, controlled + uncontrolled. |

```tsx
<Button appearance="primary" label="Save changes" />
<Checkbox label="Email me updates" isChecked onChange={…} />
<RadioGroup label="Plan" options={plans} defaultValue="free" />
<Toggle label="Autosave" size="large" defaultChecked />
<Tag appearance="green" onRemove={removeFilter}>Sports</Tag>
<Link href="https://example.com" isExternal>Documentation</Link>
<Spinner size="medium" />
<ProgressBar value={0.4} label="Upload progress" />
<Banner appearance="error">Payment failed. Update your billing details.</Banner>
<Breadcrumbs items={[{label:'Home',href:'/'},{label:'Articles'}]} />
<Tabs tabs={[{id:'a',label:'Overview',content:<Overview/>}]} />
```

## Design tokens

Tokens live in two places that mirror each other:

- **[tokens.json](tokens.json)** — primitive scales in Tokens Studio format, the Figma-side source.
- **[src/tokens/tokens.css](src/tokens/tokens.css)** — the same primitives as CSS custom
  properties, plus a **semantic layer** (`--bg-primary-default`, `--text-neutral-strong`,
  `--border-primary-strong`, …). **Components consume the semantic layer, never raw primitives.**

Building these components grew the token set with the full **teal, purple, and orange**
scales and the complete **blue** scale (the DS defines 7 palettes; only forest/neutral/danger
had been generated), plus semantic aliases surfaced by real components:
`--text-neutral-weak`, `--text-primary-default`, `--bg-neutral-strongest(-hovered)`, and
`--teal-800` (an AA-safe green for tags). A few decorative, one-off values — the six Tag
palettes and the translucent ProgressBar/Tabs tracks — are kept inline in their CSS modules
with comments, since they have no semantic alias.

The full design language — color rules, typography scale, spacing, accessibility
requirements — is documented in **[DESIGN.md](DESIGN.md)**, written to be readable by both
people and AI coding tools.

## AI-consumable metadata

Each component ships a JSON metadata file ([metadata/](metadata/)) describing variants,
token usage, common/anti-patterns, accessibility, Athena constraints, and any
`figmaDivergences`. The blank schema is
[component-metadata-template.json](component-metadata-template.json); regenerate a file with
the `/ai-component-metadata` skill. This lets AI tools reason about *when and how* to use a
component, not just read its props.

Where the implementation deliberately departs from Figma, the reason is recorded in the
metadata — e.g. Button/Banner use `danger.700` (AA-safe with white text) instead of
`danger.500`; the green Tag text uses `teal.800` (the Figma `teal.700` was 4.03:1, below AA);
Tabs use Inter rather than the Figma kit's Atlassian Sans; focus rings are unified on
`forest.700` across all components.

## Testing & accessibility

Every story is a browser test via the Storybook **vitest** addon (`npx vitest --project
storybook run`) — **85 tests across 13 components** — and the **a11y** addon runs axe on each
story with `test: 'error'`, so a WCAG AA violation **fails the suite**. That gate surfaced
(and forced fixes for) the danger-button contrast and the green-Tag contrast. Interaction
tests (`play` functions) cover real behaviour — radio single-selection, tab click + keyboard
navigation, tag removal — and each component carries a `CssCheck` story that asserts a
resolved computed style, proving the tokens load in the preview.

## Visual testing (Chromatic)

Storybook is published to [Chromatic](https://www.chromatic.com/) for visual regression
review — every story is snapshotted and diffed against its baseline.

- **Locally:** `npm run chromatic`. The project token lives in `chromatic.config.json`,
  which is **git-ignored** (never commit the token). Create it once with:

  ```json
  { "$schema": "https://www.chromatic.com/config-file.schema.json", "projectToken": "chpt_…" }
  ```

- **CI:** [`.github/workflows/chromatic.yml`](.github/workflows/chromatic.yml) runs on every
  push. It reads the token from the `CHROMATIC_PROJECT_TOKEN` repo secret — add it under
  **GitHub → Settings → Secrets and variables → Actions → New repository secret**.

A build reporting visual changes "fails" with exit code 1 until the diffs are reviewed and
accepted in the Chromatic UI — that's the review gate, not a broken build.

## Conventions

- **Storybook is the dev surface** — there's no separate app shell.
- **Semantic tokens in components**, primitives only inside `tokens.css`.
- **Prop names match Figma** component properties so design and code share vocabulary.
- **Figma `state` → CSS pseudo-states** (`:hover`/`:active`/`:focus-visible`), never a `state` prop.
- **Native elements** under the hood (real `<input>`, `<a>`, `<button>`, `role` wiring) for accessibility.
- **Sentence case** everywhere; **sharp corners** (`radius.none`) on interactive containers (pill only for toggles/spinner/progress).
- A unified **2px forest.700 focus ring** across all components.
- One **forest moment** per view (one primary button or the active nav, not both).
```
