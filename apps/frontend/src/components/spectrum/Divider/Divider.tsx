"use client";

import { forwardRef, type ComponentRef } from "react";
import { Divider as SpectrumDivider, type DividerProps } from "@react-spectrum/s2/Divider";

export type { DividerProps };

export const Divider = forwardRef<ComponentRef<typeof SpectrumDivider>, DividerProps>(function Divider(props, ref) {
  return <div className="spectrum-component"><SpectrumDivider {...props} ref={ref} /></div>;
});

Divider.displayName = "Divider";
