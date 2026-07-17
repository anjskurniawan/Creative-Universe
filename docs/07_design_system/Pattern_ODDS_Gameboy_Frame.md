# ODDS Game Boy Frame

**Owner:** ODDS  
**Atomic level:** Layout pattern  
**Status:** ACTIVE  
**Revised:** 2026-07-17

Pola ini adalah shell visual retro utama untuk pengalaman ODDS. Implementasi acuannya adalah frame `/odds/new` yang sudah diekstrak menjadi komponen bersama `OddsGameboyFrame`. Layar lain wajib memakai komponen tersebut dan tidak boleh membuat ulang class frame secara manual.

Frame ini bukan kewajiban untuk seluruh halaman ODDS. Komponen operasional, tabel, form, dialog, dan panel tetap boleh berdiri tanpa frame apabila pembungkus perangkat tidak membantu konteks pengguna.

## Tujuan

- Memberikan identitas Game Boy yang konsisten pada layar ODDS terpilih.
- Memisahkan body perangkat, status perangkat, dan area screen secara jelas.
- Menjadi shell; tidak memaksa isi di dalamnya berubah menjadi elemen permainan.
- Menjaga tabel audit dan debugging tetap mudah dibaca.

## Anatomi wajib

1. **Device body** — outer shell dengan radius besar, border gelap 3px, warna abu-hijau, dan shadow tebal di bawah.
2. **Device status bar** — baris ringkas di atas screen. Berisi nama mode di kiri serta status sistem di kanan.
3. **Inner screen** — area konten dengan radius lebih kecil, border gelap 3px, warna screen lebih terang, dan inset shadow.
4. **Screen header** — judul konteks, ikon, dan metadata mode. Header dipisahkan dari isi dengan garis horizontal.
5. **Content slot** — area bebas untuk workflow, tabel, audit log, atau form. Konten tidak harus diberi frame tambahan.

## Token visual

| Peran | Nilai acuan |
| --- | --- |
| Ink / border | `#24252b` |
| Device body | `#c9ccc0` |
| Inner screen | `#dfe2d3` |
| Screen inset | `#b5b9ad` |
| Light surface | `#eceee6` |
| Active accent | `#ba0dcb` |
| Soft accent | `#f2b8f6` |
| Muted ink | `#666961` |
| Device radius | `30px` |
| Screen radius | Tailwind `rounded-xl` |
| Primary border | `3px solid #24252b` |
| Device shadow | `0 8px 0 #24252b` |

## Komponen canonical

```tsx
import { OddsGameboyFrame } from "@/components/odds/odds-gameboy-frame";

<OddsGameboyFrame label="Mode Name" action={<span>System Status</span>}>
  <div className="flex min-h-0 flex-1 flex-col rounded-xl border-[3px] border-[#24252b] bg-[#dfe2d3] p-3 shadow-[inset_0_0_0_3px_#b5b9ad] sm:p-4">
    <header className="mb-4 border-b-2 border-[#24252b] pb-3">Screen Header</header>
    <div className="min-h-0 flex-1">Content</div>
  </div>
</OddsGameboyFrame>
```

Jangan menyalin class outer shell dari contoh ini ke halaman baru. Perubahan frame dilakukan di `apps/frontend/src/components/odds/odds-gameboy-frame.tsx` agar `/odds/new` dan seluruh pemakai lain ikut konsisten.

## Aturan penggunaan

Gunakan frame ketika:

- layar merupakan entry experience atau workflow utama ODDS;
- konteks perangkat membantu membangun pengalaman retro;
- layar audit/debug membutuhkan batas screen yang kuat;
- konten dapat tetap dibaca tanpa banyak nested border.

Jangan gunakan frame ketika:

- elemen hanya berupa card kecil, modal, tooltip, atau satu field;
- halaman sudah berada di dalam Game Boy frame;
- frame menyebabkan border bertumpuk atau ruang kerja menyempit;
- identitas retro cukup disampaikan melalui tombol, typography, atau scrollbar.

## Aturan komposisi

- Hindari menambahkan frame tebal baru di setiap komponen dalam inner screen.
- Gunakan satu garis tipis atau whitespace untuk pemisah konten internal.
- Footer action harus mengikuti pola stage: garis atas, jarak konsisten, dan tombol tetap mudah ditemukan.
- Scroll hanya diterapkan pada area konten yang memang overflow; status bar dan footer tidak ikut scroll apabila workflow membutuhkannya tetap terlihat.
- Scrollbar di dalam pengalaman retro harus memakai class `retro-scrollbar`.
- Aksen ungu menandakan active, selected, progress, atau success transition; jangan menjadikannya warna permukaan dominan.
- Margin halaman ODDS mengikuti spacing canonical `/odds/new`, yaitu dari elemen `<main>` pada `apps/frontend/src/app/odds/layout.tsx`. Jangan menambahkan padding wrapper halaman kedua (`p-4 sm:p-6`) di dalam layout ODDS.

## Responsif dan aksesibilitas

- Padding shell mengecil pada viewport kecil, tetapi border utama tetap 3px.
- Metadata sekunder boleh disembunyikan pada mobile; judul dan status utama harus tetap terbaca.
- Animasi status wajib menghormati `prefers-reduced-motion` apabila memakai GSAP atau gerakan berulang yang kompleks.
- Warna teks dan background harus mempertahankan kontras yang jelas.
- Frame tidak boleh mengubah urutan heading maupun struktur semantik konten.

## Implementasi acuan

- `apps/frontend/src/components/odds/odds-gameboy-frame.tsx` — source of truth frame.
- `apps/frontend/src/app/odds/new/page.tsx` — pemakai canonical dan acuan pengalaman utama ODDS.
- `apps/frontend/src/app/odds/page.tsx` — frame audit console pada section `all_tasks`.
