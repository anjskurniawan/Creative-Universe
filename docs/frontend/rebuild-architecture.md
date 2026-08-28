# Frontend In-Place Restructuring Architecture

> Status: Active contract; restructuring planned  
> Last verified: 2026-08-24  
> Scope: structural reorganization of the complete active application in `apps/frontend/`

<!-- documentation-size-exception -->

## 1. Purpose and non-negotiable outcome

The clean frontend rebuild was permanently cancelled on 2026-08-24. The complete former legacy application is again the only active frontend and now lives at `apps/frontend/`. This contract applies the already-defined target structure to that application through gradual in-place restructuring.

This is not a rewrite, redesign, feature migration, or bug-fixing program. Internal ownership, paths, imports, CSS boundaries, and dependency direction may change; observable product contracts may not.

Every phase must preserve UI and visual output; routes and navigation; features, interactions, and responsive behavior; API contracts and error semantics; authentication, permissions, roles, statuses, and business rules; validation, accessibility, keyboard behavior, storage URL handling; and static-export compatibility.

Bug, visual, or behavior fixes require a separate explicit instruction and direct user validation. Backend files are outside this program.

## 2. Application ownership

```text
apps/
├── backend/           # Existing Laravel API; out of restructuring scope
├── frontend/          # Only active frontend; restructured in place
└── frontend-cancel/   # Permanently cancelled clean rebuild; read-only snapshot
```

Rules for `frontend-cancel`:

1. Never edit, format, build, generate files in, or update dependencies in this directory.
2. Never import, symlink, alias, or include its source in the active build graph.
3. Do not use it as the implementation source for restructuring; the active application's live contracts are authoritative.
4. Keep it only as a cancelled historical snapshot until the user explicitly requests deletion.

## 3. Target source tree

```text
apps/frontend/
├── public/
├── src/
│   ├── app/                         # Routing, layouts, metadata, route boundaries
│   ├── components/
│   │   ├── ui/                      # Generic domain-neutral primitives
│   │   ├── spectrum/                # Spectrum S2 adapters/compositions
│   │   ├── layout/                  # Reusable shell/navigation/layout
│   │   └── feedback/                # Generic loading/empty/error/toast surfaces
│   ├── features/                    # Domain logic and domain UI
│   │   ├── auth/
│   │   ├── panel-users/
│   │   ├── panel-roles/
│   │   ├── settings/
│   │   ├── messages/
│   │   ├── notifications/
│   │   ├── creative-ai/
│   │   ├── creative-report/
│   │   ├── kv-retail/
│   │   ├── generator-pricetag/
│   │   ├── odds/
│   │   └── design-assets/
│   ├── core/                        # Pure infrastructure; no UI/domain state
│   │   ├── api/
│   │   ├── auth/
│   │   ├── permissions/
│   │   └── realtime/
│   ├── providers/                   # App-wide React providers
│   ├── hooks/                       # Generic cross-feature hooks
│   ├── lib/                         # Pure helpers, formatters, constants
│   ├── styles/                      # Token and theme synchronization
│   └── types/                       # Truly global types
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

`src/app/` owns route files, layouts, metadata, and route boundaries only. Create optional feature folders such as `api/`, `hooks/`, `components/`, and `types.ts` only when their actual contents require them.

## 4. Placement decision table

| Concern | Canonical location |
|---|---|
| Used by one page only | Colocated `app/.../_components/` |
| Domain UI, state, API, hook, or type | `features/<domain>/` |
| Generic reusable primitive | `components/ui/<Component>/` |
| Spectrum S2 adapter/composition | `components/spectrum/<Component>/` |
| Reusable shell/layout/navigation | `components/layout/` |
| Generic feedback state | `components/feedback/` |
| Pure HTTP/session/RBAC/realtime infrastructure | `core/` |
| App-wide React provider | `providers/` |
| Generic cross-feature hook | `hooks/` |
| Pure formatter/helper/constant | `lib/` |

Historical folders are transitional, not target ownership. Remove a folder only after all consumers are traced, every import is updated in the same phase, and no runtime or build reference remains.

## 5. Component level calculation

| Level | Actual consumer evidence | Location |
|---|---|---|
| Page-specific | One page | Route-local `_components/` |
| Feature-specific | Two or more pages in one domain | `features/<domain>/components/` |
| Cross-feature | Multiple domains but retains business context | Explicit ownership review |
| Generic | Domain-neutral and used by at least three pages across at least two domains | `components/ui/` |

For every component move or consumer change: trace every import and render consumer; count unique pages and domains; inspect domain knowledge in props, state, copy, API, permissions, styling variants, and dependencies; select the narrowest valid owner; move implementation and every import, barrel, test, preview, and registry reference together; then recalculate when consumers change.

Do not create compatibility shims by default. Small domain duplication is safer than a premature shared abstraction. Unused code may be deleted only after consumer audit proves it unreachable.

## 6. Dependency boundaries

Allowed direction:

```text
app -> features -> components -> core/lib/hooks
app/features/components -> hooks -> providers -> core
app -> providers
```

Mandatory rules:

- `features/` and `components/` never import from `app/`.
- One feature never imports directly from another feature.
- Generic component layers never import from `features/`.
- `core/` never imports UI or domain modules.
- Application-wide context is mounted from `app`, while consumers use a dedicated hook; feature and component files never import a provider implementation directly.
- A context hook may import its matching provider context. Providers may import only lower shared layers and must not import feature or route modules.
- Prefer `@/` aliases; remove deep relative imports during the owning phase.
- Use per-component barrels, never a broad layer barrel.
- Define `eslint-plugin-boundaries` during the foundation phase before feature moves.
- Any temporary exception must identify its owner, reason, removal phase, and registry evidence.

## 7. CSS and component-system contract

`src/app/global.css` is the sole global stylesheet. It owns Spectrum S2's global foundation, product-wide tokens, fonts, and only minimal document rules that are genuinely global.

Legacy Tailwind and reset behavior must be scoped: load Tailwind utilities/tokens without an unscoped global Preflight reset; place legacy reset and project-owned Tailwind assumptions beneath `.cu-style`; put `.cu-style` on the highest safe project-owned boundary; progressively move component-specific selectors to their owner; and remove parallel legacy global stylesheets only after selector ownership and visual parity are verified. Do not wrap Spectrum S2 controls in `.cu-style` unless their interaction and styling remain verified.

Spectrum S2 is the default component system when its official API fits. New custom components use React Aria as their accessibility and interaction foundation with project-owned Tailwind styling. Structural work must not silently replace an existing control technology or alter its interaction contract.

## 8. Execution strategy

The program starts with foundation and minimum enforceable boundaries, then restructures one complete feature at a time:

1. foundation, configuration, build, and CSS boundaries;
2. authentication and providers;
3. application shell, navigation, and layout;
4. settings and panel;
5. messages and notifications;
6. Creative AI and Creative Report;
7. KV Retail;
8. Generator;
9. ODDS;
10. developer tools and component library.

Do not perform broad layer-by-layer moves across unrelated features. Each phase must be reviewable, preserve behavior, and leave the build green. QA may remain pending while structurally independent phases continue.

## 9. Per-phase workflow and evidence

For every phase:

1. Snapshot routes, consumers, APIs, permissions, state, validation, CSS, tests, previews, and build behavior.
2. Record current and target ownership in the restructuring registry.
3. Define invariants and exclusions; bug and visual changes stay excluded.
4. Move the smallest complete ownership slice and update every import in the same change.
5. Remove old files only after consumer and reference scans are empty.
6. Run focused lint/type checks and the production static build; keep the build green.
7. Browser-smoke affected routes when feasible without changing data or backend state.
8. Update component tree, CSS ownership, commands, and registry documentation.
9. Record remaining QA separately; technical validation does not imply user QA approval.

Registry states are:

```text
planned -> audited -> in_progress -> technically_verified -> complete
```

`complete` requires target placement, boundary compliance, updated imports, passing technical checks, route smoke evidence, synchronized documentation, and no unresolved structural exception. Manual visual QA may remain recorded as pending because this program does not intentionally change UI.

## 10. Validation and stop conditions

At every completed phase, lint, type-check, and static build must pass. Stop and restore the phase to a green state if a move changes observable behavior, breaks a route, requires backend changes, or cannot preserve an API, permission, or business contract without expanding scope.

Do not claim parity from static inspection alone. Browser evidence is required for moved route ownership when the environment is available, but unresolved manual QA does not block work on structurally independent phases.

## 11. Program completion criteria

The program is complete only when no known placement violations remain; all imports satisfy dependency boundaries; every feature and shared component has canonical ownership; every existing route and product contract still functions; lint, type-check, and production static build pass; obsolete paths are absent after consumer audit; CSS has one global entry with legacy Tailwind/reset behavior scoped under `.cu-style`; documentation and registry are synchronized; and `apps/frontend-cancel/` remains isolated from the active build.
