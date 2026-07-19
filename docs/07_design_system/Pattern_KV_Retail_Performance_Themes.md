---
title: "KV Retail Desktop Theme Pattern"
status: LOCKED
revised: 2026-07-19
owner: KV Retail
---

# KV Retail Performance Theme Pattern

Pola ini adalah acuan visual yang telah disetujui untuk halaman desktop KV Retail. Perubahan pada struktur, token, atau komponen yang tercatat di sini memerlukan arahan eksplisit dari Project Owner.

## Batas penerapan saat ini

- Route aktif: `/kv-retail`, `/kv-retail/unfinished`, `/kv-retail/month`, `/kv-retail/performance`, dan `/kv-retail/option` pada desktop (`lg` ke atas).
- Mobile `/kv-retail` memakai foundation baru: navbar KV Retail compact, title route, KPI horizontal, pencarian/filter, lalu daftar task. Card mobile menggunakan kontrak final `TaskCardMobile` dengan token Light/Dark/Retro; jangan mengaktifkan kembali tree `taskcard-mobile` yang lama sebagai layout utama.
- Tidak ada perubahan pada data, API, atau perhitungan task/performa.
- Theme switch sementara berada di sidebar untuk mempercepat development. Source of truth pengaturan theme jangka panjang adalah **Pengaturan Akun**, tetapi migrasinya belum diimplementasikan.

## Shell bersama

Ketiga tema memakai struktur layout yang sama agar perpindahan tema tidak mengubah hierarchy atau posisi komponen.

1. Canvas penuh viewport tanpa page scroll.
2. Margin canvas `24px` pada desktop.
3. Floating dashboard shell dengan radius `26px` (Retro `30px`).
4. Navbar di atas, sidebar di kiri, dan main content fleksibel di kanan.
5. Main content memakai `min-h-0` dan `flex-1`; overflow internal hanya di area yang memang memerlukan scroll.
6. Kartu memakai radius besar, spacing konsisten, dan shadow yang dangkal agar tidak terpotong oleh shell.

### Foundation mobile KV Retail

- Breakpoint mobile berada di bawah `lg`; desktop shell tidak boleh ikut dirender di viewport ini.
- Mobile memakai canvas tema dengan padding `12px`, lalu floating shell `22px` radius agar ruang margin dan karakter dashboard desktop tetap terasa. Navbar berada di dalam shell serta mengikuti radius atas shell melalui `overflow-hidden`.
- Gunakan `PerformanceNavbar` KV Retail dalam mode `compact` sebagai satu-satunya chrome awal. Pada mode ini logo diganti tombol hamburger; breadcrumb serta tombol back/next dihilangkan. Hamburger membuka navigasi full-screen dengan teks menu saja (tanpa ikon) dalam pola vertical wheel: item tengah adalah pivot aktif, item di sekelilingnya lebih kecil/transparan, dan daftar melakukan scroll snap. Setelah pengguna berhenti scroll sekitar `550ms`, route item pivot dibuka otomatis.
- Urutan konten mobile: title route, tombol tambah (bila berwenang) di samping KPI horizontal, pencarian dan filter/sort ringkas, lalu daftar task. Daftar menjadi area scroll internal; shell dan navbar tidak ikut bergerak.
- `TaskCardMobile` berada di `components/taskcard/` sebagai presentasi mobile dari kontrak task card final. Card selalu menampilkan judul, vendor, tanggal/deadline, countdown, dan status; detail progress empat tahap serta aksi tersedia setelah card dibuka. Tema hanya mengubah token, bukan struktur atau informasi task.
- Struktur detail `TaskCardMobile` yang dikunci: **Informasi tugas** (Vendor, Assigned beserta avatar tiap user, Status), **Riwayat progres** (bullet sejajar timestamp; indikator bottleneck menempel pada timestamp tahap terkait; alasan berada di bawah nama tahap pada background kecil), lalu **Dokumen & tindak lanjut** (countdown, file slot/link, perubahan status, dan hapus). Overlay upload, file slot, link, dan konfirmasi wajib memakai token tema aktif.
- Area mobile yang boleh scroll hanya viewport daftar task. Shell, navbar, title, KPI, dan filter tetap fixed di dalam shell. Setiap task card harus `shrink-0` agar tinggi detail alaminya tidak terdistorsi; viewport daftar yang melakukan clipping/scroll. Indikator masih-ada-konten menggunakan mask fade pada viewport daftar dan hilang di akhir scroll.
- Route task `/kv-retail/unfinished` dan `/kv-retail/month` memakai struktur mobile `TaskPage` yang sama; yang berubah hanya scope data serta title. Mobile `/kv-retail/performance` memakai shell, navbar compact, title fixed, serta content area terpisah yang dapat di-scroll berisi KPI, diagram, summary, bottleneck, Creative Agent, dan carousel prioritas. Mobile `/kv-retail/option` tetap hanya shell, navbar compact, dan title sampai review berikutnya.
- Canvas mobile harus memenuhi `100dvh - 72px` di bawah navbar.
- Mobile menggunakan state tema yang sama dengan desktop dan harus memakai canvas luar yang sama: gradient Blue Glass pada Light, gradient dark-green berlapis pada Dark, serta `#DFE2D3` dengan font mono pada Retro. Struktur tetap sama di semua tema; hanya token yang berubah.

### Hierarki main content desktop

Gunakan pola yang sama untuk route dashboard desktop KV Retail yang memakai shell ini:

1. Main content adalah `m-4`, tanpa padding horizontal tambahan pada container luar.
2. Title route berada di posisi paling atas dengan `text-4xl`, `font-medium`, `leading-none`, dan tracking `-0.72px`.
3. Subtitle (bila dibutuhkan) berada tepat di bawah title.
4. Baris KPI/card ringkasan selalu berada **di bawah title**, diberi `mt-4`, dan memakai lebar penuh main content.
5. Filter atau control halaman berada setelah KPI/card ringkasan, juga dengan `mt-4`.

Pada viewport desktop yang cukup lebar, KPI dan control pencarian/filter boleh ditempatkan pada satu toolbar horizontal di bawah title. KPI memakai lebar `hug content`, filter dan sort memakai lebar intrinsik, sedangkan search adalah elemen fleksibel yang menyerap sisa ruang. Bila viewport menyempit, filter dan sort adalah elemen pertama yang diringkas menjadi icon-only (dengan `aria-label` yang tetap menjelaskan pilihan aktif); jangan memendekkan search lebih dulu. Pada ruang yang lebih sempit layout harus kembali menjadi dua baris tanpa overflow horizontal.

Aturan ini mencegah title dan KPI saling berebut ruang pada lebar desktop besar, sekaligus menjaga gutter yang sama antara halaman Performa dan halaman task KV Retail.

Untuk halaman task berbasis scope, title desktop harus menyebut konteks kerja yang sedang dibaca (`Hari ini`, `Belum selesai`, atau `Bulan ini`), bukan nama modul umum. Nama modul tetap tersedia pada breadcrumb.

Jangan mengganti tinggi viewport dengan fixed pixel height. Gunakan `h-screen`, `min-h-0`, dan `flex-1` agar dashboard tidak menimbulkan scroll halaman.

Untuk daftar internal yang bisa di-scroll, sembunyikan scrollbar lintas browser (`scrollbar-width: none` dan `::-webkit-scrollbar`) dan gunakan overlay gradient tipis (sekitar `32px`, opacity rendah) di tepi bawah sesuai surface tema. Fade hanya tampil bila `scrollHeight > clientHeight` dan posisi belum mencapai akhir scroll; harus hilang segera setelah pengguna berada di bagian bawah. Overlay bersifat `pointer-events-none` dan hanya menjadi affordance visual, bukan penghalang interaksi atau pengganti akses keyboard.

## Tema

### 1. Light: Blue Glass Dashboard

Tema default. Shell putih floating berada pada canvas blue gradient. Warna ini dipakai untuk status aktif, fokus, chart periode berjalan, dan dropdown.

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| Royal blue | `#000675` | bayangan/dropdown depth |
| Navy | `#04044A` | teks dan background gradient |
| Sky blue | `#00A4FF` | active, primary action, chart current |
| Neon blue | `#00E7EF` | highlight gradient |
| Light blue surface | `#F3FAFF` | panel internal |
| Hover blue | `#DFF6FF` | item dropdown/selection hover |
| Soft line | `#BDEAFF` | border dropdown |
| White | `#FFFFFF` | shell dan kartu |

Canvas memakai blue radial/linear gradient. Kartu harus putih atau putih transparan; jangan memberi seluruh main content background biru solid.

### 2. Dark: Green Accent Dashboard

Tema gelap memakai shell yang sama, dengan canvas gelap berlapis dan satu aksen hijau.

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| Canvas | `#0B0D0C` to `#1A1E1C` | background gradient |
| Shell | `#111413` | floating dashboard |
| Card | `#171717` | kartu/panel |
| Inner surface | `#0E0E0E` | area isi kartu |
| Accent | `#B0FF5E` | active, primary, chart current |
| Primary text | `#F1F1F1` | teks utama |
| Muted text | `#B9B9B9` | teks sekunder |

Menu sidebar aktif memakai `#B0FF5E` dengan **teks dan ikon gelap** `#181818`.

### 3. Retro: ODDS Game Shell

Tema Retro menggunakan bahasa visual ODDS New, tetapi tetap mempertahankan layout performance dashboard yang sama.

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| Ink/border | `#24252B` | border dan teks utama |
| Device body | `#C9CCC0` | outer shell |
| Screen | `#DFE2D3` | screen/inner panel |
| Screen inset | `#B5B9AD` | inset shadow |
| Light surface | `#ECEEE6` | navbar dan card |
| Active accent | `#BA0DCB` | selection dan active |
| Soft accent | `#F2B8F6` | dekorasi sekunder |

Outer shell mengacu pada `OddsGameboyFrame`: radius `30px`, border `3px solid #24252B`, dan block shadow `0 8px 0 #24252B`. Jangan menduplikasi shell untuk halaman ODDS; gunakan komponen canonical ODDS pada konteks ODDS. Pada KV Retail, tokennya dipakai sebagai tema visual saja.

## Aturan status lintas tema

| Kondisi | Warna |
| --- | --- |
| Terlambat / penurunan | merah `#FF5E5E` / `#FF7E87` |
| Tidak ada data / stagnan | abu-abu |
| Status baik di tema terang | warna primary tema aktif |
| Status baik di dark | hijau `#B0FF5E` |

Jangan memakai hijau sebagai aksen tema Light. Jangan memakai aksen Light atau Retro pada dark mode kecuali untuk data status yang memang membutuhkan warna semantik.

## Dropdown navbar

Semua dropdown navbar wajib memakai gaya yang sama di dalam satu tema: pemilih periode, aplikasi, pesan, notifikasi, dan akun.

- Light: teks navy, hover `#DFF6FF`, surface `#F3FAFF`, border `#BDEAFF`.
- Dark: surface `#121916`, teks terang, hover hijau transparan.
- Retro: `#ECEEE6`, border gelap 2px, hover `#DFE2D3`.
- Font item dropdown adalah regular weight. Nama pengguna boleh medium weight sebagai metadata akun.

## Pengaturan theme (target)

Saat ini selector theme di sidebar adalah **temporary development control**. Implementasi target harus:

1. menyimpan preferensi user melalui Pengaturan Akun;
2. mengembalikan theme saat session berikutnya;
3. menggunakan satu key preference untuk seluruh web app;
4. menghapus toggle sidebar setelah setting account menjadi source of truth;
5. tidak mengubah theme secara global sebelum persetujuan Project Owner.

## Source implementation

- `apps/frontend/src/app/kv-retail/performance/page.tsx`
- `apps/frontend/src/features/kv-retail/components/task-page.tsx`
- `apps/frontend/src/features/kv-retail/components/performance-navbar.tsx`
- `apps/frontend/src/features/kv-retail/components/performance-sidebar.tsx`
- `apps/frontend/src/features/kv-retail/components/performance-content-title.tsx`
- `apps/frontend/src/app/globals.css` (override scoped dropdown pesan/notifikasi)
- `docs/07_design_system/Pattern_ODDS_Gameboy_Frame.md` (source visual shell Retro)
