import type { ComponentItem } from "@/app/developer/library/library.data";

export const authComponents: ComponentItem[] = [
  {
    "name": "AuthCardFooter",
    "file": "auth-card-footer.tsx",
    "sourcePath": "@/features/auth/components/AuthCard/AuthCardFooter/AuthCardFooter.tsx",
    "description": "Bagian bawah kartu autentikasi untuk menampilkan bantuan atau navigasi lanjutan.",
    "tags": [
      "Auth",
      "Footer",
      "Navigation"
    ]
  },
  {
    "name": "AuthCardHeader",
    "file": "auth-card-header.tsx",
    "sourcePath": "@/features/auth/components/AuthCard/AuthCardHeader/AuthCardHeader.tsx",
    "description": "Bagian kepala kartu autentikasi yang menampilkan identitas dan judul form.",
    "tags": [
      "Auth",
      "Header",
      "Branding"
    ]
  },
  {
    "name": "AuthCard",
    "file": "auth-card.tsx",
    "sourcePath": "@/features/auth/components/AuthCard/AuthCard.tsx",
    "description": "Wadah visual konsisten untuk membungkus konten autentikasi.",
    "tags": [
      "Auth",
      "Card",
      "Layout"
    ]
  }
];
