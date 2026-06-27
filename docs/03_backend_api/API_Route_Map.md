---
title: "Creative Universe API Route Map"
status: "ACTIVE"
version: "1.0"
created: "2026-06-27"
revised: "2026-06-27"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
verified_against_code: true
source_files:
  - "apps/backend/routes/api.php"
  - "apps/backend/routes/web.php"
  - "apps/backend/routes/web_artisan.php"
  - "php artisan route:list"
---

# Creative Universe API Route Map

## 1. Purpose
This document provides an overview of the active backend API routes in the Creative Universe Monorepo, specifically mapping the actual implemented routes against the expected documentation.

## 2. Verification Method
Verified against `apps/backend/routes/api.php`, `web.php`, `web_artisan.php`, `channels.php` and validated by running `php artisan route:list`.

## 3. Route Group Summary
The application routes are grouped into:
- **Public API**: Health check and Guest Authentication
- **Authenticated API**: Protected by Sanctum
- **Pricetag Sub-App**: Routes prefixed with `/pricetag`
- **ODDS Sub-App**: Routes prefixed with `/odds`
- **Maintenance / Admin**: Routes for roles like Root or users with specific permissions.
- **Web Artisan**: Remote commands execution (`/_cmd`).
- **Broadcasting**: Real-time event channels (`/broadcasting/auth`).

## 4. Public Routes
- `GET /api/v1/health`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/password/otp`
- `POST /api/v1/auth/password/otp/verify`
- `POST /api/v1/auth/password/reset`

## 5. Authenticated API Routes
Protected by `auth:sanctum`:
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/dashboard`
- `POST /api/v1/ai/chat`
- Profile endpoints (`/profile`, `/profile/password`, `/profile/avatar`, `/profile/activities`, `/profile/sessions`)
- Notification endpoints (`/notifications`, `/notifications/read-all`, `/notifications/{notification}/read`)
- Chat endpoints (`/chat/conversations`, `/chat/messages`, `/chat/contacts`)

## 6. Admin / Maintenance Routes
- **Users:** `/api/v1/users`, `/api/v1/users/options`, `/api/v1/users/{user}`, `/api/v1/users/{user}/audit`, `/api/v1/users/{user}/sessions`
- **Roles & Permissions:** `/api/v1/roles`, `/api/v1/permissions`
- **Root Whitelist:** `/api/v1/users/whitelist-manager-permissions`
- **Maintenance API:** `/api/v1/maintenance/status`, `/api/v1/maintenance/commands`
- **Web Artisan:** `POST /_cmd/migrate`, `POST /_cmd/migrate-fresh`, `POST /_cmd/storage-link`, etc.

## 7. ODDS Routes
Routes prefixed with `/api/v1/odds/` (require `access-odds`):
- **Tasks:** `/tasks`, `/tasks/{task}`, `/tasks/{task}/brief`, `/tasks/{task}/start`, `/tasks/{task}/results`
- **Queue/Config:** `/queue`, `/categories`, `/designer-profiles`, `/system-rules`
- **Reviews & Revisions:** `/tasks/{task}/spv-review`, `/tasks/{task}/client-review`, `/tasks/{task}/rating`, `/tasks/{task}/revisions`, `/revisions/{revision}/extra-review`, `/revisions/{revision}/urgent-review`
- **Escalations:** `/tasks/{task}/cancel-requests`, `/cancel-requests/{cancelRequest}/review`, `/tasks/{task}/reassign`, `/tasks/{task}/extend-deadline`
- **Reports:** `/reports/daily`, `/reports/summary`, `/rankings`

## 8. Pricetag Routes
Routes prefixed with `/api/v1/pricetag/` (require `access-pricetag`):
- **Categories:** `/categories`, `/categories/{category}`
- **Products:** `/products`, `/products/{product}`
- **Generations:** `/generations/single`, `/generations/checklist`, `/generations/csv`
- **Batches:** `/batches`, `/batches/{batch}`, `/batches/{batch}/download`
- **Imports:** `/imports/products`
- Note: Compatibility alias routes `/pricetag-categories` exist.

## 9. Broadcasting Routes
- `POST /broadcasting/auth`
- Active Channels in `channels.php`: `App.Models.Core.User.{id}`, `admin.notifications`, `pricetag-batch.{batchId}`, `conversation.{conversationId}`

## 10. Route/Docs Mismatch Register
- **ODDS Sub-App:** The implemented routes (`/tasks`, `/queue`, `/reports`) completely diverge from the draft SRD (`/tickets`).
- **Web Artisan:** Draft SRD mentions `GET /_cmd/*` legacy routes, but only `POST` is implemented in `web_artisan.php`.
- **Chat:** Chat API (`/chat/*`) exists in the route map but its SRD is not present or documented clearly in the Core SRD we reviewed.

## 11. NEEDS_REVIEW
- Missing SRD updates for the newly introduced Chat Module (`/chat/*`).
- Does the `log-viewer` package routes need to be hidden behind specific middleware/gates? Currently they are registered globally based on the route list.

## 12. Next Actions
- Update the ODDS SRD to reflect the actual route structure.
- Review `log-viewer` route exposure.
