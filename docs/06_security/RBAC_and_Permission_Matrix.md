---
title: "RBAC and Permission Matrix"
status: "ACTIVE"
version: "1.0"
created: "2026-06-27"
revised: "2026-06-27"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
verified_against_code: true
source_files:
  - "apps/backend/database/seeders"
  - "apps/backend/routes/api.php"
  - "apps/backend/app/Http/Middleware"
---

# RBAC and Permission Matrix

## 1. Purpose
This document maps the actual Role-Based Access Control (RBAC) implementation, detailing baseline roles, permission assignments, and route-level authorization guards based on the source code.

## 2. Verification Method
Verified against `apps/backend/database/seeders/RolePermissionSeeder.php`, `OddsPermissionSeeder.php`, and `apps/backend/routes/api.php`.

## 3. Role Baseline
The application seeds the following core roles:
- `Root`
- `Manajer`
- `CEO`
- `Supervisor`
- `SPV` (alias for Supervisor)
- `Designer`
- `Videographer`
- `Client`
- `Leader Retail`
- `PIC Retail`

## 4. Permission Baseline
Core permissions include:
`access-core`, `manage-users`, `manage-roles`, `approve-users`, `view-logs`, `run-artisan`, `access-pricetag`, `pricetag.manage`.

ODDS permissions include:
`access-odds`, `manage-odds-config`, `create-odds-tasks`, `view-own-odds-tasks`, `view-assigned-odds-tasks`, `view-all-odds-tasks`, `review-odds-briefs`, `manage-odds-queue`, `start-odds-tasks`, `submit-odds-results`, `review-odds-spv`, `review-odds-client`, `request-odds-revisions`, `approve-odds-extra-revisions`, `approve-odds-urgent-revisions`, `cancel-odds-tasks`, `manage-odds-escalations`, `view-odds-reports`, `view-odds-rankings`, `use-odds-ai`.

## 5. Protected Roles
- `Root` has absolute access. Routes such as `/users/whitelist-manager-permissions`, `/users/{user}/audit`, and `/users/{user}/sessions` explicitly use `middleware('role:Root')`.

## 6. Permission Matrix
- **Root**: All permissions.
- **Manajer**: Core access, user management, and extensive ODDS oversight (config, queue, escalation, review, reports).
- **Supervisor/SPV**: Core access and similar ODDS oversight as Manajer.
- **Designer/Videographer**: Core access, task execution in ODDS (`start-odds-tasks`, `submit-odds-results`).
- **Client**: Core access, can create tasks and perform client reviews in ODDS.

## 7. Route Authorization Summary
- **Maintenance API**: Protected by `can:run-artisan`.
- **User Management**: Protected by `can:manage-users` and `can:approve-users`.
- **Role Management**: Protected by `can:manage-roles`.

## 8. Sub-App Access Permissions
- **ODDS**: Access requires the `access-odds` permission.
- **Pricetag**: Access requires the `access-pricetag` permission. Mutation endpoints require `pricetag.manage`.

## 9. Spatie Cache Invalidation Rules
- Seeders properly invalidate cache using `app()[PermissionRegistrar::class]->forgetCachedPermissions();`. This ensures updates are immediately effective.

## 10. Security Gaps
- Currently, no major structural security gaps have been identified in the route files or seeders. Middleware aliases (`role`, `permission`, `can`) are consistently used.

## 11. NEEDS_REVIEW
- Confirm if any inactive users can bypass authentication middleware (requires checking `EnsureUserCanAccessApp.php` or `EnsureActive` middleware which may be in use).

## 12. Next Actions
- Periodically review role and permission assignments when new sub-apps are integrated.
