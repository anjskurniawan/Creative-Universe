import React from "react";

export interface EditMemberMediaPreviewProps {
  photo: string | null;
  photoIsVideo: boolean;
  name: string;
}

export function EditMemberMediaPreview({
  photo,
  photoIsVideo,
  name,
}: EditMemberMediaPreviewProps) {
  return (
    <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-[#edf0f2] bg-white text-2xl text-[#3b4446] shadow-sm">
      {photo ? (
        photoIsVideo ? (
          <video
            src={photo}
            muted
            playsInline
            controls
            className="size-full object-contain"
          />
        ) : (
          <img
            src={photo}
            alt="Preview"
            className="size-full object-contain"
          />
        )
      ) : (
        name.slice(0, 2)
      )}
    </div>
  );
}
