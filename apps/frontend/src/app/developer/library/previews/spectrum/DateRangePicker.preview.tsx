/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { DateRangePicker } from "@/components/spectrum/DateRangePicker";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumDateRangePickerPreview() {
  return <PreviewWrapper width="sm"><DateRangePicker {...({ "aria-label": "DateRangePicker preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
