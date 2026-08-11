/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ProgressBar } from "@/components/spectrum/ProgressBar";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumProgressBarPreview() {
  return <PreviewWrapper width="sm"><ProgressBar {...({ "aria-label": "ProgressBar preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
