"use client";

import { forwardRef, type ComponentRef } from "react";
import { ColorField as SpectrumColorField, type ColorFieldProps } from "@react-spectrum/s2/ColorField";

export type { ColorFieldProps };

export const ColorField = forwardRef<ComponentRef<typeof SpectrumColorField>, ColorFieldProps>(function ColorField(props, ref) {
  return <div className="spectrum-component"><SpectrumColorField {...props} ref={ref} /></div>;
});

ColorField.displayName = "ColorField";
