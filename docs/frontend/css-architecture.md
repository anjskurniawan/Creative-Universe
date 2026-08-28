# Frontend CSS Architecture

> Status: Active in-place restructuring contract
> Last verified: 2026-08-24

## Source of truth

The active application owns `apps/frontend/src/app/global.css`. Restructuring must retain it as the one canonical global entry without changing rendered UI.

The target global file loads Spectrum S2 foundations, shared tokens, fonts, and minimal document-wide rules. Existing Tailwind reset and legacy UI assumptions must move beneath `.cu-style`; they must not remain as a second unscoped global reset. `apps/frontend-cancel/` is read-only and is not a CSS reference or source.

## Current global CSS layers

During the foundation phase, inventory the active global CSS layers, including:

- Tailwind `theme.css` for theme tokens;
- Tailwind `utilities.css` for utility classes;
- a small `html, body` margin reset;
- a scoped reset under `.cu-style` in `@layer base`;
- legacy-compatible `cu-*` color tokens and landing animation rules;
- Material Symbols helper styles.

The target must not enable Tailwind Preflight globally. Spectrum S2 remains outside the scoped legacy reset unless a specific composition has been verified.

## Scoped Tailwind reset

Use `.cu-style` as the boundary for project-owned Universe UI that needs predictable Tailwind-like defaults:

```tsx
<div className="cu-style">
  <UniverseComponent />
</div>
```

The scoped reset covers box sizing, form controls, buttons, links, headings, lists, and media elements. It belongs in `@layer base` so component utility classes can override reset declarations. Landing-specific gradient, cursor, CTA, and MediaAgent motion rules are also scoped under `.cu-style`.

Spectrum UI should not be wrapped in `.cu-style` unless the reset has been explicitly verified for that component. Spectrum styles are loaded through the single global foundation.

## Component repair workflow

When a component needs visual restoration:

1. Read the active `global.css` to understand the current baseline and active layers.
2. Trace the corresponding selector and every active consumer before changing ownership.
3. Decide whether the rule belongs to a component, layout, route, or truly global foundation.
4. Reintroduce only the required rule at the owning component or route boundary.
5. Use `.cu-style` only for project-owned Tailwind boundaries that need the scoped reset; do not retain the complete stylesheet as an unscoped shortcut.
6. Validate the route visually and run the focused type/build checks.

Examples:

- Navbar and its dropdowns are Universe UI and use `.cu-style` at the Navbar boundary.
- Spectrum S2 components keep their Spectrum ownership and should remain outside the Universe reset unless tested.
- `Container`, `Workspace`, and `Content` own layout rules through their component class names and props; do not infer their current styling from legacy CSS without checking their source.

## Spectrum and macro CSS

The root layout imports `@react-spectrum/s2/page.css` before the active global stylesheet. `next.config.ts` keeps the `unplugin-parcel-macros` plugin and groups Spectrum/macro CSS in the `s2-styles` split chunk. Preserve both when changing Spectrum styling or macro imports.

The Spectrum Provider uses a valid `div` element wrapper because the Next root layout already owns the document `<html>` and `<body>` elements. Do not configure the nested Provider to render another `<html>` element.
