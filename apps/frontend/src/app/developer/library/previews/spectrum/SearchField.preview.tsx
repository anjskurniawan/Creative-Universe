/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { SearchField } from "@/components/spectrum/SearchField";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumSearchFieldPreview() {
  return <PreviewWrapper width="sm"><SearchField {...({ "aria-label": "SearchField preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
