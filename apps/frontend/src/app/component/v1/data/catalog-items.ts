import type { MenuItem } from "../components/menu-list";

export const catalogItems: MenuItem[] = [
  {
    id: "odds",
    label: "ODDS",
    children: [
      {
        id: "odds-detail-task",
        label: "Detail Task",
        children: [
          { id: "odds-detail-task-header-title", label: "Title" },
          { id: "odds-detail-task-back-button", label: "Button Navigation" },
          { id: "odds-detail-task-header-section", label: "Header Section" },
          { id: "odds-detail-task-tab-section", label: "Tab Section" },
        ],
      },
    ],
  },
];
