/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Tooltip } from "@/components/spectrum/Tooltip";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumTooltipPreview() {
  return <PreviewWrapper width="sm"><Tooltip {...({ "aria-label": "Tooltip preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
