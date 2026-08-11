# F12 - Frontend Core Module Alignment

## Core Shell Layout Contract

`CoreShell` menjadi layout tunggal untuk seluruh halaman Core. Gutter konten
harus mengikuti navbar: `16px` pada mobile dan `64px` mulai viewport desktop
(`px-4 md:px-16`). Margin lama berbasis `mx-32` dan `xl:mx-64` tidak boleh
digunakan untuk layout Core baru karena membuat posisi halaman tidak konsisten
dengan navigasi utama.

Halaman dashboard dapat memakai header full-bleed, tetapi isi header harus
tetap menggunakan gutter yang sama agar sejajar dengan navbar dan konten.

## Shared App Launcher Contract

Dropdown aplikasi pada navbar dan sidebar wajib memakai sumber data dan urutan
yang sama: aplikasi `sub_app` milik user dengan `frontend_path`, diurutkan oleh
`sort_order`. Keduanya menggunakan `visibleSubApplications()` dari Core,
termasuk penanda status eksperimen.

Sidebar desktop menggunakan varian `Expand` sebagai tampilan awal. Pengguna
tetap dapat menciutkannya melalui kontrol sidebar; state ini bersifat lokal pada
halaman yang memakainya.

## Authenticated Landing

Route `/` bersifat adaptif. Guest melihat landing visual, sedangkan pengguna
yang sudah autentikasi melihat landing kosong dengan navbar authenticated.
Setelah autentikasi dan onboarding, pengguna diarahkan ke `/`, bukan langsung
ke dashboard. Pada tahap awal, area landing authenticated sengaja kosong
sebagai kanvas untuk konten berikutnya.

## Profile and Settings Boundary

`/profile` adalah halaman profil read-only: identitas akun, kontak, peran, dan
aplikasi yang dapat diakses. Perubahan data akun, avatar, sandi, perangkat,
pengaturan peran, serta riwayat audit berada di `/settings/*`. Halaman Settings
memakai `ProfileSettingsPage` sebagai kontainer pengaturan bersama.

## Inbox Shortcuts

Dropdown Pesan selalu menyediakan shortcut ke `/messages`. Dropdown Notifikasi
selalu menyediakan shortcut ke `/notifications`; halaman tersebut menampilkan
daftar notifikasi dan menyediakan tindakan tandai semua sudah dibaca.

## Doran Login Profile Contract

Email bukan data dari respons Doran Login. Akun yang pertama kali dibuat lewat
Doran Login disimpan dengan email `null`, lalu pengguna dapat mengisinya melalui
Pengaturan Profil. Perubahan password lokal tidak tersedia; autentikasi dan
password dikelola oleh Doran Login. Tab Settings terkait hanya menangani
perangkat dan sesi aktif.

## Personal Settings Scope

Settings personal mencakup tampilan (tema, bahasa, zona waktu, preferensi
aksesibilitas), preferensi notifikasi, privasi daftar aplikasi, aplikasi yang
dapat diakses, perangkat/sesi, dan riwayat aktivitas. Preferensi WhatsApp dan
jam hening saat ini hanya disimpan sebagai data UI; pengiriman notifikasi
per-event akan dihubungkan kemudian. Landing setelah login tetap `/` dan tidak
dapat diubah dari Settings.

## Messages Workspace Foundation

Inbox Messages mendukung pencarian percakapan, filter aktif/riwayat, filter
jenis room dan belum dibaca. Membuka room menyelaraskan state unread lokal
dengan endpoint read receipt. Room ODDS menampilkan context task (status dan
deadline) serta tautan ke detail task. Composer memakai Enter untuk kirim dan
Shift+Enter untuk baris baru.

## Messages Collaboration Contract

Messages adalah workspace Core untuk direct message dan room task ODDS. Room
ODDS tetap memakai satu conversation per task: reassign hanya mengganti peserta
aktif, sementara room serta riwayatnya dipertahankan dan reviewer tetap
read-only sesuai policy task.

Setiap pesan dapat memiliki balasan dalam room yang sama, hingga delapan
lampiran publik (maksimum 10 MB per file), dan mention `@username` untuk
peserta room. Lampiran disimpan melalui `FileStorageService`: nama fisik
memakai ULID, sedangkan nama asli hanya sebagai metadata. Draft lampiran
dipindahkan ke `core/message/{message_id}/attachments` ketika pesan terkirim.

Status baca tersimpan per pengguna melalui `message_reads`; ini menggantikan
makna `read_at` global yang tidak valid untuk room ODDS. Inbox memakai receipt
tersebut untuk filter Belum Dibaca. Composer mendukung balas, lampiran, mention
peserta, Enter untuk kirim, Shift+Enter untuk baris baru, dan retry gagal.

Riwayat dimuat bertahap (40 pesan per halaman, maksimum 80 per request). Isi
pesan dibatasi 5.000 karakter, upload dibatasi tipe aman, dan kirim pesan
dicatat dalam audit log `messages`. Retensi belum menghapus data otomatis:
kebijakan archive/purge perlu persetujuan terpisah karena menyentuh riwayat
kerja dan audit.

Layout desktop memakai panel inbox tetap 360 px (380 px pada layar ekstra
lebar), bukan fraksi layar. Dengan demikian area percakapan tetap menjadi fokus
pada viewport besar. Composer menjaga textarea selebar ruang yang tersedia,
sementara tombol lampiran dan kirim tetap berukuran tetap.

## ODDS Workspace Layout

ODDS menggunakan shell Sub-App dan komponen global `SideMenu`, bukan sidebar
legacy ODDS. Item menu dan badge tetap dibentuk dari permission yang sama,
kemudian dipasok ke komponen bersama. Desktop menggunakan varian `Expand` dan
mobile menggunakan `Collaps`, sama seperti Sub-App lain. Navbar global tidak
dirender di route ODDS karena `SideMenu` menjadi navigasi utama workspace.

## ODDS Request Form

Route `/odds/new` memakai single-page request form untuk rilis. Wizard dan
copy teknis dihapus; seluruh field ditampilkan bersamaan. Designer diisi dari
rekomendasi sistem tetapi dapat diganti, deadline opsional memakai SLA kategori,
dan referensi mendukung upload file, link, atau kosong. Upload disimpan sebagai
draft publik ODDS lalu dipindahkan ke task saat request dibuat.

## SideMenu Badge Alignment

`SideMenuButton` teks selalu memakai lebar penuh container `SideMenu`, baik
dengan maupun tanpa badge. Badge hanya mengisi slot kanan ketika tersedia;
tepi tombol dan titik awal label menu tidak berubah.

Wrapper navigasi pada varian Expand dan Collaps juga memakai `w-full`; ini
mencegah flex container menyusut mengikuti isi menu dan menjaga ruang kanan
panel tetap sama dengan ruang kiri.

**Status:** COMPLETE  
**Date:** 2026-07-15

Fungsi dashboard, settings, pengguna, role, permission catalog, dan auth dipusatkan melalui `src/core`. Halaman Core tidak lagi bergantung pada facade lama `src/lib/api`. DTO aplikasi dan permission berada pada boundary Core agar tidak didefinisikan ulang oleh Sub-App.
# User Management Route Contract Fix

Pada 2026-07-16, pemanggilan daftar pengguna diperbaiki agar mengikuti kontrak `coreApi.users.list(query)`. Helper tersebut sudah memiliki prefix `/users`, sehingga pemanggil hanya boleh mengirim query string seperti `?page=1`, bukan `/users?page=1`. Bentuk lama menghasilkan route ganda `/api/v1/users/users` dan respons 404.
