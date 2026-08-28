import type { ComponentItem } from "@/app/developer/library/library.data";

export const dashboardComponents: ComponentItem[] = [
  {
    "name": "ActivityLogSection",
    "file": "ActivityLogSection/ActivityLogSection.tsx",
    "sourcePath": "@/app/(core)/panel/dashboard/_components/ActivityLogSection/ActivityLogSection.tsx",
    "description": "Tabel aktivitas terbaru yang menampilkan operator, kategori, aksi, dan waktu.",
    "tags": [
      "Dashboard",
      "Activity",
      "Table"
    ]
  },
  {
    "name": "DashboardSystemControl",
    "file": "DashboardSystemControl/DashboardSystemControl.tsx",
    "sourcePath": "@/app/(core)/panel/dashboard/_components/DashboardSystemControl/DashboardSystemControl.tsx",
    "description": "Panel kontrol maintenance dan perintah utilitas sistem.",
    "tags": [
      "Dashboard",
      "Admin",
      "Maintenance"
    ]
  },
  {
    "name": "DashboardSystemHealth",
    "file": "DashboardSystemHealth/DashboardSystemHealth.tsx",
    "sourcePath": "@/app/(core)/panel/dashboard/_components/DashboardSystemHealth/DashboardSystemHealth.tsx",
    "description": "Panel pemantauan kesehatan sistem dan respons API.",
    "tags": [
      "Dashboard",
      "Monitoring",
      "System"
    ]
  },
  {
    "name": "DefaultStatsGrid",
    "file": "DefaultStatsGrid/DefaultStatsGrid.tsx",
    "sourcePath": "@/app/(core)/panel/dashboard/_components/DefaultStatsGrid/DefaultStatsGrid.tsx",
    "description": "Grid statistik ringkas untuk pengguna non-root.",
    "tags": [
      "Dashboard",
      "Statistics",
      "Grid"
    ]
  },
  {
    "name": "QuickActionsSection",
    "file": "QuickActionsSection/QuickActionsSection.tsx",
    "sourcePath": "@/app/(core)/panel/dashboard/_components/QuickActionsSection/QuickActionsSection.tsx",
    "description": "Kumpulan shortcut menuju aksi dan fitur yang sering digunakan.",
    "tags": [
      "Dashboard",
      "Actions",
      "Navigation"
    ]
  },
  {
    "name": "RootStatsGrid",
    "file": "RootStatsGrid/RootStatsGrid.tsx",
    "sourcePath": "@/app/(core)/panel/dashboard/_components/RootStatsGrid/RootStatsGrid.tsx",
    "description": "Grid statistik operasional dan infrastruktur khusus administrator root.",
    "tags": [
      "Dashboard",
      "Statistics",
      "Admin"
    ]
  },
  {
    "name": "SystemEnvBar",
    "file": "SystemEnvBar/SystemEnvBar.tsx",
    "sourcePath": "@/app/(core)/panel/dashboard/_components/SystemEnvBar/SystemEnvBar.tsx",
    "description": "Bar informasi versi aplikasi dan konfigurasi environment server.",
    "tags": [
      "Dashboard",
      "System",
      "Status"
    ]
  }
];
