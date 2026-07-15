# F12 - Frontend Core Module Alignment

**Status:** COMPLETE  
**Date:** 2026-07-15

Fungsi dashboard, settings, pengguna, role, permission catalog, dan auth dipusatkan melalui `src/core`. Halaman Core tidak lagi bergantung pada facade lama `src/lib/api`. DTO aplikasi dan permission berada pada boundary Core agar tidak didefinisikan ulang oleh Sub-App.

