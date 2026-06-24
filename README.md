# Athena Design System

Design tokens, components, and AI-consumable metadata for **Athena** — HuffPost's
internal editorial tooling suite. Built on Inter, a 4px-ish spacing grid, sharp
(zero-radius) shapes, and a single deep **forest green** (`#2e7061`) accent on an
otherwise white/neutral canvas.

Storybook is the development surface and the living documentation.

## Getting started — build a screen with an agent

The fastest way to build a screen with Athena is to let an **AI coding agent** (Copilot,
Cursor, Claude, …) compose the components for you. The repo is built for it: an agent
auto-loads **[AGENTS.md](AGENTS.md)**, and you point it at the design language and
per-component metadata so it composes screens correctly the first time.

```bash
git clone <repo-url> && cd athena-design-system && npm install
```

**The loop:**

1. **Give the agent context** — have it read **[DESIGN.md](DESIGN.md)** (the design
   language) and the relevant **[metadata/](metadata/)** files (when & how to use each
   component). Agents pick up **[AGENTS.md](AGENTS.md)** automatically.
2. **Describe the screen** in plain language — or paste a Figma frame. Component prop
   names match the Figma properties, so the vocabulary lines up.
3. **The agent composes** Athena components, importing from the `src/components` barrel.
4. **Verify** — `npm run typecheck && npm run lint && npx vitest --project storybook run`.
   The axe a11y gate fails the build on any WCAG AA violation.

Two facts the agent needs for working code: **import from the barrel**
(`import { Button } from '../components'`) and **`src/styles/tailwind.css` loads once**
at the app root (tokens + utilities). One `primary` button per view, sentence case,
sharp corners, AA contrast.

> **For the full walkthrough** (copy-paste prompt, example output, designer path) see
> **[docs/ONBOARDING.md](docs/ONBOARDING.md)**. For the agent-facing rules see
> **[AGENTS.md](AGENTS.md)**.

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
AGENTS.md                     # Agent-facing instructions (auto-loaded by AI coding agents)
docs/ONBOARDING.md            # Getting started: build a screen with Athena + an AI agent
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

Athena ships a set of accessible, Figma-synced React components — actions (Button,
Icon), form controls (Checkbox, Radio, Toggle, TextField…), and composites (Banner,
Tabs, Modal, Table…). Rather than list them here, let the source of truth drive you:

- **Browse & try them** in Storybook (`npm run storybook`) → **Components**.
- **Know when & how to use each** from its **[metadata/](metadata/)** JSON — variants,
  patterns, anti-patterns, and accessibility.
- **Import** any of them from the barrel:

```tsx
import { Button, TextField, Banner } from './src/components';

<Button appearance="primary">Save changes</Button>
<TextField label="Headline" />
<Banner appearance="error">Payment failed. Update your billing details.</Banner>
```

Every component is **synced to its Figma source**, names its props after the Figma
component properties, consumes the **semantic token layer**, and ships a Storybook story
plus an AI-metadata file. Interactive components are built on native elements, and the
Figma `state` (default/hover/press/focus) is expressed as real CSS pseudo-states, never
a prop.

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
