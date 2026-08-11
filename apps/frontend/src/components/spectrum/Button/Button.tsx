"use client";

import { forwardRef, type ComponentRef } from "react";
import {
  Button as SpectrumButton,
  Text,
  type ButtonProps,
  type PressEvent,
} from "@react-spectrum/s2/Button";

export type { ButtonProps, PressEvent };
export { Text };

type SpectrumButtonRef = ComponentRef<typeof SpectrumButton>;

export const Button = forwardRef<SpectrumButtonRef, ButtonProps>(function Button(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumButton {...props} ref={ref} />
    </div>
  );
});
