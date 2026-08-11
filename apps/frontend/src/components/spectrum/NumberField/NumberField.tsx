"use client";

import { forwardRef, type ComponentRef, type ComponentProps } from "react";
import { NumberField as SpectrumNumberField } from "@react-spectrum/s2/NumberField";

export type NumberFieldProps = ComponentProps<typeof SpectrumNumberField>;

export const NumberField = forwardRef<ComponentRef<typeof SpectrumNumberField>, NumberFieldProps>(function NumberField(props, ref) {
  return <div className="spectrum-component"><SpectrumNumberField {...props} ref={ref} /></div>;
});

NumberField.displayName = "NumberField";
