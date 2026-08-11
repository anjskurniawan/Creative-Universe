"use client";

import { forwardRef, type ComponentRef } from "react";
import { Tooltip as SpectrumTooltip, type TooltipProps } from "@react-spectrum/s2/Tooltip";

export type { TooltipProps };

export const Tooltip = forwardRef<ComponentRef<typeof SpectrumTooltip>, TooltipProps>(function Tooltip(props, ref) {
  return <div className="spectrum-component"><SpectrumTooltip {...props} ref={ref} /></div>;
});

Tooltip.displayName = "Tooltip";
