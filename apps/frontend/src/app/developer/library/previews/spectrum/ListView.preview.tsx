/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ListView } from "@/components/spectrum/ListView";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumListViewPreview() {
  return <PreviewWrapper width="sm"><ListView {...({ "aria-label": "ListView preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
