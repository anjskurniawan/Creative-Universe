import type { ComponentItem } from "@/app/developer/library/library.data";

export const layoutComponents: ComponentItem[] = [
  {
    "name": "AppTitle",
    "file": "app-title.tsx",
    "sourcePath": "@/app/creative-report/_components/AppTitle/AppTitle.tsx",
    "description": "Judul landing sub-aplikasi yang dinamis, responsif, dan interaktif memenuhi area konten.",
    "tags": [
      "Layout",
      "Heading",
      "Landing"
    ]
  },
  {
    "name": "Container",
    "file": "Container/Container.tsx",
    "description": "Pembungkus viewport utama yang mengatur padding, ukuran layar, dan komposisi Workspace.",
    "tags": [
      "Layout",
      "Wrapper",
      "Responsive"
    ]
  },
  {
    "name": "Content",
    "file": "Content/Content.tsx",
    "description": "Wadah area konten utama dengan pengaturan viewport dan overflow.",
    "tags": [
      "Layout",
      "Content",
      "Scroll"
    ]
  },
  {
    "name": "RouteGuard",
    "file": "RouteGuard/RouteGuard.tsx",
    "sourcePath": "@/app/_components/RouteGuard/RouteGuard.tsx",
    "description": "Pelindung tampilan route yang memeriksa status autentikasi sebelum merender halaman.",
    "tags": [
      "Security",
      "Auth",
      "Route"
    ]
  },
  {
    "name": "Sidebar",
    "file": "SideBar/SideBar.tsx",
    "description": "Sidebar global yang merender menu utama, section, dan footer utility.",
    "tags": [
      "Navigation",
      "Sidebar",
      "Global"
    ]
  },
  {
    "name": "ViewportDebug",
    "file": "ViewportDebug/ViewportDebug.tsx",
    "description": "Panel bantuan pengembangan untuk menampilkan informasi viewport saat debugging.",
    "tags": [
      "Development",
      "Debug",
      "Viewport"
    ]
  },
  {
    "name": "Workspace",
    "file": "Workspace/Workspace.tsx",
    "description": "Komposisi workspace yang menghubungkan Navbar, Sidebar, Content, dan Menu.",
    "tags": [
      "Layout",
      "Workspace",
      "Navigation"
    ]
  },
  {
    "name": "NavBar",
    "file": "NavBar/",
    "description": "Universe NavBar component family.",
    "tags": [
      "Folder"
    ],
    "children": [
      {
        "name": "AppButton",
        "file": "NavBar/AppButton/AppButton.tsx",
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
        "file": "NavBar/AppIcon/AppIcon.tsx",
        "description": "Komponen Navbar\\appIcon pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "AppsDropdown",
        "file": "NavBar/Dropdown/AppsDropdown/AppsDropdown.tsx",
        "description": "Komponen Navbar\\appsDropdown pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "Avatar",
        "file": "NavBar/Avatar/Avatar.tsx",
        "description": "Komponen Navbar\\avatar pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "Breadcrumb",
        "file": "NavBar/Breadcrumb/Breadcrumb.tsx",
        "description": "Komponen Navbar\\breadcrumb pada kategori layout.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "ButtonMenu",
        "file": "NavBar/ButtonMenu/ButtonMenu.tsx",
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
        "file": "NavBar/Dropdown/MessageDropdown/MessageDropdown.tsx",
        "sourcePath": "@/features/messages/components/MessageDropdown/MessageDropdown.tsx",
        "description": "Dropdown pesan milik feature Messages yang dikomposisikan oleh NavBar.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "NavBar",
        "file": "NavBar/NavBar.tsx",
        "description": "Primary NavBar component in the Universe family.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "NotificationDropdown",
        "file": "NavBar/Dropdown/NotificationDropdown/NotificationDropdown.tsx",
        "sourcePath": "@/features/notifications/components/NotificationDropdown/NotificationDropdown.tsx",
        "description": "Dropdown notifikasi milik feature Notifications yang dikomposisikan oleh NavBar.",
        "tags": [
          "Component",
          "layout",
          "Layout"
        ]
      },
      {
        "name": "ProfileDropdown",
        "file": "NavBar/Dropdown/ProfileDropdown/ProfileDropdown.tsx",
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
        "file": "profile/Card/Card.tsx",
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
        "sourcePath": "@/app/creative-report/creative-agent/_components/DetailCard/DetailCard.tsx",
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
        "sourcePath": "@/app/creative-report/performa/_components/AssessmentTable/AssessmentTableRow/PopupPerson/PopupPerson.tsx",
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
    "file": "SideBar/",
    "description": "Folder Sidebar.",
    "tags": [
      "Folder"
    ],
    "children": [
      {
        "name": "SidebarFooter",
        "file": "SideBar/SideBarFooter/SideBarFooter.tsx",
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
        "file": "SideBar/SideBarItem/SideBarItem.tsx",
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
        "file": "SideBar/SideBarSection/SideBarSection.tsx",
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
