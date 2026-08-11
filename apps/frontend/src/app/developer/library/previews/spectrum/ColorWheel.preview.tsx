/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ColorWheel } from "@/components/spectrum/ColorWheel";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumColorWheelPreview() {
  return <PreviewWrapper width="sm"><ColorWheel {...({ "aria-label": "ColorWheel preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
