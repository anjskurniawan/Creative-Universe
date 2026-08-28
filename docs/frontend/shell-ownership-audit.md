# Frontend Shell Ownership Audit

> Status: Active restructuring reference  
> Last verified: 2026-08-24

This document records consumer evidence and canonical ownership for SHELL-001. It covers structure only; responsive behavior, navigation state, focus, animation, API usage, and rendered UI remain unchanged.

## Completed shell composition slice

The 38-file shell family now lives under `apps/frontend/src/components/layout/`:

| Owner | Consumer evidence | Decision |
|---|---|---|
| `Container/` | 12 direct route/feature consumers across settings, panel, ODDS, KV Retail, Creative Report, messages, notifications, and developer tools | Cross-domain composed layout |
| `Workspace/` | Rendered by Container; owns route-derived active state and responsive composition | Child composition of Container |
| `Content/` | Rendered by Workspace plus developer preview | Shared layout surface |
| `NavBar/` | Workspace plus direct Auth landing, Generator, Design Assets, and developer previews | Cross-domain shell family |
| `SideBar/` | Workspace plus developer preview | Shared desktop shell family |
| `Workspace/MenuOverlay/` | Only Workspace and its supporting types/logic | Nested parent-owned mobile navigation child |

All implementation files, types, config, logic, children, previews, route consumers, and developer registry paths moved together. Three orphan developer-registry records (`menu.tsx`, `navbar.tsx`, and `settings-layout.tsx`) were removed because no matching active source file exists; the live NavBar and settings entries remain represented by their canonical component families. `Container`, `Workspace`, and `Content` retain their original composition and class defaults. NavBar, SideBar, and MenuOverlay retain their existing controlled state, callbacks, portal behavior, and public exports.

The historical `components/universe/Layouts/index.ts` had no consumers and was deleted after the moved exports became invalid. `components/universe/Layouts/SettingLayout/` remains intentionally because it is settings-domain composition assigned to PANEL-001.

## Completed feedback slice

| Owner | Consumer evidence | Decision |
|---|---|---|
| `components/feedback/UniversalErrorView/` | Root runtime/global/not-found boundaries, forbidden route, RouteGuard session/maintenance states, and developer preview | Generic cross-route feedback |
| `components/feedback/ErrorTetrisGame/` | Runtime child of every UniversalErrorView plus direct developer preview | Parent-family feedback component, not developer-only UI |

Both components now follow one PascalCase folder per component. Their props, copy, game state, keyboard/touch controls, focus behavior, canvas rendering, and previews are unchanged.

`Toast` also now lives at `components/feedback/Toast/`. Its eight product consumers span Auth, Panel, and Creative Report, and its props remain domain-neutral (`message`, `status`, and `onClose`). Portal target, alert semantics, copy, animation class, and styling are unchanged.

## Completed root route-boundary slice

`RouteGuard` has exactly one runtime consumer: `src/app/layout.tsx`. It now lives at `src/app/_components/RouteGuard/RouteGuard.tsx`, the narrowest valid owner for a root route boundary. Its auth state, application checks, redirects, onboarding resolution, emergency-maintenance event, and session/maintenance feedback branches are unchanged. The developer registry uses an explicit `sourcePath` because this route-boundary component no longer belongs to the reusable layout catalog path.

## Audited navigation assignments

The historical `components/navigation/` folder is transitional and must not move as one shared family:

| Current family | Consumer and dependency evidence | Assigned phase and target |
|---|---|---|
| `side-menu.tsx` + `sidemenu/` | Two KV Retail surfaces; shell UI also reads auth state | KV-001, `features/kv-retail/components/SideMenu/` |
| `features/messages/components/MessageBell/` | Sidebar utility and KV performance navbar through root renderer injection; owns chat API, conversation transforms, realtime subscription, unread state, and dropdown lifecycle | CORE-001 feature ownership complete |
| `features/notifications/components/NotificationBell/` | Sidebar utility and KV performance navbar through root renderer injection; owns notification API, Echo subscription, polling, local notification merge/read behavior, toast, and dropdown lifecycle | CORE-001 feature ownership complete |
| `sidebar-utility-actions.tsx` | Parent composition of SideMenu, injected communication renderers, auth applications, and settings navigation | Communication imports closed; remaining parent/app-launcher ownership moves with KV-001 |

NavBar communication ownership is also closed for CORE-001. NavBar retains only its generic trigger markup and single-menu coordination; the app-level `CommunicationProvider` owns paired refresh orchestration, and Messages/Notifications own their respective dropdown presentations through DOM-neutral render actions.

Developer previews do not change product ownership. These assignments deliberately defer physical moves until their complete domain slice can update every consumer without adding forbidden feature-to-feature imports.

## Completed background ownership slice

| Current owner | Consumer evidence | Decision |
|---|---|---|
| `features/auth/components/ParallaxBackground/` | Login, onboarding, guest portal, and developer preview | Auth feature component; complete five-file family moved together |
| `app/_components/LoadingBackground/` | Root `app/page.tsx` only | Root route-local component |

The obsolete `components/universe/Background/` barrel and folder are empty after all consumers and registry metadata were updated. Existing aliases, animation config, hook behavior, image defaults, and CSS classes remain intact at their new owners.

## Pending ownership decisions

- Settings shell and route-only BackgroundSky have moved to their PANEL-001 feature/route owners.
- `components/navigation/` has a completed ownership audit above; its physical split is assigned to CORE-001 and KV-001.
- Root layout files are assigned as follows: `AppTitle` moved route-locally in CREATIVE-001; settings menu/config/profile header moved in PANEL-001; `ViewportDebug` remains assigned to DEV-001.
- `DetailCard` and `PopupPerson` moved to their one-page Creative Report owners. The legacy `ProfileCard` still crosses Creative Report and ODDS with designer capacity/rating business semantics, so it requires a joint CREATIVE-001/ODDS-001 dependency decision and must not be promoted to generic UI from consumer count alone.
- All active `app/**/layout.tsx` files are route-owned compositions. Messages, notifications, panel, settings, Creative AI/Report, Generator/Pricetag, ODDS, and developer layouts stay in `app/` while their imported domain UI/state moves in the assigned phase.
- Empty states are currently inline or parent-owned within KV Retail, ODDS, messages, notifications, panel, settings, and generic Table. No standalone cross-domain empty-state component meets the promotion threshold, so no generic extraction is authorized.

## Validation contract

SHELL-001 remains in progress until its deferred physical moves complete in the owning phases and desktop/mobile smoke covers auth, panel, settings, workspace, and developer routes. Static fallback-only evidence is not authenticated shell parity.

Related references: [architecture contract](rebuild-architecture.md), [component system](component-system.md), and [phase registry](migration-inventory.md).
