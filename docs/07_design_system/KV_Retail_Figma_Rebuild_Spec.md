---
title: "KV Retail Task — Figma Rebuild Specification"
status: "ACTIVE"
revised: "2026-07-20"
owner: "KV Retail"
---

# KV Retail Task — Figma Rebuild Specification

Dokumen ini adalah audit visual source frontend KV Retail yang aktif. Gunakan
sebagai acuan rekreasi Figma untuk route task (Hari ini, Belum selesai, Bulan
ini) dan Performa, desktop serta mobile. UI print tidak termasuk karena bukan
layar aplikasi.

Light, Dark, dan Retro memakai struktur layout yang sama. Theme hanya mengubah
visual token; jangan menduplikasi hierarchy Auto Layout antar theme.

## Foundation

| Item | Implementasi | Acuan Figma |
| --- | --- | --- |
| Desktop breakpoint | `lg` ke atas, mulai `1024px` | Jadikan 1440px sebagai frame desktop acuan. |
| Mobile breakpoint | di bawah `1024px` | Buat frame 390px dan 430px. |
| Desktop canvas | `100vh`, padding 24px | Background penuh dengan shell mengambang berjarak 24px. |
| Mobile canvas | `100dvh`, padding 12px | Shell tinggi `100dvh - 24px`. |
| Scroll desktop | shell/canvas tidak scroll | Hanya viewport daftar/report yang scroll. |
| Scroll affordance | scrollbar disembunyikan | Fade 28–32px di bawah hanya muncul bila masih ada konten. |
| Font Light/Dark | font sans aplikasi (inherit) | Gunakan font sans Creative Universe yang sama. |
| Font Retro | `font-mono` | Seluruh shell dan konten Retro memakai mono. |

## Color styles

### Core theme

| Token | Hex | Penggunaan |
| --- | --- | --- |
| `light/royal` | `#000675` | kedalaman canvas dan shadow popup |
| `light/navy` | `#04044A` | teks popup/menu dan gradient canvas |
| `light/sky` | `#00A4FF` | primary, active nav, chart/current value |
| `light/neon` | `#00E7EF` | radial highlight canvas |
| `light/surface` | `#F3FAFF` | inner KPI surface |
| `light/popup` | `#F3FBFF` | dropdown/picker |
| `light/hover` | `#DFF6FF` | hover/selected item |
| `light/line` | `#BDEAFF` | popup border |
| `light/input-line` | `#D7DCDD` | input border |
| `light/chart-line` | `#C9EAFF` | chart/diagram line |
| `dark/canvas-start` | `#0B0D0C` | gradient canvas |
| `dark/canvas-mid` | `#111513` | gradient canvas |
| `dark/canvas-end` | `#1A1E1C` | gradient canvas |
| `dark/radial-a` | `#294C3B` | radial canvas accent |
| `dark/radial-b` | `#242A27` | radial canvas accent |
| `dark/shell` | `#111413` | shell/sidebar/navbar |
| `dark/card` | `#171717` | card/panel |
| `dark/inner` | `#0E0E0E` | inner KPI surface |
| `dark/popup` | `#121916` | dropdown/popup |
| `dark/raised` | `#202820` | raised/skeleton surface |
| `dark/accent` | `#B0FF5E` | primary, active, focus, chart |
| `dark/accent-hover` | `#C6FF89` | hover primary |
| `dark/text` | `#F1F1F1` | primary text |
| `dark/text-muted` | `#B9B9B9` | secondary text |
| `retro/ink` | `#24252B` | border dan main text |
| `retro/body` | `#C9CCC0` | outer shell/device body |
| `retro/screen` | `#DFE2D3` | inner screen/hover/skeleton |
| `retro/inset` | `#B5B9AD` | inset detail |
| `retro/surface` | `#ECEEE6` | card/navbar/dropdown |
| `retro/accent` | `#BA0DCB` | active/primary |
| `retro/accent-hover` | `#9C0BAC` | hover primary |
| `retro/soft-accent` | `#F2B8F6` | accent sekunder |

### Text, neutral, semantic, dan utility

| Token | Hex | Penggunaan |
| --- | --- | --- |
| `text/ink` | `#181818` | text utama Light; icon active Dark |
| `text/base` | `#222222` | input/text Light default |
| `text/nav-light` | `#3B4446` | navbar/sidebar Light |
| `text/label-light` | `#6E5264` | label KPI Light |
| `text/muted-light` | `#6D7880` | text sekunder Light |
| `text/muted-light-alt` | `#4E6475` | detail/chart Light |
| `text/muted-light-soft` | `#5B7190` | metadata akun Light |
| `text/placeholder-light` | `#AEB6B8` | placeholder Light |
| `text/empty-light` | `#707780` | empty state Light |
| `text/retro-muted` | `#555850` | metadata KPI Retro |
| `text/retro-muted-alt` | `#687065` | placeholder/empty Retro |
| `text/retro-panel` | `#4B514A` | secondary Retro |
| `text/dark-muted` | `#A7ADA8` | empty state Dark |
| `text/dark-secondary` | `#E3E3E3` | nav/sidebar Dark |
| `neutral/white` | `#FFFFFF` | card/shell Light, text putih |
| `neutral/black` | `#000000` | mask/focus utility |
| `neutral/profile` | `#D9D9D9` | avatar fallback |
| `neutral/line` | `#E5E5E5` | divider Light |
| `neutral/breadcrumb` | `#7B7B7B` | breadcrumb Dark |
| `neutral/deep` | `#101211` | deep utility surface |
| `semantic/late` | `#FF5E5E` | late/negative |
| `semantic/late-soft` | `#FF7E87` | negative trend |
| `semantic/error` | `#FF5B55` | error/task status |
| `semantic/warning` | `#FFCF5E` | warning/bottleneck |
| `semantic/warning-bg` | `#FFF8EE` | warning surface |
| `semantic/error-bg` | `#FFE2DD` | error surface |
| `semantic/pink` | `#EC4899` | add-task Light, badge |
| `semantic/pink-hover` | `#DB2777` | add-task hover |
| `semantic/purple` | `#8474F9` | input focus utility |
| `semantic/orange` | `#F18728` | priority/task accent |
| `semantic/green` | `#2B9915` | success utility |
| `semantic/blue-700` | `#0077BF` | chart/detail blue |
| `semantic/blue-600` | `#0288D1` | chart/detail blue alternate |
| `surface/blue-pale` | `#E5F6FD` | pale blue surface |
| `surface/blue-tint` | `#E6EDF2` | graph/inner pale surface |
| `surface/blue-white` | `#F8FBFF` | pale card surface |
| `surface/green-pale` | `#EFFFEE` | success pale surface |
| `surface/lavender` | `#EEF2FF` | pale utility surface |

### Literal source values also used

`#060606`, `#111827`, `#4D554E`, `#525E61`, `#535353`, `#6B7280`,
`#BFC7C9`, `#E1E5E1`, `#E3E3E3`, `#E4E4E4`, `#E5E7EB`, dan `#F3FBFF`
juga muncul sebagai utility/detail colors. Simpan sebagai styles `utility/*`
bila layar Figma perlu mencerminkan setiap state literal source.

## Surface, border, dan shadow

| Style | Nilai |
| --- | --- |
| Light shell | white 80%, border white 80%, backdrop blur medium |
| Light card | white 90%, border white 80%, `0 5px 14px rgba(44,42,39,.06)` |
| Light shell shadow | `0 14px 42px rgba(44,42,39,.16)` |
| Light popup shadow | `0 10px 24px rgba(0,4,117,.18)` |
| Mobile Light shell shadow | `0 12px 32px rgba(0,4,117,.20)` |
| Dark shell | `#111413` 90%, border white 10%, backdrop blur medium |
| Dark card | border white 5%, `0 5px 14px rgba(0,0,0,.24)` |
| Dark shell shadow | `0 14px 42px rgba(0,0,0,.45)` |
| Dark popup shadow | `0 12px 28px rgba(0,0,0,.34)` |
| Retro shell desktop | border 3px ink; block shadow `0 8px 0 #24252B` |
| Retro shell mobile | border 3px ink; block shadow `0 6px 0 #24252B` |
| Retro card | border 2px ink; inset `0 0 0 2px #C9CCC0` |
| Retro small control | block shadow `0 2px` atau `0 3px 0 #24252B` |

## Typography

Ukuran literal: 8, 9, 10, 11, 12, 22, 24, 28, 30, 40, dan 48px. Skala
Tailwind standar yang juga dipakai: xs 12px, sm 14px, base 16px, lg 18px,
xl 20px, 2xl 24px, 3xl 30px, 4xl 36px.

| Peran | Size / line height | Weight / tracking |
| --- | --- | --- |
| Title route | 36px / 36px | 500; `-0.72px` atau `-0.05em` |
| Menu mobile pivot | 48px / none | 500; `-0.05em` |
| Menu mobile adjacent | 24px; remote 20px | 500 |
| KPI number desktop | 28px / none | 500 |
| KPI number mobile | 24px / none | 500 |
| KPI label desktop | 12px / 16px | regular; Retro bold uppercase, tracking wide |
| KPI label mobile | 11px / 16px | regular |
| KPI trend | 12px / 16px | regular |
| KPI footnote | 8px / 16px | regular |
| Task title/input | 16px | task title medium/semibold; search tracking `.32px` |
| Navbar/sidebar menu | 14px | menu regular/current medium; sidebar 500 |
| Dropdown metadata | 10–12px | regular |
| Standard icon | 20px glyph | Material Symbols |
| Search icon desktop | 24px glyph | Material Symbols weight 300 |
| KPI icon | 40px desktop, 30px mobile | Material Symbols |

## Radius and spacing styles

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| `radius/shell-light-dark` | 26px | desktop shell Light/Dark |
| `radius/shell-retro` | 30px | desktop shell Retro |
| `radius/shell-mobile` | 22px | mobile shell |
| `radius/card` | 16px | card/task/chart/KPI |
| `radius/control` | 12px | input, inner KPI, popup content |
| `radius/button` | 8px | navbar/sidebar buttons |
| `radius/round` | 9999px | avatar/badge/dot |
| `radius/metric-menu` | 6px | KPI more button |
| spacing | 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32px | source scale utama |
| custom gap | 3, 5, 7, 9, 14px | breadcrumb, icon metadata, toolbar compact |

## Measurable layout specification

### Shell and navigation

| Area | Ukuran |
| --- | --- |
| Desktop outer gutter | 24px semua sisi |
| Mobile outer gutter | 12px semua sisi |
| Navbar | 64px height; desktop px 20px, mobile px 16px |
| Navbar icon/brand button | 32 × 32px; radius 8px |
| Sidebar expanded | 224px wide, px 12px, py 20px |
| Sidebar collapsed | 64px wide, px 16px; control 32px |
| Sidebar link | 32px high, radius 8px; expanded gap 12px, px 8px |
| Desktop main | margin 16px dari sidebar/shell; vertical fill; clip |
| Mobile main | px 20px, pt/pb 24px; vertical fill; clip |

### Task routes

| Area | Ukuran |
| --- | --- |
| Route header | min-height 45px |
| Header ke toolbar | margin-top 16px |
| KPI toolbar block | min-width 240px; preferred `min(52%, 860px)` |
| Toolbar gap | 12px; filter internal 9px |
| Add task | 76 × 64px (h × w), radius 16px |
| Search desktop | height 76px; radius 12px; py 16px, pr 16px, pl 50px; icon left 16px |
| Search mobile | height 48px; radius 12px; py 12px, pr 12px, pl 44px; icon left 16px |
| Desktop task list | card gap 12px; pr 8px; pb 80px; internal scroll |
| Loading task card | height 122px; radius 16px |
| Compact task header | height 76px; compact mode when container `<1200px` |

### Performance route

| Area | Ukuran |
| --- | --- |
| Title ke KPI | margin-top 16px |
| KPI grid desktop | 5 equal columns, gap 16px |
| KPI desktop card | height 139px; radius 16px; padding 8px; inner gap 4px |
| KPI inner surface | radius 12px; px 8px, py 4px; fill |
| KPI detail popup | x inset 8px, top 32px, padding 12px, radius 12px |
| Report grid | left flexible + right 321px; gap 16px; fill remaining height |
| Indicator row | flexible + 220px + 280px; gap 16px |
| Indicator cards | height 220px |
| Secondary horizontal card | height 126px |
| Side two-up grid | height 133px; 2 columns; gap 8px |
| KPI mobile grid | 2 equal columns, gap 12px |
| KPI mobile card | height 118px; radius 16px; padding 8px |
| Mobile report/list | margin-top 20px (report) / 16px (list); gap 12px; pr 4px, pb 8px |
| Mobile menu wheel | 52dvh viewport; 64px per item; overlay px 24px, py 28px |

## Figma hierarchy

```text
Desktop viewport / gradient (padding 24)
└─ Shell / clip (radius 26; Retro 30)
   ├─ Navbar / 64h
   └─ Body / horizontal fill
      ├─ Sidebar / 64w collapsed or 224w expanded
      └─ Main / margin 16 / vertical fill
         ├─ Route title / min 45h
         ├─ Toolbar or KPI grid / margin top 16
         └─ One internal scroll viewport / fill remaining

Mobile viewport / gradient (padding 12)
└─ Shell / height 100dvh-24 / clip (radius 22)
   ├─ Compact navbar / 64h
   └─ Main / px20 py24
      ├─ Title
      ├─ Fixed KPI and controls
      └─ Internal scroll viewport with conditional bottom fade
```

## Rebuild rules

1. Buat Light, Dark, Retro sebagai mode Variables untuk color, border, shadow,
   dan text style; pertahankan Auto Layout yang sama.
2. Shell, task card, dan scroll viewport harus `Clip content`.
3. Main/report/list memakai `Fill container`; toolbar/menu memakai `Hug
   contents`. Jangan fixed-height shell desktop.
4. Pada desktop sempit, Vendor dan Sort menjadi icon-only sebelum search
   dipersempit; setelah itu toolbar boleh dua baris.
5. Retro wajib membawa font mono, border 3px shell, border 2px card, serta
   block shadow—bukan hanya mengganti palette.
6. Warna semantic late/warning/pink add-task tetap semantic di semua theme.

## Source audited

- `apps/frontend/src/features/kv-retail/components/task-page.tsx`
- `apps/frontend/src/app/kv-retail/performance/page.tsx`
- `apps/frontend/src/features/kv-retail/components/performance-navbar.tsx`
- `apps/frontend/src/features/kv-retail/components/performance-sidebar.tsx`
- `apps/frontend/src/features/kv-retail/components/performance-content-title.tsx`
- `apps/frontend/src/features/kv-retail/components/performance-metric-card.tsx`
- `apps/frontend/src/features/kv-retail/components/performance-chart-indicators.tsx`
- `apps/frontend/src/features/kv-retail/components/performance-side-summary.tsx`
- `docs/07_design_system/Components_KV_Retail_Performance.md`
- `docs/07_design_system/Pattern_KV_Retail_Performance_Themes.md`
