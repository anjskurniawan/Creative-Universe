"use client";

import { forwardRef, type ComponentRef } from "react";
import { Switch as SpectrumSwitch, type SwitchProps } from "@react-spectrum/s2/Switch";

export type { SwitchProps };

export const Switch = forwardRef<ComponentRef<typeof SpectrumSwitch>, SwitchProps>(function Switch(props, ref) {
  return <div className="spectrum-component"><SpectrumSwitch {...props} ref={ref} /></div>;
});

Switch.displayName = "Switch";
