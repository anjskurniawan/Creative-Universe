# Current Database and ERD Map

**Status:** ACTIVE
**Verified:** 2026-07-15 terhadap migration, model, seeder, dan test database.

## Ownership tabel

| Boundary | Tabel utama |
|---|---|
| Core Account | `users`, `divisions`, `positions`, `sessions`, `personal_access_tokens` |
| Core Access | `roles`, `permissions`, `model_has_roles`, `model_has_permissions`, `role_has_permissions`, `applications`, `application_user`, `permission_metadata` |
| Core Communication | `conversations`, `conversation_user`, `messages`, `notifications` |
| Core Files and Audit | `stored_files`, `asset_links`, `activity_log` |
| Core Infrastructure | `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, `app_settings`, `password_reset_tokens` |
| KV Retail Task | `kv_retail_tasks`, `kv_retail_task_user` |
| Creative Report | `creative_report_groups`, `creative_report_assessments` |
| Generator / Pricetag | `generator_pricetag_categories`, `generator_pricetag_products`, `generator_pricetag_batches`, `generator_pricetag_batch_items` |
| ODDS | `odds_categories`, `odds_designer_profiles`, `odds_system_rules`, `odds_tasks`, `odds_task_briefs`, `odds_task_queue`, `odds_task_time_logs`, `odds_task_results`, `odds_task_reviews`, `odds_task_revisions`, `odds_task_skip_requests`, `odds_task_cancel_requests`, `odds_designer_daily_reports`, `odds_designer_rankings` |

## Relasi lintas boundary

- Semua ownership user mengarah ke `users.id` milik Core.
- `application_user` menentukan akses user ke Sub-App secara global.
- `permission_metadata` memberi alias dan grouping UI tanpa mengganti permission key backend.
- `conversations.context_type/context_id`, `asset_links`, dan `stored_files` menyediakan integrasi polymorphic/contextual tanpa foreign key langsung antarsub-app.
- ODDS mengekspos data lintas boundary melalui kontrak dan DTO, bukan model domain.

## Rename yang mempertahankan data

- `homework_tasks` menjadi `kv_retail_tasks`.
- `homework_task_user` menjadi `kv_retail_task_user`.
- Seluruh `pricetag_*` menjadi `generator_pricetag_*`.

Migration rename bersifat reversible. Migration historis pembentuk tabel lama tetap dipertahankan karena dibutuhkan untuk membangun database dari nol.

## Aturan perubahan schema

1. Migration baru tidak boleh mengubah migration historis yang pernah dipakai produksi.
2. Rename tabel atau kolom dilakukan melalui migration tersendiri dan reversible.
3. File/data lama harus diinventarisasi sebelum migrasi fisik.
4. Jalankan `php artisan migrate:fresh --seed` pada database pengujian dan seluruh test sebelum deployment.
