"use client";

import { forwardRef, type ComponentRef } from "react";
import { CheckboxGroup as SpectrumCheckboxGroup, type CheckboxGroupProps } from "@react-spectrum/s2/CheckboxGroup";

export type { CheckboxGroupProps };

export const CheckboxGroup = forwardRef<ComponentRef<typeof SpectrumCheckboxGroup>, CheckboxGroupProps>(function CheckboxGroup(props, ref) {
  return <div className="spectrum-component"><SpectrumCheckboxGroup {...props} ref={ref} /></div>;
});

CheckboxGroup.displayName = "CheckboxGroup";
