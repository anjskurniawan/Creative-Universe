# ODDS Feature

- Nama resmi: One Dashboard Design System.
- Page route: `/odds`.
- API prefix: `/api/v1/odds`.
- Status: active.
- Ownership: intake, brief, queue, workflow, review, revision, escalation, reporting, ranking, dan konfigurasi ODDS.

Chat menggunakan public contract Core; ODDS tidak memiliki implementasi chat global sendiri.

## Workspace Layout

`components/OddsShell/OddsShell.tsx` owns the ODDS Sub-App shell, permission-
filtered menu data, task badge counters, realtime refresh, theme state, and
desktop/mobile viewport selection. The route `app/odds/layout.tsx` only composes
that feature shell. Menu data is passed through the shared `Container` and
workspace navigation; ODDS does not render a global navbar or Inbox menu.

`context/OddsThemeContext.tsx` owns the shared light/dark/retro contract used by
the shell, request page, dashboard sections, and task detail. Permission names,
menu labels/order, section query values, badge rules, realtime event names, and
shell classes are product contracts and must remain unchanged during later
structural checkpoints.

The `/odds` and `/odds/option` entry files are routing-only. Their complete
single-route implementations live respectively at
`app/odds/_components/OddsPage/` and
`app/odds/option/_components/OddsOptionPage/`. Dashboard reports, rankings,
escalations, configuration state, and schedule configuration remain route-local;
the feature API remains the shared owner of their ODDS transport contracts.

### Dashboard Designer Cards

Dashboard Designer aktif untuk user dengan `view-assigned-odds-tasks` tanpa
mode control. Main content aktif berisi card:

- Total Tugas Hari Ini
- Total Dalam Antrian
- Tugas Selesai
- Antrian Revisi
- Request Terbaru
- Calendar
- Need Review Brief
- Notification
- Message

Card `Score Kamu`, `Grafik Performa`, dan `Queue Jobs` sedang tidak dirender.

### ODDS Task Card

View task card yang aktif mengikuti konteks pengguna pada route ODDS. View
Designer dipakai pada menu Dashboard Designer `Semua Tugas`; view Admin dan
Client tetap menjadi kontrak UI untuk implementasi berikutnya.

## Request Creation

`app/odds/new/page.tsx` is a routing-only wrapper around route-local
`_components/NewOddsTaskPage/NewOddsTaskPage.tsx`. The route-local component
owns browser orchestration for initial data, draft query/loading/saving,
attachment upload state, catalog commits, submit, launch feedback, and final
navigation. Reusable request presentation and multi-step state live in the
PascalCase `components/OddsRequestBuilder/` family.

`/odds/new` presents the current request sequence for category, designer,
brief, reference, deadline, and review.
Designer direkomendasikan otomatis dan tetap dapat diganti user. Deadline boleh
kosong agar SLA kategori digunakan. Referensi bersifat opsional: user dapat
mengunggah file publik, mengisi link, atau mengirim request tanpa lampiran.
File diunggah terlebih dahulu ke storage ODDS dan dipindahkan ke konteks task
ketika request berhasil dibuat.

The developer-catalogued retro request family lives under
`components/Retro/`. It is not imported by the active request route, but its
catalog records and `OddsGameboyFrame` preview remain valid technical consumers,
so the family is retained rather than deleted.

Public API module: `api/index.ts`. `types/request.ts` is the single owner for
`OddsRequestForm` and `OddsRequestBuilderDraft`; the former duplicate route
`TaskForm` has been retired. Remaining API DTO separation is deferred until
every lifecycle consumer is audited.

## Task lifecycle

`components/OddsTaskDetail/OddsTaskDetail.tsx` is the shared lifecycle surface
for `/odds/detail` and `/odds/detail/dummy`. Its complete component family owns
brief acceptance/return, execution actions, review and revision states,
discussion/history/audit, protected output handling, timers, responsive tabs,
and dummy-only QA boundaries. The dummy data/provider remains route-local.

`OddsTaskCard/`, `OddsTaskChat/`, `OddsRichTextEditor/`, and
`OddsDesignerTaskRowCard/` are PascalCase ODDS feature component families. Their consumer audit
found no non-ODDS product route or feature consumer; developer catalog entries
are preview metadata and do not change domain ownership.

`components/BriefDetails/` owns the standard/table editors and previews. Pure
ODDS browser helpers for brief references, designer recommendation, and menu
visibility live under `utils/`; no UI implementation remains directly at the
feature components root.
