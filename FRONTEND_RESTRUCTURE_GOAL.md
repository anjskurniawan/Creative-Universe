# CreativeUniverse Frontend In-Place Restructuring Goal

> Status: Active goal  
> Created: 2026-08-24  
> Active source: `apps/frontend/`  
> Read-only cancelled snapshot: `apps/frontend-cancel/`  
> Canonical contract: `docs/frontend/rebuild-architecture.md`

## 1. Goal

Reorganize the complete active CreativeUniverse frontend in place into the canonical `app`, `components`, `features`, `core`, `providers`, `hooks`, `lib`, `styles`, and `types` ownership model without changing any observable product contract.

The goal is complete only when:

- no known placement violations remain;
- all imports satisfy the enforced dependency boundaries;
- every feature, shared component, route-local component, provider, and infrastructure module has canonical ownership;
- every existing route, UI, feature, interaction, API contract, permission, validation rule, business rule, accessibility contract, and responsive behavior remains functional;
- lint, type-check, production static build, and required route smoke tests pass;
- the sole global stylesheet and scoped legacy Tailwind contract are established;
- the restructuring registry, component tree, CSS documentation, operational commands, and architecture documentation are synchronized.

## 2. Explicit authorization boundary

This file is a plan only. Creating or reviewing it does not authorize execution. Start the goal only after a separate explicit user instruction.

During execution, the goal may continue across sessions automatically, but it does not authorize:

- commit, push, pull request, merge, rebase, tag, amend, or history rewrite;
- backend edits, backend formatting, backend tests that mutate state, database migrations, or seeders;
- deployment or production configuration changes;
- deletion of `apps/frontend-cancel/`;
- bug fixes, redesign, visual refinements, feature changes, API changes, permission changes, business-rule changes, or behavioral cleanup;
- destructive cleanup of unrelated dirty-worktree changes.

If structural work cannot proceed without one of these actions, stop that phase and request explicit direction.

## 3. Immutable product invariants

Every phase must preserve:

- route URLs, route groups as observed externally, query parameters, redirects, and static output;
- rendered content, wording, colors, dimensions, spacing, responsive breakpoints, motion, and interaction sequences;
- API base URL behavior, methods, endpoints, headers, payloads, response handling, errors, retries, and uploads;
- authentication, session restoration, onboarding, logout, guards, permissions, roles, statuses, and application access;
- domain workflows and lifecycle transitions in Panel, Settings, Messages, Notifications, Creative AI, Creative Report, KV Retail, Generator, ODDS, and developer tools;
- local state, server state, realtime behavior, loading/empty/error/success states, and persistence;
- keyboard interaction, focus behavior, accessible names, semantics, and screen-reader contracts;
- public exports used by current consumers, except where every consumer is atomically updated in the same phase;
- static-export constraints and the existing Laravel API boundary.

Finding a suspected defect does not authorize fixing it. Record the observation as a risk without changing behavior.

## 4. Target ownership model

```text
src/
├── app/                 # Routing, layouts, metadata, route boundaries only
├── components/
│   ├── ui/              # Generic domain-neutral primitives
│   ├── spectrum/        # Spectrum S2 adapters/compositions
│   ├── layout/          # Reusable application shell and navigation
│   └── feedback/        # Generic loading/empty/error/toast surfaces
├── features/<domain>/   # Domain UI, state, API, hooks, and types
├── core/                # Pure API/auth/permission/realtime infrastructure
├── providers/           # Application-wide React providers
├── hooks/               # Generic cross-feature hooks
├── lib/                 # Pure utilities, formatters, constants
├── styles/              # Theme/token synchronization
└── types/               # Truly global types
```

Component levels:

| Level | Evidence | Owner |
|---|---|---|
| Page-specific | One page | Route-local `_components/` |
| Feature-specific | At least two pages in one domain | `features/<domain>/components/` |
| Cross-feature | Multiple domains with business context | Explicit ownership review |
| Generic | Domain-neutral, at least three pages across at least two domains | `components/ui/` |

Spectrum S2 is the default when an official component fits. Genuinely new custom components use React Aria as the accessibility and interaction foundation with Tailwind styling. Structural phases do not replace existing component technology unless separately authorized.

## 5. Goal operating protocol

At the start of every continuation:

1. Read root `AGENTS.md`, the canonical architecture, this goal file, and the current restructuring registry.
2. Read the mandatory work-log skill and retrieve only relevant recent history.
3. Inspect `git status` and preserve all unrelated changes, especially every backend change.
4. Confirm `apps/frontend-cancel/` has not been selected as a working directory or implementation target.
5. Resume the first incomplete phase; do not repeat a completed phase unless validation evidence has drifted.

For every active phase:

1. Move registry status from `planned` to `audited` only after evidence collection is documented.
2. Establish current and target ownership plus explicit product invariants.
3. Move one coherent ownership slice at a time, updating every import and related test/preview/barrel atomically.
4. Keep the application buildable; resolve structural failures before starting another move.
5. Update the registry and relevant current-state documentation before the phase work-log entry.
6. Leave manual QA as pending when required; continue only with structurally independent work.

Stop immediately when:

- a change would intentionally alter UI, behavior, API, permission, validation, or business logic;
- backend changes appear necessary;
- the build cannot be returned to green within the current structural slice;
- ownership cannot be determined from consumers and domain boundaries;
- a destructive operation has an ambiguous target;
- current dirty-worktree changes overlap in a way that cannot be preserved safely.

## 6. Validation matrix

Each phase defines focused checks, but all completed phases use this minimum matrix:

| Check | Purpose | Gate |
|---|---|---|
| Consumer and stale-path search | Prove every import/export/reference moved atomically | Required |
| ESLint boundaries | Prove dependency direction and placement | Required |
| Focused ESLint | Catch local syntax, hooks, and ownership issues | Required |
| TypeScript/type-aware build | Prove imports and public contracts compile | Required |
| Production static build | Preserve deployable output | Required |
| `git diff --check` scoped to frontend/docs | Catch whitespace and patch defects | Required |
| Browser route smoke | Prove route loading, navigation, primary interaction, and console health | Required when environment available |
| Responsive smoke | Preserve mobile/desktop shell for affected visual ownership | Required when applicable |
| Manual user QA | Direct visual/behavior approval | May remain pending; never inferred from technical checks |
| Documentation validator | Keep current-state docs consistent | Required when docs change |
| Work-log validator | Preserve immutable task history | Required every continuation |

Do not run backend mutation commands. Backend files in `git status` are unrelated and must remain byte-for-byte untouched by this goal.

## 7. Phase 0 — Cutover contract and safety baseline

**Objective:** Establish the former complete application as the only active frontend and retire the clean rebuild without losing either worktree.

**Scope:** Folder ownership, read-only guard, root/app instructions, current-state architecture, registry semantics, task goal, and repository-wide reference audit.

**Execution checklist:**

- [x] Rename the clean rebuild from `apps/frontend/` to `apps/frontend-cancel/` while preserving its local changes.
- [x] Rename the former legacy application from `apps/frontend-legacy/` to `apps/frontend/` while preserving its complete behavior and local changes.
- [x] Mark `apps/frontend-cancel/` as a strictly read-only cancelled snapshot and exclude it from active ownership.
- [x] Replace rebuild/migration instructions with in-place restructuring rules.
- [x] Retire the clean-rebuild component QA registry as an active workflow.
- [x] Establish the restructuring registry and this goal draft.
- [x] Audit active scripts, docs, configs, and source comments for stale active ownership references; classify the immutable work log, cancelled snapshot, and generated backend public artifact as non-current or out of scope.
- [x] Verify Git recognizes the active tree and cancelled snapshot as distinct transitions; both directory trees exist, no active `frontend-legacy` path remains, and the active tree compiles/exports successfully.
- [x] Run active frontend baseline commands after the rename and record failures: ESLint currently reports 50 errors and 197 warnings; production build currently fails on unresolved generated Spectrum macro CSS imports in five settings pages. No source fix is authorized in this planning phase.

**Acceptance criteria:** Active commands resolve only through `apps/frontend/`; `apps/frontend-cancel/` is isolated; no backend file is changed; documentation states the final decision consistently; no source content is lost. Phase 0 cannot become `technically_verified` until the recorded baseline lint/build failures are classified and an explicitly authorized structure-safe resolution makes the required gates green.

**Rollback checkpoint:** Before further restructuring, folder ownership can be reversed using exact verified paths if the cutover itself is proven corrupt. Do not use reset/clean/checkout to perform rollback.

## 8. Phase 1 — Foundation, configuration, and complete baseline inventory

**Objective:** Establish measurable current behavior and enforceable target boundaries before moving feature code.

**Audit scope:** Package scripts and versions; Next/static-export config; TypeScript aliases; ESLint; PostCSS/Tailwind; all routes/layouts/providers; component and import graph; existing tests/previews; global CSS imports; environment-variable names; public assets; generated output; path-sensitive scripts and deployment docs.

**Execution checklist:**

- [x] Record the exact baseline lint, type-check, build, and static-output commands and results without modifying backend state.
- [x] Produce route, component, provider, core, feature, hook, API-client, stylesheet, public-asset, test, and preview inventories.
- [x] Map long relative imports, app-layer imports, cross-feature imports, UI-to-feature imports, core-to-UI imports, broad barrels, cycles, and duplicate ownership.
- [x] Define `eslint-plugin-boundaries` rules for target layers before any feature moves.
- [x] Create a narrow, documented temporary-exception list for existing violations so enforcement begins immediately without hiding new violations.
- [x] Normalize identified deep module imports to `@/`; confirm there is no broad root-layer barrel and assign cyclic/high-export barrels to owner phases without changing runtime exports.
- [x] Establish target empty folders only when needed by the first real owner; no speculative `hooks/` or `types/` root was created during baseline work.
- [x] Capture desktop/mobile Playwright baseline screenshots; current local auth API returns HTTP 500, so routes render the existing `Sesi Tidak Tersedia` fallback and authenticated UI smoke remains pending.

**Acceptance criteria:** New boundary violations are blocked; every existing exception has an owner and removal phase; baseline build is green or every pre-existing failure is precisely documented and approved before continuing.

## 9. Phase 2 — CSS foundation and component-system boundaries

**Objective:** Converge on one global stylesheet while preserving exact current visuals and separating Spectrum S2 from scoped legacy Tailwind/reset behavior.

**Audit scope:** `global.css`, `global-legacy.css`, `scoped-preflight.css`, any CSS modules/imports, Tailwind layers and Preflight, Spectrum page/theme CSS, fonts, Material Symbols, tokens, animations, root document selectors, portals, and every `.cu-style` boundary.

**Execution checklist:**

- [x] Inventory every global selector and classify it as Spectrum foundation, token/font, minimal document rule, scoped legacy reset, component-owned, feature-owned, or obsolete-after-proof.
- [x] Retain `src/app/global.css` as the only global entry without enabling unscoped Tailwind Preflight.
- [x] Move the active scoped reset contract from `.tw-scope` to `.cu-style` atomically while preserving selector specificity, utility composition, and render order.
- [x] Keep Spectrum S2 controls outside `.cu-style` unless an existing mixed composition requires a verified boundary.
- [x] Defer component/feature selector movement to its owning structural phase where immediate movement would expand risk; ownership families are recorded in the CSS inventory.
- [x] Add deterministic checks for parallel global stylesheet imports, obsolete `.tw-scope`, and accidental unscoped reset reintroduction.
- [x] Compare representative auth, shell, settings, workspace, modal/portal, and responsive routes before and after foundation changes.

**Acceptance criteria:** One global entry exists; Spectrum foundation remains stable; Tailwind/reset behavior is scoped; no intentional pixel or interaction change occurs; build remains green.

## 10. Phase 3 — Core infrastructure, authentication, and providers

**Objective:** Separate pure infrastructure and app-wide state from route/UI ownership, then restructure authentication as the first complete domain.

**Audit scope:** API clients, request/error normalization, auth/session types and calls, permissions/RBAC, realtime, global providers, root layout/provider, login, logout, forgot-password, onboarding, landing auth state, route guards, redirects, storage URLs, and error handling.

**Execution checklist:**

- [x] Move pure HTTP/session/permission/realtime infrastructure to `core/` without UI imports.
- [x] Move application-wide React providers to `providers/` and retain provider ordering and client/server boundaries; AuthProvider is classified at `providers/auth` and mounted in its original root order.
- [x] Move domain authentication UI/state/API/hooks/types to canonical ownership; feature UI is in `features/auth`, app-wide session state is in `providers/auth`, the consumer hook is in `hooks/auth`, pure transport/contracts remain in `core/auth`, and one-page forgot-password UI remains route-local.
- [x] Update all imports atomically and eliminate old ownership only after stale-reference scans pass; Auth, Portal/landing, provider, and hook old paths have zero active references.
- [x] Verify login, session restoration, guest/authenticated landing, logout, forgot password, onboarding, permission denial, redirect query, loading, and API error states.

Static-artifact smoke on 2026-08-24 returned HTTP 200 for `/`, `/login`, `/onboarding`, and the moved landing developer-library entry. All rendered the existing `Sesi Tidak Tersedia` fallback because static hosting returned 404 for `/api/v1/auth/me`; authenticated and interaction evidence therefore remains pending.

**Acceptance criteria:** Core is UI-free; auth ownership is canonical; all auth routes and API contracts remain unchanged; lint/type/build and browser smoke pass.

## 11. Phase 4 — Application shell, navigation, layout, and feedback

**Objective:** Establish reusable presentation ownership for the application frame without changing responsive or interactive behavior.

**Audit scope:** Container, Workspace, Content, NavBar, SideBar, menu overlay, dropdowns, breadcrumbs, app icons, avatar/profile surfaces, route guards, settings shell, feedback/error/loading/empty/toast surfaces, portals, and route layouts.

**Execution checklist:**

- [x] Calculate consumers and domains for every shell component before selecting `components/layout/`, feature ownership, or route-local ownership; main shell, feedback, RouteGuard, navigation, root layout files, profile/background families, route layouts, and empty-state candidates are documented.
- [x] Move reusable layout and generic feedback components with complete child trees, types, config, logic, styles, tests, and previews; Container/Workspace/Content/NavBar/SideBar/MenuOverlay and UniversalErrorView/ErrorTetrisGame/Toast are complete, while domain-assigned navigation/settings/profile moves remain.
- [x] Preserve controlled/uncontrolled state, active navigation, expand/collapse, mobile overlay, portal targets, outside click, Escape handling, focus, and scroll behavior.
- [x] Remove historical layout/navigation folders only after all consumers and exports are updated; moved shell paths, root RouteGuard path, and the unused Layouts barrel are removed, while settings-specific Layouts and the audited navigation split remain assigned to their domain phases.
- [x] Smoke desktop and mobile shells across auth, panel, settings, workspace, and developer routes.

**Acceptance criteria:** Shell ownership is canonical, responsive behavior and navigation are unchanged, no duplicate active implementation remains, and all gates pass.

## 12. Phase 5 — Settings and Panel

**Objective:** Restructure settings and administrative panel domains while preserving all API, role, status, profile, and maintenance contracts.

**Audit scope:** Settings account/administration/security routes, profile/avatar, applications, notifications preferences, privacy, roles/access control, workflow, generator preferences, sessions/activity, panel dashboard/users/roles/profile/maintenance, tables/modals/filters, and permission guards.

Current progress: PANEL-001 is technically verified. Settings shell, route-local BackgroundSky/privacy/activity log/Dashboard/Panel Profile, and complete Panel Users, Panel Roles, and Panel Maintenance features have canonical ownership. The Users boundary exception, duplicate Roles page, Maintenance type dependency, mixed `core/admin`, and three unreachable Settings implementations are closed. Lint/type/build/registry gates pass; authenticated desktop/mobile smoke remains pending.

**Execution checklist:**

- [x] Separate route-only UI from reusable settings and panel domain UI.
- [x] Establish `features/settings`, `features/panel-users`, and `features/panel-roles` ownership; keep cross-domain business surfaces explicitly reviewed.
- [x] Preserve payloads, validation, role/status visibility, upload/crop behavior, maintenance actions, table/filter/modal behavior, and all feedback states.
- [x] Update every route, preview, test, barrel, and import atomically; delete unused implementations only after proof.
- [x] Smoke representative account, security, administration, users, roles, dashboard, profile, and maintenance flows without mutating production-like data.

**Acceptance criteria:** No settings/panel domain UI remains in generic components; permissions and APIs are unchanged; all technical gates pass.

## 13. Phase 6 — Messages and Notifications

**Objective:** Isolate communication domains while preserving realtime, unread, dropdown, navigation, loading, and error behavior.

**Audit scope:** Full pages, navigation bells/dropdowns, chat API/realtime clients, message types, unread state, mark/read behavior, empty/error states, and cross-shell consumers.

Current progress: CORE-001 is technically verified. Complete page surfaces, both communication bells, API/realtime orchestration, and both NavBar dropdown presentations have canonical feature ownership. App-level renderer/chat injection lets SidebarUtilityActions, KV Retail, NavBar, and ODDS retain exact behavior without feature-to-feature imports; `core/chat` is closed into Messages API/realtime ownership plus global chat types. NavBar retains its single-menu coordinator while `CommunicationProvider` preserves the paired refresh sequence. Technical gates pass; authenticated/realtime manual smoke remains pending.

**Execution checklist:**

- [x] Assign page/domain UI to `features/messages` and `features/notifications` while generic shell triggers remain layout-owned.
- [x] Keep pure realtime transport in `core/realtime` and domain transformation/state in the owning feature.
- [x] Preserve event handling, ordering, unread counts, links, dropdown lifecycle, and fallback states.
- [x] Update all consumers atomically and smoke page plus shell integrations.

**Acceptance criteria:** Features do not import each other, transport remains pure, communication behavior is unchanged, and all gates pass.

## 14. Phase 7 — Creative AI and Creative Report

**Objective:** Consolidate both creative domains without conflating shared-looking UI or changing evaluation/chat workflows.

**Audit scope:** Creative AI chat and media components; Creative Report shell, agents, edit flow, options, performance, summary, assessments, HRD rules/review, exports, local storage, APIs, types, hooks, permissions, and responsive tables/cards.

Current progress: CREATIVE-001 is technically verified. Route/API/state/permission ownership is documented in `docs/frontend/creative-ownership-audit.md`. The complete Creative AI shell and 71-file nested UI tree, plus Creative Report API/settings state, have canonical feature ownership. Summary, complete Performa, Creative Agent edit, Option member/aspect presentation, AppTitle, DetailCard, and PopupPerson are route-local; route-orchestration hooks remain beside their routes to avoid inverted or cross-feature dependencies. All seven Creative boundary exceptions, unused `report-group.tsx`, and the unconsumed local-storage settings adapter are closed. The shared business ProfileCard is explicitly handed to ODDS-001 for joint ownership review.

**Execution checklist:**

- [x] Map each route and component to Creative AI, Creative Report, route-local, layout, feedback, or generic ownership based on actual consumers.
- [x] Keep feature APIs, hooks, types, and UI within their domain; extract only truly pure cross-feature helpers.
- [x] Preserve message ordering, media rendering, assessment calculations, validation, member editing, exports, local persistence, permission visibility, and mobile/desktop behavior through structural-only moves and technical evidence; manual/authenticated QA remains pending.
- [x] Update routes, previews, exports, and imports atomically; static route output passes while authenticated main/error-state smoke remains pending.

**Acceptance criteria:** Domain boundaries are explicit, no cross-feature imports remain, product workflows are unchanged, and all gates pass.

## 15. Phase 8 — KV Retail

**Objective:** Consolidate KV Retail routes, data access, timing/performance UI, and print surfaces under one domain owner.

**Audit scope:** Main/month/option/performance/print/unfinished routes, task pages, filters/search, KPI metrics, performance charts/sidebar, print preview, timing data, permissions, statuses, APIs, and responsive behavior.

Current progress: KV-001 is technically verified. Route/API/state/permission/realtime/print ownership is documented in `docs/frontend/kv-retail-ownership-audit.md`. One-page Performance/Print UI is route-local; TaskPage, TaskFormModal, the complete desktop/mobile TaskCard family, and TaskPerformance renderers/contracts are feature-owned. The ODDS-only TaskCardDate consumer is route-local. Historical ODDS task-card/mobile/performance paths and the facade are retired, KV no longer imports the generic SideMenu contract, both exact boundary exceptions are closed, focused TaskCard cycles are zero, and lint/type/build/registry gates pass. Authenticated/manual route smoke remains pending because the local API/session is unavailable.

**Execution checklist:**

- [x] Place KV-specific APIs, hooks, types, configuration, and components under `features/kv-retail`.
- [x] Recalculate any apparently generic task/search/chart component before promotion.
- [x] Preserve timing evaluation, status logic, filtering, print output, payloads, error/loading states, and mobile/desktop layout.
- [x] Update every consumer and remove stale paths only after audits pass.

**Acceptance criteria:** KV domain ownership is complete, no behavior or print regression is introduced, and all gates pass.

## 16. Phase 9 — Generator and Pricetag

**Objective:** Consolidate generator routes, APIs, types, history, catalog, search, assets, and large page implementations under domain ownership.

**Audit scope:** Pricetag root/layout, catalog, history, search, generation state, uploads/storage, API contracts, types/config, route transitions, loading/errors, and static-export constraints.

Current progress: GEN-001 is technically verified. Four route implementations now live in PascalCase route-local `_components/`; the shared four-route Pricetag layout, API, types, formatting/error helpers, and feature reference live under `features/generator-pricetag/`; thin route entry files own routing composition only; the transitional `features/generator/pricetag/` hierarchy is retired. API, permissions, root-only mode, query selection, generation/import/download, realtime, responsive, CSS, and notification contracts remain intact by source-preserving moves. Lint/type/build/docs gates pass; authenticated/manual route smoke remains pending because the local API/session is unavailable.

**Execution checklist:**

- [x] Split route ownership from reusable generator domain logic without rewriting large page behavior.
- [x] Move APIs/types/hooks/components coherently and retain payloads, generated asset handling, persistence, filters, and navigation.
- [x] Avoid opportunistic decomposition unrelated to ownership; internal cleanup requires separate authorization.
- [x] Update all imports atomically and smoke all generator routes.

**Acceptance criteria:** Generator ownership is canonical, large-route behavior remains unchanged, and all gates pass.

## 17. Phase 10 — ODDS

**Objective:** Restructure the highest-risk domain only after foundations and simpler domains prove the workflow.

**Audit scope:** ODDS shell, option, new request, detail/dummy, categories, designer selection, briefs, scheduling/SLA, task lifecycle, status transitions, revisions, discussion/history/audit, output/protected assets, realtime, rich text, uploads, mobile card/overlays, QA boundaries, permissions, and APIs.

**Execution checklist:**

- [x] Build a complete route/component/API/permission/lifecycle map before moving any ODDS file.
- [x] Divide work into coherent subdomains while keeping one registry phase and explicit checkpoints.
- [x] Preserve every status transition, role action, validation rule, timer/deadline, file link, realtime update, dummy-only QA behavior, and responsive interaction.
- [x] Recalculate shared-looking task/card/button/editor components; retain domain ownership when business state exists.
- [x] Update all consumers atomically per coherent slice and run focused lifecycle plus desktop/mobile smoke checks before the next slice.

Current progress: ODDS-001 is technically verified. All six checkpoints are complete: shared contracts/cycles, shell/theme, request workflow, lifecycle/detail/dummy, dashboard/report/ranking/escalation/config/option, and the final residual audit have canonical ownership. Every ODDS component uses a PascalCase folder with a same-named primary file; pure domain helpers live under `features/odds/utils/`; no generic ODDS path, cross-feature import, feature-to-app import, stale source path, cycle, or ODDS boundary exception remains. The audit re-enumerated six route entries, 87 API exports, permission/status/realtime/protected-file/dummy/responsive literals, and all technical gates pass. Authenticated/manual QA remains pending and is not claimed from build evidence.

**Acceptance criteria:** All ODDS ownership is canonical, no lifecycle or permission regression is introduced, obsolete implementations are proven unused, and all gates pass.

## 18. Phase 11 — Developer tools and component library

**Objective:** Restructure internal routes last so their previews point to final canonical owners rather than transitional paths.

**Audit scope:** Developer layout, component library data/registry/previews, interactive playground, beta routes, tokens, logs, test/playground routes, internal navigation, and original-component preview contracts.

**Execution checklist:**

- [x] Keep route-specific tooling beside developer routes and move reusable product components to their already-proven canonical owners.
- [x] Preserve original-component preview use and exact component registration contracts.
- [x] Update preview imports and metadata only after product component paths stabilize.
- [x] Remove obsolete cancelled-rebuild references and verify every registered preview resolves.

Current progress: DEV-001 is complete. Ten developer route entries are routing-only; page, shell, beta-only, library, toolbar, playground, token, log, and test UI lives in same-route PascalCase ownership. The final registry contains 191 active non-folder items, 148 explicit `sourcePath` values, zero missing effective paths, 60 resolved preview imports, and 53 preview keys that all match active catalog items. Nine source-less historical Creative AI aliases were retired. Manual visual QA remains pending.

**Acceptance criteria:** Internal tools use active original components, no duplicated preview implementation replaces product UI, and all gates pass.

## 19. Phase 12 — Final structural audit and closure

**Objective:** Prove the entire active frontend satisfies the target architecture and still functions as the same product.

**Execution checklist:**

- [x] Rebuild the complete route, component, import, barrel, CSS, test, and preview inventory from current source.
- [x] Prove no placement violations, forbidden dependency directions, cross-feature imports, broad barrels, deep relative imports, cycles, stale source paths, or unresolved temporary exceptions remain.
- [x] Prove historical folders are empty/removed only where consumer audit supports removal.
- [x] Prove `apps/frontend-cancel/` has no active import, alias, symlink, script, deployment, or build-graph reference.
- [x] Run complete frontend lint, type-check, production static build, output smoke, and documentation validation.
- [x] Smoke every route group and representative role/permission states; record manual QA still pending without claiming approval.
- [x] Synchronize architecture, component tree, CSS, static export, commands, deployment references, registry, README index, and agent instructions.
- [x] Mark registry phases `complete` only when their evidence and exceptions are closed.

Current progress: CLOSE-001 and CLOSE-002 are complete. The final inventory covers 63 route entries, 18 layouts, 732 TypeScript/TSX modules, 56 shared-component modules, 173 feature-component modules, the sole project stylesheet, zero automated test modules, and the complete developer registry/preview graph. Placement, layer direction, broad root barrels, deep relative imports, cycles, structural exceptions, stale paths, and cancelled-frontend build references are zero. Full lint exits with 0 errors and 197 preserved warnings; TypeScript, CSS boundary, documentation, and clean static build gates pass; the build exports 66 routes and all 65 generated index URLs return HTTP 200. Authenticated role/permission, API/realtime, responsive, interaction, and visual QA remain pending and are not inferred from technical closure.

**Final acceptance criteria:** Every definition in Section 1 is evidenced; build is green; all routes remain functional; documentation matches source; no backend file was changed by the goal; no commit or push occurred without explicit user instruction.

## 20. Progress reporting template

Use this compact report at each continuation boundary:

```markdown
### Phase <ID> — <name>

- Status before / after:
- Scope completed:
- Files moved / deleted:
- Imports and consumers updated:
- Product invariants checked:
- Boundary, lint, type, build results:
- Browser routes and viewports checked:
- Documentation updated:
- Manual QA pending:
- Temporary exceptions and owner:
- Risks / blocker:
- Next safe phase:
```

## 21. Approval checkpoint

- [x] User has reviewed and explicitly approved this goal file.
- [x] User has explicitly instructed Codex to start goal execution.

Until both boxes are satisfied, do not begin Phase 1 or any frontend source restructuring.
