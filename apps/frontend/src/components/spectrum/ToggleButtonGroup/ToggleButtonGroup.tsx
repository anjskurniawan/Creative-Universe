"use client";

import { forwardRef, type ComponentRef } from "react";
import { ToggleButtonGroup as SpectrumToggleButtonGroup, type ToggleButtonGroupProps } from "@react-spectrum/s2/ToggleButtonGroup";

export type { ToggleButtonGroupProps };

export const ToggleButtonGroup = forwardRef<ComponentRef<typeof SpectrumToggleButtonGroup>, ToggleButtonGroupProps>(function ToggleButtonGroup(props, ref) {
  return <div className="spectrum-component"><SpectrumToggleButtonGroup {...props} ref={ref} /></div>;
});

ToggleButtonGroup.displayName = "ToggleButtonGroup";
