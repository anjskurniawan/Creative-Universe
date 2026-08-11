/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { SegmentedControl } from "@/components/spectrum/SegmentedControl";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumSegmentedControlPreview() {
  return <PreviewWrapper width="sm"><SegmentedControl {...({ "aria-label": "SegmentedControl preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
