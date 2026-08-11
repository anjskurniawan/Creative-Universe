# Frontend Finalization F19-F32

**Status:** completed and verified on 2026-07-15  
**Scope:** Generator, experimental apps, realtime, files, component boundaries, quality, and cleanup.

## Result by stage

| Stage | Result |
|---|---|
| F19 | Generator Pricetag uses a typed domain facade for catalog, generation, import, history, and authenticated ZIP download. |
| F20 | Creative AI remains the UI name, CAI remains the backend key/prefix, and `/api/v1/cai` now requires application assignment plus `access-cai`. Design Assets remains an explicit experiment without a fabricated API. |
| F21 | Pusher is the only realtime transport. One Core Echo client owns authentication; notification, chat, KV Retail, and Pricetag consumers only subscribe to it. |
| F22 | Multipart upload with progress moved to `core/files`; it standardizes Sanctum cookies, XSRF retry, progress, abort, response mapping, and errors. Authenticated batch downloads use the API blob adapter. |
| F23 | Network and realtime state ownership is separated from page rendering through Core and feature facades. |
| F24 | Core Chat types/API/subscriptions and domain API types are reusable and no longer duplicated by ODDS, Messages, or bells. |
| F25 | Route construction remains centralized in `core/navigation`; sub-app pages do not own legacy route constants. |
| F26 | Core shell, sub-app shell, Material Icon, side menu, and existing design tokens remain the shared visual primitives. No redesign was introduced. |
| F27 | Large active pages were measured. They remain a controlled decomposition backlog because an all-at-once split would risk established UI behavior. New infrastructure is no longer added inside those pages. |
| F28 | Accessibility guardrails include semantic docs navigation, reduced-motion behavior on experimental visual pages, labels, disabled states, and lint checks. |
| F29 | Unreferenced assets totaling more than 7 MB were removed from the production public tree. Realtime and API clients remain singletons/facades. |
| F30 | TypeScript, ESLint, production build, and Laravel tests are the release gates. |
| F31 | `npm run test:contracts` prevents legacy dashboard route groups, legacy API facades, duplicate XHR upload implementations, and duplicate realtime clients. |
| F32 | Unused demo routes and unreferenced public assets moved to `backup/frontend/F32-obsolete-2026-07-15`; nothing was permanently deleted. |

## Controlled decomposition backlog

These active files are still large and should be split per feature during future product work, not by blind line-count rewrites:

1. Generator Pricetag page: separate single generation, checklist generation, CSV generation, and result panels.
2. ODDS list page: separate role dashboards, queue controls, and reporting panels.
3. Profile page: separate identity, security, device sessions, and avatar flows.
4. Creative AI page: separate visual scene, chat composer, agent selector, and chat transcript.
5. KV Retail page: separate query/state hook, task collections, and desktop/mobile presenters.

Each extraction must preserve API facade usage, canonical URLs, permission checks, mobile behavior, and existing visual output.

## Active architecture rules

- Core capabilities live under `src/core`; business contracts live under `src/features/<application>`.
- Application routes remain outside `(dashboard)` and use professional canonical URLs.
- A user needs an application assignment and the relevant feature permission; UI permission labels may use friendly aliases.
- Design Assets must not call a backend until a real contract is approved.
- Public uploads are still stored on cPanel/local storage through the backend file service; original client filenames are metadata, not storage names.
- Obsolete material belongs in the root `backup` tree and must not be imported by active code.

## Verification commands

```bash
cd apps/frontend
npm run test:contracts
npx tsc --noEmit
npm run lint
npm run build

cd ../backend
php artisan test
```
