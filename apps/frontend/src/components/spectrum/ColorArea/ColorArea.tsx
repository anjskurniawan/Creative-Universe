"use client";

import { forwardRef, type ComponentRef } from "react";
import { ColorArea as SpectrumColorArea, type ColorAreaProps } from "@react-spectrum/s2/ColorArea";

export type { ColorAreaProps };

export const ColorArea = forwardRef<ComponentRef<typeof SpectrumColorArea>, ColorAreaProps>(function ColorArea(props, ref) {
  return <div className="spectrum-component"><SpectrumColorArea {...props} ref={ref} /></div>;
});

ColorArea.displayName = "ColorArea";
