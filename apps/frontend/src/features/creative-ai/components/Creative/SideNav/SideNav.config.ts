import type { ProjectItem } from "./Project";
import type { ChatItem } from "./Chat";

export const projectItems: ProjectItem[] = [
  {
    id: "proj-1",
    label: "Marketing Campaign Q3",
    icon: "Folder",
    href: "/creative-ai/projects/1",
    subItems: [
      {
        id: "sub-1-1",
        label: "Visual Assets & Banners",
        href: "/creative-ai/projects/1/assets",
      },
      {
        id: "sub-1-2",
        label: "Copywriting & Prompts",
        href: "/creative-ai/projects/1/copy",
      },
    ],
  },
  {
    id: "proj-2",
    label: "Brand Guidelines Visual",
    icon: "Folder",
    href: "/creative-ai/projects/2",
    subItems: [
      {
        id: "sub-2-1",
        label: "Color Palette & Tokens",
        href: "/creative-ai/projects/2/colors",
      },
      {
        id: "sub-2-2",
        label: "Typography & Sizing",
        href: "/creative-ai/projects/2/typography",
      },
    ],
  },
];

export const historyItems: ChatItem[] = [
  {
    id: "chat-1",
    label: "Ide kampanye sosial media",
    icon: "Chat",
    href: "/creative-ai/chat/1",
  },
  {
    id: "chat-2",
    label: "Generate prompt landscape 3D",
    icon: "Chat",
    href: "/creative-ai/chat/2",
  },
  {
    id: "chat-3",
    label: "Analisis tren visual 2026",
    icon: "Chat",
    href: "/creative-ai/chat/3",
  },
];
