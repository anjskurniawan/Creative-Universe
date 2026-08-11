/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Picker } from "@/components/spectrum/Picker";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumPickerPreview() {
  return <PreviewWrapper width="sm"><Picker {...({ "aria-label": "Picker preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
