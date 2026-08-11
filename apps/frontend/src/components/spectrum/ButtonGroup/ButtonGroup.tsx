"use client";

import { forwardRef, type ComponentRef } from "react";
import { ButtonGroup as SpectrumButtonGroup, type ButtonGroupProps } from "@react-spectrum/s2/ButtonGroup";

export type { ButtonGroupProps };

export const ButtonGroup = forwardRef<ComponentRef<typeof SpectrumButtonGroup>, ButtonGroupProps>(function ButtonGroup(props, ref) {
  return <div className="spectrum-component"><SpectrumButtonGroup {...props} ref={ref} /></div>;
});

ButtonGroup.displayName = "ButtonGroup";
