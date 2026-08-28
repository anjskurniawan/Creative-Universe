# Generator and Pricetag Ownership Audit

> Status: Active restructuring reference  
> Last verified: 2026-08-24

This document records GEN-001 route, UI, API, permission, browser-state, file, realtime, CSS, and ownership evidence. It authorizes structural placement only; visuals, behavior, payloads, validation, permissions, and generation rules remain unchanged.

## Route and layout ownership

- `app/generator/layout.tsx` remains the Generator route layout and preserves the global NavBar plus black application shell.
- `app/generator/pricetag/layout.tsx` is routing composition only. Its four-route tab/title/GSAP implementation is feature-owned by `features/generator-pricetag/components/PricetagLayout/`.
- `/generator/pricetag` routes through a thin page into route-local `PricetagGeneratorPage`; it owns single/checklist/CSV generation, query-selected products, product/category loading, batch polling, Excel template export, mobile/desktop wizard state, and result/download surfaces.
- `/generator/pricetag/catalog` routes into route-local `PricetagDatabasePage`; it owns category/product CRUD, pagination/search tabs, CSV import, dialogs, browser confirmation, and permission-denied presentation.
- `/generator/pricetag/history` routes into route-local `PricetagHistoryPage`; it owns batch pagination/detail, responsive detail state, realtime refresh, item/result actions, and ZIP download.
- `/generator/pricetag/search` routes into route-local `PricetagSearchPage`; it owns category/product search mode, pagination, expanded cards/rows, preview/download links, and notification errors.
- All routes remain static output whose protected data and mutations require the live Laravel API and authenticated browser session.

## Feature API and contracts

`features/generator-pricetag/api/index.ts` retains the `/generator/pricetag` API prefix and all existing operations:

- category list/detail/create/update/delete;
- product list/detail/create/update/delete;
- single, checklist, and CSV generation;
- batch list/detail/ZIP download;
- product CSV import.

The API continues through `core/api/client` using the same JSON methods/bodies, multipart FormData, blob handling, object URL lifecycle, and `pricetag-batch-{id}.zip` filename. `features/generator-pricetag/types/index.ts` retains category/product/batch/item/page/input contracts, empty product form, Rupiah formatting, and API/validation error mapping.

## Permission, role, state, and file invariants

- The Database tab and catalog page remain gated by `pricetag.manage`; unauthorized catalog access renders the existing denial surface and does not load catalog data.
- The generator's third mode remains visible only to the `root` role.
- `product_id` query handling, search/filter/pagination parameters, page sizes, loading/empty/error states, selection, pricing, checklist, progress, and reset behavior are unchanged.
- CSV upload/import and generation FormData keys remain source-authoritative. ExcelJS template creation, browser Blob/object URL handling, download filenames, and cleanup are unchanged.
- Route notifications continue through `pushLocalNotification` with their original route and user ID.
- History continues listening to `.pricetag.updated` on each `pricetag-batch.{id}` private channel and leaves each channel during cleanup.
- `window.matchMedia`, browser confirmation, dialogs, query state, mobile expansion, and responsive rendering remain in their original implementations.

## CSS and motion ownership

Pricetag continues consuming active Tailwind tokens/utilities through the existing `.cu-style` application boundary. The inactive `app/global-legacy.css` definitions were never part of the runtime import graph and were retired during CLOSE-001 after import and selector-consumer audits; no active Pricetag CSS import changed.

## Canonical ownership result

- Route entry files and the Pricetag layout wrapper under `app/generator/pricetag/` now contain routing composition only.
- Each one-page UI implementation lives in its route-local PascalCase `_components/` folder.
- The four-route Pricetag layout, API, types, formatting, validation-error mapping, and feature README live under `features/generator-pricetag/`.
- The transitional nested `features/generator/pricetag/` path is retired after zero-reference and empty-directory verification.
- No component was decomposed internally and no JSX, hook order, handler, payload, string, class, timing, or public route changed.

## Validation contract

GEN-001 requires focused/full lint, TypeScript, CSS boundaries, dependency-cycle and stale-path scans, documentation validation, scoped diff check, production static build, and browser route smoke when an authenticated API/session is available. Manual QA remains pending and is not inferred from structural checks.

Related references: [architecture contract](rebuild-architecture.md), [component domains](component-tree-legacy-domains.md), [phase registry](migration-inventory.md), and [CSS architecture](css-architecture.md).
