# Software Requirements Document (SRD)
## Creative Universe - Sub-App: ODDS (One Dashboard Design System)

> **Versi:** 1.0.0
> **Status:** Draft
> **Modul Induk:** Creative Universe Monorepo
> **Target:** Laravel 11 API + Next.js Static Export + Google AI Studio

---

## 1. Pendahuluan

**ODDS (One Dashboard Design System)** adalah sub-aplikasi yang ditujukan untuk mendigitalisasi dan mengotomatisasi seluruh alur kerja permintaan desain yang sebelumnya dilakukan secara manual melalui *spreadsheet*. 
Aplikasi ini melacak *request* desain dari proses *intake*, penugasan (*assignment*), evaluasi *brief* dengan bantuan AI, pengerjaan, persetujuan internal (*SPV/Manager*), persetujuan *client*, manajemen revisi, pengiriman hasil (*final delivery*), hingga penilaian (*rating*) dan pelaporan kinerja.

---

## 2. Integrasi dengan Core System

Sub-App ODDS terintegrasi erat dengan *Core System* Creative Universe. Semua fungsionalitas harus menggunakan shared service yang disediakan oleh *Core*:
- **Manajemen Pengguna:** Data requester, desainer, SPV, dan manajer diambil dari tabel `users` milik *Core*.
- **Role & Permission:** Hak akses diatur lewat Spatie Permission yang disediakan di *Core*.
- **Penyimpanan Link & Aset:** Penyimpanan tautan/berkas desain menggunakan tabel polymorphic `asset_links`.
- **Notifikasi:** Semua pemberitahuan dikirim melalui *Database* dan *FonnteChannel* milik *Core*.
- **Audit Trail:** Mencatat segala aktivitas krusial menggunakan Spatie Activitylog (Tabel `activity_log`).

---

## 3. Alur Kerja Utama (Main Workflow)

1. **Request Intake:** *Staff/Client* membuat permintaan desain dan mengisi form *brief*.
2. **AI Brief Check:** Google AI Studio menganalisis kelengkapan *brief*, mendeteksi informasi yang hilang, dan memberikan rekomendasi kelayakan. Jika di bawah skor 60, requester disarankan memberi klarifikasi.
3. **Triage & Assignment:** SPV/Manager menugaskan tiket kepada Desainer berdasarkan rekomendasi *AI Workload* atau secara manual.
4. **Execution & Blocker:** Desainer bekerja pada tiket. Jika ada masalah (misal, aset kurang), desainer dapat merubah status menjadi `blocked`.
5. **Internal Review:** Desainer mengirim *output* v1 untuk dievaluasi oleh SPV/Manager. Bisa disetujui atau dikembalikan untuk revisi.
6. **Client Review:** Setelah internal disetujui, hasil dikirim ke *Client*. *Client* memberikan tanggapan (revisi atau setuju).
7. **Revision Management:** Semua putaran revisi di-versioning, memastikan desainer dapat melihat sejarah *feedback* dan *file* yang terkait dengan setiap putaran.
8. **Delivery & Rating:** Tiket diselesaikan. *Client* memberikan penilaian (*rating*) dari 1 sampai 5 beserta *feedback*.
9. **Analytics:** Data kinerja dan rata-rata *SLA* (Service Level Agreement) masuk ke dalam *dashboard* manajerial.

---

## 4. Requirement Fungsional & Modul

### 4.1 Dashboard & Analytics
- Menampilkan grafik performa bulanan, statistik jumlah *request* aktif, antrean (*queue*), dan rekap keterlambatan (*overdue*).
- Kalkulasi SLA otomatis.

### 4.2 Request Center & Ticketing
- **CRUD Ticket:** Pembuatan tiket dengan *fields* pendukung seperti tujuan design (*design purpose*), prioritas berbasis *Important Matrix* (Quadrant 1 - 4), *deadline*, kategori desain, dsb.
- **Comment/Clarification Thread:** Diskusi per tiket antara desainer dan *client* yang terintegrasi notifikasi.
- **Status Machine:** Validasi ketat transisi status tiket mulai dari `submitted` hingga `completed`.

### 4.3 AI Engine Integration
- Endpoint yang menghubungkan backend dengan **Google AI Studio**.
- **Fungsi AI:** 
  - *Brief Analyzer* (Skoring & Rekomendasi)
  - *Revision Summarizer*
  - *Smart Assignment Recommendation* (Analisa prioritas dan beban kerja)

### 4.4 Asset & Versioning Center
- Penyimpanan multi-versi untuk *output* desain (v1, v2, v3).
- **Polymorphic Asset:** Mengintegrasikan setiap iterasi desain ke entitas `AssetLink` *Core*.

---

## 5. Roles & Permissions

Sistem akan memakai Role dari *Core System* (`Root`, `Manajer`, `Designer`, `Staff`) dengan hak akses dinamis.

| Permission | Keterangan |
| :--- | :--- |
| `access-odds` | Membuka *Sub-App* ODDS (wajib) |
| `create-odds-tickets` | Membuat request desain baru |
| `view-all-odds-tickets` | Melihat seluruh request di perusahaan |
| `view-own-odds-tickets` | Membatasi tampilan pada *ticket* buatannya sendiri |
| `assign-odds-tickets` | Mengatur penugasan *ticket* ke desainer |
| `approve-odds-tickets` | Memberikan *approval* sebagai SPV/Manager |
| `submit-odds-output` | Menyetorkan *output* desain untuk di-*review* |
| `request-odds-revision` | Meminta revisi |
| `use-odds-ai` | Hak memanggil layanan AI di ODDS |
| `view-odds-reports` | Melihat laporan analitik kinerja departemen desain |

---

## 6. Endpoints API

*Prefiks Global:* `/api/v1/odds/`

### Tiket & Alur Utama
- `GET /tickets` (Daftar tiket dengan pagination & filter)
- `POST /tickets` (Membuat request desain)
- `GET /tickets/{id}` (Detail tiket)
- `PATCH /tickets/{id}` (Ubah data/brief tiket)
- `POST /tickets/{id}/assign` (Pilih desainer)
- `POST /tickets/{id}/status` (Update status: *start, block, etc*)

### Review & Revisi
- `POST /tickets/{id}/output` (Submit hasil desain / versi baru)
- `POST /tickets/{id}/review` (Tolak dengan revisi atau setujui)

### Integrasi AI
- `POST /tickets/{id}/ai-brief-analyze` (Menganalisa *brief* dengan Gemini)
- `POST /tickets/{id}/ai-revision-summary` (Merangkum seluruh catatan revisi)

### Rating & Analitik
- `POST /tickets/{id}/rate` (Memberi *rating*)
- `GET /analytics` (Data analitik *dashboard*)

---

## 7. Aturan Status SLA & Performa

SLA (Service Level Agreement) dinilai berdasarkan durasi pengerjaan dikurangi *waktu tunggu (paused)*.
- **Aturan Default SLA:** Batas waktu (deadline) tugas ditetapkan secara otomatis **H+3 dari tanggal tugas diberikan**, kecuali ada *request* khusus yang lebih mendesak berdasarkan tingkat *Important Matrix*.
- **Paused:** Saat tiket berstatus `waiting_client`, `waiting_spv`, atau `blocked`, timer SLA **berhenti sementara**. Hal ini untuk memastikan metrik evaluasi beban kerja desainer adil dan tidak memperhitungkan kelambatan respon dari pihak lain.

---

> **Catatan Implementasi Teknis:** Semua *business logic* dilarang keras ditulis di *Controller*. *Controller* hanya sebagai pintu masuk yang memanggil Action/Service layer seperti `CreateOddsTicketAction`, `AnalyzeBriefWithGeminiService`, dsb.
