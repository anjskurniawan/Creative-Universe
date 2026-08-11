/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Meter } from "@/components/spectrum/Meter";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumMeterPreview() {
  return <PreviewWrapper width="sm"><Meter {...({ "aria-label": "Meter preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
