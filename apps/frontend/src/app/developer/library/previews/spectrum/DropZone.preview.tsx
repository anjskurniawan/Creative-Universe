/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { DropZone } from "@/components/spectrum/DropZone";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumDropZonePreview() {
  return <PreviewWrapper width="sm"><DropZone {...({ "aria-label": "DropZone preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
