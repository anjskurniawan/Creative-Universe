/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { RadioGroup } from "@/components/spectrum/RadioGroup";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumRadioGroupPreview() {
  return <PreviewWrapper width="sm"><RadioGroup {...({ "aria-label": "RadioGroup preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
