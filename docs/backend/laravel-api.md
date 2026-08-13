# Laravel API Backend

> Status: Current
> Last verified: 2026-08-13

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
- Spatie manages roles and permissions through role, permission, and role_or_permission aliases.
- Emergency maintenance is applied to API and broadcast channels.

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
