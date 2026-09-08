# Local Development Setup

> Status: Current
> Last verified: 2026-09-07

This guide describes the verified local repository structure. Environment values are intentionally not recorded here.

## Prerequisites

- PHP 8.2 or later
- Composer 2
- Node.js compatible with Next.js 16.2.9
- npm
- A database configured through apps/backend/.env

## Install

Run composer install with apps/backend as its working directory, npm install with apps/frontend as its prefix, and npm run prepare:storage.

Create environment files from apps/backend/.env.example and apps/frontend/.env.example. Generate the Laravel key and run only migrations that are approved for the target database. Never commit environment files.

## Run

Run php apps/backend/artisan serve and npm run dev:frontend in separate terminals. Keep `NEXT_PUBLIC_API_URL` empty so browser requests use the frontend origin. Next development rewrites forward API, Sanctum, broadcasting, and storage requests to `API_PROXY_TARGET` (backend origin without `/api/v1`). It falls back to `NEXT_PUBLIC_API_URL`, then `http://127.0.0.1:8000`.

With Laragon serving the backend, set `API_PROXY_TARGET=http://creativeuniverse.test` in `apps/frontend/.env.local`; no separate Artisan server is needed. Restart Next dev after changing environment settings. This server-only variable does not change browser API URLs or production Apache routing.

If localhost reports a session loading error while the Laragon domain works, check the proxy target: an inactive port 8000 causes connection refusal. Verify `/api/v1/auth/me` returns JSON 401 for a guest and `/sanctum/csrf-cookie` returns 204 through localhost. These are healthy guest responses; authenticated login requires separate verification. Localhost and the Laragon domain have separate browser sessions, so sign in on each origin.

Use [commands and validation](../operations/commands-and-validation.md) before reporting work complete.
