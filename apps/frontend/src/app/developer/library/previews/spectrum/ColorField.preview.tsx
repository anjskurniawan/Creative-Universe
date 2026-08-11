/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ColorField } from "@/components/spectrum/ColorField";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumColorFieldPreview() {
  return <PreviewWrapper width="sm"><ColorField {...({ "aria-label": "ColorField preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
