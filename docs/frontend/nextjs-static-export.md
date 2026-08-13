# Next.js Static Export

> Status: Current
> Last verified: 2026-08-13

The frontend in apps/frontend/ uses Next.js 16.2.9 with the App Router. Production must remain compatible with static export.

## Configuration

next.config.ts enables static export, trailing slashes, server-unoptimized images, the React Spectrum S2 webpack macro, allowed development origins, and source rewrites for storage, API, Sanctum, and broadcasting.

Static exports do not apply rewrites after hosting. Therefore production frontend builds must use the correct NEXT_PUBLIC_API_URL.

## Runtime ownership

- src/app/layout.tsx mounts AuthProvider and RouteGuard.
- AuthProvider retrieves the session through the API client and distinguishes 401 responses from connection failures.
- UI routes live in src/app/; domain features live in src/features/.
- Public environment variables include NEXT_PUBLIC_API_URL, NEXT_PUBLIC_PUSHER_KEY, and NEXT_PUBLIC_PUSHER_CLUSTER.

## Build and constraints

Run focused linting and type checks, then npm --prefix apps/frontend run build. Do not add behavior requiring a persistent Next.js server: a production API Route backend, server-only request state, runtime Server Actions, or dynamic routes without complete static output.
