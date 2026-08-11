"use client";

import { forwardRef, type ComponentRef } from "react";
import { Slider as SpectrumSlider, type SliderProps } from "@react-spectrum/s2/Slider";

export type { SliderProps };

export const Slider = forwardRef<ComponentRef<typeof SpectrumSlider>, SliderProps>(function Slider(props, ref) {
  return <div className="spectrum-component"><SpectrumSlider {...props} ref={ref} /></div>;
});

Slider.displayName = "Slider";
