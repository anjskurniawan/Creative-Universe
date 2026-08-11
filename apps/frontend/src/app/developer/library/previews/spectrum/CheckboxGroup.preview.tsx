/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CheckboxGroup } from "@/components/spectrum/CheckboxGroup";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumCheckboxGroupPreview() {
  return <PreviewWrapper width="sm"><CheckboxGroup {...({ "aria-label": "CheckboxGroup preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
