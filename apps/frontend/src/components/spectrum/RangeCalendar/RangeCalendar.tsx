"use client";

import { forwardRef, type ComponentRef } from "react";
import { RangeCalendar as SpectrumRangeCalendar, type RangeCalendarProps, type DateValue } from "@react-spectrum/s2/RangeCalendar";

export type { RangeCalendarProps };

export const RangeCalendar = forwardRef<ComponentRef<typeof SpectrumRangeCalendar>, RangeCalendarProps<DateValue>>(function RangeCalendar(props, ref) {
  return <div className="spectrum-component"><SpectrumRangeCalendar {...props} ref={ref} /></div>;
});

RangeCalendar.displayName = "RangeCalendar";
