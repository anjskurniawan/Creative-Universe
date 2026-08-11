"use client";

import { forwardRef, type ComponentRef } from "react";
import { Checkbox as SpectrumCheckbox, type CheckboxProps } from "@react-spectrum/s2/Checkbox";

export type { CheckboxProps };

export const Checkbox = forwardRef<ComponentRef<typeof SpectrumCheckbox>, CheckboxProps>(function Checkbox(props, ref) {
  return <div className="spectrum-component"><SpectrumCheckbox {...props} ref={ref} /></div>;
});

Checkbox.displayName = "Checkbox";
