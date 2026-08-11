"use client";

import { forwardRef, type ComponentRef } from "react";
import { SegmentedControl as SpectrumSegmentedControl, type SegmentedControlProps } from "@react-spectrum/s2/SegmentedControl";

export type { SegmentedControlProps };

export const SegmentedControl = forwardRef<ComponentRef<typeof SpectrumSegmentedControl>, SegmentedControlProps>(function SegmentedControl(props, ref) {
  return <div className="spectrum-component"><SpectrumSegmentedControl {...props} ref={ref} /></div>;
});

SegmentedControl.displayName = "SegmentedControl";
