# Developer Tools Ownership Audit

> Status: Current  
> Last verified: 2026-08-24

This document maps `DEV-001` ownership for the active developer routes and component library. It records structural placement and preview integrity only; it does not authorize product UI, behavior, API, permission, or business-rule changes.

## Route ownership

The developer routes `/developer/beta`, `/developer/beta/landing/guest`, `/developer/beta/landing/login`, `/developer/layout`, `/developer/library`, `/developer/log`, `/developer/playground`, `/developer/test`, `/developer/token`, and `/developer/token/legacy` keep routing-only `page.tsx` entry points. Route layouts remain composition-only wrappers. Their complete page and shell implementations live in same-route PascalCase `_components` trees.

The root `src/app/developer/layout.tsx` remains the shared route-group boundary. Beta-only `BetaContent` and `RouteCard` were demoted from the generic Universe layer after a full consumer search found only `DeveloperBetaPage` as a product consumer.

## Component library ownership

- `library.data.ts`, `library.types.ts`, and `data/` own route-local catalog metadata and tree contracts.
- `DeveloperLibraryPage`, `LibraryMenu`, `LibraryPreview`, `VisualPreview`, toolbar controls, and log history are route-local tooling components.
- `Previews/` owns preview adapters and preview-only support components. `PreviewWrapper`, `DefaultPreviewPlaceholder`, and the grouped preview implementations use PascalCase component ownership.
- `PREVIEW_REGISTRY` retains its exact component-name lookup contract and renders original active components through direct imports. Preview adapters may provide state or sample props, but they do not become alternate product implementations.
- A placeholder remains intentional when an interactive preview has not been defined; this does not change the registered source component.

## Registry and source-path contract

Every catalog item with a source implementation has an explicit `sourcePath`. The DEV-001 audit resolved 62 explicit source paths with zero missing targets. All 60 absolute imports used by preview modules resolve to an active source module. Cancelled-frontend paths are forbidden.

Developer previews are technical consumers. They do not promote a domain component to cross-feature or generic ownership; placement levels are calculated from real product route consumers.

## Preserved contracts

The restructuring retains internal navigation, query-string selection, folder expansion, viewport controls, source links, preview-name keys, beta links, token demonstrations, test fixtures, layout examples, labels, markup, styling, and client-state behavior. Existing warnings or suspected product defects are not corrected during this structural phase.

## Validation boundary

DEV-001 is technically verified when focused and full frontend lint have zero errors, TypeScript passes, the dependency graph has no cycles, all registry and preview paths resolve, static export retains the developer routes, documentation validates, and the production build succeeds. Manual visual QA remains pending and technical evidence does not imply user approval.

## Related documents

- [In-place restructuring architecture](rebuild-architecture.md)
- [Frontend restructuring registry](migration-inventory.md)
- [Component restructuring conventions](component-tree-migration.md)
- [Frontend restructuring goal](../../FRONTEND_RESTRUCTURE_GOAL.md)
