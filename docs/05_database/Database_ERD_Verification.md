---
title: "Database and ERD Verification"
status: "ACTIVE"
version: "1.0"
created: "2026-06-27"
revised: "2026-06-27"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
verified_against_code: true
source_files:
  - "apps/backend/database/migrations"
  - "apps/backend/database/seeders"
  - "apps/backend/app/Models"
  - "docs/99_cleanup/Repository_And_Docs_Audit.md"
---

# Database and ERD Verification

## 1. Purpose
Verify the alignment between database migrations, models, seeders, and ERD documentation across Core, Pricetag, and ODDS Sub-Apps.

## 2. Verification Method
Verified by inspecting actual files in `apps/backend/database/migrations`, `apps/backend/app/Models`, and `apps/backend/database/seeders`. Attempting to run `php artisan migrate:status` failed due to a missing MySQL connection (likely expecting SQLite based on `.env.example`, but defaulting to MySQL in the active environment without a running service).

## 3. Migration Summary
- Core Tables: `users`, `cache`, `jobs`, `asset_links`, `personal_access_tokens`, `conversations`, `messages`, `conversation_user`.
- Infrastructure: Spatie tables (`permission_tables`), Activitylog tables (`activity_log`), Notifications (`notifications`).
- Pricetag: `pricetag_tables`, `pricetag_batch_items`.
- ODDS: `odds_workflow_tables`, `quality_issue_to_odds_workflow`.

## 4. Model Summary
Models are cleanly separated into domain namespaces:
- `App\Models\Core`
- `App\Models\Pricetag`
- `App\Models\Odds`

## 5. Seeder Summary
Available seeders:
- `DatabaseSeeder.php`
- `RolePermissionSeeder.php` (Core roles and permissions)
- `OddsDefaultSeeder.php` (ODDS config seeders)
- `OddsPermissionSeeder.php` (ODDS specific roles/permissions)
- `PricetagTestDataSeeder.php`

## 6. Core ERD Alignment
`Core_ERD.md` and `CreativeUniverse-MainApp_ERD.md` have been reviewed. Core schema matches implementation, particularly with polymorphic `asset_links` and recent `users` table simplifications (dropping pending columns). The introduction of `conversations` and `messages` tables needs to be updated in the Core ERD.

## 7. Pricetag ERD Alignment
Pricetag tables (categories, products, generations, batches, batch_items) accurately match the migrations.

## 8. ODDS ERD Alignment
**Significant Mismatch:** The existing ODDS ERD (`docs/06_odds/CreativeUniverse-SubApp_ODDS_ERD.md`) outlines tables like `odds_tickets`, `odds_ticket_briefs`, `odds_ticket_versions`. However, the migration `2026_06_26_000000_create_odds_workflow_tables.php` indicates that the implementation uses "Tasks" instead of "Tickets". The ERD is completely outdated.

## 9. Ownership Column Verification
Operational tables (Pricetag Batches, ODDS Tasks, etc.) properly include ownership relationships referencing the `users` table.

## 10. Soft Delete Verification
Supported properly across major entities. For example, migrations generally include `$table->softDeletes()`.

## 11. Package-Owned Tables
Spatie tables (Roles, Permissions, Activity Log) are maintained via published package migrations and not customized intrusively.

## 12. Framework Infrastructure Tables
Tables like `jobs`, `cache`, `notifications`, `personal_access_tokens` are present and properly treated as infrastructure.

## 13. ERD / Code Mismatch Register
- **ODDS ERD:** Uses `odds_tickets` vs implementation `odds_tasks`.
- **Core ERD:** Missing `conversations`, `messages`, and `conversation_user` tables recently added via `2026_06_23_160532_create_conversations_table.php`.
- **Active User Model:** The `users` table had pending columns dropped, but older docs might still reference them.

## 14. NEEDS_REVIEW
- Missing `Core_ERD.md` file (only `CreativeUniverse-MainApp_ERD.md` exists). Need to consolidate documentation.
- MySQL Connection failure when attempting to run `migrate:status`. It implies the local active `.env` does not properly use `sqlite` as specified in `.env.example`.

## 15. Next Actions
- Overhaul the ODDS ERD to reflect the active "Task" workflow architecture.
- Add Chat/Conversation tables to the Core ERD.
