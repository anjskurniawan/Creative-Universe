import type { AttachmentItem } from "./Attachment.types";

export const DEFAULT_ATTACHMENT_CONFIG = {
  ariaLabel: "Tambah Lampiran atau Aksi",
  iconName: "Add" as const,
  recentItems: [
    { id: "recent-1", name: "Desain Banner Promosi.png", icon: "Image" as const },
    { id: "recent-2", name: "Dokumen Persyaratan.pdf", icon: "FileText" as const },
    { id: "recent-3", name: "Spreadsheet Keuangan.csv", icon: "Table" as const },
  ],
  projectItems: [
    { id: "proj-1", name: "Creative Studio App", icon: "Project" as const },
    { id: "proj-2", name: "Universe Design System", icon: "Project" as const },
    { id: "proj-3", name: "Brand Guidelines 2026", icon: "Project" as const },
  ],
  skillItems: [
    { id: "skill-1", name: "AI Visual Generator", icon: "VectorDraw" as const },
    { id: "skill-2", name: "Code Assistant Pro", icon: "Code" as const },
    { id: "skill-3", name: "Data Analysis Agent", icon: "ChartTrend" as const },
  ],
  connectorItems: [
    { id: "conn-1", name: "Google Drive", icon: "Cloud" as const },
    { id: "conn-2", name: "GitHub Repo", icon: "Code" as const },
    { id: "conn-3", name: "Adobe Creative Cloud", icon: "CCLibrary" as const },
  ],
} as const;
