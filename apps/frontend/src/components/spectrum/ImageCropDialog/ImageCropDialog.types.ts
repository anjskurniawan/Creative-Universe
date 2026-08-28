export type ImageCropKind = "avatar" | "banner";

export type ImageCropDialogProps = {
  source: string;
  kind: ImageCropKind;
  onCancel: () => void;
  onComplete: (file: File, previewUrl: string) => void;
};
