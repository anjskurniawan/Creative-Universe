import type { MutableRefObject } from "react";
import type { ImageCropKind } from "@/components/spectrum/ImageCropDialog/ImageCropDialog.types";

export type ProfileImageUploadProps = {
  kind: ImageCropKind;
  triggerRef: MutableRefObject<(() => void) | null>;
  onCropped: (file: File, previewUrl: string) => void;
};
