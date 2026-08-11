/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { TimeField } from "@/components/spectrum/TimeField";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumTimeFieldPreview() {
  return <PreviewWrapper width="sm"><TimeField {...({ "aria-label": "TimeField preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
