# Component Tree — In-Place Restructuring Conventions

> Status: Active restructuring guidance  
> Last verified: 2026-08-24  
> Source evidence: active routes and components in `apps/frontend/`

## Scope

This workflow changes ownership and paths without rewriting product behavior. Before moving a component, trace the live route, every direct and indirect consumer, API usage, permission and validation logic, loading/empty/error states, responsive behavior, accessibility, tests, previews, and CSS dependencies.

`apps/frontend-cancel/` is a cancelled read-only snapshot and must not be inspected as the implementation authority, changed, imported, or included in the build graph.

## Component leveling

| Level | Criteria | Target |
|---|---|---|
| Page-specific | One page | `app/.../_components/` |
| Feature-specific | Two or more pages in one domain | `features/<domain>/components/` |
| Cross-feature | Multiple domains with retained business context | Explicit cross-feature review |
| Generic | Domain-neutral, at least three pages across at least two domains | `components/ui/` |

Consumer count triggers evaluation but never overrides ownership. A widely used component carrying API state, permissions, business copy, or domain variants remains domain-owned. Recalculate after every consumer addition or removal.

## Atomic move rules

For each move:

1. Record current path, target path, unique page consumers, unique domains, and dependency direction.
2. Preserve props, markup, classes, interaction, accessibility, state, API calls, and exports unless a separate instruction authorizes contract changes.
3. Move implementation, tests, types, config, logic, styles, stories/previews, and per-component barrel together when they share ownership.
4. Update every import in the same phase; do not leave compatibility shims by default.
5. Search old paths, symbols, and barrel exports after the move.
6. Delete old files only when consumer and reference searches are empty.
7. Run focused lint/type checks and the production static build.
8. Smoke affected routes in a browser when the environment is available.
9. Update the restructuring registry and component-tree documentation.

## Target mapping

- Spectrum S2 adapters and compositions: `components/spectrum/`.
- Domain-neutral React Aria plus Tailwind primitives: `components/ui/` after generic thresholds are met.
- Shell, header, navigation, sidebar, container, workspace, content, and breadcrumb: `components/layout/` when genuinely reusable.
- Generic error, empty, loading, and toast surfaces: `components/feedback/`.
- Domain UI and state: `features/<domain>/`.
- Route-only UI: colocated `_components/`.
- Pure HTTP, auth/session, permissions, and realtime infrastructure: `core/`.

Spectrum S2 is the default component system when its official API fits. A genuinely new custom component uses React Aria for accessibility and interaction with project-owned Tailwind styling. Structural work does not authorize replacing the implementation technology of an existing component.

Current PANEL-001 examples include `features/panel-users/`, `features/panel-roles/`, and `features/panel-maintenance/`. Maintenance owns its status, emergency, command-console hooks, shared response type, and component folders together; `app/(core)/panel/maintenance/page.tsx` owns only route composition and access-denied rendering.

## CSS ownership

The target has one global file: `src/app/global.css`. Spectrum foundations, shared tokens, fonts, and minimal document rules may be global. Legacy Tailwind/reset behavior must be scoped beneath `.cu-style`. Component- or feature-specific selectors move with their owner only after consumer and visual evidence is captured.

## Registry status

Each restructuring phase moves through:

```text
planned -> audited -> in_progress -> technically_verified -> complete
```

Technical verification requires boundary lint, type-check, static build, stale-reference scan, and browser smoke evidence where feasible. Manual QA may remain pending while an independent phase proceeds; no phase may intentionally alter UI or behavior.
