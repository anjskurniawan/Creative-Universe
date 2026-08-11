/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Menu } from "@/components/spectrum/Menu";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumMenuPreview() {
  return <PreviewWrapper width="sm"><Menu {...({ "aria-label": "Menu preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
