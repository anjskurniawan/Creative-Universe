"use client";

import { forwardRef, type ComponentRef } from "react";
import { Meter as SpectrumMeter, type MeterProps } from "@react-spectrum/s2/Meter";

export type { MeterProps };

export const Meter = forwardRef<ComponentRef<typeof SpectrumMeter>, MeterProps>(function Meter(props, ref) {
  return <div className="spectrum-component"><SpectrumMeter {...props} ref={ref} /></div>;
});

Meter.displayName = "Meter";
