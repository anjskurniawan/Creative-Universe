"use client";

import { useEffect, useState } from "react";

export function ProtectedAssetPreview({ uploadId, fallbackUrl, alt }: { uploadId?: string; fallbackUrl: string; alt: string }) {
  const [src, setSrc] = useState(fallbackUrl);

  useEffect(() => {
    if (!uploadId) return;
    let objectUrl = "";
    void fetch(`/api/v1/odds/uploads/${uploadId}/content`, { credentials: "include", headers: { Accept: "image/*" } })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Thumbnail request failed: ${response.status}`);
        return response.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => undefined);
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [fallbackUrl, uploadId]);

  return <img src={src} alt={alt} className="h-full w-full object-cover" />;
}
