# Frontend Final Structural Audit

> Status: Current  
> Last verified: 2026-08-24

This document records the repository-wide `CLOSE-001` audit for the only active frontend in `apps/frontend/`. It proves structural ownership and dependency direction; it does not claim authenticated manual QA or authorize product behavior changes.

## Routing and ownership

- All 66 static-export routes retain their original route paths.
- The source inventory contains 63 `page.tsx` entries, 18 layouts, 732 TypeScript/TSX modules, 56 shared-component TSX modules, 173 feature TSX modules, and zero `.test`/`.spec` modules.
- `page.tsx` files own redirects, Suspense boundaries, route props, or thin composition only. Thirty-one remaining full page implementations were moved intact into same-route PascalCase `_components/<PageName>/<PageName>.tsx` ownership.
- Shared presentation uses PascalCase folders with same-named primary files. The final source scan reports zero primary-component naming violations.
- Domain UI remains under `features/<domain>/components/`; one-page UI remains route-local; generic presentation remains under `components/`; pure infrastructure remains under `core/`.
- Historical empty folders under `components/archive`, `creative`, `creative-report`, `dashboard`, `docs`, `landing`, `messages`, `notifications`, `odds`, `panel`, `primitives`, `settings`, and `universe` were removed after zero-file checks.

## Consumer decisions

- `IconMaterial` has four auth-domain consumers and is owned by `features/auth/components/IconMaterial/`.
- `ProfileImageUpload` has one product page consumer and is owned by the account-profile route.
- `InteractiveComponentPlayground` is developer-library tooling and is owned route-locally.
- KV Retail is the only product consumer of `FileUploadDropzone`; it now owns the upload UI beside `TaskFormModal`, closing the final generic-to-feature boundary exception.
- Two byte-identical `SideMenu` implementations had no product consumer and one catalog registration. One canonical developer-catalogued implementation remains under `components/navigation/sidemenu/SideMenu/`; the duplicate was retired.
- ODDS and KV each retain their identical `TaskCardDate` copy. There are only two product pages across two domains, below the documented three-page generic promotion threshold; retaining narrow owners prevents a forbidden cross-feature dependency.

## Dependency and path evidence

| Check | Result |
| --- | --- |
| Cross-feature imports | 0 |
| Feature-to-app imports | 0 |
| Generic component imports from feature/app/provider | 0 |
| Core imports from app/feature/component/provider/hook | 0 |
| Three-level deep relative imports | 0 |
| Broad root component barrels | 0 |
| Structural `boundaries/dependencies` overrides | 0 |
| Missing exact ESLint file paths | 0 |
| Reparse points or source links | 0 |
| Active source/config references to `frontend-cancel` | 0 |
| Circular dependencies | 0 |

Per-component, API, and type barrels remain allowed cohesive public boundaries. The former broad `features/auth/components/index.ts` layer barrel was replaced with direct family imports.

## CSS and registry evidence

`src/app/global.css` is the only project CSS file. The root layout imports only Spectrum S2 page CSS and this file. Tailwind theme/utilities load without unscoped Preflight, and legacy reset behavior remains beneath `.cu-style`. Three zero-consumer inactive stylesheets were retired.

The Developer Library has 191 active non-folder catalog items. Every explicit or fallback source path resolves, all 60 absolute preview imports resolve, and all 53 preview registry keys match active catalog items. Nine stale Creative AI metadata aliases with no source symbol or file were retired.

## Cancelled frontend and backend boundary

`apps/frontend-cancel/` has no active import, alias, symlink, script, deployment, or build-graph reference. It remains read-only. Backend files are outside this restructuring and were not written by CLOSE-001. Existing unrelated dirty-worktree entries in either excluded area are not evidence of changes by this phase.

## Validation boundary

Technical closure passed with full lint at 0 errors and 197 preserved warnings, TypeScript success, CSS verification across 732 modules, zero cycles, complete catalog/preview resolution, documentation validation, and a clean production static build of 66 routes. A local static server returned HTTP 200 for all 65 generated index URLs across every route group. Authenticated role/permission, API, realtime, protected-file, responsive, and visual QA remain pending and are not inferred from static or unauthenticated evidence.

## Related documents

- [In-place restructuring architecture](rebuild-architecture.md)
- [Frontend restructuring registry](migration-inventory.md)
- [CSS selector inventory](css-selector-inventory.md)
- [Boundary exceptions](boundary-exceptions.md)
- [Frontend restructuring goal](../../FRONTEND_RESTRUCTURE_GOAL.md)
