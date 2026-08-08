import type { ComponentItem } from "@/app/developer/library/library.data";

export const layoutComponents: ComponentItem[] = [
  {
    "name": "AppTitle",
    "file": "app-title.tsx",
    "description": "Judul landing sub-aplikasi yang dinamis, responsif, dan interaktif memenuhi area konten.",
    "tags": [
      "Layout",
      "Heading",
      "Landing"
    ]
  },
  {
    "name": "Container",
    "file": "container.tsx",
    "description": "Pembungkus viewport utama yang mengatur padding, ukuran layar, dan komposisi Workspace.",
    "tags": [
      "Layout",
      "Wrapper",
      "Responsive"
    ]
  },
  {
    "name": "Content",
    "file": "content.tsx",
    "description": "Wadah area konten utama dengan pengaturan viewport dan overflow.",
    "tags": [
      "Layout",
      "Content",
      "Scroll"
    ]
  },
  {
    "name": "Menu",
    "file": "menu.tsx",
    "description": "Drawer navigasi responsif untuk menampilkan item menu pada viewport mobile.",
    "tags": [
      "Navigation",
      "Menu",
      "Mobile"
    ]
  },
  {
    "name": "Navbar",
    "file": "navbar.tsx",
    "description": "Navigasi atas global yang memuat menu, breadcrumb, dan kontrol workspace.",
    "tags": [
      "Navigation",
      "Header",
      "Responsive"
    ]
  },
  {
    "name": "RouteGuard",
    "file": "route-guard.tsx",
    "description": "Pelindung tampilan route yang memeriksa status autentikasi sebelum merender halaman.",
    "tags": [
      "Security",
      "Auth",
      "Route"
    ]
  },
  {
    "name": "SettingsLayout",
    "file": "settings-layout.tsx",
    "description": "Layout halaman pengaturan dengan navigasi section dan area detail.",
    "tags": [
      "Settings",
      "Layout",
      "Navigation"
    ]
  },
  {
    "name": "Sidebar",
    "file": "sidebar.tsx",
    "description": "Sidebar global yang merender menu utama, section, dan footer utility.",
    "tags": [
      "Navigation",
      "Sidebar",
      "Global"
    ]
  },
  {
    "name": "ViewportDebug",
    "file": "viewport-debug.tsx",
    "description": "Panel bantuan pengembangan untuk menampilkan informasi viewport saat debugging.",
    "tags": [
      "Development",
      "Debug",
      "Viewport"
    ]
  },
  {
    "name": "Workspace",
    "file": "workspace.tsx",
    "description": "Komposisi workspace yang menghubungkan Navbar, Sidebar, Content, dan Menu.",
    "tags": [
      "Layout",
      "Workspace",
      "Navigation"
    ]
  },
  {
    "name": "Navbar",
    "file": "navbar/",
    "description": "Folder Navbar.",
    "tags": [
      "Folder"
    ],
    "children": [
      {
        "name": "AppButton",
        "file": "navbar/app-button.tsx",
        "description": "Komponen Navbar\\appButton pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Button",
          "Layout"
        ]
      },
      {
        "name": "AppIcon",
        "file": "navbar/app-icon.tsx",
        "description": "Komponen Navbar\\appIcon pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "AppsDropdown",
        "file": "navbar/apps-dropdown.tsx",
        "description": "Komponen Navbar\\appsDropdown pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "Avatar",
        "file": "navbar/avatar.tsx",
        "description": "Komponen Navbar\\avatar pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "Breadcrumb",
        "file": "navbar/breadcrumb.tsx",
        "description": "Komponen Navbar\\breadcrumb pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "ButtonMenu",
        "file": "navbar/button-menu.tsx",
        "description": "Komponen Navbar\\buttonMenu pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Button",
          "Layout",
          "Menu"
        ]
      },
      {
        "name": "MessageDropdown",
        "file": "navbar/message-dropdown.tsx",
        "description": "Komponen Navbar\\messageDropdown pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "Navbar",
        "file": "navbar/navbar.tsx",
        "description": "Komponen Navbar\\navbar pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "NotificationDropdown",
        "file": "navbar/notification-dropdown.tsx",
        "description": "Komponen Navbar\\notificationDropdown pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "ProfileDropdown",
        "file": "navbar/profile-dropdown.tsx",
        "description": "Komponen Navbar\\profileDropdown pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout",
          "Profile",
          "File"
        ]
      }
    ]
  },
  {
    "name": "Profile",
    "file": "profile/",
    "description": "Folder Profile.",
    "tags": [
      "Folder"
    ],
    "children": [
      {
        "name": "Card",
        "file": "profile/card.tsx",
        "description": "Komponen Profile\\card pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Card",
          "Layout",
          "Profile"
        ]
      },
      {
        "name": "DetailCard",
        "file": "profile/detail-card.tsx",
        "description": "Komponen Profile\\detailCard pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Card",
          "Layout",
          "Profile"
        ]
      },
      {
        "name": "PopupPerson",
        "file": "profile/popup-person.tsx",
        "description": "Komponen Profile\\popupPerson pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout",
          "Profile",
          "File"
        ]
      }
    ]
  },
  {
    "name": "Sidebar",
    "file": "sidebar/",
    "description": "Folder Sidebar.",
    "tags": [
      "Folder"
    ],
    "children": [
      {
        "name": "SidebarFooter",
        "file": "sidebar/sidebar-footer.tsx",
        "description": "Komponen Sidebar\\sidebarFooter pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout",
          "Sidebar"
        ]
      },
      {
        "name": "SidebarItem",
        "file": "sidebar/sidebar-item.tsx",
        "description": "Komponen Sidebar\\sidebarItem pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout",
          "Sidebar"
        ]
      },
      {
        "name": "SidebarSection",
        "file": "sidebar/sidebar-section.tsx",
        "description": "Komponen Sidebar\\sidebarSection pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout",
          "Sidebar"
        ]
      }
    ]
  }
];

