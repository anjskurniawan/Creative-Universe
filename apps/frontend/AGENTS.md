# Active frontend ownership

This is the only active CreativeUniverse frontend. Before reorganizing or adding code, read the repository-root `AGENTS.md` and `docs/frontend/rebuild-architecture.md`.

- Preserve all existing UI, behavior, routes, API contracts, permissions, business rules, validation, accessibility, and responsive behavior during structural work.
- Restructure foundation-first and then one feature at a time; update all imports in the same move and keep lint, type-check, and static build green.
- Never import from or modify `apps/frontend-cancel/`.
- Do not touch `apps/backend/` as part of frontend restructuring.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes â€” APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` â€” verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
