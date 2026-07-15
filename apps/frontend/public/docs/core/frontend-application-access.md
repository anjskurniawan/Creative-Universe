# F10 - Frontend Application Access

**Status:** COMPLETE  
**Date:** 2026-07-15

F10 memisahkan akses Sub-App dari permission fitur. `/auth/me` mengirim katalog `applications` milik pengguna. Core selalu tersedia, Root memperoleh akses global, dan pengguna lain hanya memperoleh Sub-App yang tercatat pada `application_user`.

Frontend memakai `core/applications` sebagai sumber pemetaan path, ikon, dan guard. Navbar tidak lagi memiliki daftar aplikasi hardcoded. Route yang tidak termasuk assignment diarahkan ke `/forbidden?application={key}`. Backend memakai middleware `app:{key}` dan bersifat fail-closed di luar environment test.

Assignment dapat dikelola dari halaman pengguna. Manajer hanya dapat meneruskan aplikasi yang dimilikinya dan tidak dapat menghapus assignment di luar kewenangannya.

