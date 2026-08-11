/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { SelectBoxGroup } from "@/components/spectrum/SelectBoxGroup";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumSelectBoxGroupPreview() {
  return <PreviewWrapper width="sm"><SelectBoxGroup {...({ "aria-label": "SelectBoxGroup preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
