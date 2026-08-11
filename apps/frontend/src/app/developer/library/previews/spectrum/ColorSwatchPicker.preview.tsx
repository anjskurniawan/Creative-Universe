/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ColorSwatchPicker } from "@/components/spectrum/ColorSwatchPicker";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumColorSwatchPickerPreview() {
  return <PreviewWrapper width="sm"><ColorSwatchPicker {...({ "aria-label": "ColorSwatchPicker preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
