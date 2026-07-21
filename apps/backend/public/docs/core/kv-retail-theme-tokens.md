# KV Retail Theme Design Tokens

Panduan ini berisi seluruh detail *design token* (variabel desain) untuk tiga tema yang digunakan dalam sub-aplikasi KV Retail, diperbarui dengan rentang warna hex yang komprehensif berdasarkan keseluruhan komponen UI (Dashboard, Perfomance, Option, dsb). Dokumen ini dibuat sangat spesifik untuk kebutuhan *redesign* di Figma.

---

## 1. Tema Light (Modern Glassmorphism)

Tema ini mengutamakan estetika modern yang terang, menggunakan efek *glassmorphism* (kaca transparan) dengan latar belakang gradien biru/biru kehijauan yang cerah.

### a. Colors (Hex)
- **Global Backgrounds**:
  - Base Fallback: `#f6faff`
  - Gradient 1: `radial-gradient(circle at 8% 6%, #00e7ef 0%, transparent 25%)`
  - Gradient 2: `radial-gradient(circle at 95% 90%, #00a4ff 0%, transparent 31%)`
  - Gradient 3: `linear-gradient(135deg, #00a4ff 0%, #000675 44%, #04044a 100%)`
- **Container / Surface Backgrounds**:
  - Main Panel (Glass): `rgba(255, 255, 255, 0.8)` / `#ffffff` dengan 80% Opacity
  - Cards (Panels): `rgba(255, 255, 255, 0.9)` / `#ffffff` dengan 90% Opacity
  - Inner Elements / Skeletons: `rgba(255, 255, 255, 0.75)` / `#ffffff` dengan 75% Opacity
  - Secondary / Hover Surfaces / Popovers: `#f3faff`, `#f8fbff`, `#f3fbff`
- **Text & Typography**:
  - Primary Text: `#181818`, `#222222` (desktop body)
  - Dark Accents / Heavy Text: `#04044a`, `#000675`, `#0077bf`, `#4e6475`
  - Muted Text: `#6d7880`
- **Borders & Dividers**:
  - Main Borders (Glass): `rgba(255, 255, 255, 0.8)` / `#ffffff` dengan 80% Opacity
  - Thin Dividers: `#e6edf2`, `#dbe9f3`
  - Interactive Component Borders: `#bdeaff`
- **Primary Action (Buttons, Icons)**:
  - Background (Biru Terang): `#00a4ff`
  - Text on Primary: `#ffffff`
  - Inactive Controls / Track Backgrounds: `#c9eaff`
- **Status (Ratings)**:
  - POOR: `#ff5e5e`
  - FAIR: `#ffcf5e`
  - NO DATA: `#b9b9b9`

### b. Typography
- **Font Family**: Default Sans-serif (Inter/Roboto)
- **Sizes**: Page Title `4xl` (36px), Standard Text `xs` (12px), `sm` (14px)
- **Line Height / Tracking**: Page Title `leading-none` (1), `tracking-[-0.05em]` (-5%)

### c. Shadows & Effects
- **Main Container Shadow**: `0px 14px 42px rgba(44, 42, 39, 0.16)` (Desktop) atau `0px 12px 32px rgba(0, 4, 117, 0.2)` (Mobile)
- **Card Shadows**: `0px 5px 14px rgba(44, 42, 39, 0.06)`
- **Backdrop Blur**: `backdrop-blur-md` (12px blur radius)

### d. Border Radius, Margins, & Paddings
- **Border Radius (Round)**: Mobile Main `22px`, Desktop Main `26px`, Cards `16px` (2xl), Small Controls `12px` (xl)

---

## 2. Tema Dark (Cyberpunk / Matrix Green)

Tema ini memiliki estetika gelap (*dark mode*) yang kuat, dengan aksen hijau neon/matrix dan panel *glassmorphism* berwarna hitam solid transparan.

### a. Colors (Hex)
- **Global Backgrounds**:
  - Gradient 1: `radial-gradient(circle at 8% 6%, #294c3b 0%, transparent 28%)`
  - Gradient 2: `radial-gradient(circle at 91% 4%, #242a27 0%, transparent 38%)`
  - Gradient 3: `linear-gradient(135deg, #111513 0%, #0b0d0c 58%, #1a1e1c 100%)`
- **Container / Surface Backgrounds**:
  - Main Panel (Glass): `#111413` dengan 90% Opacity
  - Cards (Panels): `#171717`
  - Inner Skeleton/Card: `#202820`
  - Secondary/Popovers/Inner Lists: `#121916`, `#101211`
- **Text & Typography**:
  - Primary Text: `#f1f1f1`
  - Secondary Text: `#e1e5e1`
  - Muted Text: `#a7ada8`, `#b9b9b9`
- **Borders & Dividers**:
  - Main Borders & Dividers: `rgba(255, 255, 255, 0.1)` / `#ffffff` dengan 10% Opacity
  - Accent Borders (Buttons/Dropdowns): `#b0ff5e` dengan 30% atau 25% Opacity
- **Primary Action (Buttons, Icons)**:
  - Background (Neon Green): `#b0ff5e`
  - Text on Primary: `#181818`
  - Inactive Controls / Track Backgrounds: `#4d554e`, `#535353`
- **Status (Ratings)**:
  - POOR: `#ff5e5e`
  - FAIR: `#ffcf5e`
  - NO DATA: `#b9b9b9`

### b. Typography
- Identik secara hierarki dengan Tema Light.

### c. Shadows & Effects
- **Main Container Shadow**: `0px 14px 42px rgba(0, 0, 0, 0.45)`
- **Backdrop Blur**: `backdrop-blur-md` (12px blur radius)

### d. Border Radius, Margins, & Paddings
- Identik secara struktural dengan Tema Light.

---

## 3. Tema Retro (Neo-Brutalism)

Tema ini mengadopsi gaya desain brutalism modern / *neo-brutalism*, membuang semua gradien halus, *blur*, dan bayangan realistis. Tema ini menggunakan garis *border* tebal, warna solid kontras, *drop shadow* blok tajam, dan tipografi monospasi (menyerupai *coding*/mesin tik).

### a. Colors (Hex)
- **Global Background**: `#dfe2d3` (Warna solid)
- **Container / Surface Backgrounds**:
  - Main Panel: `#c9ccc0`
  - Cards (Panels): `#eceee6`
  - Inner Cards / Popovers / Buttons: `#eceee6`
- **Text & Typography**:
  - Primary Text: `#24252b`
  - Secondary Text: `#4b514a`
  - Muted Text: `#687065`, `#555850`
- **Borders & Dividers**:
  - Semua Border Utama: `#24252b` (Hitam pekat/abu-abu gelap)
  - Thin Dividers: `rgba(36, 37, 43, 0.25)` atau `rgba(36, 37, 43, 0.2)` (`#24252b` @ 20-25%)
- **Primary Action (Buttons, Icons)**:
  - Background (Magenta/Ungu Terang): `#ba0dcb`
  - Text on Primary: `#ffffff`
  - Inactive Controls / Track Backgrounds: `#b5b9ad`
- **Status (Ratings)**:
  - POOR: `#ff5e5e`
  - FAIR: `#ffcf5e`
  - NO DATA: `#b9b9b9`

### b. Typography
- **Font Family**: `monospace` (Consolas, Courier New, Roboto Mono, dll)
- Identik hierarki *size/weight* dengan Tema Light, namun spasi *monospace* membuat huruf lebih renggang.

### c. Shadows & Effects
- **Tidak ada *Backdrop Blur*** (Solid colors only)
- **Neo-Brutalism Shadows** (Bayangan blok tajam tanpa *blur*):
  - Desktop Main Container Shadow: `0px 8px 0px #24252b`
  - Mobile Main Container Shadow: `0px 6px 0px #24252b`
  - Inner Card Shadows: `3px 3px 0px #24252b`
  *(Catatan Figma: Set Blur=0, Spread=0, Color=#24252b, Opacity=100%)*

### d. Border Radius, Margins, & Paddings
- **Border Thickness (Ketebalan Garis)**:
  - Main Panels: `3px`
  - Inner Cards / Buttons: `2px`
- **Border Radius (Round)**:
  - Desktop Main Panel: `30px` (Lebih bulat)
  - Mobile Main Panel: `22px`
  - Inner Cards: `16px` (2xl)
  - Small Controls: `12px` (xl)

---

## 4. Warna Ekstra / Tambahan (Konteks Ekspor & Cetak)
Untuk halaman ekspor ke gambar atau cetak PDF, terdapat beberapa warna dasar sistem yang di luar 3 tema di atas:
- **Print Background**: `#202020`
- **Print Canvas / Preview**: `#ffffff`
- **AI Agent Button**: `#6931f1` (Ungu Khas AI) dengan teks `#ffffff`
- **Standard Button (Print)**: Latar `#ffffff` dengan teks `#2f2f2f`
- **Error Box**: Teks `#b91c1c` (Merah pekat) pada latar `#ffffff`
