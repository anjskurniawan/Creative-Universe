"use client";

import { forwardRef, type ComponentRef } from "react";
import { ProgressBar as SpectrumProgressBar, type ProgressBarProps } from "@react-spectrum/s2/ProgressBar";

export type { ProgressBarProps };

export const ProgressBar = forwardRef<ComponentRef<typeof SpectrumProgressBar>, ProgressBarProps>(function ProgressBar(props, ref) {
  return <div className="spectrum-component"><SpectrumProgressBar {...props} ref={ref} /></div>;
});

ProgressBar.displayName = "ProgressBar";
