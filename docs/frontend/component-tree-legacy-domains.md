# Active Component Tree — Domain Map

> Status: Active restructuring reference  
> Last verified: 2026-08-24  
> Source: `apps/frontend/src/components/` and `apps/frontend/src/features/`

## Creative Report

Kelompok utama: assessment table/mobile cards, report header/toolbar/metric, group accordion, score panel, HRD rules/review, summary, export PDF, edit member, month picker.

Target utama: `src/features/creative-report/` dengan `components/`, `hooks/`, `api/`, dan `types.ts` sesuai kebutuhan. Component yang benar-benar generic dipromosikan setelah pemakaian kedua terbukti.

## ODDS

Kelompok utama: task detail, brief details, request builder, schedule, revision, discussion, history, audit, output, protected asset, dan ODDS-specific mobile overlays. Request builder berada di PascalCase `features/odds/components/OddsRequestBuilder/`; developer-catalogued retro request UI berada di `features/odds/components/Retro/`; `/odds/new`, `/odds`, dan `/odds/option` memiliki thin route entry dengan one-page implementation route-local. Dashboard/report/ranking/escalation serta schedule berada di `app/odds/_components/OddsPage/`; root-only option/category UI berada di `app/odds/option/_components/OddsOptionPage/`. The former legacy TaskCard family was proven to be KV Retail workflow UI; only the exact Date presentation used by ODDS remains route-local under `app/odds/_components/TaskCardDate/`.

Target utama: `src/features/odds/`. Jangan memindahkan seluruh folder sekaligus; inventarisasi kontrak payload, permission, lifecycle, dan responsive behavior per phase.

## KV Retail

TaskPage, its task filters/KPI/title, TaskFormModal, the complete desktop/mobile TaskCard child tree, and TaskPerformance renderers/types are owned by `src/features/kv-retail/components/`. One-page Performance and Print presentation remains route-local. The former `components/odds/legacy-taskcard`, `taskcard-mobile`, task-performance, and facade paths are retired; developer-library labels remain stable while explicit source paths resolve to canonical owners.

## Generator and Pricetag

The four Pricetag page implementations are route-local under their PascalCase `_components/` folders. The shared four-route tab/title/motion layout, API, contracts, format/error utilities, and feature reference are owned by `src/features/generator-pricetag/`. Route `page.tsx` and Pricetag `layout.tsx` files now contain routing composition only; the transitional nested `features/generator/pricetag/` hierarchy is retired.

## Auth dan landing

Auth card, login, onboarding, guest/auth portal, landing text, application universe, media agent, and ParallaxBackground now live in `src/features/auth/components/`. Navbar and menu overlay are shared shell components; profile surfaces have explicit domain assignments recorded in the shell audit.

Target utama: `src/features/auth/`, route-local `_components/`, serta reusable shell di `src/components/layout/` atau `src/components/ui/` jika sudah generic.

## Panel dan settings

Settings shell dimiliki `features/settings/components/SettingLayout/`; Panel Users, Roles, dan Maintenance dimiliki feature masing-masing; privacy, activity-log, Dashboard, dan Panel Profile sudah route-local. `core/admin` telah dipecah ke owner domain dan `types/pagination.ts`; tiga implementation Settings tanpa runtime consumer telah dihapus setelah audit. PANEL-001 tidak memiliki placement debt yang diketahui dan hanya menunggu authenticated/manual route smoke. Root `RouteGuard` dimiliki route boundary lokal di `app/_components/RouteGuard/`.

Target utama: `src/features/panel-users/`, `src/features/panel-roles/`, `src/features/panel-maintenance/`, `src/features/settings/`, serta route-local `_components/` berdasarkan [Panel and Settings ownership audit](panel-settings-ownership-audit.md).

## Core surfaces dan feedback

MessagesPageContent dan NotificationsPageContent kini dimiliki `features/messages` dan `features/notifications`. Bell, NavBar dropdown state, ODDS task chat, SidebarUtilityActions, dan `core/chat` memiliki keputusan consumer/injection eksplisit di [Messages and Notifications ownership audit](communication-ownership-audit.md); physical move berikutnya tidak boleh menciptakan feature-to-feature import.

UniversalErrorView, ErrorTetrisGame, dan generic Toast sudah berada dalam folder component canonical di `components/feedback/`. Messages dan notifications tetap dipetakan ke feature masing-masing setelah stateful bell dan shell trigger dipisahkan.

## Application shell

Container, Workspace, Content, NavBar, SideBar, dan parent-owned MenuOverlay sekarang berada di `components/layout/`. Navigation split sudah diaudit: SideMenu ditugaskan ke KV-001, bell stateful ke domain messages/notifications, dan utility composition harus dipecah tanpa feature-to-feature imports. Settings layout dan physical navigation moves masih pending sesuai [shell ownership audit](shell-ownership-audit.md).
