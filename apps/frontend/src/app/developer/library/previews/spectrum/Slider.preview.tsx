/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Slider } from "@/components/spectrum/Slider";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumSliderPreview() {
  return <PreviewWrapper width="sm"><Slider {...({ "aria-label": "Slider preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
