"use client";

import { forwardRef, type ComponentRef } from "react";
import { Dialog as SpectrumDialog, type DialogProps } from "@react-spectrum/s2/Dialog";

export type { DialogProps };

export const Dialog = forwardRef<ComponentRef<typeof SpectrumDialog>, DialogProps>(function Dialog(props, ref) {
  return <div className="spectrum-component"><SpectrumDialog {...props} ref={ref} /></div>;
});

Dialog.displayName = "Dialog";
