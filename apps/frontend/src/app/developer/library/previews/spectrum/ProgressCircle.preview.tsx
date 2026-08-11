/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ProgressCircle } from "@/components/spectrum/ProgressCircle";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumProgressCirclePreview() {
  return <PreviewWrapper width="sm"><ProgressCircle {...({ "aria-label": "ProgressCircle preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
