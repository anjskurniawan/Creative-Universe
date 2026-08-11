"use client";

import { forwardRef, type ComponentRef } from "react";
import { DatePicker as SpectrumDatePicker, type DatePickerProps, type DateValue } from "@react-spectrum/s2/DatePicker";

export type { DatePickerProps };

export const DatePicker = forwardRef<ComponentRef<typeof SpectrumDatePicker>, DatePickerProps<DateValue>>(function DatePicker(props, ref) {
  return <div className="spectrum-component"><SpectrumDatePicker {...props} ref={ref} /></div>;
});

DatePicker.displayName = "DatePicker";
