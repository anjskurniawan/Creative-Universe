/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ColorArea } from "@/components/spectrum/ColorArea";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumColorAreaPreview() {
  return <PreviewWrapper width="sm"><ColorArea {...({ "aria-label": "ColorArea preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
