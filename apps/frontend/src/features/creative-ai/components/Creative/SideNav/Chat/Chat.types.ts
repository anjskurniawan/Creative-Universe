import type { MenuItem } from "../Menu";

export interface ChatItem extends MenuItem {
  chatId?: string;
  timestamp?: string;
}

export interface ChatProps {
  items: ChatItem[];
  isExpanded?: boolean;
  isCollapsible?: boolean;
  isOpen?: boolean;
  onToggleOpen?: () => void;
  /** Callback saat tombol "Lihat Semua" diklik */
  onViewAll?: () => void;
  /** Link URL untuk halaman seluruh riwayat chat (default: "/creative-ai/history") */
  viewAllHref?: string;
  activeHref?: string;
  className?: string;
}
