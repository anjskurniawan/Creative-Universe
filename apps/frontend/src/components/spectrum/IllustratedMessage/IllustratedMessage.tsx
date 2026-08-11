"use client";

import { forwardRef, type ComponentRef, type ComponentProps } from "react";
import { IllustratedMessage as SpectrumIllustratedMessage } from "@react-spectrum/s2/IllustratedMessage";

export type IllustratedMessageProps = ComponentProps<typeof SpectrumIllustratedMessage>;

export const IllustratedMessage = forwardRef<ComponentRef<typeof SpectrumIllustratedMessage>, IllustratedMessageProps>(function IllustratedMessage(props, ref) {
  return <div className="spectrum-component"><SpectrumIllustratedMessage {...props} ref={ref} /></div>;
});

IllustratedMessage.displayName = "IllustratedMessage";
