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
        "file": "maintenance/console-output-panel.tsx",
        "description": "Komponen Maintenance\\consoleOutputPanel pada kategori panel.",
        "tags": [
          "Component",
          "panel",
          "Panel"
        ]
      },
      {
        "name": "EmergencyMaintenanceCard",
        "file": "maintenance/emergency-maintenance-card.tsx",
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
        "file": "maintenance/maintenance-actions-grid.tsx",
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
        "file": "maintenance/system-status-grid.tsx",
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
        "file": "profile/profile-apps.tsx",
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
        "file": "profile/profile-card.tsx",
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
        "file": "roles/role-editor-modal.tsx",
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
        "file": "roles/role-table.tsx",
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
        "file": "users/user-detail-modal.tsx",
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
        "file": "users/user-filters.tsx",
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
        "file": "users/user-mobile-grid.tsx",
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
        "file": "users/user-table.tsx",
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
        "file": "users/user-whitelist-modal.tsx",
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

