"use client";

import { forwardRef, type ComponentRef } from "react";
import { ToggleButton as SpectrumToggleButton, type ToggleButtonProps } from "@react-spectrum/s2/ToggleButton";

export type { ToggleButtonProps };

export const ToggleButton = forwardRef<ComponentRef<typeof SpectrumToggleButton>, ToggleButtonProps>(function ToggleButton(props, ref) {
  return <div className="spectrum-component"><SpectrumToggleButton {...props} ref={ref} /></div>;
});

ToggleButton.displayName = "ToggleButton";
