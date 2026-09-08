# Laravel API Backend

> Status: Current
> Last verified: 2026-09-08

Laravel in apps/backend/ owns all server behavior: authentication, authorization, domain rules, persistence, storage, queues, events, and third-party integrations.

## Routing and response boundary

- bootstrap/app.php configures the api/v1 prefix; API endpoints are under /api/v1/*.
- routes/api.php loads the core, creative-report, kv-retail, odds, generator, cai, and design-assets modules.
- GET /api/v1/health is the public health check.
- API errors are normalized as JSON for validation 422, authentication 401, authorization 403, not found 404, CSRF 419, and server errors.
- Web routes are limited to operational command endpoints in routes/web_artisan.php. These endpoints require artisan-token middleware and rate limiting.

## Authentication and authorization

- Private endpoints use auth:sanctum.
- EnsureUserCanAccessApp is available through the app middleware alias.
- Core and ODDS are accessible by default to every authenticated user, including existing users without an `application_user` assignment. `UserProfileResource` includes both registry entries in authentication/profile responses so frontend navigation exposes ODDS. Other sub-apps still require assignment unless the user is Root.
- ODDS routes require `auth:sanctum` and `app:odds`; the legacy `access-odds` permission is no longer an entry requirement. Action permissions and task policies remain enforced (for example, category creation requires `manage-odds-config`). Guests receive 401; unauthorized protected actions receive 403. No migration or assignment backfill is required; existing sessions must refresh their profile to update navigation.
- Spatie manages roles and permissions through role, permission, and role_or_permission aliases.
- Emergency maintenance is applied to API and broadcast channels.

### SPV as an ODDS designer

- `SPV` retains supervisory permissions and also receives assigned-task visibility, queue-skip requests, task start, result submission, and revision requests through `SpvDesignerAccessSeeder`. No additional Designer role is required; Manajer and Supervisor permissions are unchanged.
- Migration `2026_09_08_000000_enable_spv_designer_access` applies the additive backfill to existing installations. New installations receive it from `OddsPermissionSeeder`; `OddsDefaultSeeder` also includes SPV profiles. Run `php artisan migrate --force` from `apps/backend` during deployment. The migration rollback deliberately retains permissions/profiles because they may own active work.
- Missing SPV designer profiles are created as active/available with unrestricted specializations (`[]`). Existing configurations, inactive profiles, and soft-deleted profiles are preserved. For SPV users added later, create their profile through ODDS configuration or rerun `php artisan db:seed --class=SpvDesignerAccessSeeder --force`.
- Clients select SPV through `GET /api/v1/odds/designer-profiles` and assign tasks through `POST /api/v1/odds/tasks` using `preferred_designer_id`. Existing availability, specialization, capacity, and queue validation still applies.
- Assigned SPV users accept/return briefs, call `POST /tasks/{task}/start`, and send `POST /tasks/{task}/results` beneath `/api/v1/odds`. Start/result services still reject another user's assignment with 422. Submitted new-task results enter `leader_review` through the existing workflow.
- `/odds` exposes personal designer sections alongside SPV management menus. Personal task sections filter by the signed-in assignee; management sections retain all-task access. Refresh the authenticated profile after applying permissions. Browser interaction QA is separate from API tests.

## Domain modules

| Module | Route boundary |
| --- | --- |
| Core | auth, onboarding, dashboard, profile, chat, notifications, users, roles, and maintenance |
| Creative AI | chat with cai access |
| Creative Report | assessments and members |
| Generator | generator/pricetag |
| KV Retail | kv-retail |
| ODDS | odds |
| Design Assets | design-assets.php route module |

Run php apps/backend/artisan route:list before changing an endpoint contract. Add the relevant feature test under apps/backend/tests/Feature.
