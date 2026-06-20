# Creative Universe Monorepo

Project refactor Creative Universe dari monolit Laravel Livewire menjadi monorepo headless dengan Laravel 11 REST API dan Next.js (static export) yang dideploy pada single shared hosting cPanel.

## Struktur Direktori

```text
creativeuniverse/
├── apps/
│   ├── backend/                 Laravel 11 REST API (https://creative.doran.id/api/v1)
│   └── frontend/                Next.js + React static export (https://creative.doran.id)
├── legacy/
│   └── laravel-livewire/        Snapshot read-only aplikasi lama (Livewire)
├── docs/                        Paket dokumentasi refactor & spesifikasi sistem
└── README.md
```

## Dokumentasi Pendukung

Untuk detail teknis, desain arsitektur, dan alur migrasi, silakan merujuk ke folder `docs/`:
- [Indeks Dokumentasi](docs/README.md)
- [Architecture Decision Log](docs/00_architecture/Architecture_Decision_Log.md)
- [Arsitektur Headless](docs/00_architecture/Headless_Architecture.md)
- [Milestone Roadmap](docs/05_migration/Milestone_Roadmap.md)

---

## Petunjuk Pengembangan (Local Development)

### Prerequisites
- PHP >= 8.2 & Composer
- MySQL >= 8.0
- Node.js >= 20.0 & npm

### 1. Backend (Laravel API)
Pindah ke direktori backend:
```bash
cd apps/backend
```

- **Setup Environment:**
  Salin `.env.example` menjadi `.env` lalu sesuaikan kredensial database Anda.
- **Instalasi Dependensi:**
  ```bash
  composer install
  npm install
  ```
- **Migrasi Database & Seed:**
  ```bash
  php artisan migrate --seed
  ```
- **Menjalankan Server:**
  ```bash
  php artisan serve
  ```
- **Menjalankan Unit/Feature Test:**
  ```bash
  php artisan test
  ```

### 2. Frontend (Next.js)
Pindah ke direktori frontend:
```bash
cd apps/frontend
```
*(Scaffold lengkap Next.js akan diinisialisasi pada Milestone 4)*

---

## Deployment (cPanel Production)

Aplikasi dideploy ke hosting cPanel same-origin:
1. **Frontend:** Dibangun secara lokal atau melalui CI menggunakan Next.js static export (`output: 'export'`) yang menghasilkan folder `apps/frontend/out`.
2. **Backend:** File Laravel di `apps/backend` dideploy ke server.
3. **Penyatuan Artifact:** Isi dari folder `apps/frontend/out` disalin secara aman ke dalam folder `apps/backend/public` (tanpa menimpa `index.php`, `.htaccess`, storage link, atau asset bawaan Laravel backend).
4. **Operasi Tanpa Terminal:** Migrasi dan pembersihan cache di production dapat dipicu secara aman menggunakan Web Artisan endpoint terproteksi (`POST /_cmd/*`).
