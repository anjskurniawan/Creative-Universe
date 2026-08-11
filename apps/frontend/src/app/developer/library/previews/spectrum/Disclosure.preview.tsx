/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Disclosure } from "@/components/spectrum/Disclosure";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumDisclosurePreview() {
  return <PreviewWrapper width="sm"><Disclosure {...({ "aria-label": "Disclosure preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
