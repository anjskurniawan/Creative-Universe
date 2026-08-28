# Messages and Notifications Ownership Audit

> Status: Active restructuring reference  
> Last verified: 2026-08-24

This document records CORE-001 consumer evidence, canonical ownership, and preserved frontend contracts. It covers structural placement only; message, notification, realtime, unread, API, responsive, and accessibility behavior remains unchanged.

## Route and page ownership

- `/messages` remains a statically exported route shell under `app/(core)/messages/`. `features/messages/components/MessagesPageContent/` owns the complete browser-side conversation workspace; the route retains its Suspense fallback and the layout retains its exact Container composition.
- `/notifications` remains a statically exported route shell under `app/(core)/notifications/`. `features/notifications/components/NotificationsPageContent/` owns the complete browser-side activity center; its layout and permission-derived menu remain route-owned.
- Both pages require the live Laravel API and authenticated browser state. Static build output does not prove realtime or authenticated parity.

## Preserved Messages contracts

MessagesPageContent retains contacts and conversation loading; `?conversation=` activation; active/history, unread/direct/task filters; search; earlier-page loading; direct and ODDS task rooms; optimistic send/failure/retry state; attachments; replies; mentions; closed-room behavior; unread transformations; message ordering; and conversation-channel subscriptions.

The current chat endpoints remain `/chat/contacts`, `/chat/conversations`, `/chat/conversations/{id}/messages?page={page}`, `/chat/attachments`, and `/chat/messages`. The generic Echo client stays in `core/realtime`.

## Preserved Notifications contracts

NotificationsPageContent retains authenticated GET `/notifications`, PATCH `/notifications/read-all`, server/local merge order, local read persistence, loading/empty states, timestamp formatting, destination links, and the rule that local notifications remain readable when the server mark-all request fails.

NotificationBell additionally retains polling, private Echo subscription, local-update events, single/all read operations, unread badge/count, toast behavior, dropdown lifecycle, and five-item preview.

## Completed bell and transport injection slice

`features/messages/components/MessageBell/` and `features/notifications/components/NotificationBell/` now own their complete domain behavior. `app/provider.tsx` installs both renderers through the DOM-neutral `hooks/communication-actions` port. SidebarUtilityActions and KV Retail PerformanceNavbar request the same renderer with the same props and trigger callback, so neither imports another feature.

The former `core/chat/` is closed. `features/messages/api/chatApi.ts` owns the unchanged endpoint calls, `features/messages/realtime/subscribeToConversationMessages.ts` owns the unchanged Echo orchestration, and `types/chat.ts` owns the cross-consumer data contracts. NavBar and ODDS task chat receive the same API/subscription implementation through the root communication port; Messages-owned components import their own implementation directly. No compatibility shim or boundary exception remains.

## Completed NavBar communication composition

`app/_components/CommunicationProvider/` is the app-level composition root inside `AuthProvider`. It owns the existing paired refresh orchestration, keeps `Promise.allSettled` failure isolation, maps the same conversation and notification fields, and injects render actions through `hooks/communication-actions` without adding DOM.

NavBar still owns the single `openMenu` coordinator and the exact trigger markup. A click on either communication trigger still toggles that menu and refreshes both backend lists. `features/messages/components/MessageDropdown/` and `features/notifications/components/NotificationDropdown/` now own their domain presentation while continuing to use the same generic NavBar Dropdown shell, markup, copy, classes, unread indicators, empty states, and close callback.

## Cross-surface consumer decisions

| Current surface | Consumers | Decision |
|---|---|---|
| `components/navigation/SidebarUtilityActions/SidebarUtilityActions.tsx` | SideMenu only | Bell imports are closed through renderer injection; the canonical shared navigation family owns the app launcher/settings actions |
| NavBar message/notification dropdown composition | Reusable shell plus app composition root | Complete: NavBar owns menu coordination; app provider owns paired fetching; each feature owns its dropdown data presentation through injected render actions |
| `features/odds/components/OddsTaskChat/OddsTaskChat.tsx` | ODDS surfaces | Shared chat transport is injected; the task-status-aware UI is owned by ODDS and moved with its complete lifecycle graph |

No feature-to-feature import or boundary exception was added. Remaining transitional communication use is the ODDS task-chat UI explicitly assigned to ODDS-001; its transport already uses the injected port.

## Validation contract

Each slice requires stale-path search, full boundary lint, type-aware static build, registry synchronization, dependency-cycle check, and authenticated/realtime browser smoke when the local API/session is available. Manual QA remains pending and does not block the next structural slice.

Related references: [architecture contract](rebuild-architecture.md), [Core audit](core-ownership-audit.md), [shell audit](shell-ownership-audit.md), and [phase registry](migration-inventory.md).
