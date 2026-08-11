"use client";

import { forwardRef, type ComponentRef } from "react";
import { CardView as SpectrumCardView, type CardViewProps } from "@react-spectrum/s2/CardView";

export type { CardViewProps };

export const CardView = forwardRef<ComponentRef<typeof SpectrumCardView>, CardViewProps<object>>(function CardView(props, ref) {
  return <div className="spectrum-component"><SpectrumCardView {...props} ref={ref} /></div>;
});

CardView.displayName = "CardView";
