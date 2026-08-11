/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Provider } from "@/components/spectrum/Provider";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumProviderPreview() {
  return <PreviewWrapper width="sm"><Provider {...({ "aria-label": "Provider preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
