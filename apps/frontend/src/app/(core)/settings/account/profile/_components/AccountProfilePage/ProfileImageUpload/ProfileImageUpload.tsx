"use client";

import { useEffect, useRef, useState } from "react";
import { ImageCropDialog } from "@/components/spectrum/ImageCropDialog/ImageCropDialog";
import type { ProfileImageUploadProps } from "./ProfileImageUpload.types";

export function ProfileImageUpload({ kind, triggerRef, onCropped }: ProfileImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    triggerRef.current = () => inputRef.current?.click();
    return () => {
      triggerRef.current = null;
    };
  }, [triggerRef]);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) setSource(URL.createObjectURL(file));
          event.currentTarget.value = "";
        }}
      />
      {source && (
        <ImageCropDialog
          source={source}
          kind={kind}
          onCancel={() => setSource(null)}
          onComplete={(file, previewUrl) => {
            onCropped(file, previewUrl);
            setSource(null);
          }}
        />
      )}
    </>
  );
}
