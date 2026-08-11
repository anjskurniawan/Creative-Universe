"use client";

import { forwardRef, type ComponentRef } from "react";
import { ColorSlider as SpectrumColorSlider, type ColorSliderProps } from "@react-spectrum/s2/ColorSlider";

export type { ColorSliderProps };

export const ColorSlider = forwardRef<ComponentRef<typeof SpectrumColorSlider>, ColorSliderProps>(function ColorSlider(props, ref) {
  return <div className="spectrum-component"><SpectrumColorSlider {...props} ref={ref} /></div>;
});

ColorSlider.displayName = "ColorSlider";
