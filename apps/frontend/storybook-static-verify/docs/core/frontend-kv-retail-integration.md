# F14 - Frontend KV Retail Integration

**Status:** COMPLETE  
**Date:** 2026-07-15

Seluruh request domain KV Retail menggunakan `features/kv-retail/api` dan DTO `KvRetailTask`. Upload sementara kini membaca envelope backend `data.path` dengan benar. Pemilihan assignee menampilkan seluruh pengguna yang memiliki akses aplikasi KV Retail, kecuali Root yang tidak dapat ditag ke task operasional.

Event realtime kanonis adalah `.kv-retail.task.assigned` dan `.kv-retail.task.updated`. Istilah `homework-task.*` dan pengaturan akses berbasis nama `task_route_allowed_names` dihentikan. Akses route kini berasal dari registry aplikasi; aksi fitur berasal dari permission.
