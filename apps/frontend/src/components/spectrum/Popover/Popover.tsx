/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { forwardRef, type ComponentRef } from "react";
import { Popover as SpectrumPopover, type PopoverProps } from "@react-spectrum/s2/Popover";

export type { PopoverProps };

export const Popover = forwardRef<ComponentRef<typeof SpectrumPopover>, PopoverProps>(function Popover(props, ref) {
  return <div className="spectrum-component"><SpectrumPopover {...(props as any)} ref={ref} /></div>;
});

Popover.displayName = "Popover";
