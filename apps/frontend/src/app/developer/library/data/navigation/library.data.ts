import type { ComponentItem } from "@/app/developer/library/library.data";

export const navigationComponents: ComponentItem[] = [
  {
    "name": "MessageBell",
    "file": "MessageBell/MessageBell.tsx",
    "sourcePath": "@/features/messages/components/MessageBell/MessageBell.tsx",
    "description": "Tombol indikator pesan yang membuka akses ke pesan terbaru.",
    "tags": [
      "Navigation",
      "Message",
      "Notification"
    ]
  },
  {
    "name": "NotificationBell",
    "file": "NotificationBell/NotificationBell.tsx",
    "sourcePath": "@/features/notifications/components/NotificationBell/NotificationBell.tsx",
    "description": "Tombol indikator notifikasi dengan state unread dan daftar pemberitahuan.",
    "tags": [
      "Navigation",
      "Notification",
      "Badge"
    ]
  },
  {
    "name": "SideMenu",
    "file": "sidemenu/SideMenu/SideMenu.tsx",
    "sourcePath": "@/components/navigation/sidemenu/SideMenu/SideMenu.tsx",
    "description": "Komposisi side menu modul yang menggabungkan icon, avatar, dan kontrol navigasi.",
    "tags": [
      "Navigation",
      "Sidebar",
      "Menu"
    ]
  },
  {
    "name": "SidebarUtilityActions",
    "file": "SidebarUtilityActions/SidebarUtilityActions.tsx",
    "sourcePath": "@/components/navigation/SidebarUtilityActions/SidebarUtilityActions.tsx",
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
        "file": "sidemenu/SideMenuAvatar/SideMenuAvatar.tsx",
        "sourcePath": "@/components/navigation/sidemenu/SideMenuAvatar/SideMenuAvatar.tsx",
        "description": "Komponen Sidemenu\\avatar pada kategori navigation.",
        "tags": [
          "Component",
          "navigation",
          "Menu"
        ]
      },
      {
        "name": "Button",
        "file": "sidemenu/SideMenuButton/SideMenuButton.tsx",
        "sourcePath": "@/components/navigation/sidemenu/SideMenuButton/SideMenuButton.tsx",
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
        "file": "sidemenu/SideMenuCollaps/SideMenuCollaps.tsx",
        "sourcePath": "@/components/navigation/sidemenu/SideMenuCollaps/SideMenuCollaps.tsx",
        "description": "Komponen Sidemenu\\collaps pada kategori navigation.",
        "tags": [
          "Component",
          "navigation",
          "Menu"
        ]
      },
      {
        "name": "Expand",
        "file": "sidemenu/SideMenuExpand/SideMenuExpand.tsx",
        "sourcePath": "@/components/navigation/sidemenu/SideMenuExpand/SideMenuExpand.tsx",
        "description": "Komponen Sidemenu\\expand pada kategori navigation.",
        "tags": [
          "Component",
          "navigation",
          "Menu"
        ]
      },
      {
        "name": "Iconapp",
        "file": "sidemenu/SideMenuIconApp/SideMenuIconApp.tsx",
        "sourcePath": "@/components/navigation/sidemenu/SideMenuIconApp/SideMenuIconApp.tsx",
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
