"use client";

import { forwardRef, type ComponentRef } from "react";
import { SelectBoxGroup as SpectrumSelectBoxGroup, SelectBox, type SelectBoxGroupProps, type SelectBoxProps } from "@react-spectrum/s2/SelectBoxGroup";

export type { SelectBoxGroupProps };
export { SelectBox };
export type { SelectBoxProps };

export const SelectBoxGroup = forwardRef<ComponentRef<typeof SpectrumSelectBoxGroup>, SelectBoxGroupProps<object>>(function SelectBoxGroup(props, ref) {
  return <div className="spectrum-component"><SpectrumSelectBoxGroup {...props} ref={ref} /></div>;
});

SelectBoxGroup.displayName = "SelectBoxGroup";
