/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ColorSlider } from "@/components/spectrum/ColorSlider";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumColorSliderPreview() {
  return <PreviewWrapper width="sm"><ColorSlider {...({ "aria-label": "ColorSlider preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
