"use client";

import { forwardRef, type ComponentRef } from "react";
import { Disclosure as SpectrumDisclosure, type DisclosureProps } from "@react-spectrum/s2/Disclosure";

export type { DisclosureProps };

export const Disclosure = forwardRef<ComponentRef<typeof SpectrumDisclosure>, DisclosureProps>(function Disclosure(props, ref) {
  return <div className="spectrum-component"><SpectrumDisclosure {...props} ref={ref} /></div>;
});

Disclosure.displayName = "Disclosure";
