# Next.js Static Export

> Status: Current active frontend contract
> Last verified: 2026-08-24

The only active application in `apps/frontend/` uses Next.js 16.2.9 with the App Router and static export. Its existing runtime and product contracts must remain intact during in-place restructuring. The cancelled clean rebuild is preserved at `apps/frontend-cancel/` and must not be built or used as a source.

## Configuration

next.config.ts enables static export, trailing slashes, server-unoptimized images, the React Spectrum S2 webpack macro, allowed development origins, and source rewrites for storage, API, Sanctum, and broadcasting.

Static exports do not apply rewrites after hosting. Therefore production frontend builds must use the correct NEXT_PUBLIC_API_URL.

## Runtime ownership

- src/app/layout.tsx mounts AuthProvider and RouteGuard.
- AuthProvider retrieves the session through the API client and distinguishes 401 responses from connection failures.
- UI routes live in src/app/; domain features live in src/features/.
- Public environment variables include NEXT_PUBLIC_API_URL, NEXT_PUBLIC_PUSHER_KEY, and NEXT_PUBLIC_PUSHER_CLUSTER.

## Error surfaces

The shared `UniversalErrorView` renders distinct titles through the `errorKind` prop while preserving the same recovery UI:

- `runtime`: route-level runtime errors from `src/app/error.tsx`;
- `global`: root-level failures from `src/app/global-error.tsx`;
- `not-found`: missing routes from `src/app/not-found.tsx`;
- `forbidden`: authorization failures from `/forbidden`;
- `session`: session-check or API connection failures handled by `RouteGuard`;
- `maintenance`: emergency maintenance state handled by `RouteGuard`.

The frontend does not currently expose separate route pages for HTTP 401 or HTTP 500; those states use the relevant shared error surface.

## Build and constraints

All frontend verification commands run against `apps/frontend/`. Do not run generated-write commands in `apps/frontend-cancel/`. Do not add behavior requiring a persistent Next.js server: a production API Route backend, server-only request state, runtime Server Actions, or dynamic routes without complete static output.
