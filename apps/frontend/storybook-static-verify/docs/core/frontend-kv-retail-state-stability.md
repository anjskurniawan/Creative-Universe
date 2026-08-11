# F15 - Frontend KV Retail State Stability

**Status:** COMPLETE  
**Date:** 2026-07-15

State task dipusatkan pada `useKvRetailTasks`. Hook memakai request sequence dan state epoch untuk mengabaikan response daftar yang stale, mutation token per task untuk mencegah double-submit, version marker untuk mencegah rollback menimpa event realtime yang lebih baru, merge idempotent, dan penghapusan lokal setelah backend berhasil.

Dengan kontrak ini, optimistic update tetap responsif tanpa membuat status kartu kembali ke snapshot lama ketika request dan broadcast tiba berdekatan.
