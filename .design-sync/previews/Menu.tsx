import * as React from 'react';
import * as S from "@ds-stories/src/components/Menu/Menu.stories";

// Owned preview. The Menu is a popup surface with an intrinsic content width;
// its stories use storybook `layout: 'centered'`, which shrink-wraps it to
// ~212px. The generated preview rendered it as a plain block child, so it
// stretched to the full cell width. Wrapping each story in a flex row (items
// take content width, not container width) reproduces the storybook framing.
function compose(S: any, key: string) {
  const meta: any = S.default ?? {};
  const st: any = S[key];
  const args: any = { ...(meta.args ?? {}), ...(st && st.args ? st.args : {}) };
  const at: any = { ...(meta.argTypes ?? {}), ...(st && st.argTypes ? st.argTypes : {}) };
  for (const k of Object.keys(args)) {
    const m = at[k] && at[k].mapping;
    if (m && typeof m === 'object' && args[k] in m) args[k] = m[args[k]];
  }
  const title: string = typeof meta.title === 'string' ? meta.title : '';
  const ctx: any = {
    args, name: key, title, kind: title, id: '', componentId: '',
    globals: {}, viewMode: 'story',
    parameters: (st && st.parameters) ?? meta.parameters ?? {},
  };
  let render: (() => any) | null = null;
  if (st && typeof st.render === 'function') render = () => st.render(args, ctx);
  else if (typeof st === 'function') render = () => st(args, ctx);
  else if (typeof meta.render === 'function') render = () => meta.render(args, ctx);
  else {
    const C = (st && st.component) || meta.component;
    if (C) render = () => React.createElement(C, args);
  }
  if (!render) return () => null;
  const decorators: any[] = ([] as any[]).concat((st && st.decorators) ?? []).concat(meta.decorators ?? []);
  return decorators.reduce((inner: any, dec: any) => () => {
    const out = dec(inner, ctx);
    return out === undefined ? inner() : out;
  }, render);
}

// Shrink-wrap to the menu's content width, like storybook `layout: 'centered'`.
const wrap = (renderFn: () => any) => () =>
  React.createElement('div', { style: { display: 'flex' } }, renderFn());

export const DualTrailingIcons = /* Dual Trailing Icons */ wrap(compose(S, "DualTrailingIcons"));
export const Default = /* Default */ wrap(compose(S, "Default"));
export const Simple = /* Simple */ wrap(compose(S, "Simple"));
export const Checkboxes = /* Checkboxes */ wrap(compose(S, "Checkboxes"));
export const Radios = /* Radios */ wrap(compose(S, "Radios"));
export const Grouped = /* Grouped */ wrap(compose(S, "Grouped"));
export const GroupedWithSeparators = /* Grouped With Separators */ wrap(compose(S, "GroupedWithSeparators"));
export const Scrollable = /* Scrollable */ wrap(compose(S, "Scrollable"));
export const Compact = /* Compact */ wrap(compose(S, "Compact"));
export const KeyboardNav = /* Keyboard Nav */ wrap(compose(S, "KeyboardNav"));
export const CssCheck = /* Css Check */ wrap(compose(S, "CssCheck"));
