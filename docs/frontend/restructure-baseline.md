# Frontend Restructuring Baseline

> Status: Active Phase 1 evidence  
> Last verified: 2026-08-24

This baseline describes the active `apps/frontend/` before feature ownership moves. It records existing structure and debt without treating suspected bugs, warnings, or placement violations as authorization for behavior changes.

## Toolchain and build

| Concern | Current evidence |
|---|---|
| Package manager | npm with `package-lock.json`; `npm ci` completed |
| Next.js | 16.2.9, App Router, webpack build |
| React | 19.2.4 |
| Static export | `output: "export"`, trailing slash, unoptimized images |
| Spectrum | `@react-spectrum/s2` 1.6.0 with `unplugin-parcel-macros` |
| Boundary lint | `eslint-plugin-boundaries` 7.2.0 with ESLint flat config |
| Lint | `npm run lint`: exit 0, 0 errors, 197 existing warnings |
| TypeScript | Passed inside `npm run build` |
| Production build | Passed; 66 static routes generated |
| Automated tests | No `*.test.*` or `*.spec.*` files found under `src/` |
| Dependency audit | `npm ci` reports 8 vulnerabilities: 3 moderate and 5 high; no automatic fix authorized |

The first production build failed because custom `splitChunks.cacheGroups.s2` forced Spectrum virtual macro CSS assets into unresolved chunks. Removing only that custom chunking override restored the documented shared macro plugin setup and made the build pass. Static export still warns that Next rewrites are not applied to exported output; this existing deployment contract requires later operational review, not an opportunistic behavior change.

## Source inventory

| Area | Count |
|---|---:|
| Source files | 692 |
| TypeScript/TSX files | 678 |
| `page.tsx` route files | 63 |
| Route layouts | 18 |
| Error/not-found boundaries | 3 |
| Component TypeScript files | 370 |
| Feature TypeScript files | 84 |
| Core TypeScript files | 23 |
| Provider TypeScript files | 2 |
| Lib TypeScript files | 2 |
| CSS files | 4 |
| Developer preview files | 59 |
| Per-folder `index.ts` files | 66 |
| Public files | 24 |

Top-level source file totals, including non-TypeScript files: `app` 201, `components` 372, `core` 24, `features` 92, `lib` 2, `providers` 2, and `styles` 1. No root `hooks/` or `types/` folder exists yet; neither should be created until a real owner requires it.

## Runtime configuration inputs

Only names are recorded; values remain private:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_PUSHER_CLUSTER`
- `NEXT_PUBLIC_PUSHER_KEY`

## Placement and import baseline

- The three deep relative TypeScript imports found in ODDS were normalized to `@/features/odds/...`; the only remaining `../../` occurrence is an intentional filesystem path from the developer log route to root `logs/logs.md`, not a module import.
- Six files outside `app/` import `@/app/` ownership.
- Twenty-five files under `components/` import `@/features/`.
- One file under `core/` imports presentation components.
- Three component implementations remain directly at `src/components/` root.
- Boundary lint initially found 35 forbidden dependencies across 27 exact files.
- The exact structural exceptions and their removal phases are in [Frontend Boundary Exceptions](boundary-exceptions.md).
- Existing non-boundary lint failures were converted to exact-file exceptions: 49 errors across 15 files. This preserves behavior while making new errors fail immediately; 197 warnings remain visible.

The 66 `index.ts` files contain no root `components`, `features`, `core`, `providers`, or `lib` layer barrel. Eleven folder barrels export eight or more symbols; they remain per-component/domain candidates. The ODDS legacy TaskCard and brief-details barrels participate in recorded cycles and are assigned to ODDS-001; other large barrels require consumer review before any change.

## Circular dependency baseline

`madge` 8.0.0 processed all 678 TypeScript/TSX files and found 28 cycles:

- 19 developer-library data cycles between `app/developer/library/library.data.ts` and domain library data modules; owner phase `DEV-001`.
- 8 ODDS legacy TaskCard cycles centered on `components/odds/legacy-taskcard/index.ts`; owner phase `ODDS-001`.
- 1 ODDS brief/request-builder cycle through `features/odds/components/brief-details/index.ts`; owner phase `ODDS-001`.

Cycles are baseline debt, not permission to rewrite logic. Each owning phase must preserve exports and behavior while removing the cycle, then rerun the complete graph scan.

On 2026-08-24, KV-001 consumer evidence reassigned the historical TaskCard family from ODDS to KV Retail. Its canonical move and `TaskCardConfig` extraction removed all nine cycles reported by the focused post-move graph (the original eight-cycle repository baseline plus the mobile entry edge exposed by the focused scope). This paragraph records closure without altering the historical baseline counts above.

The subsequent full `src` graph processed 681 TypeScript/TSX modules and now reports exactly one remaining cycle: the ODDS brief-details/request-builder chain already assigned to ODDS-001. The former developer-library and TaskCard cycles no longer appear in current evidence; the original 28-cycle list remains above solely as the Phase 1 baseline snapshot.

After GEN-001 introduced five thin route/layout wrappers while moving the original implementations intact, the full graph processed 686 modules and still reports only that same assigned ODDS cycle.

ODDS-001 checkpoint 1 moved the cross-component brief/request contracts to `features/odds/types/` and removed the assigned ODDS cycle. A focused ODDS graph is cycle-free. A later raw full-`src` scan processed 689 modules and exposed the 19 developer-library cycles from the historical baseline again; those remain owned by DEV-001 and do not invalidate closure of the ODDS cycle.

After ODDS-001 checkpoint 3 retired two proven-unused request files and reorganized the active request/retro trees, the full graph processes 688 modules. All 19 reported cycles remain exclusively in the developer-library registry assigned to DEV-001; the 59-file request/retro focused graph is cycle-free.

After ODDS-001 checkpoint 4 moved the complete task-lifecycle graph and added explicit developer-catalog source paths for its feature-owned components, the full graph still processes 688 TypeScript/TSX modules and reports zero circular dependencies. This is current evidence only; the historical Phase 1 cycle counts above remain unchanged as the original baseline snapshot.

After ODDS-001 checkpoint 5 added thin `/odds` and `/odds/option` entry files while moving their implementations and sole-consumer configuration components intact, the full graph processes 690 TypeScript/TSX modules and remains cycle-free.

ODDS-001 checkpoint 6 retains 690 modules while normalizing every residual ODDS component into a PascalCase folder/same-named primary file and moving domain helpers under `features/odds/utils/`. The full graph remains cycle-free; ODDS has zero generic component paths, cross-feature imports, feature-to-app imports, and boundary exceptions.

## Active CSS baseline

The original baseline found four CSS files while only `global.css` was active. CLOSE-001 completed that assignment: the root still imports `@react-spectrum/s2/page.css` and `src/app/global.css`, the three zero-consumer inactive stylesheets are retired, and `global.css` is the only project CSS file. Legacy Tailwind/reset behavior remains scoped beneath `.cu-style`.

## Public asset baseline

Twenty-four files exist under `public/`. Direct source/CSS reference scanning finds active references for seven assets. Seventeen files have no direct literal reference, including manifest-linked favicon sizes, the Material Symbols license, landing motion assets, mobile guest imagery, and layout-preview profiles. Absence of a literal source reference does not prove an asset unused; deletion is deferred until manifest, CSS, runtime-generated path, and browser-network audits are complete in the owning phases.

## Browser baseline

Playwright opened the active application at desktop and mobile viewports. `/login` and `/developer/layout` compiled and rendered the same accessible `Sesi Tidak Tersedia` fallback because `GET /api/v1/auth/me/` returned HTTP 500 in the current local environment. The console had one corresponding resource error; authenticated route/UI parity remains unverified.

Ignored screenshots are stored under `apps/frontend/output/playwright/`:

- `baseline-login-desktop-session-unavailable.png`
- `baseline-login-mobile-session-unavailable.png`
- `baseline-developer-layout-mobile-session-unavailable.png`

## Phase 1 remaining evidence

- Authenticated route rendering remains pending on a working local auth/API state.
- Static rewrite/deployment behavior remains a documented warning and must not be changed without separate architecture evidence.

Related contracts: [Restructuring Architecture](rebuild-architecture.md), [Restructuring Registry](migration-inventory.md), and the root [Goal](../../FRONTEND_RESTRUCTURE_GOAL.md).

## Post-baseline foundation changes

- `src/core/layouts/core-shell.tsx` had no consumer and imported UI/providers from `core`; it was deleted after exact symbol/path searches returned no use.
- `src/providers/spectrum-root-provider.tsx` was an unused duplicate provider and was deleted after the same consumer audit.
- The active source now contains 676 TypeScript/TSX modules. Full lint, CSS boundary verification, TypeScript, and the 66-route static build pass after both deletions.
