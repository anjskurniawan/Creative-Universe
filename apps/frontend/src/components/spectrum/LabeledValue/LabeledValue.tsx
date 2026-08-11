/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { forwardRef } from "react";
import { LabeledValue as SpectrumLabeledValue, type LabeledValueProps } from "@react-spectrum/s2/LabeledValue";

export type { LabeledValueProps };

export const LabeledValue = forwardRef<any, any>(function LabeledValue(props, ref) {
  return <div className="spectrum-component"><SpectrumLabeledValue {...(props as any)} ref={ref} /></div>;
});

LabeledValue.displayName = "LabeledValue";
