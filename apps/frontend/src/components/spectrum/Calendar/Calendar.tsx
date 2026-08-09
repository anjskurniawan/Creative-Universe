"use client";

import { forwardRef, type ComponentRef } from "react";
import {
  Calendar as SpectrumCalendar,
  type CalendarProps,
  type DateValue,
} from "@react-spectrum/s2/Calendar";

export type { CalendarProps, DateValue };

type SpectrumCalendarRef = ComponentRef<typeof SpectrumCalendar>;

export const Calendar = forwardRef<SpectrumCalendarRef, CalendarProps<DateValue>>(function Calendar(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumCalendar {...props} ref={ref} />
    </div>
  );
});
