# Daftar Lengkap Komponen Aktif (Component Catalog Index)
*Dicatat pada: 2026-08-06*

Dokumen ini mendata seluruh direktori dan komponen aktif yang berada di bawah `apps/frontend/src/components/` beserta fungsi ringkasnya.

---

## 1. Komponen Tata Letak (Layout) - `src/components/layout/`
Menyusun struktur tata letak (layout shell) halaman aplikasi.

* **`Container`** (`container.tsx`): Pembungkus halaman terluar yang mengatur padding responsif.
* **`Workspace`** (`workspace.tsx`): Grid pembungkus area navigasi samping (sidebar) dan area utama (content).
* **`Content`** (`content.tsx`): Kontainer area konten halaman.
* **`Menu`** (`menu.tsx`): Pembangkit daftar link menu navigasi.
* **`Navbar`** (`navbar.tsx` & `navbar/navbar.tsx`): Panel atas global dengan breadcrumb, pencarian, dan pemicu dropdown (pesan, notifikasi, profil, sub-aplikasi).
* **`Sidebar`** (`sidebar.tsx` & folder `sidebar/`): Panel navigasi samping.
* **`SettingsLayout`** (`settings-layout.tsx`): Tata letak khusus dua kolom untuk halaman pengaturan.
* **`RouteGuard`** (`route-guard.tsx`): Middleware visual untuk menjaga kelancaran otentikasi rute.
* **`ViewportDebug`** (`viewport-debug.tsx`): Indikator layar responsif untuk developer.
* **Profil Tata Letak (`profile/`):**
  * `card.tsx`: Ringkasan profil staff.
  * `detail-card.tsx`: Detail biodata staff lengkap.
  * `popup-person.tsx`: Kartu info ringkas melayang (*hover card*).

---

## 2. Komponen Navigasi Fitur - `src/components/navigation/`
Komponen khusus untuk navigasi modul/aplikasi tertentu (seperti KV Retail).

* **`SideMenu`** (`side-menu.tsx`): Sidebar khusus modul laci navigasi KV Retail.
* **`SidebarUtilityActions`** (`sidebar-utility-actions.tsx`): Wadah tombol utilitas cepat.
* **`MessageBell`** (`message-bell.tsx`): Lonceng indikator pesan masuk.
* **`NotificationBell`** (`notification-bell.tsx`): Lonceng indikator notifikasi masuk.
* **`Sidemenu/` (Atoms):** Komponen atom (`avatar`, `button`, `collaps`, `expand`, `iconapp`) penyusun menu laci.

---

## 3. Komponen UI Bersama (Shared UI Primitives) - `src/components/ui/`
Kumpulan komponen atom dan elemen dasar (*design system primitives*) yang digunakan berulang kali di seluruh aplikasi.

* **`material-icon.tsx`**: Pembangkit ikon Google Material Icons secara konsisten.
* **`creative-universe-logo.tsx` & `logo.tsx`**: Aset logo Creative Universe.
* **`custom-date-picker.tsx`**: Pemilih tanggal kustom dengan kalender interaktif.
* **`file-upload-dropzone.tsx`**: Area unggah berkas (drag-and-drop) terintegrasi status progress.
* **`modal.tsx` & `confirm-modal.tsx`**: Dialog popup modal standar dan modal konfirmasi aksi.
* **`table.tsx`**: Struktur tabel data responsif.
* **`toast.tsx`**: Notifikasi melayang (*toast alerts*) untuk info sukses/error.
* **`spinning-wheel.tsx`**: Indikator pemuatan data (*loading spinner*).
* **`primary-action-link.tsx`**: Tombol/tautan aksi utama dengan gaya visual khas.
* **`stat-card.tsx`**: Kartu visual untuk menampilkan data metrik / statistik.
* **`action-card.tsx`**: Kartu pilihan aksi interaktif.
* **`auth-particle-background.tsx`**: Efek partikel latar belakang untuk halaman login.
* **`guest-mobile-orbit-motion.tsx`**: Animasi orbit visual pada landing page mobile.

---

## 4. Komponen Feedback & Status - `src/components/feedback/`
Mengelola tampilan feedback visual saat terjadi galat (error) atau halaman tidak ditemukan.

* **`error-tetris-game.tsx`**: Game Tetris interaktif yang dimainkan saat terjadi error (sebagai fallback 404).
* **`universal-error-view.tsx`**: Tampilan visual fallback error terpadu.

---

## 5. Komponen Khusus Fitur & Domain
Komponen-komponen spesifik yang terikat dengan logika bisnis modul tertentu.

* **`/creative-ai` (Asisten AI):**
  * Komponen chat bubble, panel input pesan AI, dan efek visual aurora.
* **`/creative-report` (Laporan Kinerja):**
  * `assessment-table.tsx`: Tabel input nilai evaluasi.
  * `assessment-mobile-cards.tsx`: Kartu evaluasi khusus tampilan seluler.
  * `hrd-date-modal.tsx` & `month-picker-button.tsx`: Pemilih bulan dan periode penilaian.
  * `export-pdf-button.tsx`: Tombol ekspor laporan ke PDF.
  * `group-accordion.tsx`: Pembagi kelompok divisi dengan akordion.
  * `hrd-rules-footer.tsx`: Panduan aturan pengurangan nilai HRD.
* **`/odds` (One Dashboard Design System):**
  * `TaskCard/`: Komponen composable penyusun kartu tugas (`odds-task-card.tsx`, `task-card-date.tsx`, `task-card-people.tsx`, `task-card-status-panel.tsx`).
  * `legacy-taskcard/`: Versi lama taskcard untuk fallback layout (`task-card.tsx`, `task-card-mobile.tsx`, dsb.).
  * `taskcard-mobile/`: Versi visual mobile dari taskcard.
  * `odds-designer-task-row-card.tsx` & `odds-task-chat.tsx`: Kartu baris tugas desainer dan obrolan diskusi tugas.
  * `odds-rich-text-editor.tsx`: Editor teks kaya untuk input brief tugas.
  * `odds-gameboy-frame.tsx`: Bingkai visual bergaya retro gameboy.
  * `task-card.tsx` & `task-form-modal.tsx`: Modal form tugas dan layout kartu tugas.
  * `task-performance-desktop.tsx` & `task-performance-mobile.tsx`: Visual dashboard performa tugas ODDS.
* **`/typography` (Tipografi Kustom):**
  * `header-title.tsx` & `hero-heading.tsx`: Tipografi terstandarisasi untuk bagian header halaman dan elemen dekoratif hero.
* **`/auth` (Kerangka Otentikasi):**
  * `auth-card.tsx`, `auth-card-header.tsx`, `auth-card-footer.tsx`: Komponen kartu pembungkus form otentikasi.
* **`/login` (Form Masuk):**
  * `login-card.tsx`, `login-form.tsx`, `login-particle-background.tsx`, `login-animations.ts`: Komponen login lengkap beserta animasi latar belakang partikel.
* **`/onboarding` (Pengenalan Pengguna Baru):**
  * `onboarding-card.tsx`, `onboarding-form.tsx`, dan langkah wizard (`steps/step-welcome.tsx`, `step-whatsapp.tsx`, `step-division.tsx`, `step-position.tsx`, `step-preparing.tsx`, `step-ready.tsx`, dsb.).
* **`/landing` (Portal Utama):**
  * `application-universe.tsx`, `auth-portal.tsx`, `guest-portal.tsx`, `landing-text.tsx`, `media-agent.tsx`: Halaman portal perkenalan sub-aplikasi yang ditujukan bagi tamu (guest) maupun pengguna terdaftar.
* **`/dashboard` (Dashboard Panel Utama):**
  * `root-stats-grid.tsx` & `default-stats-grid.tsx`: Grid statistik untuk admin (root) dan pengguna biasa.
  * `dashboard-system-control.tsx` & `dashboard-system-health.tsx`: Indikator kontrol sistem server dan status kesehatannya.
  * `activity-log-section.tsx` & `quick-actions-section.tsx`: Panel log aktivitas sistem dan jalan pintas aksi cepat.
  * `system-env-bar.tsx` & `dashboard.types.ts`: Konfigurasi bar variabel lingkungan dan definisi tipe data dashboard.
* **`/panel` (Halaman Admin & Staff):**
  * Komponen-komponen spesifik halaman admin yang dikelompokkan dalam sub-folder `/users`, `/roles`, `/profile`, dan `/maintenance`.
