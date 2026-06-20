---
status: APPROVED
version: 1.0
revised: 2026-06-19
---

# Migrasi Laravel Livewire ke Laravel REST API dan Next.js

## Prinsip

- Migrasi dilakukan bertahap per capability, bukan rewrite serentak.
- Database dan business rule tetap dipertahankan.
- Legacy application dibekukan setelah snapshot dibuat.
- Fitur dianggap selesai hanya jika API test, frontend test, permission test, dan feature parity checklist lulus.
- Tidak ada deployment yang membutuhkan terminal interaktif production.

## Tahapan

### 1. Bekukan baseline

- tag commit terakhir aplikasi Livewire;
- pindahkan snapshot source tanpa `.env`, `vendor`, `node_modules`, log, cache, session, dan upload user ke `legacy/laravel-livewire`;
- catat route aktif pada `Legacy_Route_Baseline.md`;
- tandai legacy sebagai read-only dan keluarkan dari pipeline aktif.

### 2. Bentuk monorepo

- pindahkan Laravel aktif ke `apps/backend`;
- buat Next.js di `apps/frontend`;
- pertahankan `docs` di root;
- sesuaikan deployment, test command, dan `.gitignore`.

### 3. Siapkan fondasi backend

- aktifkan routing API `/api/v1`;
- pasang/configure Sanctum stateful authentication;
- buat response envelope, exception mapping, pagination, rate limit, same-origin auth, dan CORS development;
- ekstrak business logic Livewire ke Action/Service yang dapat dipanggil controller;
- tambah API Resource dan API Feature Test.

### 4. Siapkan fondasi frontend

- buat layout, design tokens, API client, session bootstrap, error mapping, dan route guard UX;
- aktifkan static export dan hindari seluruh fitur yang memerlukan runtime Node.js production;
- buat handler `401`, `403`, `419`, `422`, dan `5xx`;
- siapkan Echo/Pusher client dan invalidasi cache data;
- tetapkan deployment tanpa terminal production.

### 5. Migrasi capability

Urutan yang disarankan:

1. login, logout, registrasi, pending approval, dan reset password OTP;
2. profile, session perangkat, notification bell;
3. dashboard;
4. user dan role management;
5. Pricetag search dan database;
6. generator single, checklist, CSV, history, dan realtime progress;
7. maintenance dan log viewer.

### 6. Cutover

- jalankan UAT dengan database staging/clone yang aman;
- verifikasi seluruh permission dan ownership;
- deploy static export ke hostname `creative.doran.id` bersama public artifact Laravel;
- pantau error, queue, notifikasi, dan integrasi GAS;
- rollback dengan mengembalikan routing ke legacy selama jendela cutover jika diperlukan.

## Pemetaan pola

| Legacy | Target backend | Target frontend |
|---|---|---|
| Livewire Form Object | Laravel Form Request | form state + client hint validation |
| Livewire method | Controller tipis + Action | mutation/query hook |
| computed/paginate | Model scope + API Resource | query cache + pagination UI |
| Blade component | tidak berlaku | React component/design system |
| `wire:loading` | response/status HTTP | pending/loading state |
| `session()->flash()` | response message | toast/alert frontend |
| Livewire event | broadcast/domain event | Echo listener + refetch |

## Definition of done

- route target terdokumentasi;
- authorization diuji di backend;
- payload API tidak mengekspos kolom sensitif;
- copy UI berbahasa Indonesia;
- loading, empty, error, dan success state tersedia;
- audit trail dan ownership tetap tercatat;
- legacy route terkait tidak lagi menjadi dependency frontend baru;
- deployment dapat dilakukan tanpa terminal production.
