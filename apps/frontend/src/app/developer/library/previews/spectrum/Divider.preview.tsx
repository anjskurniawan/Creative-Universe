/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Divider } from "@/components/spectrum/Divider";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumDividerPreview() {
  return <PreviewWrapper width="sm"><Divider {...({ "aria-label": "Divider preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
