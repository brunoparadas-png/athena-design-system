# AGENTS.md — Athena Design System

Instructions for AI coding agents working in this repo. Read this first, then read
`DESIGN.md` and the relevant files in `metadata/` before writing any UI code. Humans:
see **[docs/ONBOARDING.md](docs/ONBOARDING.md)**.

This is HuffPost's **Athena** design system: design tokens, React 19 + TypeScript
components, and AI-consumable metadata. Your job is to compose **existing** components
into screens — not to reinvent styling.

---

## Context to load before coding

| File | Why you need it |
|---|---|
| `DESIGN.md` | The design language: color rules, type scale, spacing, the *forest moment*, accessibility. The source of truth. |
| `metadata/<name>.json` | Per-component: `variants`, `requiredProps`, `commonPatterns` (with JSX), `antiPatterns`, `accessibility`, and `aiHints` (`keywords`, `context`, `neverUseWhen`). Read one for every component you use. |
| `src/components/index.ts` | The barrel — every component and its prop types, one import path. |
| `metadata/` (whole dir) | Use `aiHints.keywords` and `aiHints.context` to pick the right component for a need. |

If an MCP-capable session is available, the repo exposes a Storybook MCP server
(`@storybook/addon-mcp`) when `npm run storybook` is running — use it to read live
stories and component docs.

---

## How to build a screen

1. Read `DESIGN.md` and the `metadata/` file for every component you plan to use.
2. Compose components from the barrel. Follow each component's `commonPatterns`.
3. Honour every `antiPattern` and `neverUseWhen` in the metadata.
4. Verify (see **Verification** below) and fix anything that fails.

```tsx
import { PageHeader, Banner, TextField, Button } from '../components';
```

---

## Hard rules (do not violate)

- **One forest moment per view.** Exactly one `appearance="primary"` button (or the
  active nav). Everything else is `neutral` or `text`. Two primaries is a bug.
- **Import from the barrel** `../components` — never deep component paths.
- **No hardcoded colors.** No inline hex, no raw Tailwind color classes for brand
  color. Styling rides on the components and their semantic tokens.
- **Don't re-import styles per file.** `src/styles/tailwind.css` is loaded once at the
  app root (and already in Storybook's `.storybook/preview.tsx`). Assume it's present.
- **Prop names mirror Figma** properties (`appearance`, `size`, `isSelected`, …). Don't
  invent props — if a prop isn't in the component's types or metadata, it doesn't exist.
- **Don't re-wrap native semantics.** Components already render real `<button>`,
  `<input>`, `<a>` with `role`/`aria` wiring. Don't add redundant roles or wrappers.
- **Figma `state` → CSS pseudo-states.** There is no `state` prop; hover/press/focus are
  handled in CSS.
- **Sentence case** everywhere. **Sharp corners** on interactive containers (pills only
  for toggles / spinner / progress).
- **WCAG AA is a build gate.** AA contrast and valid markup are mandatory — the test
  suite fails below AA (see Verification).

---

## Verification (run before declaring done)

```bash
npm run typecheck                          # tsc --noEmit
npm run lint                               # ESLint
npx vitest --project storybook run         # every story as a browser test + axe a11y gate
```

The a11y addon runs axe on each story with `test: 'error'`, so a WCAG AA violation
**fails the suite**. If a check fails, fix the code — do not disable the rule.

---

## When you drift

If you invent a prop, render two primary buttons, hardcode a color, or pick the wrong
component, re-read that component's `metadata/<name>.json`. Its `antiPatterns` and
`aiHints.neverUseWhen` describe exactly these mistakes and the correct alternative.

## Don't

- Don't add new dependencies or a component library — Athena's components are the kit.
- Don't edit tokens to make one screen work; tokens are global (`tokens.json` +
  `src/tokens/tokens.css`) and changing them is a separate, deliberate task.
- Don't publish/install Athena via npm — it's a private, in-repo package.
