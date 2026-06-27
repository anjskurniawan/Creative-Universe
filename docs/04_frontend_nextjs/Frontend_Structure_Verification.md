---
title: "Frontend Structure Verification"
status: "ACTIVE"
version: "1.0"
created: "2026-06-27"
revised: "2026-06-27"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
verified_against_code: true
source_files:
  - "apps/frontend/package.json"
  - "apps/frontend/next.config.ts"
  - "apps/frontend/src"
---

# Frontend Structure Verification

## 1. Purpose
Verify the implemented folder structure and configurations of the Next.js frontend to ensure they align with the headless architecture specifications.

## 2. Verification Method
Verified by inspecting `apps/frontend/next.config.ts`, `apps/frontend/package.json`, and the directory layout of `apps/frontend/src`.

## 3. Next.js Configuration Evidence
- `next.config.ts` enforces `output: "export"`, guaranteeing that the build produces a static HTML/JS export.
- It also uses `trailingSlash: true` and `images: { unoptimized: true }` to comply with static export constraints.
- A local proxy rewrite rule maps `/api/v1/:path*` to `http://creativeuniverse.test/api/v1/:path*` for local development. This is safe, as Next.js automatically discards rewrites during static exports.

## 4. Folder Structure Summary
- `/src/app`: Contains the Next.js App Router definitions.
- `/src/components`: Contains shared React components.
- `/src/lib`: Contains utility modules (API client, Echo client, feature-specific API wrappers like `odds.ts` and `pricetag.ts`).
- `/src/providers`: Contains React context providers.

## 5. Components and Features Structure
The application structure generally adheres to modern Next.js practices. However, the SRD (`NextJS_Frontend_SRD.md`) outlines a `features/` directory for modular logic (e.g., `features/auth`, `features/core`, `features/odds`). The `features` folder is currently **missing** from `src/`. Logic appears to be placed within `lib/` and directly in the `app/` routes.

## 6. Static Export Readiness
The configuration is fully prepared for static export. The use of `next.config.ts` settings like unoptimized images ensures that no runtime Node.js features are unintentionally used, validating the static deployment strategy to shared hosting.

## 7. Package and Dependency Summary
The frontend uses:
- `next: 16.2.9`
- `react: 19.2.4`
- Tailwind CSS 4 (`@tailwindcss/postcss`)
- Utilities like `lucide-react`, `gsap`, `three`.
- Real-time communication via `laravel-echo` and `pusher-js`.

## 8. Frontend Docs Alignment
The `NextJS_Frontend_SRD.md` provides accurate guidance on static export restrictions. However, its expectation of a strict `features/` folder pattern contradicts the actual `src/` layout.

## 9. Frontend Mismatch Register
- **Folder Mismatch:** SRD dictates a `features/` directory for grouping domain logic. The actual implementation places domain API logic in `src/lib/` (e.g., `src/lib/odds.ts`) and presumably hooks/components inside `src/app/` or `src/components/`.

## 10. NEEDS_REVIEW
- Should the `src/` folder be restructured to include the `features/` directory as specified in the SRD, or should the SRD be updated to match the current implementation?

## 11. Next Actions
- Discuss the folder structure strategy with the frontend lead.
- Update `NextJS_Frontend_SRD.md` if the `features/` folder pattern is abandoned.
