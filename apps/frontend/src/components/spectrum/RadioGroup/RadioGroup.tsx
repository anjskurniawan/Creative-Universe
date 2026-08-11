"use client";

import { forwardRef, type ComponentRef } from "react";
import { RadioGroup as SpectrumRadioGroup, type RadioGroupProps } from "@react-spectrum/s2/RadioGroup";

export type { RadioGroupProps };

export const RadioGroup = forwardRef<ComponentRef<typeof SpectrumRadioGroup>, RadioGroupProps>(function RadioGroup(props, ref) {
  return <div className="spectrum-component"><SpectrumRadioGroup {...props} ref={ref} /></div>;
});

RadioGroup.displayName = "RadioGroup";
