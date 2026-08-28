# Architecture Overview

> Status: Current
> Last verified: 2026-08-24

CreativeUniverse is a monorepo with Laravel as its API/backend and Next.js as its static frontend.

## System shape

The browser receives static HTML, CSS, and JavaScript from the Next.js frontend. The browser then calls the Laravel API, which owns the database, storage, queues, broadcasts, and integrations.

## Repository boundaries

| Path | Ownership |
| --- | --- |
| apps/backend/ | Laravel 11 API, database, policies, queues, broadcasting, file services, and tests |
| apps/frontend/ | Only active Next.js application; complete product undergoing structure-only in-place reorganization |
| apps/frontend-cancel/ | Permanently cancelled clean-rebuild snapshot; strictly read-only and excluded from the active build graph |
| scripts/ | Root build and storage helpers |
| docs/ | Current-state documentation |
| logs/logs.md | Newest-first immutable work history |
| skills/ | Project-owned AI workflows |
| apps/backend/public/ | Laravel document root and local static package target |

## Runtime rules

- Laravel registers its API with the /api/v1 prefix; the health endpoint is GET /api/v1/health.
- Next.js uses static export, trailing slashes, and server-unoptimized images.
- NEXT_PUBLIC_API_URL becomes the browser base host at build time and is not a secret.
- The API uses Sanctum, API sessions, Spatie roles and permissions, and application-access middleware.
- The frontend is not the production backend. API routes, Server Actions, and runtime server rendering must not be production dependencies.

See [Laravel API backend](../backend/laravel-api.md) and [Next.js static export](../frontend/nextjs-static-export.md).
