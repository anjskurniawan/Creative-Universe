import type { IconSpectrumName } from "@/components/spectrum/IconSpectrum";

export interface AttachmentSubmenuItem {
  id: string;
  name: string;
  icon?: IconSpectrumName;
}

export interface AttachmentItem {
  id: string;
  name: string;
  icon?: IconSpectrumName;
  children?: AttachmentSubmenuItem[];
}

export interface AttachmentProps {
  onSelectAttachment?: (itemId: string) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}
