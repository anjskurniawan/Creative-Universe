/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { TagGroup } from "@/components/spectrum/TagGroup";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumTagGroupPreview() {
  return <PreviewWrapper width="sm"><TagGroup {...({ "aria-label": "TagGroup preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
