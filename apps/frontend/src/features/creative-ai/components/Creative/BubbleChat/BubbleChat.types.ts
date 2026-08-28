import type { ReactNode } from "react";

export type BubbleChatSender = "user" | "ai" | "system";

export interface BubbleChatProps {
  /** Pengirim pesan: "user" | "ai" | "system" */
  sender?: BubbleChatSender;
  /** Konten teks atau komponen pesan */
  content?: ReactNode;
  /** Avatar pengirim user (opsional) */
  avatarUrl?: string;
  /** Callback tombol edit (khusus sender="user") */
  onEdit?: () => void;
  /** Callback tombol copy (khusus sender="user" / "ai") */
  onCopy?: () => void;
  /** Callback tombol share (khusus sender="ai") */
  onShare?: () => void;
  /** Callback tombol love/like (khusus sender="ai") */
  onLike?: () => void;
  /** Callback tombol dislike/need improvement (khusus sender="ai") */
  onDislike?: () => void;
  /** Callback tombol regenerate (khusus sender="ai") */
  onRegenerate?: () => void;
  /** Callback saat item di menu More dipilih (khusus sender="ai") */
  onMoreAction?: (actionKey: string) => void;
  /** Custom className tambahan */
  className?: string;
  /** Children sebagai alternatif atau pelengkap konten */
  children?: ReactNode;
}
