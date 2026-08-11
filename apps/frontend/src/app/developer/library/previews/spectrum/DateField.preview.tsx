/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { DateField } from "@/components/spectrum/DateField";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumDateFieldPreview() {
  return <PreviewWrapper width="sm"><DateField {...({ "aria-label": "DateField preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
