# CreativeUniverse Frontend

This is the Next.js frontend for CreativeUniverse. It uses the App Router and produces a static export for deployment with the Laravel backend.

## Commands

Run these commands from the repository root:

```powershell
npm --prefix apps/frontend run dev
npm --prefix apps/frontend run lint
npx --prefix apps/frontend tsc -p apps/frontend/tsconfig.json --noEmit --pretty false
npm --prefix apps/frontend run build
```

## Structure

- `src/app/`: route-local pages and layouts.
- `src/components/`: reusable UI and layouts.
- `src/core/`: shared application infrastructure such as APIs and navigation.
- `src/features/`: domain-specific UI, state, and API composition.
- `src/providers/`: application providers.
- `scripts/`: frontend validation and documentation synchronization scripts.

For the full project workflow, see [the repository documentation](../../docs/README.md).
