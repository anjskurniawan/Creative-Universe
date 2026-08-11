"use client";

import { forwardRef, type ComponentRef } from "react";
import { Link as SpectrumLink, type LinkProps } from "@react-spectrum/s2/Link";

export type { LinkProps };

export const Link = forwardRef<ComponentRef<typeof SpectrumLink>, LinkProps>(function Link(props, ref) {
  return <div className="spectrum-component"><SpectrumLink {...props} ref={ref} /></div>;
});

Link.displayName = "Link";
