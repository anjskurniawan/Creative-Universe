"use client";

import { forwardRef, type ComponentRef } from "react";
import { TimeField as SpectrumTimeField, type TimeFieldProps, type TimeValue } from "@react-spectrum/s2/TimeField";

export type { TimeFieldProps };

export const TimeField = forwardRef<ComponentRef<typeof SpectrumTimeField>, TimeFieldProps<TimeValue>>(function TimeField(props, ref) {
  return <div className="spectrum-component"><SpectrumTimeField {...props} ref={ref} /></div>;
});

TimeField.displayName = "TimeField";
