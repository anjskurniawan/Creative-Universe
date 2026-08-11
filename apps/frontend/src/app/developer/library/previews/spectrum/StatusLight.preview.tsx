/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { StatusLight } from "@/components/spectrum/StatusLight";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumStatusLightPreview() {
  return <PreviewWrapper width="sm"><StatusLight {...({ "aria-label": "StatusLight preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
