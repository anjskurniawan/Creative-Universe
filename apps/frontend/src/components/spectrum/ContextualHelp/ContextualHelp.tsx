"use client";

import { forwardRef, type ComponentRef } from "react";
import { ContextualHelp as SpectrumContextualHelp, type ContextualHelpProps } from "@react-spectrum/s2/ContextualHelp";

export type { ContextualHelpProps };

export const ContextualHelp = forwardRef<ComponentRef<typeof SpectrumContextualHelp>, ContextualHelpProps>(function ContextualHelp(props, ref) {
  return <div className="spectrum-component"><SpectrumContextualHelp {...props} ref={ref} /></div>;
});

ContextualHelp.displayName = "ContextualHelp";
