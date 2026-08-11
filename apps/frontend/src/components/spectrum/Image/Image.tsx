"use client";

import { forwardRef, type ComponentRef } from "react";
import { Image as SpectrumImage, type ImageProps } from "@react-spectrum/s2/Image";

export type { ImageProps };

export const Image = forwardRef<ComponentRef<typeof SpectrumImage>, ImageProps>(function Image(props, ref) {
  return <div className="spectrum-component"><SpectrumImage {...props} ref={ref} /></div>;
});

Image.displayName = "Image";
