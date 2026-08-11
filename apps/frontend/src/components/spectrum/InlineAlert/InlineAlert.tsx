"use client";

import { forwardRef, type ComponentRef } from "react";
import {
  Content as SpectrumContent,
  Heading as SpectrumHeading,
  InlineAlert as SpectrumInlineAlert,
  type InlineAlertProps,
} from "@react-spectrum/s2/InlineAlert";

export { SpectrumContent as Content, SpectrumHeading as Heading };
export type { InlineAlertProps };

type InlineAlertRef = ComponentRef<typeof SpectrumInlineAlert>;

export const InlineAlert = forwardRef<InlineAlertRef, InlineAlertProps>(function InlineAlert(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumInlineAlert {...props} ref={ref} />
    </div>
  );
});
