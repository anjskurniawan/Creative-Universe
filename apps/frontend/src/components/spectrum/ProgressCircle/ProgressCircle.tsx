"use client";

import { forwardRef, type ComponentRef } from "react";
import { ProgressCircle as SpectrumProgressCircle, type ProgressCircleProps } from "@react-spectrum/s2/ProgressCircle";

export type { ProgressCircleProps };

export const ProgressCircle = forwardRef<ComponentRef<typeof SpectrumProgressCircle>, ProgressCircleProps>(function ProgressCircle(props, ref) {
  return <div className="spectrum-component"><SpectrumProgressCircle {...props} ref={ref} /></div>;
});

ProgressCircle.displayName = "ProgressCircle";
