# Pricetag Generator — Overview

Modul generator pricetag adalah fitur inti Creative Universe yang memungkinkan tim merchandising membuat label harga produk secara otomatis.

---

## Cara Kerja

1. Pengguna memilih **template pricetag** yang sesuai dengan kategori produk.
2. Sistem mengambil data produk dari database melalui API Laravel.
3. Output diekspor sebagai file **PDF** atau **PNG** siap cetak.

## Tipe Template

| Nama Template | Ukuran | Keterangan |
|---|---|---|
| Standard | 60×40 mm | Template default untuk produk reguler |
| Promo | 80×50 mm | Untuk produk dengan badge diskon |
| Bundle | 100×60 mm | Untuk paket bundling |

## Contoh Kode Integrasi

```typescript
// Memanggil API generator
const response = await fetch('/api/v1/pricetag/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ templateId: 1, productIds: [42, 43] }),
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);
```

## Catatan Penting

> **Perhatian:** Fitur ekspor PDF membutuhkan koneksi ke server Laravel yang aktif. Pastikan backend berjalan sebelum mencoba generate.

- Maksimum **50 produk** per request.
- Format output default: PDF (A4, multi-page).
- Format PNG tersedia untuk single item saja.
