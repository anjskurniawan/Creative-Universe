# KV Retail Ownership Audit

> Status: Active restructuring reference  
> Last verified: 2026-08-28

This document records KV-001 route, consumer, state, API, permission, realtime, print, and component ownership evidence. It authorizes structural placement only; UI, behavior, payload, permission, timing, responsive, and accessibility changes remain outside scope.

## Route and rendering ownership

- `/kv-retail`, `/kv-retail/month`, and `/kv-retail/unfinished` are statically exported route wrappers around feature-owned `TaskPage`; the mode prop selects current, month, or unfinished filtering without duplicating the workflow.
- `/kv-retail/performance` owns performance report composition, month comparisons, mobile report cards, desktop charts, realtime refresh, Creative Agent summary, theme state, and print trigger; its desktop shell uses the same themed outer background plus `Container`/`Workspace` layout contract as `/kv-retail`, while the mobile breakpoint retains the compact performance-specific shell.
- `/kv-retail/option` owns permission-gated settings composition and persists page labels plus task-card strings through `coreApi.settings`.
- `/kv-retail/print` owns the `task` query parameter, browser-side task/suggestion loading, PNG generation through `html-to-image`, Creative Agent generation, and print-preview composition.
- All six routes remain static output and require the live Laravel API plus authenticated browser session for protected data and mutations.

## API, state, and permission contracts

- `features/kv-retail/api` retains `/kv-retail/tasks` list/create/title/status/files/delete, `/kv-retail/assignees`, temporary upload, task Creative Agent suggestion/generation, and latest performance report calls.
- `useKvRetailTasks` retains request sequencing, state epochs, per-task versions, optimistic mutation, realtime-newer-response protection, rollback, merge, removal, and loading state.
- `TaskPage` retains `kv-retail.tasks.create` administration behavior, route-mode filtering, search/status filters, title/settings loading, modal creation, task status/title/file/delete mutations, Echo assigned/updated/deleted events, desktop/mobile themes, and feedback/error states.
- Performance retains `kv-retail.tasks.create` access redirect, task period calculations, timing/bottleneck rules, completion-only rating, priority actions, Echo refresh, latest Creative Agent report, mobile/desktop responsive surfaces, and browser print.
- Option retains `kv-retail.settings.manage` gating, exact setting keys/defaults, tabs, loading, update payload, alert feedback, and theme/sidebar state.
- Print retains missing-task/error/loading states, task lookup, suggestion generation, fixed 403x632 capture, sanitized filename, blob lifecycle, and action disabling.

## Current canonical feature ownership

- `features/kv-retail/api`, `types.ts`, and `hooks/` own KV transport, contracts, task state, and persisted desktop-sidebar state.
- `PerformanceNavbar` and `PerformanceSidebar` serve task, performance, and option routes and remain feature-specific shell components.
- `TaskPage`, TaskPageTitle, TaskKpiMetrics, TaskSearchBar, and TaskFilterDropdown serve three task routes and remain feature-specific.
- `TaskFormModal` has one component consumer, `TaskPage`, whose composition serves all three task routes; it is therefore a parent-owned KV feature component at `features/kv-retail/components/TaskFormModal/` rather than shared ODDS UI.
- The complete desktop/mobile task-card workflow now lives under `features/kv-retail/components/TaskCard/`. `TaskCardConfig` is a feature-local type, every meaningful child has a PascalCase folder, and the public feature barrel preserves the symbols consumed by TaskPage and Option.
- `performance-page-config.ts` serves Performance plus shared KV shell labels and remains feature configuration.

## Completed one-page presentation slice

PerformanceContentTitle, PerformanceMetricCard, PerformanceSideSummary, and PerformanceChartIndicators each have exactly one product-page consumer and now live under `app/kv-retail/performance/_components/` in PascalCase component folders. TaskPrintPreview likewise has exactly one product-page consumer and now lives under `app/kv-retail/print/_components/TaskPrintPreview/`.

All five route imports moved atomically. The move preserves exported props, hooks, calculations, strings, SVG/markup, Tailwind classes, print dimensions, Creative Agent presentation, chart/priority interaction, theme handling, and responsive behavior.

## Completed task-card ownership split

The product-consumer graph showed one cross-domain edge: `app/odds/page.tsx` imported only the visual `TaskCardDate` child. ODDS now owns an identical route-local implementation at `app/odds/_components/TaskCardDate/`; KV retains the same implementation inside its parent TaskCard family. This deliberate domain split avoids an ODDS-to-KV or KV-to-ODDS dependency and does not introduce a compatibility facade.

The former `components/odds/legacy-taskcard`, `components/odds/taskcard-mobile`, and `components/odds/task-card.tsx` paths are retired. TaskPage, Option, the internal child graph, and developer-library source metadata were updated atomically. Extracting `TaskCardConfig` from the old barrel removed all nine focused TaskCard cycles, and the exact generic-layer boundary exception for the former main TaskCard was removed.

The former `components/odds/task-form-modal.tsx` had no ODDS product consumer. Its implementation moved intact to the KV feature, the TaskPage and developer-library source path changed atomically, and its obsolete generic-layer boundary exception was removed.

## Completed performance ownership

The former `components/odds/task-performance-mobile.tsx` and `task-performance-desktop.tsx` renderers now live together under `features/kv-retail/components/TaskPerformance/`. Their shared `TaskPerformanceTask` contract is feature-local, the KV Performance route imports that contract directly, developer-library source paths resolve to the new owners, and the desktop renderer's exact generic-layer boundary exception is closed.

KV routes and feature code no longer import the historical ODDS task-card, taskcard-mobile, task-performance, or generic SideMenu paths. The former SideMenu catalog implementation remains a developer-library artifact for DEV-001; KV arrays now use their actual `PerformanceSidebarItem` and `KvRetailCompactMenuItem` owner contracts.

## Validation contract

Every KV slice requires focused and full lint, dependency boundaries, cycle and stale-path scans, registry resolution, TypeScript, production static build, and authenticated browser smoke when API/session access is available. Manual QA remains pending and does not authorize behavior changes.

Related references: [architecture contract](rebuild-architecture.md), [placement audit](legacy-component-audit.md), [boundary exceptions](boundary-exceptions.md), and [phase registry](migration-inventory.md).
