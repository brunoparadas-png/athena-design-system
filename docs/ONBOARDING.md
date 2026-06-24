# Onboarding — Athena Design System

Welcome. This guide gets you from a fresh clone to rendering your first Athena
component, then points you at the deeper docs. Athena is HuffPost's internal
editorial tooling suite; this repo is its **design tokens, React components, and
AI-consumable metadata**.

If you only read one other file, read **[DESIGN.md](../DESIGN.md)** — the design
language (color rules, type scale, spacing, accessibility) is the source of truth.

> **👋 Designer?** You don't need to install anything to explore Athena. Jump to
> **[For designers](#9-for-designers)** at the bottom — it covers viewing the live
> component library, how Figma maps to code, and where the tokens live.

---

## 1. What you're working with

- **React 19 + TypeScript** components, styled with **Tailwind CSS v4** utilities
  that resolve to **design tokens** (forest-green brand, neutral canvas, sharp
  corners, Inter type).
- **Storybook is the dev surface and the living documentation** — there is no
  separate app shell. You build, preview, and test components in Storybook.
- **Tokens** live in two mirrored places: `tokens.json` (Figma side, Tokens Studio
  format) and `src/tokens/tokens.css` (CSS custom properties + a semantic layer).
- Every component is **synced to a Figma source**, ships a **story set**, and has an
  **AI-metadata JSON** in `metadata/`.

---

## 2. Prerequisites

| Tool | Version |
|---|---|
| Node.js | 20+ (LTS recommended) |
| npm | 10+ (ships with Node 20) |
| Git | any recent |

A Chromium browser is downloaded automatically by Playwright the first time you run
the story tests.

---

## 3. Install & run

```bash
git clone <repo-url>
cd athena-design-system
npm install
npm run storybook        # opens the dev surface at http://localhost:6006
```

That's it — Storybook hot-reloads as you edit components and stories.

### The scripts you'll actually use

| Script | What it does |
|---|---|
| `npm run storybook` / `npm run dev` | Start Storybook on :6006 |
| `npm run build-storybook` | Static Storybook build |
| `npm run typecheck` | `tsc --noEmit` against `tsconfig.app.json` |
| `npm run lint` | ESLint |
| `npx vitest --project storybook run` | Run every story as a browser test (incl. axe a11y) |
| `npm run chromatic` | Publish Storybook to Chromatic for visual review |

---

## 4. Using the components

> Athena is an **internal, unpublished** package (`"private": true`). You consume it
> by working **inside this repo** (the Storybook surface) or by importing from
> `src/components`, not via `npm install athena-design-system`.

### a. Import from the barrel

All components and their prop types are re-exported from a single barrel,
`src/components/index.ts`:

```tsx
import { Button, Tag, Banner, type ButtonProps } from '../components';
```

### b. Make sure the styles are loaded

Components are styled with Tailwind utilities that depend on the Athena token theme.
The single stylesheet that wires Tailwind + tokens together is
`src/styles/tailwind.css`:

```css
/* src/styles/tailwind.css */
@import 'tailwindcss';
@import '../tokens/tokens.css';

@theme {
  --color-forest-500: #2e7061;
  /* …the rest of the Athena palette… */
}
```

In Storybook this is already imported once in `.storybook/preview.tsx`, so stories
render correctly with zero setup. In any other surface, import
`src/styles/tailwind.css` **once** at your app root so the tokens and utilities are
available.

### c. Render something

```tsx
import { Button } from '../components';

export function SaveBar() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button appearance="neutral">Cancel</Button>
      <Button appearance="primary" onClick={save}>Save changes</Button>
    </div>
  );
}
```

A few more, straight from the component set:

```tsx
<Checkbox label="Email me updates" isChecked onChange={…} />
<RadioGroup label="Plan" options={plans} defaultValue="free" />
<Toggle label="Autosave" size="large" defaultChecked />
<Tag appearance="green" onRemove={removeFilter}>Sports</Tag>
<Link href="https://example.com" isExternal>Documentation</Link>
<Spinner size="medium" />
<ProgressBar value={0.4} label="Upload progress" />
<Banner appearance="error">Payment failed. Update your billing details.</Banner>
<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Articles' }]} />
<Tabs tabs={[{ id: 'a', label: 'Overview', content: <Overview /> }]} />
```

Browse every variant, prop, and copy-paste example live in Storybook → **Components**.

---

## 5. House rules (the conventions that matter)

These are enforced by review (and some by the test suite). Follow them and your code
will look like the rest of the system:

- **Storybook is the dev surface** — every component change comes with a story.
- **Semantic tokens in components**, primitives only inside `tokens.css`. Reach for a
  semantic alias (`--text-neutral-strong`, `--bg-primary-default`) before a raw scale.
- **Prop names mirror Figma** component properties, so design and code share one
  vocabulary (`appearance`, `size`, `isSelected`, …).
- **Figma `state` → CSS pseudo-states** (`:hover` / `:active` / `:focus-visible`),
  never a `state` prop.
- **Native elements under the hood** — real `<button>`, `<input>`, `<a>`, with proper
  `role`/`aria` wiring, for accessibility.
- **Sentence case** everywhere; **sharp corners** (zero radius) on interactive
  containers (pills only for toggles / spinner / progress).
- A unified **2px forest.700 focus ring** across all components.
- **One forest moment per view** — a single `primary` button (or the active nav),
  never two.

---

## 6. Accessibility is a gate, not a guideline

Every story is a browser test, and the **a11y addon runs axe on each story with
`test: 'error'`** — so a WCAG AA violation **fails the suite**. Before you push:

```bash
npm run typecheck
npm run lint
npx vitest --project storybook run
```

Interaction tests (`play` functions) cover real behaviour, and each component carries
a `CssCheck` story that proves the tokens actually loaded in the preview.

---

## 7. Where to go next

| You want to… | Read |
|---|---|
| Understand the design language (color, type, spacing, a11y) | **[DESIGN.md](../DESIGN.md)** |
| See the component catalogue & props | **[README.md](../README.md)** → Components, or Storybook |
| Know *when* to use a component (AI metadata) | **[metadata/](../metadata/)** + `component-metadata-template.json` |
| Change or add a token | `tokens.json` (Figma side) **and** `src/tokens/tokens.css` (code side) |
| Set up visual regression | **[README.md](../README.md)** → Visual testing (Chromatic) |

---

## 8. Troubleshooting

- **Components render unstyled** — `src/styles/tailwind.css` isn't imported at your
  app root, so the Tailwind utilities and token theme never load. In Storybook this is
  handled in `.storybook/preview.tsx`.
- **A `CssCheck` story fails** — tokens didn't resolve in the preview; confirm
  `tokens.css` is imported via `tailwind.css`.
- **`npm run storybook` port clash** — Storybook runs on `:6006`; stop the other
  process or pass `-p <port>`.
- **a11y test failures** — open the failing story in Storybook, check the **A11y**
  panel for the axe rule, and fix the markup/contrast rather than disabling the rule.

Welcome aboard. Spin up Storybook, poke at the Button stories, and you'll have the
shape of the whole system in a few minutes.

---

## 9. For designers

You don't have to write code to work with Athena. Here's the short path.

### See every component, live

The whole library is browsable in **Storybook**. If you can run two commands:

```bash
npm install
npm run storybook        # opens http://localhost:6006
```

Then open **Components** in the left sidebar. Each component has:

- a **Docs** page (description, all props, do/don't notes), and
- interactive **Controls** — change `appearance`, `size`, text, etc. and watch the
  component update live, no code required.

Prefer not to run anything locally? Ask an engineer for the **Chromatic** link — every
story is published there for visual review, so you can browse the same catalogue in
the browser.

### Figma ↔ code share one vocabulary

Athena is built to keep design and code in sync, so the words you use in Figma are the
words in the code:

- Every component is **synced to its Figma source node** (see the table in
  **[README.md](../README.md)**).
- **Prop names match the Figma component properties** — Figma's `appearance`, `size`,
  `isSelected` are literally the props engineers set.
- The Figma **`state`** (default / hover / press / focus) is expressed as real CSS
  states, never a separate option — so what you spec in Figma is what ships.

### Tokens are the shared source of truth

Colors, type, spacing, and radii are **design tokens**, defined once and mirrored on
both sides:

- **`tokens.json`** — primitive scales in **Tokens Studio** format (the Figma side).
- **`src/tokens/tokens.css`** — the same values as CSS variables (the code side).

Change a token in the design source and it flows to the components. The full design
language — color rules, the type ramp, spacing grid, and accessibility requirements —
is written for both people and tools in **[DESIGN.md](../DESIGN.md)**.

### The non-negotiables (so specs match reality)

- **Sentence case** everywhere.
- **Sharp corners** on interactive containers (pills only for toggles / spinner /
  progress).
- **One forest-green moment per view** — a single primary button or the active nav,
  never two competing greens.
- A unified **2px forest focus ring** on every interactive element.
- Accessibility is a **build gate**: a WCAG AA contrast or markup violation fails the
  test suite, so designs need to clear AA from the start.

### Where to look

| You want to… | Open |
|---|---|
| Browse components & play with props | Storybook → **Components** (or the Chromatic link) |
| Understand the full design language | **[DESIGN.md](../DESIGN.md)** |
| See the Figma node for a component | **[README.md](../README.md)** → Components tables |
| Find a token's value | `tokens.json` (Figma side) / `src/tokens/tokens.css` (code side) |
