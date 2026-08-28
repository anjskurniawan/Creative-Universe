# ODDS Ownership Audit

> Status: Current  
> Last verified: 2026-08-24

This document maps the active ODDS frontend before and during `ODDS-001`. It is a structural ownership reference, not authorization to alter lifecycle, permissions, API contracts, UI, or backend behavior.

## Route ownership

| Route | Current owner | Responsibility |
| --- | --- | --- |
| `/odds` | Routing-only `src/app/odds/page.tsx`; route-local `OddsPage` | Section orchestration, task lists, reports, rankings, escalation and review surfaces |
| `/odds/new` | Routing-only `src/app/odds/new/page.tsx`; route-local `NewOddsTaskPage` | Request state, drafts, attachments, catalog loading, submit orchestration |
| `/odds/option` | Routing-only `src/app/odds/option/page.tsx`; route-local `OddsOptionPage` | Root-only category configuration surface |
| `/odds/detail` | Routing-only `src/app/odds/detail/page.tsx`; feature `OddsTaskDetail` | Selected task detail entry and reusable lifecycle surface |
| `/odds/detail/dummy` | `src/app/odds/detail/dummy/` | Dummy-only task-detail QA provider and route |

`src/app/odds/layout.tsx` is a routing-only wrapper around `src/features/odds/components/OddsShell/OddsShell.tsx`. The feature shell owns ODDS menu composition, permission filtering, task counters, realtime invalidation, theme state, viewport selection, and the exact `Container` composition. `src/features/odds/context/OddsThemeContext.tsx` owns the light/dark/retro context consumed across ODDS routes and task-detail UI.

## Feature ownership

- `src/features/odds/api/index.ts` owns the browser API contracts and domain response types.
- `src/features/odds/components/OddsRequestBuilder/` owns the reusable multi-step request UI in one PascalCase parent/child tree.
- `src/features/odds/components/BriefDetails/` owns standard/table brief editing, previews, and read-only rendering.
- `src/features/odds/components/OddsTaskDetail/` owns lifecycle actions, tabs, history, discussion, revisions, protected outputs, QA boundaries, and responsive task detail.
- `OddsTaskCard`, `OddsTaskChat`, `OddsRichTextEditor`, and `OddsDesignerTaskRowCard` are feature-owned because their complete consumer graph is ODDS-only and their props/rendering encode ODDS task state.
- The single-route dashboard/report/ranking/escalation orchestration and schedule configuration live under `src/app/odds/_components/OddsPage/`.
- Option tabs/menu and category panels live under `src/app/odds/option/_components/OddsOptionPage/` because their audited consumer is only `/odds/option`.
- `src/features/odds/types/` owns contracts shared across two or more ODDS component families. It now owns `TableBriefRow`, `OddsRequestForm`, and `OddsRequestBuilderDraft`.
- `src/app/odds/_components/TaskCardDate/` remains route-local because its audited consumer is only the ODDS route.

The generic-looking rich-text, chat, retro, task-card, and designer-row surfaces have completed consumer audits. Developer previews and catalog records are technical consumers, not evidence of cross-domain reuse; the product consumers are exclusively ODDS, so these surfaces remain domain-owned.

## Permissions and actors

The layout and page consumers currently check the following ODDS permissions: `manage-odds-config`, `manage-users`, `review-odds-leader`, `view-all-odds-tasks`, `approve-odds-extra-revisions`, `approve-odds-urgent-revisions`, `manage-odds-escalations`, `review-odds-queue-skip`, `view-odds-reports`, `view-odds-rankings`, `create-odds-tasks`, and `view-assigned-odds-tasks`.

Structural checkpoints must retain exact permission strings and their current action/menu consumers. No inferred role or bug correction is permitted without separate user validation.

## Lifecycle and API groups

The feature API covers these inseparable contract groups:

- configuration: categories, designer profiles, system rules, product catalog, and assignable users;
- requests: create task, task drafts, attachments, brief update/return/accept/force/cancel;
- execution: queue, start, pause, result submission, and deadline extension;
- review: leader/SPV review, client review, rating, normal/extra/urgent/leader revisions;
- escalation: cancel, reassignment, queue skip/priority, special-revision and cancellation reviews;
- reporting: daily reports, summaries, and rankings.

Status strings, payloads, validation, error handling, revision limits, deadlines, protected upload URLs, and review decisions remain runtime contracts. They may be relocated only with source-preserving moves and focused consumer checks.

## Realtime, files, and responsive contracts

The ODDS shell subscribes through `src/core/realtime/client.ts` and listens for `.odds.task.updated` and `.odds.task.deleted` before refreshing counters. Attachments and brief references use `/api/v1/odds/uploads/<id>/content`; task result/output surfaces must retain protected URL behavior and download/view semantics.

Desktop, mobile, retro-theme, overlay, and dummy-only QA branches are behavior contracts. Technical build evidence does not replace authenticated desktop/mobile manual QA.

## ODDS-001 checkpoints

1. Shared contracts and dependency cycles.
2. Shell, permissions, menu, counters, and realtime. Completed structurally: the feature owns the intact shell/context and the app layout is routing-only.
3. Request builder, drafts, briefs, uploads, catalog, designer selection, and SLA. Completed structurally: route entry is thin, one-page orchestration is route-local, reusable builder/retro UI and contracts are feature-owned.
4. Task detail lifecycle, discussion/history, output, revisions, and QA boundaries.
5. Option/configuration, reports, rankings, escalations, and residual component ownership.
6. Full stale-path, boundary, responsive, route, and documentation audit.

Checkpoint 6 completed the residual placement and evidence audit. `BriefDetails`, every `OddsTaskCard` child, every `OddsTaskDetail` child, `OddsDesignerTaskRowCard`, `OddsRichTextEditor`, and `OddsTaskChat` now use PascalCase component folders with a same-named primary file. Browser-only helpers live under `features/odds/utils/`; the dummy provider is route-local under a PascalCase `_components` tree. No generic `components/` ODDS path, feature-to-app import, cross-feature import, stale source import, circular dependency, or ODDS boundary exception remains.

Completion evidence also re-enumerated all six ODDS route entries, 87 exported API contracts, current endpoint literals, permission checks, task/status literals, realtime custom events, protected-file helpers, dummy local-storage/QA branches, and 289 responsive/dummy contract markers. These checks prove current source ownership and preservation of the literal contracts; authenticated/manual behavior remains pending and is not inferred from technical gates.

Checkpoint 5 made `/odds` and `/odds/option` routing-only. The complete 6,000-line dashboard implementation moved intact to route-local `OddsPage`, retaining its task loading, optimistic/realtime updates, control views, reporting, rankings, escalations, configuration forms, permissions, responsive cards, overlays, and theme branches. Its sole-consumer `ScheduleConfig` moved with it. The root-only option orchestration and its four sole-consumer category/navigation components moved together into a PascalCase route-local tree. API calls, permission strings, state defaults, validation, labels, markup, classes, and redirects were not rewritten.

Checkpoint 4 moved the complete task-detail lifecycle graph and its ODDS-only support components into canonical feature ownership. Both detail routes still render the same `OddsTaskDetail` implementation; the dummy provider remains route-local and retains scenario, POV, brief-type, local-storage, and QA-boundary behavior. Task status/action handlers, permissions, discussion/history/audit, revisions, protected output, realtime browser events, responsive branches, rich-text behavior, feedback toasts, and markup were not rewritten. The final three ODDS generic-layer boundary exceptions are closed.

Checkpoint 1 moved only shared TypeScript contracts to `src/features/odds/types/`. All known consumers were updated atomically. The former `brief-details -> request-builder/types -> brief-details` cycle is gone; no runtime implementation or public route behavior changed.

Checkpoint 2 moved the complete shell implementation intact to `src/features/odds/components/OddsShell/` and its multi-route theme context to `src/features/odds/context/`. The route wrapper retains only composition. Permission checks, role normalization, menu construction/order, section URLs, count formulas, realtime private channel and event names, browser custom events, theme transitions, responsive breakpoint, markup, classes, and shared layout props are unchanged.

Together with checkpoint 1, the context move removes all `features/odds -> app/odds` imports from task-detail. The two exact ESLint boundary exceptions for `detail-ui.tsx` and `odds-task-detail-view.tsx` are closed; remaining ODDS exceptions belong to historical generic component paths and the route-owned `TaskForm` dependency in the retro request UI.

Checkpoint 3 made `/odds/new` routing-only and moved its intact one-page orchestration to `_components/NewOddsTaskPage/`. The reusable builder was reorganized into `features/odds/components/OddsRequestBuilder/` with explicit PascalCase component folders and existing internal composition preserved. `OddsRequestForm` is now the only request form contract; the identical route `TaskForm` and its file were retired.

The complete retro request family and `OddsGameboyFrame` moved from generic `components/odds` to `features/odds/components/Retro/`. Developer catalog metadata and the frame preview now reference canonical sources. The retro family is not imported by the active request route but remains exposed by developer tooling, so it was retained. Its unconsumed duplicate utility module and the unconsumed `BriefPurposeStep` were deleted only after source, Madge orphan, preview, and catalog audits found no consumers. Eleven generic-layer ESLint exceptions closed.

The active request contracts remain unchanged: four initial resources load together; active designers are filtered; capacity honors `global_daily_capacity` and `holiday_calendar`; draft query state restores form, attachments, and wizard state; upload count remains capped at eight; submit requires category, preferred designer, purpose, and non-empty brief; table catalog values are committed before task creation; optional values remain omitted from the payload; successful submit deletes the source draft, shows the launch sequence, and routes to `/odds/detail?id=<id>`.

## Validation boundary

ODDS-001 is technically verified: source ownership, placements, dependency direction, exports, catalog paths, lint, TypeScript, CSS boundaries, cycles, documentation, and static export gates pass. Authenticated lifecycle, realtime, protected-file, configuration/reporting, desktop/mobile, and visual parity remain pending while the local API/session is unavailable; technical verification is not manual QA approval.

## Related documents

- [In-place restructuring architecture](rebuild-architecture.md)
- [Frontend restructuring registry](migration-inventory.md)
- [Frontend restructuring baseline](restructure-baseline.md)
- [Component restructuring conventions](component-tree-migration.md)
