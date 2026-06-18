## Building with Athena

Athena is a **pre-styled** React component library (brand: HuffPost Athena, forest-green
primary). Build UIs by **composing components and setting their props** — do NOT hand-roll
Tailwind utility classes or CSS to restyle a component; its look is already correct.

### Setup — no provider needed
Import a component and render it. There is **no ThemeProvider/context wrapper** — tokens,
the Inter typeface (body) and IBM Plex Mono (code), and all component styles ship in the
bound `styles.css`. A component renders correctly on its own:

```jsx
import { Button, Tag, TextField, Icon } from 'athena-design-system';

<Button appearance="primary" iconBefore="diamond">Create</Button>
```

### Style via props, not classes
Each component exposes a small, intentional prop API — use it instead of CSS:
- **Button / IconButton**: `appearance="primary|neutral|text|danger"`, `size="default|small"`,
  `iconBefore`/`iconAfter` (icon-name strings), `isSelected`, `isDisabled`, `loading`.
- **Tag**: `appearance="gray|green|red|purple|blue|orange"`, `isRemovable`.
- **Icon**: `name` is one of the names in the `iconNames` export (e.g. `chevron-down`,
  `search`, `trash`, `edit`, `external-link`, `info`, `warning`, `check-circle`, `diamond`).
- Form fields (**TextField, TextArea, Checkbox, Radio, RadioGroup, Toggle**): `label`,
  `isInvalid`, `isValid`, `isRequired`, `isDisabled`; TextField/TextArea also take `helperText`
  (rendered as the error message when `isInvalid`).
- **Banner** `appearance="info|error"`; **Modal** `size` + `appearance="default|danger"` with
  `ModalHeader`/`ModalBody`/`ModalFooter`; **Menu** takes an `items` tree.

### Tokens — for YOUR layout glue only
For wrappers, grids and spacing around components, use the DS CSS variables (never invent hex
or arbitrary px). All are defined in the bound `styles.css` closure:
- Color (primitive scales): `--color-forest-{50–900}` (brand), `--color-neutral-{50–900}`,
  `--color-danger-{50–900}`, plus `--color-blue/teal/orange/purple-*`, `--color-white`.
- Semantic text: `--text-neutral-default|weak|strong|inverse|disabled`,
  `--text-primary-default|strong`, `--text-danger-default`, `--text-link-default`, `--text-success`.
- Type: `--font-main` (Inter), `--font-code` (IBM Plex Mono), `--font-size-{2xs..xl}`,
  `--font-weight-{normal|medium|semibold|bold}`.
- Spacing: `--spacing-{none|3xs|2xs|xs|sm|base|md|lg|xl|3xl}`.
- Radius: `--radius-{none|sm|pill}`. Shadow: `--shadow-{card|elevated|overlay}`.

```jsx
// component for the control; tokens for your own layout
<div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
  <TextField label="Email" />
  <Button appearance="primary">Save</Button>
</div>
```

### Where the truth lives
Read each component's `*.prompt.md` (usage + variants) and `*.d.ts` (exact prop types) before
composing it, and the bound `styles.css` (+ its `@import`ed `_ds_bundle.css`) for the full
token list. The component name index is the `components/` directory.
