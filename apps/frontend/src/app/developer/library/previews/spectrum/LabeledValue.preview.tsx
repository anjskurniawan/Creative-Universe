/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { LabeledValue } from "@/components/spectrum/LabeledValue";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumLabeledValuePreview() {
  return <PreviewWrapper width="sm"><LabeledValue {...({ "aria-label": "LabeledValue preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
