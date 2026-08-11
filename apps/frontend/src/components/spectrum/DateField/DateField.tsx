"use client";

import { forwardRef, type ComponentRef } from "react";
import { DateField as SpectrumDateField, type DateFieldProps, type DateValue } from "@react-spectrum/s2/DateField";

export type { DateFieldProps };

export const DateField = forwardRef<ComponentRef<typeof SpectrumDateField>, DateFieldProps<DateValue>>(function DateField(props, ref) {
  return <div className="spectrum-component"><SpectrumDateField {...props} ref={ref} /></div>;
});

DateField.displayName = "DateField";
