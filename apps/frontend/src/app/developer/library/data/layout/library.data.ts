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
    "file": "universe/Layouts/Container/Container.tsx",
    "description": "Pembungkus viewport utama yang mengatur padding, ukuran layar, dan komposisi Workspace.",
    "tags": [
      "Layout",
      "Wrapper",
      "Responsive"
    ]
  },
  {
    "name": "Content",
    "file": "universe/Layouts/Content/Content.tsx",
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
    "file": "universe/SideBar/SideBar.tsx",
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
    "file": "universe/Layouts/Workspace/Workspace.tsx",
    "description": "Komposisi workspace yang menghubungkan Navbar, Sidebar, Content, dan Menu.",
    "tags": [
      "Layout",
      "Workspace",
      "Navigation"
    ]
  },
  {
    "name": "NavBar",
    "file": "universe/NavBar/",
    "description": "Universe NavBar component family.",
    "tags": [
      "Folder"
    ],
    "children": [
      {
        "name": "AppButton",
        "file": "universe/NavBar/AppButton/AppButton.tsx",
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
        "file": "universe/NavBar/AppIcon/AppIcon.tsx",
        "description": "Komponen Navbar\\appIcon pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "AppsDropdown",
        "file": "universe/NavBar/Dropdown/AppsDropdown/AppsDropdown.tsx",
        "description": "Komponen Navbar\\appsDropdown pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "Avatar",
        "file": "universe/NavBar/Avatar/Avatar.tsx",
        "description": "Komponen Navbar\\avatar pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "Breadcrumb",
        "file": "universe/NavBar/Breadcrumb/Breadcrumb.tsx",
        "description": "Komponen Navbar\\breadcrumb pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "ButtonMenu",
        "file": "universe/NavBar/ButtonMenu/ButtonMenu.tsx",
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
        "file": "universe/NavBar/Dropdown/MessageDropdown/MessageDropdown.tsx",
        "description": "Komponen Navbar\\messageDropdown pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "NavBar",
        "file": "universe/NavBar/NavBar.tsx",
        "description": "Primary NavBar component in the Universe family.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "NotificationDropdown",
        "file": "universe/NavBar/Dropdown/NotificationDropdown/NotificationDropdown.tsx",
        "description": "Komponen Navbar\\notificationDropdown pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "ProfileDropdown",
        "file": "universe/NavBar/Dropdown/ProfileDropdown/ProfileDropdown.tsx",
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
    "file": "universe/SideBar/",
    "description": "Folder Sidebar.",
    "tags": [
      "Folder"
    ],
    "children": [
      {
        "name": "SidebarFooter",
        "file": "universe/SideBar/SideBarFooter/SideBarFooter.tsx",
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
        "file": "universe/SideBar/SideBarItem/SideBarItem.tsx",
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
        "file": "universe/SideBar/SideBarSection/SideBarSection.tsx",
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
