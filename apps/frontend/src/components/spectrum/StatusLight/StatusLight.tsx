"use client";

import { forwardRef, type ComponentRef } from "react";
import { StatusLight as SpectrumStatusLight, type StatusLightProps } from "@react-spectrum/s2/StatusLight";

export type { StatusLightProps };

export const StatusLight = forwardRef<ComponentRef<typeof SpectrumStatusLight>, StatusLightProps>(function StatusLight(props, ref) {
  return <div className="spectrum-component"><SpectrumStatusLight {...props} ref={ref} /></div>;
});

StatusLight.displayName = "StatusLight";
