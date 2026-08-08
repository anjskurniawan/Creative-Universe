---
name: log
description: Maintain a chronological, concise, and consistent Markdown work log for Codex, Antigravity, Claude Code, and other AI agents. Use whenever an agent performs, changes, diagnoses, validates, or becomes blocked on work in this repository, and whenever the user says "salah", "kembalikan", "rollback", or similar correction terms so the latest relevant change can be safely reviewed and reversed.
---

# Agent Work Log

## Tujuan

Gunakan skill ini untuk menjaga kesinambungan pekerjaan antar-agent. Log berada di `notes/logs/agent-work-log.md` dan bersifat append-only secara semantik: entri terbaru selalu ditempatkan paling atas; jangan menghapus atau mengubah entri historis kecuali pengguna memintanya secara eksplisit.

## Urutan wajib

1. Pahami permintaan pengguna dan jalankan instruksi utama terlebih dahulu.
2. Sebelum mengubah file, baca hanya entri terbaru yang relevan dengan area kerja, nama fitur, file, error, keputusan, atau blocker yang sedang ditangani. Jangan membaca seluruh log jika tidak diperlukan.
3. Pertahankan keputusan dan pola yang masih berlaku dari entri relevan. Jika konteks baru bertentangan, verifikasi dari source/worktree dan catat keputusan baru.
4. Selesaikan dan validasi pekerjaan sesuai scope pengguna.
5. Setelah selesai, tambahkan tepat satu entri ringkasan di bagian paling atas log. Berlaku juga untuk tugas analisis, review, diagnosis, atau investigasi yang tidak mengubah file, karena hasil keputusan dan pengetahuannya tetap penting. Jika pekerjaan belum selesai atau terblokir, tetap tambahkan entri dengan status yang jujur.
6. Setelah menulis entri, verifikasi secara read-back bahwa file canonical benar-benar ada, entri terbaru berada di bagian paling atas, timestamp/Agent/Model/status terisi, dan judul/ringkasan tugas saat ini cocok. Jangan mengklaim logging berhasil jika verifikasi read-back gagal.
7. Hanya setelah verifikasi read-back berhasil, beri tahu pengguna dengan kalimat persis: `Berhasil di catat di notes logs`.
8. Log ini adalah database pribadi pengguna. Agent boleh mencatat data sensitif secara proaktif apabila data tersebut relevan dengan pekerjaan, berguna sebagai referensi atau database pribadi, atau membantu menjaga kesinambungan antar-agent; agent tidak perlu menunggu instruksi eksplisit. Agent tetap tidak boleh menebak nilai yang tidak diketahui atau mencatat data yang jelas tidak berkaitan dengan tugas.

## Format entri

Gunakan format berikut secara konsisten. Semua field wajib diisi; gunakan `Tidak ada` jika memang tidak berlaku.

```markdown
---
## YYYY-MM-DD HH:mm:ss TZ - Judul singkat

- **Timestamp:** `YYYY-MM-DDTHH:mm:ss+TZ`
- **Agent/Model:** `Codex - GPT-5` / `Claude Code - <model>` / `Antigravity - <model>` / identitas aktual lainnya
- **Status:** `Selesai` / `Selesai sebagian` / `Analisis` / `Review` / `Terblokir` / `Dibatalkan`
- **Permintaan:** Ringkasan singkat instruksi pengguna.
- **Scope:** Area, modul, atau file yang disentuh.
- **Perubahan:** Apa yang diubah, dipindahkan, dihapus, atau dikonfigurasi.
- **Penambahan:** File, fitur, aturan, atau metadata baru yang ditambahkan.
- **Cara penyelesaian:** Pendekatan tingkat tinggi, tanpa kode.
- **Validasi teknis:** Pemeriksaan tipe, lint, unit test, build, command, atau verifikasi source yang dijalankan dan hasilnya.
- **Validasi visual/live:** Pemeriksaan browser, screenshot, live request, deployment, atau runtime yang dijalankan dan hasilnya; tulis `Tidak dijalankan` beserta alasan jika belum dilakukan.
- **Keputusan penting:** Keputusan desain/teknis dan alasan singkat.
- **Blocker/Risiko:** Blocker, keterbatasan, atau risiko tersisa.
- **Tindak lanjut:** Langkah berikutnya jika ada.
- **Referensi:** Path file, route, command, atau identifier relevan.
```

## Aturan isi

- Tulis ringkasan padat, jelas, dan tidak ambigu; pembaca harus memahami hasil tanpa melihat kode.
- Bedakan perubahan nyata dari rencana. Jangan menulis "selesai" jika hanya analisis atau patch belum tervalidasi.
- Catat file/path penting, tetapi jangan menyalin blok kode.
- Catat validasi teknis dan visual/live secara terpisah dengan hasil aktual: `lulus`, `gagal`, atau `tidak dijalankan` beserta alasannya.
- Jika ada perubahan yang sudah ada sebelumnya di worktree, nyatakan bahwa perubahan tersebut tidak disentuh.
- Catat file, modul, atau area yang sengaja tidak diubah ketika keputusan tersebut penting untuk menjaga scope atau mencegah agent berikutnya mengulangi investigasi.
- Untuk blocker, jelaskan penyebab, dampak, dan apa yang diperlukan agar dapat dilanjutkan.
- Gunakan bahasa yang sama dengan pengguna bila memungkinkan. Istilah teknis boleh dipertahankan jika membantu presisi.
- Satu tugas atau satu sesi kerja menghasilkan satu entri; jangan membuat entri per file.
- Jangan membuat log palsu untuk pekerjaan yang tidak dilakukan.
- Jika mencatat data sensitif, jelaskan konteks dan tujuan pencatatannya secara singkat agar data tersebut tetap dapat dicari dan dipahami di kemudian hari.
- Tandai informasi yang berpotensi stale, seperti endpoint, dependency, konfigurasi, status deployment, atau keputusan lama, dan verifikasi ulang sebelum menjadikannya dasar perubahan.

## Identitas agent dan waktu

- Isi **Agent/Model** dengan identitas aktual yang tersedia. Jangan menebak model.
- Gunakan timestamp lokal repository dengan timezone eksplisit, idealnya ISO 8601.
- Jika waktu aktual tidak tersedia, gunakan waktu sistem saat log ditulis dan tandai timezone yang digunakan.

## Membaca log secara efisien

- Mulai dari bagian paling atas.
- Cari kata kunci fitur, route, komponen, file, error, keputusan, dan blocker.
- Prioritaskan entri terbaru yang menyebut area tersebut.
- Baca entri lama hanya jika diperlukan untuk memahami keputusan yang masih menjadi dasar.
- Jangan menganggap log sebagai sumber kebenaran tunggal; verifikasi kondisi aktual dari repository sebelum mengambil keputusan.

## Penanganan kegagalan

Jika instruksi tidak dapat diselesaikan, jangan menyembunyikan kegagalan dan jangan menghapus pekerjaan parsial yang merupakan milik pengguna. Tulis status `Terblokir` atau `Selesai sebagian`, sertakan bukti validasi, file yang sudah berubah, penyebab blocker, dan tindak lanjut yang aman.

## Protokol koreksi dan rollback

Aktifkan protokol ini jika pengguna menggunakan kata atau maksud seperti `salah`, `keliru`, `kembalikan`, `kembalikan lagi`, `rollback`, `batalkan perubahan`, `jangan seperti itu`, atau menyatakan bahwa hasil agent tidak sesuai.

1. Baca entri log terbaru yang relevan, terutama entri pekerjaan terakhir pada area yang dikoreksi.
2. Identifikasi dengan jelas perubahan yang akan dikembalikan: file, route, komponen, konfigurasi, keputusan, dan batas scope berdasarkan log serta kondisi worktree saat ini.
3. Periksa diff/status aktual sebelum mengubah apa pun. Jangan menganggap seluruh perubahan terakhir berasal dari agent yang sama.
4. Kembalikan hanya perubahan yang dinyatakan salah atau tidak sesuai. Pertahankan perubahan pengguna, perubahan agent lain, dan perubahan yang tidak termasuk koreksi.
5. Gunakan operasi yang dapat ditinjau dan terarah. Jangan menjalankan `git reset --hard`, `git checkout --`, pembersihan worktree, atau penghapusan massal sebagai jalan pintas.
6. Jika rollback sebagian, targetnya ambigu, atau perubahan sudah tertimpa pekerjaan lain, hentikan bagian yang berisiko dan jelaskan konflik sebelum melanjutkan.
7. Validasi hasil rollback sesuai kebutuhan: diff, TypeScript, test, browser, atau pemeriksaan runtime.
8. Catat rollback sebagai entri baru dengan status `Selesai`, `Selesai sebagian`, atau `Terblokir`. Jelaskan perubahan yang dikembalikan, alasan koreksi, perubahan yang sengaja dipertahankan, dan validasi hasilnya.
9. Setelah entri rollback berhasil ditulis, gunakan konfirmasi wajib: `Berhasil di catat di notes logs`.

## Lokasi log

File utama: `notes/logs/agent-work-log.md`.

Gunakan path repository-root yang canonical, bukan path relatif terhadap subdirectory tempat agent kebetulan berjalan. Dari `apps/frontend`, path canonical adalah `..\..\notes\logs\agent-work-log.md` atau absolute path repository-root. Jangan membuat `apps/frontend/notes/logs/` sebagai duplikat.

Jika file belum ada, buat folder `notes/logs/` dan file tersebut dengan heading `# Agent Work Log`, lalu tulis entri pertama di bawahnya. Jangan membuat banyak file log per-agent kecuali pengguna memintanya; satu log bersama mencegah konteks terpecah.
