/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ToggleButtonGroup } from "@/components/spectrum/ToggleButtonGroup";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumToggleButtonGroupPreview() {
  return <PreviewWrapper width="sm"><ToggleButtonGroup {...({ "aria-label": "ToggleButtonGroup preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
