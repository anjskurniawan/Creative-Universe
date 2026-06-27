---
title: "Operations and Deployment Verification"
status: "ACTIVE"
version: "1.0"
created: "2026-06-27"
revised: "2026-06-27"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
verified_against_code: true
source_files:
  - "README.md"
  - "apps/backend/composer.json"
  - "apps/frontend/package.json"
  - "apps/frontend/next.config.ts"
---

# Operations and Deployment Verification

## 1. Purpose
Verify the accuracy of operations and deployment documentation, ensuring that local setups, environment configurations, and production release procedures are correctly stated.

## 2. Verification Method
Verified by inspecting `README.md`, `package.json`, `composer.json`, and the absence of a structured `docs/08_operations/` folder prior to this audit.

## 3. Local Development Flow
- Documented in `README.md`.
- Requires `php artisan serve` for backend and a (planned) `npm run dev` for frontend.
- Backend initialization steps (`composer install`, `php artisan migrate --seed`) are clearly outlined.

## 4. Backend Commands
- Valid commands reflect standard Laravel practices.
- `composer.json` includes custom dev scripts leveraging `concurrently` (e.g., running server, queue, pail, and vite simultaneously), though Vite is arguably unnecessary for the pure API backend context.

## 5. Frontend Commands
- Standard Next.js commands: `next dev`, `next build`, `next start`, `eslint`.
- Static export requires `next build` (which inherently runs the export logic due to `output: "export"` in `next.config.ts`).

## 6. Environment Variables Policy
- `README.md` instructs copying `.env.example`.
- Frontend correctly utilizes `NEXT_PUBLIC_` prefixes.

## 7. cPanel Deployment Notes
- `README.md` documents a manual/artifact-based deployment strategy.
- It specifies deploying Laravel to the backend and copying the Next.js `out/` folder contents into Laravel's `public/` directory.
- Critically, it notes **not** to overwrite `index.php`, `.htaccess`, or storage links. This is a fragile process that must be strictly followed.

## 8. Static Export Deployment Notes
- The static export strategy relies on Apache routing Next.js generated `.html` files. Dynamic routes must either have generated static paths or rely on client-side query parameters.
- Since everything is served from the same domain, CORS issues are avoided.

## 9. Queue and Scheduler Notes
- The `README.md` mentions `POST /_cmd/*` Web Artisan routes for operations but lacks detailed instructions on how the queue worker (`queue:work`) or scheduler (`schedule:run`) should be maintained in the cPanel environment (e.g., via Cron Jobs or Daemon processes).

## 10. Release Checklist Alignment
- No formal Release Checklist document exists.

## 11. Rollback and Recovery Notes
- No formal Rollback or Recovery procedure document exists.

## 12. Operations Mismatch Register
- **Missing Docs:** The `docs/08_operations` directory was entirely missing prior to this audit, meaning critical operational runbooks (Queue setup on cPanel, Rollback guides) are absent.
- **Vite Script:** The backend `composer.json` includes `npm run dev` for Vite in its `dev` script, despite the architecture being decoupled (Next.js handles the frontend).

## 13. NEEDS_REVIEW
- Create a dedicated Operations Runbook detailing cPanel Cron job setups for the Laravel scheduler and Queue daemon.
- Draft a formal Release Checklist and Rollback Procedure.
- Review and prune the backend `composer.json` scripts if Vite is no longer used for the API.

## 14. Next Actions
- Draft missing operational documentation in `docs/08_operations/`.
