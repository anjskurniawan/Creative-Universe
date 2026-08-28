# Active Component Placement Audit

> Status: Baseline audit for in-place restructuring  
> Last verified: 2026-08-24  
> Source: `apps/frontend/src/components/`

<!-- documentation-size-exception -->
Scope evidence remains in this audit because ownership and Spectrum-boundary decisions must be reviewed together.

Dokumen ini adalah baseline audit ownership untuk component aktif sebelum dipindahkan in place. Setiap perpindahan wajib mempertahankan behavior, mengaudit seluruh consumer, dan memperbarui semua import secara atomik. `apps/frontend-cancel/` tidak menjadi dependency atau sumber implementasi.

## 1. Ringkasan ukuran

| Kategori | Jumlah | Perlakuan |
|---|---:|---|
| Semua source `.ts`/`.tsx` | 370 | Diaudit sebagai component atau supporting module |
| Render component `.tsx` | 232 | Diklasifikasikan ke page, feature, reusable component, layout, atau feedback |
| Supporting `.ts` | 138 | Dipisahkan ke feature `types/hooks/api`, `core`, `lib`, atau tetap colocated |
| `universe/` | 193 source | Bukan target folder; harus dipecah menurut ownership |
| `odds/` dan root ODDS | 58 source | Satu domain `features/odds` |
| `creative-report/` | 34 source | Satu domain `features/creative-report` |

## 2. Keputusan level

| Level | Lokasi target | Kriteria |
|---|---|---|
| Page-specific | `app/.../_components/` | Dipakai satu page |
| Feature-specific | `features/<domain>/components/` | Dipakai dua atau lebih page dalam satu domain atau membawa business state |
| Cross-feature | Evaluasi sebelum promosi | Dipakai lintas dua atau lebih domain tetapi masih memiliki konteks bisnis |
| Generic reusable | `components/ui/` | Domain-neutral, presentational murni, dipakai minimal tiga page pada minimal dua domain |
| Spectrum adapter | `components/spectrum/<Component>/` | Wrapper/adapter di atas `@react-spectrum/s2` |
| Layout shell | `components/layout/` | Container, workspace, content, navbar, sidebar, app shell |
| Feedback | `components/feedback/` | Error, empty, loading, toast generic |
| Infrastructure | `core/` | HTTP, session, RBAC, realtime; tidak merender UI |
| Pure utility | `lib/` | Formatter, constants, algorithm murni tanpa React/domain state |

## 3. Audit seluruh component render

### 3.1 `creative-report/` — 32 component

**Level:** feature-specific. **Target:** `features/creative-report/components/`; route-only pieces ke route `_components/`; tipe/utilitas ke feature `types.ts`/`lib` feature. Tidak ada yang langsung masuk `components/ui/` hanya karena bentuknya card/table.

```text
aspect-score-list, aspect-score-total, assessment-mobile-cards,
assessment-table-actions, assessment-table-avatar, assessment-table-cell,
assessment-table-header, assessment-table-row, assessment-table,
edit-member-header, edit-member-media-preview, edit-member-media-upload,
edit-member-personal-tab, edit-member-specialties-tab, edit-member-tabs,
evaluation-notes-card, export-pdf-button, group-accordion, hrd-date-modal,
hrd-review-card, hrd-rules-card, hrd-rules-footer, month-picker-button,
report-group, report-header, report-metric-card, report-summary-info,
report-title, report-toolbar, score-panel, summary-pillars, summary-profile
```

### 3.2 Historical `odds/` dan tiga file root ODDS — 58 component

**Current split:** ODDS request presentation lives in PascalCase `features/odds/components/OddsRequestBuilder/`; the developer-catalogued retro request family and its frame live in `features/odds/components/Retro/`; the active `/odds/new`, dashboard/report/ranking/escalation `/odds`, and root-only `/odds/option` implementations are route-local behind thin page entries. The complete task-detail lifecycle lives in `features/odds/components/OddsTaskDetail/`; its audited ODDS-only `OddsTaskCard`, `OddsTaskChat`, `OddsRichTextEditor`, and `OddsDesignerTaskRowCard` support surfaces are feature-owned. Consumer evidence proved the historical `legacy-taskcard`, `taskcard-mobile`, facade `task-card`, and `task-form-modal` are KV Retail workflow UI; they live under `features/kv-retail/components/TaskCard/` and `TaskFormModal/`. The sole ODDS use of the former date child is route-local at `app/odds/_components/TaskCardDate/`.

```text
odds-designer-task-row-card, odds-rich-text-editor, odds-task-chat,
legacy-taskcard/button-status, date, delay-reason-overlay, delete-overlay,
detail-status, detail, loading-bar, next-button, submit-link-overlay,
task-card-mobile, task-card, title-task, upload-overlay, view-link-overlay,
odds-gameboy-frame,
retro/category-inventory-stage, designer-character-select-stage, loadout-row,
mission-brief-stage, mission-scroll-review, panel, request-type-select-stage,
retro-hud-route, welcome-screen,
task-card, task-form-modal, task-performance-desktop, task-performance-mobile,
taskcard-mobile/taskcard-mobile-button, taskcard-mobile-changelog,
taskcard-mobile-confirm-overlay, taskcard-mobile-detail,
taskcard-mobile-file-slots-overlay, taskcard-mobile-full-card,
taskcard-mobile-header, taskcard-mobile-layout-card, taskcard-mobile-overlay,
TaskCard/odds-task-card, output-files-panel, output-review-panel,
recommendation-button, task-card-action-bar, task-card-date, task-card-layouts,
task-card-people, task-card-status-panel, task-discussion-panel,
task-feedback-toast, task-submission-panel
```

### 3.3 Authentication family — 22 component

**Current state:** AuthCard, login, onboarding, onboarding steps, Portal Auth/Guest, LandingText, AppUniverse, and MediaAgent have moved to `features/auth/components/` after their runtime consumers resolved to the authentication/landing domain.

**Level:** mixed. Auth cards/forms/steps are feature-specific; generic card primitives may move to `components/ui/` only after removing auth semantics/state; route-only steps may remain in `app/(auth)/onboarding/_components/` if consumer evidence narrows to one page.

```text
AuthCard/AuthCard, AuthCardFooter, AuthCardHeader,
Login/LoginCard, LoginForm,
Onboarding/OnboardingCard, OnboardingForm,
Onboarding/steps/step-division, step-fullname, step-position, step-preparing,
step-ready, step-splash, step-welcome, step-whatsapp,
Portal/Auth/Auth, Portal/Guest/ClickToAction, Portal/Guest/Guest,
Portal/Guest/TypingText
```

### 3.4 `universe/NavBar`, `SideBar`, `Layouts`, `Portal`, and presentation — 42 component

**Level:** layout shell or feature-specific based on usage. **Target:** reusable shell pieces → `components/layout/`; guest/auth landing pieces → `features/auth` or route-local; `ProfileImageUpload` → `features/auth` if account-owned, otherwise Spectrum adapter; `IconMaterial` → `components/ui` only if provider-neutral.

```text
NavBar/NavBar, AppButton, AppIcon, AppIconLogo, Avatar, Breadcrumb,
ButtonMenu, Dropdown, AppsDropdown, MessageDropdown, NotificationDropdown,
ProfileDropdown,
SideBar, SideBarFooter, SideBarItem, SideBarSection,
Layouts/Container, Content, SettingLayout, Workspace,
LandingText, MediaAgent, MenuOverlay, AppUniverse,
ProfileImageUpload, Settings/SettingTitle,
Background/LoadingBackground, Background/ParallaxBackground,
BackgroundSky/BackgroundSky,
IconMaterial, developer/BetaContent, developer/RouteCard,
CreativeLayout, Creative/MobileNav, Creative/SideNav, Creative/ChatBox,
Creative/BubbleChat, Creative/SideNav children, Portal/Auth, Portal/Guest children
```

**Catatan:** `CreativeLayout`, `SideNav`, `NavBar`, `Container`, `Workspace`, dan `Content` tidak masuk `lib`. Mereka merender UI dan memiliki layout behavior, sehingga targetnya `components/layout/` atau feature workspace apabila hanya dipakai Creative.

### 3.5 `ui/` — 23 component

**Level:** kandidat generic reusable, tetapi harus diaudit props/import satu per satu. **Target default:** `components/ui/`; auth/domain-specific items turun ke feature atau route-local.

```text
access-denied, action-card, auth-particle-background, button-action, button,
confirm-modal, content-title, creative-universe-logo, custom-date-picker,
file-upload-dropzone, form/dropdown-menu, form/input, guest-mobile-orbit-motion,
logo, material-icon, modal, primary-action-link, search-bar, spinning-wheel,
stat-card, table, task-desktop-page-transition, toast
```

Probable exceptions: `access-denied` → `components/feedback` atau `core/permissions` + feedback UI; `custom-date-picker` → Spectrum adapter jika memakai S2; `task-desktop-page-transition` → feature ODDS; `guest-mobile-orbit-motion` → auth/guest feature; `toast` → `components/feedback`.

### 3.6 `spectrum/` — 3 render component

**Level:** Spectrum adapter. **Target:** `components/spectrum/`.

```text
IconSpectrum/IconSpectrum
ImageCropDialog/ImageCropDialog
ProfileCard/ProfileCard
```

Supporting `.types.ts` tetap dekat component atau barrel folder, bukan `lib` global.

### 3.7 `panel/`, `dashboard/`, `settings/` — 26 component

**Level:** feature-specific. **Target:** `features/panel-users`, `features/panel-roles`, `features/settings`, atau route-local `_components/`. Hanya shell yang benar-benar lintas route masuk `components/layout/`.

```text
panel/maintenance/console-output-panel, emergency-maintenance-card,
maintenance-actions-grid, system-status-grid,
panel/profile/profile-apps, profile-card,
panel/roles/role-editor-modal, role-table,
panel/users/user-detail-modal, user-filters, user-mobile-grid, user-table,
user-whitelist-modal,
dashboard/activity-log-section, dashboard-system-control,
dashboard-system-health, default-stats-grid, quick-actions-section,
root-stats-grid, system-env-bar,
settings/account-privacy-settings, activity-log, profile-settings-tabs,
role-setting-page, roles/roles-page, security-settings
```

### 3.8 `navigation/`, `messages/`, `notifications/`, `feedback/`, `typography/`, `docs/` — 24 component

```text
navigation/message-bell, notification-bell, side-menu,
sidebar-utility-actions, sidemenu/avatar, button, collaps, expand, iconapp,
messages/messages-page, notifications/notifications-page,
feedback/ErrorTetrisGame/ErrorTetrisGame, feedback/UniversalErrorView/UniversalErrorView,
typography/header-title, typography/hero-heading,
docs/interactive-component-playground
```

**Target:** the SideMenu family → `features/kv-retail` from its two product consumers; stateful message/notification bells → their feature folders; their cross-domain utility composition must be split without feature-to-feature imports; feedback → `components/feedback`; typography → `components/ui` only if domain-neutral; playground → `app/developer` route-local tooling. Runtime consumer evidence confirms ErrorTetrisGame belongs to the UniversalErrorView feedback family rather than developer-only UI.

## 4. Audit supporting files (`.ts`)

Supporting files berjumlah 138 dan tidak boleh dimasukkan ke `lib` secara otomatis.

| Bentuk file legacy | Target default |
|---|---|
| `*.types.ts` yang hanya dipakai satu feature | `features/<domain>/types.ts` atau colocated |
| `*.config.ts` component-specific | Colocated di component/feature |
| `*.logic.ts` yang memiliki domain state | `features/<domain>/hooks` atau feature logic |
| `*.logic.ts` pure dan domain-neutral | `lib/` setelah bukti pemakaian lintas feature |
| `*.utils.ts` formatting/algorithm pure | `lib/` atau feature-local utils |
| `index.ts` | Barrel per-folder saja |
| `constants.ts` retro/ODDS | `features/odds` |

`core/` hanya untuk HTTP/session/RBAC/realtime infrastructure. `lib/` bukan tempat memindahkan semua file non-React.

## 5. Kesimpulan ownership

| Legacy area | Target utama | Level |
|---|---|---|
| `creative-report` | `features/creative-report` | Feature-specific |
| `odds` | `features/odds` | Feature-specific |
| `panel`, `dashboard`, `settings` | `features/*` | Feature-specific |
| `universe/Auth`, Portal | `features/auth` + route-local | Feature/page-specific |
| `universe/NavBar`, SideBar, Layouts | `components/layout` | Layout shell |
| `ui` | `components/ui` dengan audit exceptions | Generic candidate |
| `spectrum` | `components/spectrum` | Spectrum adapter |
| `feedback` | `components/feedback` | Generic feedback |
| `messages`, `notifications` | `features/messages`, `features/notifications` | Feature-specific |
| `logic`, `types`, `utils` | Feature-local, `core`, atau `lib` berdasarkan dependency | Supporting |

## 6. Audit limitations dan langkah berikutnya
Klasifikasi ini berbasis lokasi file, nama, dan struktur source. Keputusan final per component membutuhkan trace import/consumer, API, permission, dan browser evidence. Mulai dari phase foundation pada restructuring registry, lanjutkan ke authentication, lalu perbarui registry dengan consumer evidence dan target path aktual sebelum setiap perpindahan.

## 7. Scope Tailwind berdasarkan dependency Spectrum

Aturan scope untuk component baru:

- Gunakan `.cu-style` jika component dan seluruh descendant tidak memiliki dependency React Spectrum S2.
- Jangan gunakan `.cu-style` jika root, supporting type yang membentuk API, atau child terdalam mengimpor `@react-spectrum/s2` atau wrapper `components/spectrum`.
- Satu child Spectrum membuat seluruh subtree root menjadi `none`.
- Untuk subtree campuran, pasang `.cu-style` hanya pada child Universe yang benar-benar terisolasi.

### 7.1 Subtree `none`

```text
components/spectrum/IconSpectrum
components/spectrum/ImageCropDialog
components/spectrum/ProfileCard
components/layout/setting-menu
components/panel/users/user-filters
components/panel/users/user-table
components/settings/account-privacy-settings
components/universe/ProfileImageUpload -> spectrum/ImageCropDialog
components/universe/Layouts/SettingLayout -> layout/setting-menu
features/creative-ai/components/CreativeLayout -> Creative/SideNav, Creative/MobileNav, Creative/ChatBox
features/creative-ai/components/Creative/BubbleChat -> Send, Receive -> IconSpectrum
features/creative-ai/components/Creative/ChatBox -> Attachment, Model, Send -> IconSpectrum
features/creative-ai/components/Creative/MobileNav -> IconSpectrum
features/creative-ai/components/Creative/SideNav -> Header, Menu, Footer, FolderRow -> IconSpectrum
components/universe/developer/RouteCard
components/universe/Settings/SettingTitle
```

Parent route yang membungkus subtree tersebut juga tidak boleh diberi `.cu-style` pada ancestor bersama, termasuk settings profile, settings layout, developer beta, dan Creative layout/page yang merender subtree Spectrum.

### 7.2 Subtree aman memakai `.cu-style`

```text
components/dashboard/*
components/feedback/*
components/messages/*
components/notifications/*
components/panel/maintenance/*
components/panel/profile/*
components/panel/roles/*
components/navigation/*
components/typography/*
features/auth/components/AppUniverse
features/auth/components/*
components/universe/Background/*
components/universe/BackgroundSky/*
features/auth/components/LandingText
features/auth/components/MediaAgent
components/layout/Workspace/MenuOverlay
features/auth/components/Portal/Guest/*
components/universe/developer/BetaContent
components/layout/Container
components/layout/Content
components/layout/Workspace
```

`components/ui/*` adalah kandidat scope, tetapi `custom-date-picker`, `file-upload-dropzone`, form controls, modal, table, dan toast harus diputuskan ulang berdasarkan implementation baru. Jika menjadi wrapper S2, pindahkan ke `components/spectrum` dan gunakan `none`.

### 7.3 Supporting files dan re-tracing

Import type Spectrum yang membentuk props/API tetap dihitung; contoh `ProfileImageUpload.types.ts`. Config, logic, utils pure, dan barrel `index.ts` tidak otomatis membuat subtree `none`. Jika logic mengembalikan atau mengimpor element Spectrum, parent menjadi `none`.

Keputusan ini harus di-trace ulang saat rewrite karena penggantian icon, input, dialog, table, atau date picker dapat mengubah dependency boundary.

### 7.4 Contoh implementasi

```tsx
<section className="cu-style flex min-h-screen p-4">
  <UniverseOnlyContent />
</section>
```

Untuk kasus campuran:

```tsx
<section className="flex p-4">
  <div className="cu-style flex flex-col gap-4"><UniverseOnlyContent /></div>
  <SpectrumDatePicker />
</section>
```
