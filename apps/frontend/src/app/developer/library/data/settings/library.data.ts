import type { ComponentItem } from "@/app/developer/library/library.data";

export const settingsComponents: ComponentItem[] = [
  {
    "name": "SettingMenu",
    "file": "setting-menu.tsx",
    "description": "Navigasi pengaturan responsif dengan grup menu, active state, filter permission, dan submenu collapsible.",
    "tags": ["Layout", "Settings", "Navigation", "Menu"]
  },
  {
    "name": "SettingsProfileHeader",
    "file": "settings-profile-header.tsx",
    "description": "Header profil Settings yang menampilkan avatar, nama, dan username pengguna.",
    "tags": ["Layout", "Settings", "Profile", "Header"]
  },
  {
    "name": "SettingsMobileHeader",
    "file": "settings-mobile-header.tsx",
    "description": "Header navigasi mobile Settings dengan tombol kembali dan label halaman aktif.",
    "tags": ["Layout", "Settings", "Navigation", "Mobile"]
  },
  {
    "name": "SettingsNavigationConfig",
    "file": "settings-navigation-config.ts",
    "description": "Konfigurasi grup menu Settings, permission, dan helper active state navigasi.",
    "tags": ["Settings", "Navigation", "Configuration"]
  },
  {
    "name": "SecuritySettings",
    "file": "security-settings.tsx",
    "description": "Daftar sesi perangkat aktif, status sesi, dan aksi pencabutan akses perangkat.",
    "tags": ["Settings", "Security", "Sessions", "Devices"]
  },
  {
    "name": "RolesPageContent",
    "file": "roles/roles-page.tsx",
    "description": "Workspace pengelolaan role dan permission dengan tabel, editor, dan konfirmasi penghapusan.",
    "tags": ["Settings", "Roles", "Permissions", "Administration"]
  },
  {
    "name": "ActivityLog",
    "file": "activity-log.tsx",
    "description": "Timeline aktivitas keamanan dengan status loading/error, detail aksi, dan informasi audit.",
    "tags": ["Settings", "Activity", "Audit", "Security"]
  },
  {
    "name": "RoleSettingPage",
    "file": "role-setting-page.tsx",
    "description": "Halaman pengaturan khusus peran untuk konfigurasi sistem, integrasi, dan default Pricetag.",
    "tags": ["Settings", "Roles", "Configuration", "Permissions"]
  }
];
