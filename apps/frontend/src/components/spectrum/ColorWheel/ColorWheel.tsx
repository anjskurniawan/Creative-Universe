"use client";

import { forwardRef, type ComponentRef } from "react";
import { ColorWheel as SpectrumColorWheel, type ColorWheelProps } from "@react-spectrum/s2/ColorWheel";

export type { ColorWheelProps };

export const ColorWheel = forwardRef<ComponentRef<typeof SpectrumColorWheel>, ColorWheelProps>(function ColorWheel(props, ref) {
  return <div className="spectrum-component"><SpectrumColorWheel {...props} ref={ref} /></div>;
});

ColorWheel.displayName = "ColorWheel";
