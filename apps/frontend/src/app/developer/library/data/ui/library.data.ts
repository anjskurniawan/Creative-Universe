import type { ComponentItem } from "@/app/developer/library/library.data";

export const uiComponents: ComponentItem[] = [
  {
    "name": "AccessDenied",
    "file": "access-denied.tsx",
    "description": "Tampilan pemberitahuan ketika pengguna tidak memiliki akses ke resource.",
    "tags": [
      "Feedback",
      "Permission",
      "State"
    ]
  },
  {
    "name": "ActionCard",
    "file": "action-card.tsx",
    "description": "Kartu aksi yang menggabungkan ikon, judul, deskripsi, dan tautan tindakan.",
    "tags": [
      "Action",
      "Card",
      "Navigation"
    ]
  },
  {
    "name": "AuthParticleBackground",
    "file": "auth-particle-background.tsx",
    "description": "Latar belakang partikel animatif untuk area autentikasi.",
    "tags": [
      "Auth",
      "Background",
      "Animation"
    ]
  },
  {
    "name": "Background",
    "file": "background.tsx",
    "description": "Komponen lapisan latar belakang visual yang dapat digunakan ulang pada halaman.",
    "tags": [
      "Background",
      "Layout",
      "Visual"
    ]
  },
  {
    "name": "ButtonAction",
    "file": "button-action.tsx",
    "description": "Tombol aksi standar dengan konfigurasi visual dan perilaku yang konsisten.",
    "tags": [
      "Button",
      "Action",
      "Interaction"
    ]
  },
  {
    "name": "Button",
    "file": "button.tsx",
    "description": "Komponen tombol kustom dengan status loading dan penyesuaian gaya visual.",
    "tags": [
      "Button",
      "Interaction",
      "UI"
    ]
  },
  {
    "name": "ConfirmModal",
    "file": "confirm-modal.tsx",
    "description": "Dialog konfirmasi untuk meminta persetujuan sebelum menjalankan aksi penting.",
    "tags": [
      "Modal",
      "Confirmation",
      "Action"
    ]
  },
  {
    "name": "ContentTitle",
    "file": "content-title.tsx",
    "description": "Komponen judul halaman untuk menandai konteks utama area content.",
    "tags": [
      "Typography",
      "Header",
      "Layout"
    ]
  },
  {
    "name": "CreativeUniverseLogo",
    "file": "creative-universe-logo.tsx",
    "description": "Logo Creative Universe dengan opsi tampilan untuk kebutuhan branding.",
    "tags": [
      "Branding",
      "Logo",
      "Visual"
    ]
  },
  {
    "name": "CustomDatePicker",
    "file": "custom-date-picker.tsx",
    "description": "Input pemilih tanggal dengan kalender interaktif dan callback perubahan nilai.",
    "tags": [
      "Form",
      "Date",
      "Picker"
    ]
  },
  {
    "name": "FileUploadDropzone",
    "file": "file-upload-dropzone.tsx",
    "description": "Area drag-and-drop untuk memilih, memvalidasi, dan menangani file unggahan.",
    "tags": [
      "Form",
      "Upload",
      "DragDrop"
    ]
  },
  {
    "name": "GuestMobileOrbitMotion",
    "file": "guest-mobile-orbit-motion.tsx",
    "description": "Animasi orbit elemen visual pada pengalaman guest mobile.",
    "tags": [
      "Animation",
      "Mobile",
      "Visual"
    ]
  },
  {
    "name": "Logo",
    "file": "logo.tsx",
    "description": "Komponen logo umum untuk digunakan pada header atau area branding.",
    "tags": [
      "Branding",
      "Logo",
      "Visual"
    ]
  },
  {
    "name": "MaterialIcon",
    "file": "material-icon.tsx",
    "description": "Wrapper ikon Material yang menyediakan nama, ukuran, bobot, dan class styling.",
    "tags": [
      "Icon",
      "Typography",
      "UI"
    ]
  },
  {
    "name": "Modal",
    "file": "modal.tsx",
    "description": "Wadah dialog overlay generik dengan kontrol penutupan dan fokus interaksi.",
    "tags": [
      "Modal",
      "Overlay",
      "Interaction"
    ]
  },
  {
    "name": "PrimaryActionLink",
    "file": "primary-action-link.tsx",
    "description": "Tautan aksi utama dengan gaya tombol untuk navigasi penting.",
    "tags": [
      "Link",
      "Action",
      "Navigation"
    ]
  },
  {
    "name": "SpinningWheel",
    "file": "spinning-wheel.tsx",
    "description": "Indikator loading berbentuk roda untuk menandai proses yang sedang berjalan.",
    "tags": [
      "Loading",
      "Feedback",
      "Animation"
    ]
  },
  {
    "name": "SearchBar",
    "file": "search-bar.tsx",
    "description": "Input pencarian reusable dengan ikon search, state controlled, placeholder, dan aksi hapus nilai.",
    "tags": [
      "Form",
      "Search",
      "Input",
      "Interaction"
    ]
  },
  {
    "name": "StatCard",
    "file": "stat-card.tsx",
    "description": "Kartu ringkasan metrik dengan nilai, ikon, subtitle, dan state visual.",
    "tags": [
      "Card",
      "Statistics",
      "Dashboard"
    ]
  },
  {
    "name": "Table",
    "file": "table.tsx",
    "description": "Komponen tabel generik untuk merender data, kolom, key, dan empty state.",
    "tags": [
      "Table",
      "Data",
      "Layout"
    ]
  },
  {
    "name": "TaskDesktopPageTransition",
    "file": "task-desktop-page-transition.tsx",
    "description": "Transisi halaman desktop untuk perpindahan tampilan task yang lebih halus.",
    "tags": [
      "Animation",
      "Task",
      "Transition"
    ]
  },
  {
    "name": "Toast",
    "file": "toast.tsx",
    "description": "Notifikasi sementara untuk menyampaikan status sukses, error, atau informasi.",
    "tags": [
      "Feedback",
      "Notification",
      "Status"
    ]
  },
  {
    "name": "Form",
    "file": "form/",
    "description": "Folder Form.",
    "tags": [
      "Folder"
    ],
    "children": [
      {
        "name": "DropdownMenu",
        "file": "form/dropdown-menu.tsx",
        "description": "Komponen Form\\dropdownMenu pada kategori ui.",
        "tags": [
          "Component",
          "ui",
          "Form",
          "Menu"
        ]
      },
      {
        "name": "Input",
        "file": "form/input.tsx",
        "description": "Komponen Form\\input pada kategori ui.",
        "tags": [
          "Component",
          "ui",
          "Form",
          "Input"
        ]
      }
    ]
  }
];
