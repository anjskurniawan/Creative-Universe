# F11 - Frontend Permission and UI Aliases

**Status:** COMPLETE  
**Date:** 2026-07-15

Key permission backend tetap stabil dan tidak digunakan sebagai label utama UI. Endpoint `/api/v1/permission-catalog` mengirim key, `display_name`, grup, aplikasi, deskripsi, dan urutan. Halaman role serta pengelolaan pengguna memakai alias tersebut.

KV Retail sekarang memakai permission fitur `kv-retail.tasks.view`, `kv-retail.tasks.create`, `kv-retail.tasks.update-status`, `kv-retail.tasks.delete`, dan `kv-retail.settings.manage`. Assignment aplikasi dan permission fitur wajib sama-sama lolos.

