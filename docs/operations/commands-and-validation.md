# Commands and Validation

> Status: Current
> Last verified: 2026-08-13

Use commands that are proportional to the changed scope. A syntax check alone does not prove UI or API behavior end to end.

## Frontend

Use npm --prefix apps/frontend run lint, npx --prefix apps/frontend tsc -p apps/frontend/tsconfig.json --noEmit --pretty false, and npm --prefix apps/frontend run build. The build creates a static export because frontend configuration enables static export.

## Backend

Use composer --working-dir=apps/backend test, php apps/backend/artisan route:list, and php apps/backend/artisan migrate:status. Prefer focused feature tests. Do not run database migrations or seeders merely for inspection.

## Shared checks

Use npm run check:storage, the documentation validator, the work-log validator, and git diff --check. Browser or live API validation is required when a change affects rendering, authentication, permissions, or request contracts.
