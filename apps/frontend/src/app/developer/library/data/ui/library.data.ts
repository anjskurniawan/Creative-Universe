import type { ComponentItem } from "@/app/developer/library/library.data";

export const uiComponents: ComponentItem[] = [
  {
    "name": "AccessDenied",
    "file": "AccessDenied/AccessDenied.tsx",
    "description": "Tampilan pemberitahuan ketika pengguna tidak memiliki akses ke resource.",
    "tags": [
      "Feedback",
      "Permission",
      "State"
    ]
  },
  {
    "name": "ActionCard",
    "file": "ActionCard/ActionCard.tsx",
    "description": "Kartu aksi yang menggabungkan ikon, judul, deskripsi, dan tautan tindakan.",
    "tags": [
      "Action",
      "Card",
      "Navigation"
    ]
  },
  {
    "name": "AuthParticleBackground",
    "file": "AuthParticleBackground/AuthParticleBackground.tsx",
    "description": "Latar belakang partikel animatif untuk area autentikasi.",
    "tags": [
      "Auth",
      "Background",
      "Animation"
    ]
  },
  {
    "name": "Background",
    "file": "ParallaxBackground/ParallaxBackground.tsx",
    "sourcePath": "@/features/auth/components/ParallaxBackground/ParallaxBackground.tsx",
    "description": "Lapisan background gambar dengan efek fade-in dan parallax zoom lembut berbasis GSAP.",
    "tags": [
      "Background",
      "Layout",
      "Visual",
      "GSAP",
      "Parallax"
    ]
  },
  {
    "name": "ButtonAction",
    "file": "ButtonAction/ButtonAction.tsx",
    "description": "Tombol aksi standar dengan konfigurasi visual dan perilaku yang konsisten.",
    "tags": [
      "Button",
      "Action",
      "Interaction"
    ]
  },
  {
    "name": "Button",
    "file": "Button/Button.tsx",
      "description": "Tombol reusable dengan variant primary, secondary, danger, outline, filter, ukuran responsif, icon, loading, dan disabled state.",
    "tags": [
      "Button",
      "Interaction",
        "UI",
        "Variant",
        "Loading"
      ],
      "childComponents": [
        {
          "name": "MaterialIcon",
          "category": "ui",
          "file": "MaterialIcon/MaterialIcon.tsx"
        }
      ]
  },
  {
    "name": "ConfirmModal",
    "file": "ConfirmModal/ConfirmModal.tsx",
    "description": "Dialog konfirmasi untuk meminta persetujuan sebelum menjalankan aksi penting.",
    "tags": [
      "Modal",
      "Confirmation",
      "Action"
    ]
  },
  {
    "name": "ContentTitle",
    "file": "ContentTitle/ContentTitle.tsx",
    "description": "Komponen judul halaman untuk menandai konteks utama area content.",
    "tags": [
      "Typography",
      "Header",
      "Layout"
    ]
  },
  {
    "name": "CreativeUniverseLogo",
    "file": "CreativeUniverseLogo/CreativeUniverseLogo.tsx",
    "description": "Mark SVG Creative Universe reusable dengan ukuran dan warna yang dapat dikendalikan melalui className.",
    "tags": [
      "Branding",
      "Logo",
      "Visual",
      "SVG",
      "Branding"
    ]
  },
  {
    "name": "CustomDatePicker",
    "file": "CustomDatePicker/CustomDatePicker.tsx",
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
    "sourcePath": "@/features/kv-retail/components/TaskFormModal/FileUploadDropzone/FileUploadDropzone.tsx",
    "description": "Area drag-and-drop untuk memilih, memvalidasi, dan menangani file unggahan.",
    "tags": [
      "Form",
      "Upload",
      "DragDrop"
    ],
    "childComponents": [
      {
        "name": "MaterialIcon",
        "category": "ui",
        "file": "MaterialIcon/MaterialIcon.tsx"
      }
    ]
  },
  {
    "name": "GuestMobileOrbitMotion",
    "file": "GuestMobileOrbitMotion/GuestMobileOrbitMotion.tsx",
    "description": "Animasi orbit elemen visual pada pengalaman guest mobile.",
    "tags": [
      "Animation",
      "Mobile",
      "Visual"
    ]
  },
  {
    "name": "Logo",
    "file": "Logo/Logo.tsx",
    "description": "Komponen logo umum untuk digunakan pada header atau area branding.",
    "tags": [
      "Branding",
      "Logo",
      "Visual"
    ]
  },
  {
    "name": "MaterialIcon",
    "file": "MaterialIcon/MaterialIcon.tsx",
    "description": "Wrapper ikon Material yang menyediakan nama, ukuran, bobot, dan class styling.",
    "tags": [
      "Icon",
      "Typography",
      "UI"
    ]
  },
  {
    "name": "Modal",
    "file": "Modal/Modal.tsx",
    "description": "Wadah dialog overlay generik dengan kontrol penutupan dan fokus interaksi.",
    "tags": [
      "Modal",
      "Overlay",
      "Interaction"
    ]
  },
  {
    "name": "PrimaryActionLink",
    "file": "PrimaryActionLink/PrimaryActionLink.tsx",
    "description": "Tautan aksi utama dengan gaya tombol untuk navigasi penting.",
    "tags": [
      "Link",
      "Action",
      "Navigation"
    ]
  },
  {
    "name": "SpinningWheel",
    "file": "SpinningWheel/SpinningWheel.tsx",
    "description": "Indikator loading berbentuk roda untuk menandai proses yang sedang berjalan.",
    "tags": [
      "Loading",
      "Feedback",
      "Animation"
    ]
  },
  {
    "name": "SearchBar",
    "file": "SearchBar/SearchBar.tsx",
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
    "file": "StatCard/StatCard.tsx",
    "description": "Kartu ringkasan metrik dengan nilai, ikon, subtitle, dan state visual.",
    "tags": [
      "Card",
      "Statistics",
      "Dashboard"
    ]
  },
  {
    "name": "Table",
    "file": "Table/Table.tsx",
    "description": "Komponen tabel generik untuk merender data, kolom, key, dan empty state.",
    "tags": [
      "Table",
      "Data",
      "Layout"
    ]
  },
  {
    "name": "TaskDesktopPageTransition",
    "file": "TaskDesktopPageTransition/TaskDesktopPageTransition.tsx",
    "description": "Transisi halaman desktop untuk perpindahan tampilan task yang lebih halus.",
    "tags": [
      "Animation",
      "Task",
      "Transition"
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
        "file": "form/DropdownMenu/DropdownMenu.tsx",
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
        "file": "form/Input/Input.tsx",
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
