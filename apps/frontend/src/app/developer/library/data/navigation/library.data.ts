import type { ComponentItem } from "@/app/developer/library/library.data";

export const navigationComponents: ComponentItem[] = [
  {
    "name": "MessageBell",
    "file": "message-bell.tsx",
    "description": "Tombol indikator pesan yang membuka akses ke pesan terbaru.",
    "tags": [
      "Navigation",
      "Message",
      "Notification"
    ]
  },
  {
    "name": "NotificationBell",
    "file": "notification-bell.tsx",
    "description": "Tombol indikator notifikasi dengan state unread dan daftar pemberitahuan.",
    "tags": [
      "Navigation",
      "Notification",
      "Badge"
    ]
  },
  {
    "name": "SideMenu",
    "file": "side-menu.tsx",
    "description": "Komposisi side menu modul yang menggabungkan icon, avatar, dan kontrol navigasi.",
    "tags": [
      "Navigation",
      "Sidebar",
      "Menu"
    ]
  },
  {
    "name": "SidebarUtilityActions",
    "file": "sidebar-utility-actions.tsx",
    "description": "Kumpulan aksi utilitas yang ditempatkan pada sidebar navigasi.",
    "tags": [
      "Navigation",
      "Sidebar",
      "Actions"
    ]
  },
  {
    "name": "Sidemenu",
    "file": "sidemenu/",
    "description": "Folder Sidemenu.",
    "tags": [
      "Folder"
    ],
    "children": [
      {
        "name": "Avatar",
        "file": "sidemenu/avatar.tsx",
        "description": "Komponen Sidemenu\\avatar pada kategori navigation.",
        "tags": [
          "Component",
          "navigation",
          "Menu"
        ]
      },
      {
        "name": "Button",
        "file": "sidemenu/button.tsx",
        "description": "Komponen Sidemenu\\button pada kategori navigation.",
        "tags": [
          "Component",
          "navigation",
          "Button",
          "Menu"
        ]
      },
      {
        "name": "Collaps",
        "file": "sidemenu/collaps.tsx",
        "description": "Komponen Sidemenu\\collaps pada kategori navigation.",
        "tags": [
          "Component",
          "navigation",
          "Menu"
        ]
      },
      {
        "name": "Expand",
        "file": "sidemenu/expand.tsx",
        "description": "Komponen Sidemenu\\expand pada kategori navigation.",
        "tags": [
          "Component",
          "navigation",
          "Menu"
        ]
      },
      {
        "name": "Iconapp",
        "file": "sidemenu/iconapp.tsx",
        "description": "Komponen Sidemenu\\iconapp pada kategori navigation.",
        "tags": [
          "Component",
          "navigation",
          "Menu"
        ]
      }
    ]
  }
];

