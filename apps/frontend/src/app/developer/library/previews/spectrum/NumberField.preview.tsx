/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { NumberField } from "@/components/spectrum/NumberField";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumNumberFieldPreview() {
  return <PreviewWrapper width="sm"><NumberField {...({ "aria-label": "NumberField preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
