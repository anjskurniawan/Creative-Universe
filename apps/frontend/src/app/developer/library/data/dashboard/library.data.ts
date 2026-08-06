import type { ComponentItem } from "@/app/developer/library/library.data";

export const dashboardComponents: ComponentItem[] = [
  {
    "name": "ActivityLogSection",
    "file": "activity-log-section.tsx",
    "description": "Tabel aktivitas terbaru yang menampilkan operator, kategori, aksi, dan waktu.",
    "tags": [
      "Dashboard",
      "Activity",
      "Table"
    ]
  },
  {
    "name": "DashboardSystemControl",
    "file": "dashboard-system-control.tsx",
    "description": "Panel kontrol maintenance dan perintah utilitas sistem.",
    "tags": [
      "Dashboard",
      "Admin",
      "Maintenance"
    ]
  },
  {
    "name": "DashboardSystemHealth",
    "file": "dashboard-system-health.tsx",
    "description": "Panel pemantauan kesehatan sistem dan respons API.",
    "tags": [
      "Dashboard",
      "Monitoring",
      "System"
    ]
  },
  {
    "name": "DefaultStatsGrid",
    "file": "default-stats-grid.tsx",
    "description": "Grid statistik ringkas untuk pengguna non-root.",
    "tags": [
      "Dashboard",
      "Statistics",
      "Grid"
    ]
  },
  {
    "name": "QuickActionsSection",
    "file": "quick-actions-section.tsx",
    "description": "Kumpulan shortcut menuju aksi dan fitur yang sering digunakan.",
    "tags": [
      "Dashboard",
      "Actions",
      "Navigation"
    ]
  },
  {
    "name": "RootStatsGrid",
    "file": "root-stats-grid.tsx",
    "description": "Grid statistik operasional dan infrastruktur khusus administrator root.",
    "tags": [
      "Dashboard",
      "Statistics",
      "Admin"
    ]
  },
  {
    "name": "SystemEnvBar",
    "file": "system-env-bar.tsx",
    "description": "Bar informasi versi aplikasi dan konfigurasi environment server.",
    "tags": [
      "Dashboard",
      "System",
      "Status"
    ]
  }
];

