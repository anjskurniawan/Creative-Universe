# F13 - Frontend Pusher Configuration

**Status:** COMPLETE  
**Date:** 2026-07-15

Client Laravel Echo/Pusher dipusatkan pada `src/core/realtime`. Hanya `NEXT_PUBLIC_PUSHER_KEY` dan cluster yang boleh berada di frontend. Pusher secret tetap hanya di backend. Otorisasi private channel memakai cookie Sanctum, XSRF, `credentials: include`, endpoint `/broadcasting/auth`, pemeriksaan status HTTP, dan satu singleton connection.

Implementasi lama dari `src/lib/echo.ts` dihentikan. Konfigurasi tanpa public key menonaktifkan realtime secara aman.

