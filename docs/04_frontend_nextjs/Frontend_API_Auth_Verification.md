---
title: "Frontend API and Auth Verification"
status: "ACTIVE"
version: "1.0"
created: "2026-06-27"
revised: "2026-06-27"
owner: "Divisi Creative - PT Doran Sukses Indonesia (JETE)"
verified_against_code: true
source_files:
  - "apps/frontend/src/lib/api.ts"
  - "apps/frontend/package.json"
  - "apps/frontend/next.config.ts"
---

# Frontend API and Auth Verification

## 1. Purpose
Verify the behavior of the frontend API client, authentication logic, and real-time connectivity to ensure secure and seamless integration with the Laravel backend.

## 2. Verification Method
Verified by inspecting `apps/frontend/src/lib/api.ts`, `apps/frontend/src/lib/echo.ts`, and local environment files.

## 3. API Client Evidence
- Centralized in `src/lib/api.ts`.
- Uses native `fetch` with robust error handling (creating specific error instances like `ValidationError`, `ForbiddenError`).
- Base URL is determined by `NEXT_PUBLIC_API_URL` or a relative `/api/v1` path (crucial for same-origin production deployment).

## 4. CSRF and Sanctum Flow
- The client reads the `XSRF-TOKEN` cookie and attaches it to non-GET requests as `X-XSRF-TOKEN`.
- It intelligently handles `419` expiration errors by automatically calling `/sanctum/csrf-cookie` to refresh the token and retrying the failed request transparently.
- Uses `credentials: "include"` globally to ensure cookies are sent.

## 5. Auth State Management
- `api.ts` handles `401 Unauthorized` responses by automatically redirecting the user to `/login?redirect=...`.
- Client-side auth redirect can be bypassed per-request using `_skipAuthRedirect: true`.

## 6. API Response Envelope
- The API client expects a standard JSON envelope (e.g., checking for `success` and `data` properties).
- Unwraps `payload.data` automatically on successful requests, preserving `meta` data when pagination is involved.
- `422` Validation errors are normalized into a standard `Record<string, string[]>` format for easy form binding.

## 7. Protected Route Strategy
- Due to static export, protected routes are entirely dependent on client-side API requests to determine authorization state. 401 redirects happen after page load based on API failure.

## 8. Realtime Client Evidence
- Implemented in `src/lib/echo.ts`.
- Uses `laravel-echo` with the `pusher` broadcaster.
- Securely attaches the CSRF token to the `authEndpoint` (`/broadcasting/auth`), ensuring private channel subscriptions succeed.
- Connects using safe, public environment variables (`NEXT_PUBLIC_PUSHER_KEY`, `NEXT_PUBLIC_PUSHER_CLUSTER`).

## 9. Static Export Constraints
- Authenticated pages cannot use `getServerSideProps` or Server Components for data fetching. The client accurately relies on client-side `fetch` wrappers.
- The `next.config.ts` development proxy works around CORS, but production relies on being deployed to the same origin (e.g., copying `out/` to Laravel's `public/` directory).

## 10. Frontend Security Notes
- Secure: The CSRF token is properly managed without exposing it to the UI unnecessarily.
- Secure: Environment variables passed to the Next.js bundle correctly limit exposure strictly to `NEXT_PUBLIC_` prefixed keys.

## 11. NEEDS_REVIEW
- N/A. The API client implementation is robust and follows Laravel Sanctum SPA best practices perfectly.

## 12. Next Actions
- No immediate actions required. Continue utilizing `api.ts` for all new frontend modules.
