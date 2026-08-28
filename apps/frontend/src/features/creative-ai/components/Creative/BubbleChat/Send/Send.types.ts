import type { ReactNode } from "react";

export interface SendBubbleProps {
  /** Isi pesan teks atau elemen child */
  content?: ReactNode;
  /** Avatar user (opsional) */
  avatarUrl?: string;
  /** Callback saat tombol edit ditekan */
  onEdit?: () => void;
  /** Callback saat tombol copy ditekan */
  onCopy?: () => void;
  /** Custom className tambahan */
  className?: string;
  /** Children sebagai alternatif konten */
  children?: ReactNode;
}
