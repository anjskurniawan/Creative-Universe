# Frontend-Backend Contract Matrix

**Status:** ACTIVE
**Phase:** F17 updated
**Verified:** 2026-07-15
**Backend baseline:** 112 route `/api/v1`

## 1. Tujuan

Dokumen ini menjadi matriks kerja untuk menyinkronkan fungsi frontend dengan backend modular. Matriks membedakan keberadaan consumer dari validasi runtime: label `CONNECTED` berarti call site ditemukan, bukan jaminan seluruh alur sudah lulus browser test.

## 2. Status kontrak

| Status | Arti |
|---|---|
| `ALIGNED` | URL, method, payload utama, guard, dan consumer sesuai |
| `CONNECTED` | Consumer ada tetapi masih perlu adapter/test |
| `PARTIAL` | Hanya sebagian alur atau state yang terhubung |
| `BROKEN` | Consumer ada tetapi kontrak/deployment diketahui gagal |
| `MISSING UI` | Backend tersedia tetapi belum ada consumer frontend |
| `BACKEND GAP` | Frontend membutuhkan kontrak Core yang belum tersedia |
| `EXPERIMENTAL` | Bukan kontrak production final |

## 3. Ringkasan coverage

| Domain | Route operation backend | Consumer intent terdeteksi | Catatan |
|---|---:|---:|---|
| Core | 42 | 38 | Health sengaja tanpa UI; tiga endpoint admin/profile belum dipakai |
| Creative AI | 1 | 1 | Guard masih memakai `access-core` |
| Creative Report | 5 | 5 | Facade DTO, URL detail, app access, dan permission sudah selaras |
| Generator Pricetag | 17 | 16 | Category show tanpa UI; download batch rusak pada static export |
| KV Retail Task | 7 | 7 | Temporary upload salah membaca envelope |
| ODDS | 40 | 40 | Seluruh workflow memiliki adapter dan consumer frontend |
| **Total** | **112** | **107** | Coverage statis, bukan pass rate runtime |

## 4. Core contract matrix

### 4.1 Authentication dan onboarding

| Fungsi | Method dan endpoint | Consumer | Status | Tindakan |
|---|---|---|---|---|
| Login | `POST /auth/login` | Auth Provider / Login | `ALIGNED` | Pindahkan ke `core/auth` |
| Logout | `POST /auth/logout` | Auth Provider | `ALIGNED` | Pertahankan cookie session |
| Bootstrap user | `GET /auth/me` | Auth Provider | `ALIGNED` | Jadikan satu-satunya bootstrap akun |
| Request OTP | `POST /auth/password/otp` | Forgot Password | `ALIGNED` | Tambahkan contract test |
| Verify OTP | `POST /auth/password/otp/verify` | Forgot Password | `ALIGNED` | Tambahkan contract test |
| Reset password | `POST /auth/password/reset` | Forgot Password | `ALIGNED` | Tambahkan contract test |
| Onboarding options | `GET /onboarding/data` | Onboarding | `ALIGNED` | Pindahkan ke feature Core |
| Submit onboarding | `POST /onboarding/submit` | Onboarding | `ALIGNED` | Refresh `/auth/me` setelah sukses |

Catatan: `/login` masih berada di luar route group `(auth)`, sedangkan forgot password dan onboarding sudah berada di `(auth)`.

### 4.2 Dashboard, health, dan maintenance

| Fungsi | Method dan endpoint | Consumer | Permission | Status |
|---|---|---|---|---|
| Dashboard summary | `GET /dashboard` | Dashboard | authenticated | `CONNECTED` |
| API health | `GET /health` | Tidak ada | public | `MISSING UI`, disengaja |
| Maintenance status | `GET /maintenance/status` | Maintenance | `run-artisan` | `ALIGNED` |
| Run command | `POST /maintenance/commands` | Maintenance | `run-artisan` | `ALIGNED` |

Health tidak wajib memiliki halaman. Ia dapat dipakai oleh deployment check atau status indicator Root.

### 4.3 Profile dan session

| Fungsi | Method dan endpoint | Consumer | Status | Gap |
|---|---|---|---|---|
| Get full profile | `GET /profile` | Tidak ada | `MISSING UI` | Page mengandalkan `/auth/me` |
| Update identity/settings | `PATCH /profile` | Profile | `PARTIAL` | Masih mengirim konfigurasi Pusher |
| Upload avatar | `POST /profile/avatar` | Profile | `ALIGNED` | Gunakan upload adapter Core |
| Update password | `PUT /profile/password` | Profile | `ALIGNED` | Standarkan validation mapping |
| Activity history | `GET /profile/activities` | Profile | `ALIGNED` | Pisahkan page Activity Log |
| Current sessions | `GET /profile/sessions` | Profile | `ALIGNED` | Pisahkan session feature |
| Revoke session | `DELETE /profile/sessions/{session}` | Profile | `ALIGNED` | Konfirmasi destructive action |

Keputusan implementasi: `/auth/me` tetap bootstrap ringan; `GET /profile` dipakai ketika membuka Profile agar kontrak halaman tidak bergantung pada payload bootstrap.

### 4.4 User, role, permission, dan settings

| Kelompok | Endpoint | Consumer | Status |
|---|---|---|---|
| User list | `GET /users` | Users | `ALIGNED` |
| User options | `GET /users/options` | Users | `ALIGNED` |
| User detail | `GET /users/{user}` | Users | `ALIGNED` |
| Update user | `PATCH /users/{user}` | Users | `ALIGNED` |
| User audit | `GET /users/{user}/audit` | Tidak ada call langsung | `MISSING UI` |
| User sessions | `GET /users/{user}/sessions` | Tidak ada call langsung | `MISSING UI` |
| Revoke user session | `DELETE /users/{user}/sessions/{session}` | Users | `CONNECTED` |
| Manager whitelist | `GET/POST /users/whitelist-manager-permissions` | Users | `ALIGNED` |
| Role CRUD | `GET/POST /roles`, `PATCH/DELETE /roles/{role}` | Roles | `ALIGNED` |
| Permission options | `GET /permissions` | Roles | `CONNECTED` |
| App settings | `GET/POST /settings` | KV Retail Option dan Task Form | `PARTIAL` |

Gap permission: frontend memakai `manage-settings`, tetapi key tersebut tidak ada pada metadata permission aktif. Settings juga masih menampung konfigurasi lintas domain tanpa adapter pemilik aplikasi.

### 4.5 Core chat dan notification

| Fungsi | Endpoint/event | Consumer | Status |
|---|---|---|---|
| Contacts | `GET /chat/contacts` | Messages | `ALIGNED` |
| Conversations | `GET /chat/conversations` | Messages dan Message Bell | `ALIGNED` |
| Messages | `GET /chat/conversations/{id}/messages` | Messages dan ODDS Chat | `ALIGNED` |
| Send message | `POST /chat/messages` | Messages dan ODDS Chat | `ALIGNED` |
| Realtime message | `conversation.{id}` / `.message.sent` | Messages dan ODDS Chat | `ALIGNED` |
| Notification list | `GET /notifications` | Notification Bell | `ALIGNED` |
| Read one/all | `PATCH /notifications/{id}/read`, `/read-all` | Notification Bell | `ALIGNED` |
| Realtime notification | user private notification channel | Notification Bell | `ALIGNED` |

## 5. Application registry dan access matrix

| Aplikasi | Registry backend | Frontend menu | Route guard | API guard | Status |
|---|---|---|---|---|---|
| Core | Ada | Sebagian hardcoded | Auth only | mixed | `PARTIAL` |
| KV Retail Task | Ada | Hardcoded | Tidak ada app guard | internal role/assignment check | `PARTIAL` |
| Creative Report | Ada | Terdaftar | Application access | assignment + feature permission | `ALIGNED` |
| ODDS | Ada | Terdaftar | Application access + permission | `app:odds` + action gates | `ALIGNED` |
| Generator | Ada | Sebagian/commented | Layout/page guard | `access-pricetag` / `pricetag.manage` | `PARTIAL` |
| Creative AI | Ada, experimental | Commented | Tidak ada app guard | `access-core` | `EXPERIMENTAL` |
| Design Assets | Ada, experimental | Commented | Tidak ada app guard | Belum ada endpoint | `EXPERIMENTAL` |

`BACKEND GAP`: belum ada endpoint Core aktif untuk daftar aplikasi yang dapat diakses user beserta `display_name`, status, frontend path, permission metadata, dan urutan. Frontend tidak boleh membangun application switcher profesional dari hardcoded menu.

Kontrak yang dibutuhkan pada tahap application access:

```text
GET /api/v1/applications
```

Payload minimum per aplikasi:

```json
{
  "key": "odds",
  "display_name": "One Dashboard Design System",
  "short_name": "ODDS",
  "status": "active",
  "frontend_path": "/odds",
  "can_access": true,
  "permissions": []
}
```

Endpoint tersebut merupakan rekomendasi kontrak; belum diimplementasikan pada F2.

## 6. KV Retail Task matrix

| Aksi | Method dan endpoint | Consumer | Realtime | Status |
|---|---|---|---|---|
| List tasks | `GET /kv-retail/tasks` | Index dan Performance | user channel | `ALIGNED` |
| Assignee options | `GET /kv-retail/assignees` | Option | none | `CONNECTED` |
| Create task | `POST /kv-retail/tasks` | Task Form | assigned event | `PARTIAL` |
| Delete task | `DELETE /kv-retail/tasks/{task}` | Index | none | `CONNECTED` |
| Update status | `PATCH /kv-retail/tasks/{task}/status` | Index | updated event | `ALIGNED` |
| Upload task file | `POST /kv-retail/tasks/{task}/files` | Desktop/mobile card | updated event | `CONNECTED` |
| Temporary upload | `POST /kv-retail/uploads` | Upload Dropzone | none | `BROKEN` |

Temporary upload membaca `response.path`, padahal path berada pada `response.data.path`. Jalur upload juga masih membaca bearer token dari local storage.

Realtime saat ini memakai:

- Channel: `App.Models.Core.User.{id}`.
- Event: `.kv-retail.task.assigned` dan `.kv-retail.task.updated`.

Payload dan nama event telah disinkronkan pada F14.

## 7. Creative Report matrix

| Aksi | Method dan endpoint | Consumer | Status |
|---|---|---|---|
| Assessment list | `GET /creative-reports` | `/creative-report` | `ALIGNED` |
| User detail | `GET /creative-reports/users/{user}` | Detail | `ALIGNED` |
| Assessment detail | `GET /creative-reports/{assessment}` | Index/edit | `ALIGNED` |
| Update assessment | `PATCH /creative-reports/{assessment}` | Index/edit | `ALIGNED` |
| Complete assessment | `POST /creative-reports/{assessment}/complete` | Index/edit | `ALIGNED` |

F16 menetapkan query `user` dan `month` sebagai sumber state tunggal detail, menghapus ketergantungan session storage, serta memisahkan assignment aplikasi dari permission view/update.

## 8. Generator Pricetag matrix

| Kelompok | Endpoint | Consumer | Permission | Status |
|---|---|---|---|---|
| Batch list/detail | `GET /generator/pricetag/batches`, `/{batch}` | History/Generator | `access-pricetag` | `ALIGNED` |
| Batch download | `GET /generator/pricetag/batches/{batch}/download` | Relative anchor | `access-pricetag` | `BROKEN` pada static export |
| Category list | `GET /generator/pricetag/categories` | Generator/Search/Catalog | `access-pricetag` | `ALIGNED` |
| Category detail | `GET /generator/pricetag/categories/{category}` | Tidak ada | `access-pricetag` | `MISSING UI`, tidak wajib |
| Category mutation | `POST/PATCH/DELETE` category | Catalog | `pricetag.manage` | `ALIGNED` |
| Product list/detail | `GET` products | Generator/Search/Catalog | `access-pricetag` | `ALIGNED` |
| Product mutation | `POST/PATCH/DELETE` product | Catalog | `pricetag.manage` | `ALIGNED` |
| Product import | `POST /imports/products` | Catalog | `pricetag.manage` | `ALIGNED` |
| Single generation | `POST /generations/single` | Generator | `access-pricetag` | `CONNECTED` |
| Checklist generation | `POST /generations/checklist` | Generator | `access-pricetag` | `CONNECTED` |
| CSV generation | `POST /generations/csv` | Generator | `access-pricetag` | `CONNECTED` |
| Realtime batch | `pricetag-batch.{id}` / `.pricetag.updated` | History | batch owner/Root | `ALIGNED` |

Download harus memakai backend host atau blob client, bukan rewrite Next.js. Generator juga harus dipisahkan dari layout Core sebelum dark/full-width styling distabilkan.

## 9. ODDS matrix

### 9.1 Konfigurasi dan reporting

| Kelompok | Endpoint | Consumer | Status |
|---|---|---|---|
| Category CRUD | `/odds/categories*` | feature API + ODDS config UI | `ALIGNED` |
| Designer profile CRUD | `/odds/designer-profiles*` | feature API + ODDS config UI | `ALIGNED` |
| System rule CRUD | `/odds/system-rules*` | feature API + ODDS config UI | `ALIGNED` |
| Queue list/next | `/odds/queue`, `/queue/next` | ODDS page | `ALIGNED` |
| Daily report/summary | `/odds/reports/*` | ODDS page | `ALIGNED` |
| Rankings | `/odds/rankings` | ODDS page | `ALIGNED` |

### 9.2 Task workflow

| Aksi | Endpoint | Consumer | Status |
|---|---|---|---|
| List/create/show task | `/odds/tasks*` | ODDS pages/lib | `ALIGNED` |
| Update/accept/return brief | `/brief*` | ODDS pages/lib | `ALIGNED` |
| Force continue/cancel brief | `/brief/force-continue`, `/brief/cancel` | ODDS pages/lib | `ALIGNED` |
| Start task | `/start` | ODDS pages/lib | `ALIGNED` |
| Submit result | `/results` | Detail/lib | `ALIGNED` |
| SPV/client review | `/spv-review`, `/client-review` | Detail/lib | `ALIGNED` |
| Rating | `/rating` | Detail/lib | `ALIGNED` |
| Revision request/review | `/revisions*` | Pages/lib | `ALIGNED` |
| Cancel request/review | `/cancel-requests*` | Pages/lib | `ALIGNED` |
| Reassign | `/reassign` | Pages/lib | `ALIGNED` |
| Conversation | `/conversation` + Core Chat | Detail/chat | `ALIGNED` |
| Request skip | `POST /tasks/{task}/skip-requests` | Detail desainer | `ALIGNED` |
| Review skip | `POST /skip-requests/{request}/review` | Workspace reviewer | `ALIGNED` |
| Extend deadline | `POST /tasks/{task}/extend-deadline` | Detail escalation | `ALIGNED` |

F17 melengkapi tiga workflow terakhir dan memisahkan permission request/review skip. Reassign dan conversation tetap mempertahankan satu task room sesuai kontrak backend.

## 10. Creative AI dan Design Assets

| Aplikasi | Kontrak | Consumer | Status |
|---|---|---|---|
| Creative AI | `POST /cai/chat` | Creative AI page | `EXPERIMENTAL` |
| Design Assets | Belum ada endpoint | Coming soon page | `EXPERIMENTAL` |

Creative AI saat ini dijaga oleh `access-core`, bukan permission aplikasi CAI. Sebelum akses dibuka, backend memerlukan permission aplikasi yang jelas dan frontend memerlukan experimental access guard.

## 11. Realtime matrix

| Domain | Channel | Event | Consumer | Status |
|---|---|---|---|---|
| Core Chat | `conversation.{id}` | `.message.sent` | Messages dan ODDS Chat | `ALIGNED` |
| Core Notification | user private channel | Laravel notification | Notification Bell | `ALIGNED` |
| KV Retail | `App.Models.Core.User.{id}` | `.kv-retail.task.assigned` | KV Retail | `MATCH` |
| KV Retail | `App.Models.Core.User.{id}` | `.kv-retail.task.updated` | KV Retail | `MATCH` |
| Generator | `pricetag-batch.{id}` | `.pricetag.updated` | History | `ALIGNED` |
| ODDS workflow | notification + Core Chat | tidak ada task event khusus | ODDS | `PARTIAL` |

Echo/Pusher telah dipusatkan pada Core realtime. ODDS Chat memakai event `.message.sent` dan tidak membuat client realtime sendiri.

## 12. Gap queue untuk implementasi

### Gap aktif berikutnya

1. Perbaiki authenticated download Pricetag untuk static export.
2. Konsolidasikan seluruh consumer Core Chat pada F18.
3. Hubungkan user audit dan user sessions secara eksplisit.
4. Normalisasi pagination dan error mapping domain yang belum dimigrasikan.

## 13. Acceptance F17

- Seluruh 112 operasi API telah dikelompokkan berdasarkan consumer frontend.
- Core dan setiap Sub-App memiliki matriks fungsi.
- Permission dan application access gap telah dicatat.
- Event Pusher telah dibandingkan dengan listener frontend.
- Seluruh workflow ODDS memiliki consumer dan permission mutation yang terpisah.
- Matriks tersedia pada route `/docs`.
- F3 dapat membuat boundary folder final tanpa menebak ownership fungsi.
