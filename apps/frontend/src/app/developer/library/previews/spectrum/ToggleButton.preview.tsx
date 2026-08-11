/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ToggleButton } from "@/components/spectrum/ToggleButton";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumToggleButtonPreview() {
  return <PreviewWrapper width="sm"><ToggleButton {...({ "aria-label": "ToggleButton preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
