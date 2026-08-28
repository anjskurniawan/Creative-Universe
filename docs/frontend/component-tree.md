# Frontend Component Tree & Structure

> Status: Active restructuring index  
> Last verified: 2026-08-24  
> Source: `apps/frontend/src/components/`

Dokumen ini adalah index untuk membaca struktur component aktif secara bertahap. Struktur historis direorganisasi in place; gunakan [Frontend in-place restructuring architecture](rebuild-architecture.md) sebagai aturan penempatan target.

## Dokumen turunan

| Bagian | Isi |
|---|---|
| [component-tree-legacy-overview.md](component-tree-legacy-overview.md) | Ownership historis dan target kelompok component aktif |
| [component-tree-legacy-domains.md](component-tree-legacy-domains.md) | Peta domain component aktif |
| [component-tree-migration.md](component-tree-migration.md) | Konvensi restrukturisasi in place |

## Aturan membaca

1. Mulai dari overview untuk memahami ownership historis.
2. Buka domain yang relevan saat mengerjakan restructuring phase.
3. Jangan menganggap nama folder aktif saat ini otomatis sebagai lokasi target.
4. Verifikasi live route, import, API, permission, state, dan CSS sebelum memindahkan file.

Dokumen ini sengaja pendek agar dokumentasi tetap mudah dinavigasi dan validator tidak dipenuhi satu file tree besar.
