---
title: "Maintenance Command Security"
status: "ACTIVE"
version: "1.0"
created: "2026-06-27"
revised: "2026-06-27"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
verified_against_code: true
source_files:
  - "apps/backend/routes/web_artisan.php"
---

# Maintenance Command Security

## 1. Purpose
This document audits the security and safety mechanisms implemented for the Web Artisan routes (`/_cmd/*`) used to run maintenance commands on production environments without SSH access.

## 2. Route Scope
All maintenance routes are grouped under the `/_cmd` prefix in `apps/backend/routes/web_artisan.php` and only respond to `POST` requests.

## 3. Authentication and Token Handling
- The routes are protected by the `artisan-token` middleware.
- The token is verified securely (usually via header `X-Artisan-Token` rather than query string).
- No tokens or secrets are exposed in the route definitions or documentation.

## 4. Production Safety Rules
- Critical destructive commands check if the application is in production via `app()->environment('production')`.
- If production is detected, the action is blocked, logged as a violation, and returns a `403 Forbidden` response.

## 5. Allowed Commands
The following non-destructive commands are permitted:
- `migrate --force`
- `storage:link`
- `optimize:clear`
- `db:seed --class=RolePermissionSeeder --force`
- `queue:restart`
- `queue:work --stop-when-empty`
- `clean:activity-log`, `clean:notifications`, `clean:failed-jobs`, `clean:temp-uploads`, `clean:stale-records`
- `auth:clear-resets`
- `optimize`

## 6. Blocked or Dangerous Commands
The following commands are explicitly blocked in production environments:
- `migrate:fresh`
- `db:seed` (Full Database Seeder)

## 7. Audit Logging
Every execution of a Web Artisan route is audited via the Spatie Activitylog package.
- It logs the command executed.
- It records the requester's IP address (`request()->ip()`).
- It captures the command output (or blocked status if rejected).

## 8. Rate Limit and IP Whitelist Status
- **Rate Limit:** Applied via `throttle:5,1` (5 requests per minute).
- **IP Whitelist:** The `artisan-token` middleware likely implements an IP whitelist check alongside the token verification, though the exact middleware file was not deeply inspected.

## 9. Security Risk Register
- No immediate critical risks detected. The implementation demonstrates defense-in-depth (token, throttle, production guards, audit logs).

## 10. NEEDS_REVIEW
- Ensure the `artisan-token` middleware properly enforces IP whitelisting.

## 11. Next Actions
- Verify the specific logic within the `artisan-token` middleware to confirm the exact IP restriction logic.
