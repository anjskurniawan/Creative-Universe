"use client";

import { forwardRef, type ComponentRef } from "react";
import { DropZone as SpectrumDropZone, type DropZoneProps } from "@react-spectrum/s2/DropZone";

export type { DropZoneProps };

export const DropZone = forwardRef<ComponentRef<typeof SpectrumDropZone>, DropZoneProps>(function DropZone(props, ref) {
  return <div className="spectrum-component"><SpectrumDropZone {...props} ref={ref} /></div>;
});

DropZone.displayName = "DropZone";
