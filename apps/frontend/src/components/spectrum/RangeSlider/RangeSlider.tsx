"use client";

import { forwardRef, type ComponentRef } from "react";
import { RangeSlider as SpectrumRangeSlider, type RangeSliderProps } from "@react-spectrum/s2/RangeSlider";

export type { RangeSliderProps };

export const RangeSlider = forwardRef<ComponentRef<typeof SpectrumRangeSlider>, RangeSliderProps>(function RangeSlider(props, ref) {
  return <div className="spectrum-component"><SpectrumRangeSlider {...props} ref={ref} /></div>;
});

RangeSlider.displayName = "RangeSlider";
