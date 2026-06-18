# design-sync notes — athena-design-system

Synced to claude.ai/design project **Athena Design System**
(`7f789ac8-aaad-4687-aa03-955f4fdd2b68`). Source shape: **storybook**.
Tailwind v4 (CSS-first `@theme`) + CSS tokens. React 19. 24 storied components.

## General fixes (replayed automatically via committed config / package.json)

- **[GENERAL] No package entry → 0 components.** This is the DS's own source repo
  with no library build: `package.json` had no `main`/`module`/`exports`/`types`,
  so the converter's export gate (`exportedNames` → `findTypesRoot`) found 0
  public exports and dropped all 24 (`[TITLE_UNMAPPED]`). Fix: added
  `"types": "src/components/index.ts"` (the barrel) to `package.json`. ts-morph
  parses the `.ts` barrel and follows `export * from './X'` to the value exports.
  The bundle entry is separate (`cfg.entry` / `--entry`, same barrel).
- **[GENERAL] Storybook decorator does not bundle — and that's fine.**
  `.storybook/preview.tsx` imports `../src/styles/tailwind.css` (which does
  `@import 'tailwindcss'`), so esbuild can't bundle the decorator
  (`Could not resolve "tailwindcss"`). The decorator only sets
  `font-family: Inter` on a wrapper `<div>` — it provides NO React context, so
  there is nothing to distill into `cfg.provider`. Leave `provider` unset.
- **[GENERAL] Fonts load remotely; both sides match.** `styles.css` @imports the
  Google Fonts URL (Inter + IBM Plex Mono) scraped from the reference storybook,
  and the reference loads the same via `.storybook/preview-head.html`. Validate
  reports `[FONT_REMOTE]` (expected, not a problem). Capture must have egress to
  `fonts.googleapis.com`/`fonts.gstatic.com` or both panels fall back identically.
- **[GENERAL] CSS comes from the storybook scrape.** Tailwind v4 utilities are
  compiled into the reference build; `[CSS_FROM_STORYBOOK]` scrapes the compiled
  42 KB into `_ds_bundle.css`. No `cfg.cssEntry` (the raw `tailwind.css` is
  uncompiled `@import 'tailwindcss'` and unusable directly).

## Reading the compare sheets

- **[GENERAL] Sheet framing differs per panel — judge from raw/, not the sheet.**
  The storybook panel is cropped tight to its content (`layout: 'centered'`),
  while the preview panel shows the full capture viewport with the component at
  top-left. After shrink-to-fit, preview components LOOK smaller in the sheet but
  are the SAME size at full resolution. Confirmed on Button/Primary. Always open
  `_screenshots/compare/raw/<...>__sb.png` vs `__ds.png` before calling a size
  mismatch.

## Portal/overlay components — sb-error on open stories

- **[GENERAL] Open overlay stories `sb-error` "no storybook root content".**
  Stories that render a Modal/menu OPEN portal their content to `document.body`,
  outside `#storybook-root`. The storybook reference capture roots at
  `#storybook-root`, so it sees nothing → compare reports `sb-error`. The PREVIEW
  side (single-mode card) wraps to contain fixed/portal content and renders the
  open overlay correctly. Resolution: grade these stories from the preview render
  on its own merit (`"basis": "preview-only"` + a note explaining the reference
  limitation) — NOT `skip` (skip drops the story export entirely, so it can't be
  the single-card `primaryStory`). Confirmed on Modal (BlanketClickCloses,
  CssCheck). Watch for the same on DropdownMenu, Menu, Tabs if their stories open
  on render.
- **[GENERAL] Trigger-based overlay stories render CLOSED on both sides → match.**
  Stories that open on click (`useState(false)` + trigger) render as just the
  trigger button in static capture on BOTH sides (play() doesn't auto-run in the
  static canvas), so they match each other.

## Owned previews

- **Menu** (`.design-sync/previews/Menu.tsx`): the Menu is a popup surface with an
  intrinsic content width; its stories use `layout: 'centered'` which shrink-wraps
  it to ~212px. The generated preview rendered it as a plain block child, so it
  stretched to the full cell width. The owned preview wraps each composed story in
  a `display:flex` row so the menu takes content width. If the Menu stories change,
  re-derive from the regenerated `.cache/previews/Menu.tsx` (re-add the flex wrap).
  Watch for the same stretch on any other standalone full-width surface added later.

## Grading gotchas

- **Grade keys are story DISPLAY names (titleized, with spaces)**, not export
  names: `WithIcons` → `"With Icons"`, `ActionPair` → `"Action Pair"`,
  `CssCheck` → `"Css Check"`. A wrong key never matches and leaves the story
  pending. Pull exact names from `.design-sync/.cache/compare/<Name>.json`.

## Presentation overrides (cfg.overrides)

- `column` (stories wider than a grid cell): Button, FileUploader, Icon, Table,
  Tabs, TextArea.
- `single` (fixed/portal): Modal, `primaryStory: "BlanketClickCloses"` (the only
  story that renders the dialog OPEN with full content in a static capture;
  trigger-based stories render closed = just a button, which still matches the
  reference since storybook play() doesn't auto-run in static canvas).

## Play-driven story states (graded match, preview shows default)

- **[GENERAL] Many stories run a storybook `play()` that drives an interaction**
  (type text, click a tab/radio, collapse a nav). In the static reference the
  play() ran, so storybook shows the post-interaction state; the preview has no
  play() so it shows the DEFAULT state. Graded `match` because the component
  rendering is faithful — only the interaction-driven state differs. Affected:
  RadioGroup/Single Selection, TextField/Typing, TextArea/Typing, Tabs/Select By
  Click, Tabs/Keyboard Nav, SideNavigation/With Toggle. (For each, a sibling
  story verifies the other state directly — e.g. Tabs renders all panels, the
  Collapsed nav story renders the rail.)

## Re-sync risks (watch these on the next sync)

- **package.json `types`** (`src/components/index.ts`) is load-bearing — without
  it the export gate drops all 24 components. Don't remove it.
- **Modal** BlanketClickCloses / CssCheck are graded `preview-only` (reference
  sb-errors on portaled content). If Modal's portal behavior or these stories
  change, re-judge the preview render directly; they can't be compared to
  storybook.
- **Menu** has an OWNED preview (`.design-sync/previews/Menu.tsx`) that re-adds a
  flex wrapper for compact width. If Menu stories change, the generated cache
  twin updates but the owned copy shadows it — re-derive and re-add the wrap.
- **Play-driven stories** (list above) were verified only in their DEFAULT state
  via the preview; the play-driven state was not pixel-compared.
- **Story caps**: solo Button captured 12/12; most others captured all stories
  (≤12). Any component that later exceeds 12 stories needs `--max-stories` raised
  to verify the tail.
- **Fonts** are remote (Google Fonts @import). Capture needs egress to
  fonts.googleapis.com / fonts.gstatic.com; CI/headless without egress would make
  both panels fall back identically.
- **Select** existed in the prior uploaded project but NOT in this repo (24
  components, no Select) — the upload reconciliation removes it.
- **Generated `.d.ts` are gitignored** (`src/**/*.d.ts`). The converter reads them
  for per-component prop docs (`.d.ts` / `.prompt.md`). On a fresh clone they're
  absent — run the type-declaration emit (e.g. `tsc --declaration
  --emitDeclarationOnly`) before a re-sync so prop docs extract fully; otherwise
  prop bodies fall back to source parsing and may be thinner.
