# Local and cPanel Deployment

> Status: Current
> Last verified: 2026-08-13

This document records the local deployment flow that is available in the current worktree. Server paths and cPanel tasks are not present and must be verified again before production deployment.

## Local static package

npm run build:static builds apps/frontend/, checks for the static index output, and copies the static export to apps/backend/public/.

## Important boundary

scripts/build-static.mjs removes the entire apps/backend/public/ target before copying the export. Do not run it where that directory contains Laravel files that are still needed unless the target and backup are verified first.

## cPanel

Before enabling cPanel deployment:

1. Choose a document root that exposes only apps/backend/public/.
2. Verify the source path and account path on the server.
3. Back up the database and storage/app.
4. Verify production environment, storage link, cache, queue, and health endpoint.
5. Perform the build and transfer explicitly, then check GET /api/v1/health.

No hosting path, credential, or production token is recorded in the repository.
