"use client";

import { forwardRef, type ComponentRef } from "react";
import { ColorSwatchPicker as SpectrumColorSwatchPicker, type ColorSwatchPickerProps } from "@react-spectrum/s2/ColorSwatchPicker";

export type { ColorSwatchPickerProps };

export const ColorSwatchPicker = forwardRef<ComponentRef<typeof SpectrumColorSwatchPicker>, ColorSwatchPickerProps>(function ColorSwatchPicker(props, ref) {
  return <div className="spectrum-component"><SpectrumColorSwatchPicker {...props} ref={ref} /></div>;
});

ColorSwatchPicker.displayName = "ColorSwatchPicker";
