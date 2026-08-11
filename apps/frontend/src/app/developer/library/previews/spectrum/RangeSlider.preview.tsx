/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { RangeSlider } from "@/components/spectrum/RangeSlider";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumRangeSliderPreview() {
  return <PreviewWrapper width="sm"><RangeSlider {...({ "aria-label": "RangeSlider preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
