"use client";

import { parseDate } from "@internationalized/date";
import { Calendar } from "@/components/spectrum/Calendar";
import { PreviewWrapper } from "../preview-wrapper";

export function SpectrumCalendarPreview() {
  return (
    <PreviewWrapper width="md">
      <Calendar aria-label="Tanggal pilihan" defaultValue={parseDate("2025-02-03")} />
    </PreviewWrapper>
  );
}
