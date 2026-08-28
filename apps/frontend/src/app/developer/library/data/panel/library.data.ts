import type { ComponentItem } from "@/app/developer/library/library.data";

export const panelComponents: ComponentItem[] = [
  {
    "name": "Maintenance",
    "file": "maintenance/",
    "description": "Folder Maintenance.",
    "tags": [
      "Folder"
    ],
    "children": [
      {
        "name": "ConsoleOutputPanel",
        "file": "ConsoleOutputPanel/ConsoleOutputPanel.tsx",
        "sourcePath": "@/features/panel-maintenance/components/ConsoleOutputPanel/ConsoleOutputPanel.tsx",
        "description": "Komponen Maintenance\\consoleOutputPanel pada kategori panel.",
        "tags": [
          "Component",
          "panel",
          "Panel"
        ]
      },
      {
        "name": "EmergencyMaintenanceCard",
        "file": "EmergencyMaintenanceCard/EmergencyMaintenanceCard.tsx",
        "sourcePath": "@/features/panel-maintenance/components/EmergencyMaintenanceCard/EmergencyMaintenanceCard.tsx",
        "description": "Komponen Maintenance\\emergencyMaintenanceCard pada kategori panel.",
        "tags": [
          "Component",
          "panel",
          "Card",
          "Panel"
        ]
      },
      {
        "name": "MaintenanceActionsGrid",
        "file": "MaintenanceActionsGrid/MaintenanceActionsGrid.tsx",
        "sourcePath": "@/features/panel-maintenance/components/MaintenanceActionsGrid/MaintenanceActionsGrid.tsx",
        "description": "Komponen Maintenance\\maintenanceActionsGrid pada kategori panel.",
        "tags": [
          "Component",
          "panel",
          "Panel",
          "Grid"
        ]
      },
      {
        "name": "SystemStatusGrid",
        "file": "SystemStatusGrid/SystemStatusGrid.tsx",
        "sourcePath": "@/features/panel-maintenance/components/SystemStatusGrid/SystemStatusGrid.tsx",
        "description": "Komponen Maintenance\\systemStatusGrid pada kategori panel.",
        "tags": [
          "Component",
          "panel",
          "Panel",
          "Grid",
          "Status"
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
        "name": "ProfileApps",
        "file": "ProfileApps/ProfileApps.tsx",
        "sourcePath": "@/app/(core)/panel/profile/_components/ProfileApps/ProfileApps.tsx",
        "description": "Komponen Profile\\profileApps pada kategori panel.",
        "tags": [
          "Component",
          "panel",
          "Panel",
          "Profile",
          "File"
        ]
      },
      {
        "name": "ProfileCard",
        "file": "ProfileCard/ProfileCard.tsx",
        "sourcePath": "@/app/(core)/panel/profile/_components/ProfileCard/ProfileCard.tsx",
        "description": "Komponen Profile\\profileCard pada kategori panel.",
        "tags": [
          "Component",
          "panel",
          "Card",
          "Panel",
          "Profile"
        ]
      }
    ]
  },
  {
    "name": "Roles",
    "file": "roles/",
    "description": "Folder Roles.",
    "tags": [
      "Folder"
    ],
    "children": [
      {
        "name": "RoleEditorModal",
        "file": "RoleEditorModal/RoleEditorModal.tsx",
        "sourcePath": "@/features/panel-roles/components/RoleEditorModal/RoleEditorModal.tsx",
        "description": "Komponen Roles\\roleEditorModal pada kategori panel.",
        "tags": [
          "Component",
          "panel",
          "Modal",
          "Panel",
          "Editor"
        ]
      },
      {
        "name": "RoleTable",
        "file": "RoleTable/RoleTable.tsx",
        "sourcePath": "@/features/panel-roles/components/RoleTable/RoleTable.tsx",
        "description": "Komponen Roles\\roleTable pada kategori panel.",
        "tags": [
          "Component",
          "panel",
          "Table",
          "Panel"
        ]
      }
    ]
  },
  {
    "name": "Users",
    "file": "users/",
    "description": "Folder Users.",
    "tags": [
      "Folder"
    ],
    "children": [
      {
        "name": "UserDetailModal",
        "file": "UserDetailModal/UserDetailModal.tsx",
        "sourcePath": "@/features/panel-users/components/UserDetailModal/UserDetailModal.tsx",
        "description": "Komponen Users\\userDetailModal pada kategori panel.",
        "tags": [
          "Component",
          "panel",
          "Modal",
          "Panel",
          "User"
        ]
      },
      {
        "name": "UserFilters",
        "file": "UserFilters/UserFilters.tsx",
        "sourcePath": "@/features/panel-users/components/UserFilters/UserFilters.tsx",
        "description": "Komponen Users\\userFilters pada kategori panel.",
        "tags": [
          "Component",
          "panel",
          "Panel",
          "User"
        ]
      },
      {
        "name": "UserMobileGrid",
        "file": "UserMobileGrid/UserMobileGrid.tsx",
        "sourcePath": "@/features/panel-users/components/UserMobileGrid/UserMobileGrid.tsx",
        "description": "Komponen Users\\userMobileGrid pada kategori panel.",
        "tags": [
          "Component",
          "panel",
          "Panel",
          "Grid",
          "User"
        ]
      },
      {
        "name": "UserTable",
        "file": "UserTable/UserTable.tsx",
        "sourcePath": "@/features/panel-users/components/UserTable/UserTable.tsx",
        "description": "Komponen Users\\userTable pada kategori panel.",
        "tags": [
          "Component",
          "panel",
          "Table",
          "Panel",
          "User"
        ]
      },
      {
        "name": "UserWhitelistModal",
        "file": "UserWhitelistModal/UserWhitelistModal.tsx",
        "sourcePath": "@/features/panel-users/components/UserWhitelistModal/UserWhitelistModal.tsx",
        "description": "Komponen Users\\userWhitelistModal pada kategori panel.",
        "tags": [
          "Component",
          "panel",
          "Modal",
          "Panel",
          "User"
        ]
      }
    ]
  }
];
