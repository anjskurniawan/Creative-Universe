# Frontend CSS Selector Inventory

> Status: Active Phase 2 evidence  
> Last verified: 2026-08-24

This inventory classifies current CSS ownership before any selector deletion or relocation. Runtime authority is the import graph from `src/app/layout.tsx`, not file names or historical intent.

## Active global chain

The root layout imports exactly:

1. `@react-spectrum/s2/page.css` for the Spectrum S2 foundation;
2. `src/app/global.css` as the sole project global entry.

The duplicate Spectrum page import formerly present in `app/developer/playground/layout.tsx` was removed because the root layout already owns it. No other TypeScript/TSX file imports a project stylesheet.

## `src/app/global.css`

| Segment | Classification | Target |
|---|---|---|
| Google Sans import | Product-wide font | Keep global until font-loading ownership is consolidated |
| `tailwindcss/theme.css` and `utilities.css` | Tailwind tokens/utilities without global Preflight | Keep global |
| `@theme` tokens | Shared product tokens | Keep global; synchronize with Spectrum theme where relevant |
| `html, body` margin/padding | Minimal document rule | Keep global |
| `.cu-layout-content` and pseudo-element | Shared layout contract | Move with SHELL-001 only after route comparison |
| `.cu-style` reset | Scoped legacy Tailwind/reset behavior | Keep globally defined but effective only below `.cu-style` |
| `.material-symbols-rounded` | Shared icon/font utility | Keep until component ownership proves a narrower safe target |
| Scoped landing/cursor/media selectors | Product UI helpers | Move with AUTH-001 after consumer audit |
| Four keyframe groups | Animation definitions used only by scoped helpers | Move with their owning selectors when safe |

The previous boundary name `.tw-scope` was renamed atomically to `.cu-style` in CSS and all 39 source files. Reset declarations and composed utility classes were not changed. Lint, TypeScript, and the 66-route static build passed after the rename.

## Retired inactive CSS

`src/app/global-legacy.css`, `src/app/scoped-preflight.css`, and `src/styles/spectrum-fonts.css` had no active TypeScript/TSX import; the font file was referenced only by the inactive legacy stylesheet. CLOSE-001 rechecked the complete CSS import graph and retired all three without moving selectors into the runtime chain. `src/app/global.css` is now the only project CSS file.

The deletion does not claim historical selector parity: these files were already absent from runtime styling. Active classes, tokens, and scoped reset behavior remain unchanged in `global.css` and component markup.

## Deterministic checks

Phase 2 and later validation uses:

- search for project CSS imports outside the root layout;
- search for `@import "tailwindcss"` to prevent unscoped Preflight in the active chain;
- search for obsolete `.tw-scope` references;
- search for `.cu-style` boundaries and Spectrum compositions;
- lint, TypeScript, production static build, and browser comparison on affected routes.

`npm run check:css-boundaries` implements the import, unscoped Preflight, obsolete boundary-name, and required Tailwind layer checks. It intentionally does not modify CSS.

No Spectrum control should be placed under `.cu-style` solely for convenience. Existing mixed boundaries remain behavior-preservation evidence and require route-level visual validation before changing composition.
