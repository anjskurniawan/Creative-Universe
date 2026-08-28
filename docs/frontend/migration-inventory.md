# Frontend In-Place Restructuring Registry

> Status: Active planning registry  
> Last verified: 2026-08-24  
> Source: active routes, components, configuration, and tests in `apps/frontend/`

This registry replaces the former clean-rebuild migration inventory. It tracks structural reorganization inside the complete active application; it does not track feature rewrites or parity migration from another source tree.

## Status flow

```text
planned -> audited -> in_progress -> technically_verified -> complete
```

| Status | Required evidence |
|---|---|
| `planned` | Scope, owner, dependencies, and exclusions identified |
| `audited` | Routes, consumers, APIs, permissions, state, CSS, tests, and target ownership recorded |
| `in_progress` | Atomic structural move underway; imports updated in the same phase |
| `technically_verified` | Placement/boundary checks, lint, type-check, build, stale-reference scan, and route smoke completed |
| `complete` | Documentation synchronized and no unresolved structural exception remains |

Manual visual QA is recorded as evidence but is not a status gate for structurally independent work. No status authorizes intentional UI, behavior, API, permission, business-rule, or backend changes.

## Program invariants

- `apps/frontend/` is the only active frontend.
- `apps/frontend-cancel/` is strictly read-only and excluded from the build graph.
- Backend is outside scope.
- Every completed phase leaves lint, type-check, static build, and affected routes operational.
- Every move updates all imports atomically; compatibility shims require explicit approval.
- Unused code is deleted only after consumer audit and stale-reference scans.
- `src/app/global.css` remains the sole global stylesheet; legacy Tailwind/reset behavior is scoped under `.cu-style`.

## Phase registry

| ID | Phase | Target ownership | Status | Manual QA | Primary completion evidence |
|---|---|---|---|---|---|
| CUT-001 | Restore complete application as active frontend and archive cancelled rebuild | `apps/frontend/`, `apps/frontend-cancel/` | complete | Not required | Folder ownership isolated; active references clean; lint/type/build exports 66 routes; docs synchronized |
| FND-001 | Baseline inventory, scripts, package/config, aliases, and static-export evidence | frontend root, `src/` | complete | Pending | Baseline and final inventories recorded; clean build exports 66 routes and all output routes pass HTTP smoke |
| FND-002 | ESLint dependency boundaries and temporary exception registry | `eslint.config.mjs` | complete | Not required | Every layer is classified; structural dependency overrides and missing exact paths are zero; full lint exits 0 |
| FND-003 | Sole global stylesheet, Spectrum foundation, scoped Tailwind/reset, token ownership | `app/global.css`, `styles/` | complete | Pending | `global.css` is the only project CSS file; Spectrum root import and `.cu-style` scoped Tailwind/reset checks pass |
| FND-004 | Core infrastructure ownership | `core/api`, `core/auth`, `core/permissions`, `core/realtime` | complete | Pending | Core upward imports are zero and the final file-upload generic-to-feature exception is closed |
| AUTH-001 | Authentication routes, state, API, onboarding, forgot password, landing auth | `features/auth`, route-local UI, `providers/`, `hooks/auth` | complete | Pending | Auth UI is feature/route owned, shared component naming is canonical, registry paths resolve, and technical gates pass |
| SHELL-001 | Root providers, app shell, navigation, layout, feedback boundaries | `providers/`, `components/layout`, `components/feedback` | complete | Pending | Shell/navigation/feedback ownership is canonical; duplicate SideMenu and historical empty folders are retired; technical gates pass |
| PANEL-001 | Settings and panel routes, users, roles, profile, maintenance | `features/settings`, `features/panel-users`, `features/panel-roles`, `features/panel-maintenance`, route-local UI | complete | Pending | All page implementations are routing-only or route-local; domain ownership and final repository gates pass |
| CORE-001 | Messages and notifications | `features/messages`, `features/notifications` | complete | Pending | Page, dropdown, API/realtime, and shell injection ownership is canonical with zero cross-feature imports |
| CREATIVE-001 | Creative AI and Creative Report | `features/creative-ai`, `features/creative-report`, route-local UI | complete | Pending | Creative ownership is canonical; stale catalog aliases are retired; all remaining registry paths resolve |
| KV-001 | KV Retail routes and reusable domain UI | `features/kv-retail`, route-local UI | complete | Pending | KV page/domain UI and upload ownership are canonical; all stale shared paths and final boundary exception are closed |
| GEN-001 | Generator and Pricetag | `features/generator-pricetag`, route-local UI | complete | Pending | Four route implementations and shared feature contracts are canonical; final lint/type/build/HTTP smoke pass |
| ODDS-001 | ODDS request, task lifecycle, details, QA, output, and mobile UI | `features/odds`, route-local ODDS UI | complete | Pending | Six checkpoints plus repository-wide placement/import/cycle/catalog/static-output audits pass |
| DEV-001 | Developer tools, previews, component library, beta routes | route-local developer UI and canonical component owners | complete | Pending | Developer ownership is canonical; 191 catalog items, 60 preview imports, and 53 preview keys resolve |
| CLOSE-001 | Global placement/import audit and obsolete-path retirement | Entire `apps/frontend/src` | complete | Pending | Zero placement, direction, broad-root-barrel, deep-relative, stale registry, cycle, structural-exception, cancelled-frontend-link, or CSS-entry violations |
| CLOSE-002 | Full regression, documentation synchronization, and goal closure | Entire active frontend | complete | Pending | Lint 0 errors, TypeScript/CSS/cycles/docs pass, build exports 66 routes, 65 static index URLs return HTTP 200, and documentation/registry are synchronized |

## Required evidence per phase

Each phase entry must accumulate:

- exact route and source scope;
- current and target ownership;
- unique component consumers and domain count;
- API, permission, business-state, validation, and error invariants;
- CSS selectors/global dependencies and `.cu-style` ownership;
- moved/deleted files and every updated import;
- ESLint boundary result, type-check, production build, and stale-reference scan;
- browser smoke routes, viewport coverage, console/network observations, and pending manual QA;
- temporary exceptions, owner, removal phase, and residual risk.

The detailed execution checklist is maintained in the root [FRONTEND_RESTRUCTURE_GOAL.md](../../FRONTEND_RESTRUCTURE_GOAL.md).
