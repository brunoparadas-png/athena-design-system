# Onboarding — Building a screen with Athena + an agent

Welcome. The fastest way to build a screen with the **Athena Design System** is to let
an **AI coding agent** (Copilot, Cursor, Claude, etc.) compose the components for you —
and Athena is built specifically so the agent gets it right.

This guide teaches you that workflow: give the agent the right context, describe the
screen, and let it assemble Athena components correctly the first time. Athena is
HuffPost's internal editorial tooling suite; this repo is its **design tokens, React
components, and AI-consumable metadata**.

> **👋 Designer?** You don't have to write code. Jump to **[For designers](#6-for-designers)** —
> the agent workflow works just as well from a Figma frame and a plain-language brief.

---

## 1. The idea

You don't memorise props or hand-wire components. Instead you point an agent at
Athena's machine-readable context and tell it what screen you want. The repo ships
three things so the agent composes screens correctly:

| Asset | What it gives the agent |
|---|---|
| **[DESIGN.md](../DESIGN.md)** | The whole design language — color rules, type scale, spacing, the *forest moment*, accessibility — written to be read by tools, not just people. |
| **[metadata/](../metadata/)** (one JSON per component) | *When and how* to use each component: variants, required props, `commonPatterns` (with JSX), `antiPatterns`, accessibility, and `aiHints` (`keywords`, `context`, `neverUseWhen`). |
| **[component barrel](../src/components/index.ts)** | Every component and its prop types, exported from one import path. |

Because component **prop names match Figma** properties, a designer can describe a
Figma frame and the vocabulary lines up end to end.

---

## 2. One-time setup

```bash
git clone <repo-url>
cd athena-design-system
npm install
```

That's all you need before involving the agent. (There's a live component preview —
`npm run storybook` on http://localhost:6006 — if you ever want to *see* a component,
but it's optional and not the focus here.)

**Two facts the agent must know to produce working code:**

- **Import from the barrel:** `import { Button, TextField } from '../components';`
- **Styles load once:** components are Tailwind-utility styled against the Athena
  token theme in `src/styles/tailwind.css`. Import that file **once** at your app root
  so tokens and utilities resolve. (Don't re-import it per component.)

---

## 3. The workflow

1. **Give the agent the context.** Tell it to read `DESIGN.md` and the relevant files
   in `metadata/` *before* writing code.
2. **Describe the screen** in plain language — or paste a Figma frame. Name the regions
   (header, form, actions) and the data involved.
3. **State the house rules** (section 4) — or just point the agent at them.
4. **Let it compose, then verify** (section 5). The accessibility gate catches contrast
   and markup mistakes automatically.

### A prompt you can copy

```text
You are building a screen with the Athena design system (this repo).

Before writing any code:
1. Read docs/ONBOARDING.md and DESIGN.md for the design language and house rules.
2. Read the relevant files in metadata/ for every component you plan to use —
   follow their commonPatterns and respect every antiPattern and neverUseWhen.

Task: Build an "Article settings" screen as a React component.
- A PageHeader titled "Article settings" with a primary "Save changes" button
  and a neutral "Cancel" button.
- A form with: a TextField for the headline, a TextArea for the summary,
  a RadioGroup for visibility (Public / Unlisted / Private), and a Toggle for
  "Allow comments".
- A Banner (info) at the top noting that unsaved changes are lost on exit.

Constraints:
- Import components from ../components.
- Assume src/styles/tailwind.css is loaded at the app root (don't re-import per file).
- Exactly one primary button on the view (the forest moment).
- Sentence case, sharp corners, WCAG AA — no exceptions.

When done, run: npm run typecheck && npm run lint && npx vitest --project storybook run
and fix anything that fails.
```

### What the result should look like

```tsx
import { PageHeader, Banner, TextField, TextArea, RadioGroup, Toggle, Button } from '../components';

export function ArticleSettings() {
  return (
    <div>
      <PageHeader title="Article settings">
        <Button appearance="neutral">Cancel</Button>
        <Button appearance="primary">Save changes</Button>
      </PageHeader>

      <Banner appearance="info">Unsaved changes are lost when you leave this page.</Banner>

      <TextField label="Headline" />
      <TextArea label="Summary" />
      <RadioGroup
        label="Visibility"
        options={[
          { label: 'Public', value: 'public' },
          { label: 'Unlisted', value: 'unlisted' },
          { label: 'Private', value: 'private' },
        ]}
        defaultValue="public"
      />
      <Toggle label="Allow comments" defaultChecked />
    </div>
  );
}
```

*(Exact props vary per component — the agent gets them from the barrel's types and the
`metadata/` files; treat this as the shape, not the spec.)*

---

## 4. House rules the agent must follow

These keep a generated screen consistent with the rest of Athena. Most are also encoded
in the `metadata/` files, so an agent that reads them will follow them — point it back
there if it drifts.

- **One forest moment per view** — a single `appearance="primary"` button (or the active
  nav), never two competing greens. Everything else is `neutral` or `text`.
- **Import from the barrel** (`../components`), never deep component paths.
- **No hardcoded colors** — styling rides on the components and their tokens, not inline
  hex. Semantic tokens only.
- **Prop names mirror Figma** properties (`appearance`, `size`, `isSelected`, …), so the
  design spec and the code share one vocabulary.
- **Native elements under the hood** — real `<button>`, `<input>`, `<a>` with proper
  `role`/`aria` wiring (the components already do this; don't re-wrap them).
- **Sentence case** everywhere; **sharp corners** on interactive containers (pills only
  for toggles / spinner / progress).
- **WCAG AA is non-negotiable** — it's a build gate (section 5), so designs and code must
  clear AA from the start.

---

## 5. Verify the screen

Accessibility is enforced, not suggested: the test suite runs **axe on every story with
`test: 'error'`**, so a WCAG AA violation **fails the build**. After the agent finishes:

```bash
npm run typecheck                          # types are correct
npm run lint                               # style/rules pass
npx vitest --project storybook run         # behaviour + a11y gate
```

If the agent invents a prop, doubles up primary buttons, or hardcodes a color, point it
at that component's `metadata/<name>.json` — the `antiPatterns` and `neverUseWhen`
entries exist precisely to correct it.

---

## 6. For designers

You can drive this whole workflow without writing code.

- **Start from a Figma frame or a sentence.** Because Athena's component **prop names
  match the Figma component properties**, you can describe what you designed and the
  agent maps it straight onto real components.
- **Hand the agent the brief**, the screenshot or frame, and tell it to read `DESIGN.md`
  and `metadata/` first. Then ask it to build the screen using Athena components.
- **The non-negotiables that keep specs and reality in sync:** sentence case, sharp
  corners, one forest-green moment per view, a unified 2px forest focus ring, and WCAG
  AA contrast (the build fails below AA).
- **Want to see a component first?** Ask an engineer for the **Chromatic** link (every
  component is published there for visual review), or run `npm run storybook` locally to
  browse and play with props — no code required.

---

## 7. Where to go next

| You want to… | Open |
|---|---|
| Understand the design language (color, type, spacing, a11y) | **[DESIGN.md](../DESIGN.md)** |
| Know *when & how* to use a component | **[metadata/](../metadata/)** (one JSON per component) |
| See the component catalogue & Figma nodes | **[README.md](../README.md)** → Components |
| Find or change a token | `tokens.json` (Figma side) / `src/tokens/tokens.css` (code side) |

Give the agent the context, describe the screen, run the checks — that's the loop.
