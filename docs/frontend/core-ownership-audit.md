# Frontend Core Ownership Audit

> Status: Active restructuring reference  
> Last verified: 2026-08-24

This audit classifies the live `apps/frontend/src/core/` modules before domain moves. It records ownership only; it does not authorize API, permission, state, or behavior changes.

## Canonical infrastructure

| Current path | Evidence | Decision |
|---|---|---|
| `core/api/` | Shared browser request transport, API errors, and auth-expiry handling | Retain in `core/api/` |
| `core/auth/` | Session API contracts, auth types, and pure redirect resolution | Retain in `core/auth/`; React state stays outside Core |
| `core/applications/` | Application catalog, visibility, and cross-domain application types | Retain in `core/applications/` |
| `core/permissions/` | Permission catalog and pure permission types | Retain in `core/permissions/` |
| `core/realtime/` | Shared Pusher client factory/configuration | Retain in `core/realtime/` |
| `core/navigation/routes.ts` | Pure route constants, normalization, safe internal redirects, and route builders | Retain in `core/navigation/` |
| `core/files/` | Shared upload transport used by the current dropzone | Retain temporarily; resolve presentation/domain split under FND-004 |

Core is currently UI-free. The unused UI-bearing `core/layouts/core-shell.tsx` was removed after a zero-consumer audit.

## Closed domain modules

CORE-001 closed `core/chat`: endpoint calls and conversation-channel orchestration moved to `features/messages`, shared data contracts moved to `types/chat.ts`, and cross-domain consumers receive the implementation through the app-installed communication port. The generic Echo factory remains in `core/realtime`.

PANEL-001 closed `core/admin`: Panel Users now owns its user contracts and unchanged helpers, Panel Roles owns its role contracts and unchanged error helper, and `types/pagination.ts` owns the pure pagination response shared with Generator. No active source imports `core/admin`.

## Provider boundary

`providers/auth/AuthProvider.tsx` owns application-wide React session state and imports only pure Core contracts plus shared application/navigation registries. `hooks/auth/use-auth.ts` is the sole consumer-facing context hook; route, feature, and shared component code imports the hook rather than the provider implementation. `app/layout.tsx` retains the same provider position and ordering.

The unused `lib/api.ts` compatibility re-export had zero imports and was deleted after an exact consumer scan. Canonical API transport remains `core/api/`.

## Closure evidence

FND-004 can close only after:

- the file-upload presentation/transport exception is resolved;
- no Core module imports UI, providers, routes, or feature modules;
- stale-path scans, lint, type-check, and static build pass.

Related references: [architecture contract](rebuild-architecture.md), [boundary exceptions](boundary-exceptions.md), and [phase registry](migration-inventory.md).
