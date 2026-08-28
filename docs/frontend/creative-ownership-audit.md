# Creative AI and Creative Report Ownership Audit

> Status: Active restructuring reference  
> Last verified: 2026-08-24

This document records CREATIVE-001 consumer evidence, canonical ownership, and preserved frontend contracts. It authorizes structural placement only; UI, behavior, API, permission, business-rule, responsive, and accessibility changes remain outside scope.

## Route ownership

- `/creative-ai` remains a statically exported route and currently renders fixed initial conversation data. Its dark Spectrum provider and complete navigation/chat shell are route-layout composition.
- `/creative-report`, `/creative-report/performa`, `/creative-report/summary`, `/creative-report/creative-agent`, `/creative-report/creative-agent/edit`, and `/creative-report/option` remain statically exported route shells. Browser-side requests still require the live Laravel API and authenticated session.
- Creative Report layout retains viewport-derived mobile/desktop navigation and the exact route-to-menu mapping for Performa, Creative Agent, and Option.

## Preserved Creative AI contracts

The current page retains its three initial messages, sender ordering, markdown/code presentation through BubbleChat, and responsive content container. The layout retains the dark Spectrum provider, SideNav/MobileNav state, full-screen shell, scroll region, bottom ChatBox, and existing submit callback. `features/creative-ai/api` retains POST `/cai/chat`, although the current route does not call it.

## Completed Creative AI shell slice

`CreativeLayout.tsx` and the complete 71-file historical `components/universe/Creative/` tree are now owned by `features/creative-ai/components/`. The route layout imports the feature shell, the route page imports the feature-owned BubbleChat, and CreativeLayout uses relative imports for SideNav, MobileNav, and ChatBox. No other product or developer consumer existed, so the family did not meet generic or cross-feature ownership thresholds.

The relocation preserved every file byte in the 71-file nested tree, its public barrels, component props, configuration, hook logic, Spectrum Icon dependencies, markdown/media presentation, sidebar state, responsive navigation, chat input behavior, strings, classes, and dark-shell composition. The route remains the sole external composition owner; `features/creative-ai/api` remains independent and unchanged.

## Preserved Creative Report contracts

- `features/creative-report/api` retains list/detail/update/complete assessment calls, user detail, member ordering, member approval/rejection, historical creation, detail, and multipart update under `/creative-reports`.
- Performa retains permission checks for `creative-report.assessments.update`, Manajer, and SPV; month/search/jobdesk filtering; desktop-expanded groups; draft and completion actions; HRD dates; member ordering; responsive table/cards; print/export; loading and errors.
- Summary retains `user` and `month` query state, canonical query replacement, individual detail loading/error states, month selection, print action, score calculations, and HRD/evaluation presentation.
- Creative Agent retains month selection, member/assessment loading, role-derived edit access, profile selection, scrolling, and navigation to `?memberId=` editing.
- Edit member retains role gating, invalid/missing-member navigation, media preview/upload, personal/specialty editing, FormData payload, feedback timeout, and return navigation.
- Option retains aspect/title/detail-card settings through `coreApi.settings` and role-controlled member approval/rejection and historical-member creation.

## Completed summary route-local slice

The eight-file Summary presentation family has exactly one product page consumer. `ScorePanel` now owns nested `AspectScoreList` and `AspectScoreTotal`; `SummaryProfile`, `SummaryPillars`, `HrdReviewCard`, `HrdRulesCard`, and `EvaluationNotesCard` are sibling route-local components under `app/creative-report/summary/_components/`.

The move preserves every exported prop, rendered element, class, string, score calculation, inline width, and callback. Developer catalog metadata uses explicit source paths, and the live AspectScoreList preview imports the canonical implementation. Developer preview use does not promote product ownership.

## Completed Performa route-local slice

The Performa product surface has exactly one route consumer. Its nineteen-file UI family now lives under `app/creative-report/performa/_components/`: AssessmentTable owns its types, utilities, row, cell, avatar, header, and actions; AssessmentMobileCards and HrdDateModal remain sibling route components because both desktop and mobile assessment surfaces consume the date modal/contracts; ReportHeader owns ReportTitle, MonthPickerButton, and ExportPdfButton; ReportToolbar owns CreativeReportMetricCard; GroupAccordion, HrdRulesFooter, and ReportSummaryInfo remain proportional siblings.

All route, hook, internal, live preview, and developer registry imports moved atomically. Five CREATIVE-001 dependency exceptions were removed because route-local UI may consume Creative Report feature API/types and route settings directly. The pre-existing HrdRulesFooter set-state rule exception follows its canonical file path without changing its effect. Historical `report-group.tsx` had no runtime, preview, or import consumer and was deleted with its placeholder registry entry; active GroupAccordion remains unchanged.

## Completed Creative Agent edit slice

The six-component edit-member presentation family has one product-page consumer and now lives under `app/creative-report/creative-agent/edit/_components/`. EditMemberPersonalTab owns its EditMemberMediaPreview and EditMemberMediaUpload children; EditMemberHeader, EditMemberTabs, and EditMemberSpecialtiesTab remain proportional sibling components.

The route and nested imports moved atomically, and all six developer registry records resolve through explicit canonical source paths. Moving PersonalTab and SpecialtiesTab out of the generic component layer removes the final two CREATIVE-001 dependency exceptions while preserving their existing Creative Report and ODDS type dependencies at the app composition layer. Role checks, member/query loading, FormData save, image/video handling, tabs, categories, feedback, and navigation remain unchanged.

## Completed settings and Option ownership slice

Creative Report settings types, defaults, database loading/saving, and `useCreativeReportSettings` now live under `features/creative-report/settings/`. Product routes, Performa presentation, and developer previews import that canonical feature owner directly. The former local-storage adapter had no source, preview, or runtime consumer and was deleted after an exact export-consumer scan; the active `coreApi.settings` behavior and fallback defaults are unchanged.

`CreativeMemberManagement` has exactly one product-page consumer and now lives under `app/creative-report/option/_components/CreativeMemberManagement/`. Its member loading, approval/rejection, historical-member payload, strings, markup, styles, and error/saving behavior are unchanged.

`AspectsConfiguration` likewise has one Option-page consumer and now lives under `app/creative-report/option/_components/AspectsConfiguration/`. The route page retains access gating and tab composition, while the component retains the same settings hook, field values, totals, validation, save action, success toast, copy, markup, and classes.

The Summary, Performa, Creative Agent, Option, and edit hooks remain route-local deliberately. They compose URL/search state, navigation, auth, route-local presentation types, or the ODDS feature; moving them into `features/creative-report` would either invert `feature -> app` or introduce a prohibited Creative Report to ODDS feature dependency. This route orchestration is distinct from the feature-owned settings state.

## Completed residual Creative Report presentation slice

`AppTitle` has one product consumer and now lives under `app/creative-report/_components/AppTitle/`. `DetailCard` and its rating/metric contracts have one product consumer and now live under `app/creative-report/creative-agent/_components/DetailCard/`. `PopupPerson` has one product consumer and is nested beneath `AssessmentTableRow` under the Performa route. Route, hook, row, live preview, and developer catalog paths moved atomically.

These moves preserve the exact exports, props, defaults, markup, classes, image/video behavior, rating animation, profile resolution, and hover composition. Developer preview/catalog usage remains QA evidence and does not promote product ownership.

The underlying `components/layout/profile/card.tsx` remains a reviewed cross-domain business component. Creative Agent renders it directly, Performa PopupPerson composes it, and ODDS designer selection consumes it with capacity/rating/recommendation semantics. It is therefore not generic UI and cannot move into either feature without creating a forbidden feature dependency; physical ownership is deferred to the joint ODDS-001 review while its current shared boundary remains unchanged.

## Cross-domain handoff

| Current surface | Consumer evidence | Target |
|---|---|---|
| `components/layout/profile/card.tsx` | Creative Agent, Performa PopupPerson, and ODDS designer selection | Joint CREATIVE-001/ODDS-001 ownership review; do not create a feature-to-feature dependency |

No Creative-owned presentation remains in historical generic folders. The shared ProfileCard decision is assigned to ODDS-001 because its current consumers and business contract span both Creative Report and ODDS; this handoff does not authorize a cross-feature import or behavior change.

## Validation contract

Every slice requires focused and full lint, dependency boundaries, cycle and stale-path scans, registry resolution, production type/build/static export, and authenticated browser smoke when the API/session is available. Manual QA remains pending and does not block independent structural slices.

Related references: [architecture contract](rebuild-architecture.md), [placement audit](legacy-component-audit.md), [boundary exceptions](boundary-exceptions.md), and [phase registry](migration-inventory.md).
