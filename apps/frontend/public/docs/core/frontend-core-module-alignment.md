# F12 - Frontend Core Module Alignment

## Core Shell Layout Contract

`CoreShell` menjadi layout tunggal untuk seluruh halaman Core. Gutter konten
harus mengikuti navbar: `16px` pada mobile dan `64px` mulai viewport desktop
(`px-4 md:px-16`). Margin lama berbasis `mx-32` dan `xl:mx-64` tidak boleh
digunakan untuk layout Core baru karena membuat posisi halaman tidak konsisten
dengan navigasi utama.

Halaman dashboard dapat memakai header full-bleed, tetapi isi header harus
tetap menggunakan gutter yang sama agar sejajar dengan navbar dan konten.

**Status:** COMPLETE  
**Date:** 2026-07-15

Fungsi dashboard, settings, pengguna, role, permission catalog, dan auth dipusatkan melalui `src/core`. Halaman Core tidak lagi bergantung pada facade lama `src/lib/api`. DTO aplikasi dan permission berada pada boundary Core agar tidak didefinisikan ulang oleh Sub-App.
# User Management Route Contract Fix

Pada 2026-07-16, pemanggilan daftar pengguna diperbaiki agar mengikuti kontrak `coreApi.users.list(query)`. Helper tersebut sudah memiliki prefix `/users`, sehingga pemanggil hanya boleh mengirim query string seperti `?page=1`, bukan `/users?page=1`. Bentuk lama menghasilkan route ganda `/api/v1/users/users` dan respons 404.
