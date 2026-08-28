import type { ReactNode } from "react";

export interface ReceiveBubbleProps {
  /** Isi respons teks markdown atau elemen child balasan AI */
  content?: ReactNode;
  /** Callback tombol Copy Respond */
  onCopy?: () => void;
  /** Callback tombol Buat Link Berbagi */
  onShare?: () => void;
  /** Callback tombol Love this / Suka */
  onLike?: () => void;
  /** Callback tombol Need Improvement / Tidak Suka */
  onDislike?: () => void;
  /** Callback tombol Regenerate / Buat Ulang */
  onRegenerate?: () => void;
  /** Callback saat aksi di menu More dipilih */
  onMoreAction?: (actionKey: string) => void;
  /** Custom className tambahan */
  className?: string;
  /** Children sebagai alternatif konten */
  children?: ReactNode;
}
