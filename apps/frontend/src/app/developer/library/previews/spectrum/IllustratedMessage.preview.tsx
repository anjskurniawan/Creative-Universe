/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { IllustratedMessage } from "@/components/spectrum/IllustratedMessage";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumIllustratedMessagePreview() {
  return <PreviewWrapper width="sm"><IllustratedMessage {...({ "aria-label": "IllustratedMessage preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
