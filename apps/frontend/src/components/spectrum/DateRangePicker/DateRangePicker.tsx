"use client";

import { forwardRef, type ComponentRef } from "react";
import { DateRangePicker as SpectrumDateRangePicker, type DateRangePickerProps, type DateValue } from "@react-spectrum/s2/DateRangePicker";

export type { DateRangePickerProps };

export const DateRangePicker = forwardRef<ComponentRef<typeof SpectrumDateRangePicker>, DateRangePickerProps<DateValue>>(function DateRangePicker(props, ref) {
  return <div className="spectrum-component"><SpectrumDateRangePicker {...props} ref={ref} /></div>;
});

DateRangePicker.displayName = "DateRangePicker";
