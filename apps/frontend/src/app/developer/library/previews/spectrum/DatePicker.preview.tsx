/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { DatePicker } from "@/components/spectrum/DatePicker";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumDatePickerPreview() {
  return <PreviewWrapper width="sm"><DatePicker {...({ "aria-label": "DatePicker preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
