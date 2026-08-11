/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ColorSwatch } from "@/components/spectrum/ColorSwatch";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumColorSwatchPreview() {
  return <PreviewWrapper width="sm"><ColorSwatch {...({ "aria-label": "ColorSwatch preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
