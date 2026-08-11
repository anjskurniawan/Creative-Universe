"use client";

import { forwardRef, type ComponentRef } from "react";
import { ColorSwatch as SpectrumColorSwatch, type ColorSwatchProps } from "@react-spectrum/s2/ColorSwatch";

export type { ColorSwatchProps };

export const ColorSwatch = forwardRef<ComponentRef<typeof SpectrumColorSwatch>, ColorSwatchProps>(function ColorSwatch(props, ref) {
  return <div className="spectrum-component"><SpectrumColorSwatch {...props} ref={ref} /></div>;
});

ColorSwatch.displayName = "ColorSwatch";
