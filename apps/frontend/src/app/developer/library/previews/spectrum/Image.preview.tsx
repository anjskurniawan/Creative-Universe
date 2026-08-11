/* eslint-disable @typescript-eslint/no-explicit-any, jsx-a11y/alt-text */
"use client";
import { Image } from "@/components/spectrum/Image";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumImagePreview() {
  return <PreviewWrapper width="sm"><Image {...({ "aria-label": "Image preview", alt: "Preview image", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
