/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Checkbox } from "@/components/spectrum/Checkbox";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumCheckboxPreview() {
  return <PreviewWrapper width="sm"><Checkbox {...({ "aria-label": "Checkbox preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
