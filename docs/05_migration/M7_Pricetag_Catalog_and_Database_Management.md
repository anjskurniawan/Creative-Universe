---
status: APPROVED
version: 1.0
revised: 2026-06-20
owner: Divisi Creative - PT Doran Sukses Indonesia (JETE)
milestone: M7
---

# M7 - Pricetag Catalog dan Database Management

## Strategi checkpoint

1. **Catalog read API** - kategori dua tahap, produk/varian, status ready, preview/download, pagination, filter, dan authorization.
2. **Database CRUD API** - kategori dan produk, ownership, soft delete, validasi kombinasi produk/varian, dan audit harga.
3. **CSV database import** - separator/header, duplicate, invalid row, transaksi, restore soft-delete, dan laporan hasil.
4. **Frontend parity** - `/pricetag/search` dan `/pricetag/database` pada static Next.js.
5. **Verification** - dataset pembanding legacy, denied cases, full test suite, build, browser QA, dan UAT backend aktual.

## Checkpoint 1 - Catalog read API

**Status:** `COMPLETED`

Route kanonis aktif:

```text
GET /api/v1/pricetag/categories
GET /api/v1/pricetag/categories/{category}
GET /api/v1/pricetag/products
GET /api/v1/pricetag/products/{product}
```

Seluruh route memerlukan akun aktif dan permission `access-pricetag`. Alias sementara `/api/v1/pricetag-categories` dipertahankan untuk kompatibilitas M2, tetapi tidak digunakan oleh frontend baru.

Perilaku yang sudah tersedia:

- kategori memuat `products_count`, pencarian nama, sorting, dan pagination;
- produk dapat difilter berdasarkan `category_id`, nama/varian, serta status `ready`/`not_ready`;
- response produk memuat kategori, harga, status ready, preview/download URL, waktu pembaruan asset, dan deep link generator;
- asset dibaca melalui relasi polymorphic `linkable_type`/`linkable_id`;
- payload tidak mengekspos ownership atau credential eksternal.

Verifikasi checkpoint:

| Pemeriksaan | Hasil |
|---|---|
| Targeted category/product API | 9 passed, 47 assertions |
| Permission denied | User tanpa `access-pricetag` menerima 403 |
| Polymorphic asset link | Preview/download dan ready filter terverifikasi |
| PHP formatting | Laravel Pint lulus setelah formatting |

## Checkpoint 2 - Database CRUD API

**Status:** `COMPLETED`

Route mutasi aktif dan seluruhnya memerlukan `pricetag.manage`:

```text
POST   /api/v1/pricetag/categories
PATCH  /api/v1/pricetag/categories/{category}
DELETE /api/v1/pricetag/categories/{category}
POST   /api/v1/pricetag/products
PATCH  /api/v1/pricetag/products/{product}
DELETE /api/v1/pricetag/products/{product}
```

Kontrak yang diterapkan:

- `created_by`, `updated_by`, dan `deleted_by` diisi otomatis dari session pengguna;
- kategori dan produk memakai soft delete;
- kategori dengan produk aktif ditolak saat dihapus agar tidak membuat produk yatim;
- kombinasi nama produk dan varian harus unik; varian kosong dinormalisasi menjadi `Default`;
- harga wajib berupa integer non-negatif;
- mutasi kategori dan produk tercatat pada activity log `pricetag` dengan prefix `[PRICETAG]`;
- perubahan harga produk tercatat melalui dirty attribute activity log;
- user yang hanya memiliki `access-pricetag` dapat membaca tetapi menerima 403 untuk mutasi.

Verifikasi gabungan checkpoint 1 dan 2:

| Pemeriksaan | Hasil |
|---|---|
| Targeted Pricetag catalog API | 14 passed, 75 assertions |
| CRUD ownership dan soft delete | Lulus |
| Duplicate/invalid price validation | Lulus dengan response 422 |
| Mutation permission denied | Lulus dengan response 403 |
| Category orphan protection | Lulus dengan response 422 |
| Audit kategori dan perubahan harga | Lulus |
| Laravel Pint | Lulus |

## Checkpoint 3 - CSV Database Import

**Status:** `COMPLETED`

Endpoint aktif:

```text
POST /api/v1/pricetag/imports/products
Content-Type: multipart/form-data
Field: file
Permission: pricetag.manage
```

Kontrak import:

- file `.csv` atau `.txt`, maksimal 2 MB;
- separator koma dan titik koma dideteksi otomatis;
- menerima alias header Indonesia/Inggris untuk kategori, produk, varian, harga normal, dan harga diskon;
- header minimum: kategori, produk, dan harga normal;
- varian kosong dinormalisasi menjadi `Default`, harga diskon kosong menjadi `0`;
- harga menerima integer polos atau format pemisah ribuan Indonesia/internasional;
- duplikat kombinasi produk/varian di dalam file ditolak secara case-insensitive;
- baris invalid menghasilkan nomor baris dan daftar error;
- validasi seluruh file dilakukan sebelum mutasi; satu baris invalid membatalkan seluruh import;
- kategori/produk baru dibuat, record aktif diperbarui, dan record soft-deleted dipulihkan;
- ownership serta audit perubahan harga tetap dijalankan oleh model;
- response sukses memuat total, created, updated, restored, categories_created, dan categories_restored;
- ringkasan import dicatat sebagai `[PRICETAG] Catalog CSV imported`.

Verifikasi gabungan checkpoint 1-3:

| Pemeriksaan | Hasil |
|---|---|
| Targeted Pricetag API | 21 passed, 102 assertions |
| Comma/semicolon dan header alias | Lulus |
| Create/update/restore | Lulus |
| Invalid row dan rollback atomic | Lulus |
| Duplicate dalam file | Lulus dengan response 422 |
| Permission denied | Lulus dengan response 403 |
| Import summary audit | Lulus |
| Laravel Pint | Lulus |

## Checkpoint 4 - Frontend Parity

**Status:** `COMPLETED`

Halaman aktif:

- `/pricetag/search`: pencarian kategori dua tahap, pagination, pencarian produk/varian, expand detail, status ready, harga, preview, download, dan deep link generator;
- `/pricetag/database`: tab kategori/produk, search, pagination, CRUD modal, konfirmasi delete, serta upload CSV dengan ringkasan hasil;
- layout Pricetag memakai navigasi responsive berbasis permission tanpa emoji/encoding rusak;
- seluruh data dimuat client-side melalui REST API sehingga tetap kompatibel dengan static export;
- API client mempertahankan top-level pagination metadata untuk endpoint katalog dan tetap kompatibel dengan response endpoint lama.

Verifikasi checkpoint frontend:

| Pemeriksaan | Hasil |
|---|---|
| ESLint | Lulus tanpa error/warning |
| TypeScript dan production build | Lulus; 19 halaman static export |
| Deployment artifact lokal | Lulus; hasil `out` disalin ke Laravel public |
| Browser QA backend aktual | Lulus untuk kategori dua tahap, expand produk, preview/download, database kategori/produk, dan modal create |
| Browser console | Tidak ada error/warning |
| Mobile 390x844 | Tidak ada overflow halaman (`scrollWidth=390`); tabel memakai scroll horizontal terisolasi |

## Checkpoint 5 - Verification dan UAT Backend Aktual

**Status:** `COMPLETED`

Verifikasi akhir dijalankan pada 2026-06-20 terhadap Laravel, database MySQL, dan static export Next.js aktual. Data UAT temporer dihapus permanen setelah pemeriksaan selesai.

| Pemeriksaan | Hasil |
|---|---|
| Full Laravel test suite | 140 passed, 7 skipped, 580 assertions |
| ESLint | Lulus tanpa error/warning |
| TypeScript dan production build | Lulus; 19 halaman static export |
| Dataset legacy vs REST API | Sama persis: 2 kategori dan 3 produk/varian beserta kategori serta harga |
| Browser CRUD aktual | Create kategori, create produk, dan update harga berhasil serta langsung terbaca dari API |
| Import CSV aktual | HTTP 200; 1 baris diproses, 1 produk diperbarui, harga baru tampil di frontend |
| Audit aktual | Category created, Product created/updated, perubahan harga, dan ringkasan import tercatat |
| Delete aktual | Produk dan kategori UAT berhasil dihapus melalui REST API |
| Role tanpa `pricetag.manage` | Supervisor dapat membaca katalog (200) tetapi mutasi ditolak (403) |
| Cleanup UAT | Produk, kategori, dan percobaan kategori terlarang tersisa 0 record |

### Kesimpulan M7

Seluruh checkpoint M7 telah selesai dan pemilik menyatakan milestone `APPROVED` pada 2026-06-20. Pekerjaan dihentikan pada stop point setelah M7; M8 tetap belum dimulai dan memerlukan instruksi eksplisit pemilik untuk memulai.
