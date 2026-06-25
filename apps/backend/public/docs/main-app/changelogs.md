# Changelogs — Main App

Catatan perubahan versi aplikasi Creative Universe.

---

## v1.2.0 — Juni 2025

### ✨ Fitur Baru
- Halaman `/docs` dengan navigasi dua kolom (sidebar + konten).
- Komponen `DocsMenu` dengan hierarki 3 level dan toggle expand/collapse.
- Komponen `DocsContent` dengan rendering Markdown dinamis.

### 🐛 Perbaikan Bug
- Perbaikan sticky sidebar yang tidak mengikuti scroll di Firefox.
- Perbaikan breadcrumb yang tidak memperbarui segmen aktif saat navigasi.

### ⚙️ Perubahan Internal
- Migrasi icon dari Material Icons ke `lucide-react` di area docs.
- Instalasi `react-markdown` + `remark-gfm` + `rehype-highlight`.

---

## v1.1.0 — Mei 2025

### ✨ Fitur Baru
- Sistem autentikasi dengan Laravel Sanctum + cookie stateful.
- Halaman login dengan animasi blob gradient.
- Route guard berbasis role di sisi frontend.

### 🐛 Perbaikan Bug
- Perbaikan CORS untuk lingkungan development lokal.

---

## v1.0.0 — April 2025

Rilis perdana Creative Universe.

- Portal generator pricetag produk JETE.
- Manajemen user dan role berbasis Laravel 11.
- Antarmuka dashboard dengan sidebar navigasi.
