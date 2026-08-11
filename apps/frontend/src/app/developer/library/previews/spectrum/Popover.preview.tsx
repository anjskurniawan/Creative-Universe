/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Popover } from "@/components/spectrum/Popover";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumPopoverPreview() {
  return <PreviewWrapper width="sm"><Popover {...({ "aria-label": "Popover preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
