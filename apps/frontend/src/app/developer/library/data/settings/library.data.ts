import type { ComponentItem } from "@/app/developer/library/library.data";

export const settingsComponents: ComponentItem[] = [
  {
    "name": "SettingMenu",
    "file": "SettingLayout/SettingMenu/SettingMenu.tsx",
    "sourcePath": "@/features/settings/components/SettingLayout/SettingMenu/SettingMenu.tsx",
    "description": "Navigasi pengaturan responsif dengan grup menu, active state, filter permission, dan submenu collapsible.",
    "tags": ["Layout", "Settings", "Navigation", "Menu"]
  },
  {
    "name": "SettingsProfileHeader",
    "file": "SettingLayout/SettingsProfileHeader/SettingsProfileHeader.tsx",
    "sourcePath": "@/features/settings/components/SettingLayout/SettingsProfileHeader/SettingsProfileHeader.tsx",
    "description": "Header profil Settings yang menampilkan avatar, nama, dan username pengguna.",
    "tags": ["Layout", "Settings", "Profile", "Header"]
  },
  {
    "name": "SettingsNavigationConfig",
    "file": "SettingLayout/SettingMenu/SettingMenu.config.ts",
    "sourcePath": "@/features/settings/components/SettingLayout/SettingMenu/SettingMenu.config.ts",
    "description": "Konfigurasi grup menu Settings, permission, dan helper active state navigasi.",
    "tags": ["Settings", "Navigation", "Configuration"]
  },
  {
    "name": "RolesPageContent",
    "file": "roles/page.tsx",
    "sourcePath": "@/app/(core)/panel/roles/page.tsx",
    "description": "Workspace pengelolaan role dan permission dengan tabel, editor, dan konfirmasi penghapusan.",
    "tags": ["Settings", "Roles", "Permissions", "Administration"]
  },
  {
    "name": "ActivityLog",
    "file": "ActivityLog/ActivityLog.tsx",
    "sourcePath": "@/app/(core)/settings/security/activity-log/_components/ActivityLog/ActivityLog.tsx",
    "description": "Timeline aktivitas keamanan dengan status loading/error, detail aksi, dan informasi audit.",
    "tags": ["Settings", "Activity", "Audit", "Security"]
  }
];
