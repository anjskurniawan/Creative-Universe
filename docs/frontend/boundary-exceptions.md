# Frontend Boundary Exceptions

> Status: Current; structural debt closed  
> Last verified: 2026-08-24

The target dependency policy is enforced by `apps/frontend/eslint.config.mjs`. Existing violations discovered at the Phase 1 baseline are disabled only on exact files; the global policy remains strict so new violations fail immediately.

An exception preserves existing source behavior while ownership is moved in its scheduled phase. It is not permission to add another forbidden dependency. Remove each file from the ESLint override as soon as its imports comply.

## Dependency policy

- `app` may depend on all canonical lower layers and route-local `app` code.
- `features` may depend on itself, shared components, core, hooks, lib, styles, and types, but not another feature or `app`.
- `components` may depend on shared components, core, hooks, lib, styles, and types, but not `app` or features.
- `core` may depend only on core, lib, and global types.
- context hooks may depend on their matching application-wide provider; providers, lib, styles, and types otherwise follow the direction in the architecture contract.

## Structural exceptions

No structural boundary exception remains. `eslint.config.mjs` has zero `boundaries/dependencies` overrides.

## Existing lint-rule debt

The ESLint config retains narrow exact-file exceptions for pre-existing non-boundary React hooks, explicit `any`, JSX keys, unescaped copy, and memoization rules. These preserve runtime behavior and are lint-rule debt, not dependency-boundary exceptions; changing those behaviors requires separate user validation.

## Closure evidence

For every removed exception, record the new canonical path, all updated consumers, a zero-result stale-path search, focused lint, full lint, TypeScript/static build, and the owning registry status. Do not mark final closure while any exact-file boundary override remains.

## Closed exceptions

| Closed | Former scope | Evidence |
|---|---|---|
| 2026-08-24 | `src/components/ui/file-upload-dropzone.tsx` | Consumer audit found one KV Retail product owner; implementation moved intact beside `TaskFormModal`, preview/catalog paths updated, stale source path removed, and the final structural ESLint override closed |
| 2026-08-24 | `src/core/layouts/core-shell.tsx` | No imports, renders, tests, or previews found; unused UI-bearing core module deleted together with its exact ESLint exception |
| 2026-08-24 | `src/components/panel/users/user-detail-modal.tsx` | UI, state hook, and shared `UserFormState` moved together to `features/panel-users`; route and registry consumers updated; exact ESLint boundary exception removed |
| 2026-08-24 | Creative Report Performa assessment/report exact files | Nineteen route-only files moved to `app/creative-report/performa/_components/`; route, hook, preview, registry, and internal imports updated; five exact boundary exceptions removed; unused `report-group.tsx` retired after zero-consumer audit |
| 2026-08-24 | Creative Report edit-member family | Six one-page components moved to `app/creative-report/creative-agent/edit/_components/`; route, nested media imports, and registry updated; final two CREATIVE-001 boundary exceptions removed |
| 2026-08-24 | `src/components/odds/task-form-modal.tsx` | Sole product consumer is KV `TaskPage`; implementation moved intact to `features/kv-retail/components/TaskFormModal/`, all source imports/registry paths updated, stale-path scan clean, and exact boundary exception removed |
| 2026-08-24 | `src/components/odds/legacy-taskcard/task-card.tsx` | ODDS-only Date consumer split route-locally; complete KV TaskCard/mobile family moved to `features/kv-retail/components/TaskCard/`; facade and old paths retired; TaskCardConfig extracted; focused cycles reduced from nine to zero; exact boundary exception removed |
| 2026-08-24 | `src/components/odds/task-performance-desktop.tsx` | Desktop/mobile renderers and shared task contract moved together to `features/kv-retail/components/TaskPerformance/`; Performance route and developer registry updated; exact generic-layer exception removed |
| 2026-08-24 | `src/features/odds/components/task-detail/detail-ui.tsx`, `odds-task-detail-view.tsx` | Shared brief/request types moved to `features/odds/types`; theme context moved from the route tree to `features/odds/context`; zero feature-to-app imports remain and both exact boundary exceptions were removed |
| 2026-08-24 | `src/components/odds-designer-task-row-card.tsx`, `src/components/odds-task-chat.tsx`, `src/components/odds/TaskCard/odds-task-card.tsx` | Complete consumer audit proved these components are ODDS business UI; the full families moved under `features/odds/components/` and all three generic-layer exceptions were removed |
| 2026-08-24 | `src/components/odds/retro/*` | Complete developer-catalogued retro family and OddsGameboyFrame moved to PascalCase `features/odds/components/Retro/`; duplicate route `TaskForm` retired in favor of identical `OddsRequestForm`; all source, preview, and catalog consumers updated; eleven exact generic-layer exceptions removed |
