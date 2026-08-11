/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { RangeCalendar } from "@/components/spectrum/RangeCalendar";
import { PreviewWrapper } from "../preview-wrapper";
export function SpectrumRangeCalendarPreview() {
  return <PreviewWrapper width="sm"><RangeCalendar {...({ "aria-label": "RangeCalendar preview", children: "Preview", channel: "hue", isLoading: false } as any)} /></PreviewWrapper>;
}
