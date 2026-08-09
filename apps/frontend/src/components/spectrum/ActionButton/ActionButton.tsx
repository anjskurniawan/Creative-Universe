"use client";

import { forwardRef, type ComponentRef } from "react";
import {
  ActionButton as SpectrumActionButton,
  type ActionButtonProps,
  type PressEvent,
} from "@react-spectrum/s2/ActionButton";

export type { ActionButtonProps, PressEvent };

type SpectrumActionButtonRef = ComponentRef<typeof SpectrumActionButton>;

export const ActionButton = forwardRef<SpectrumActionButtonRef, ActionButtonProps>(function ActionButton(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumActionButton {...props} ref={ref} />
    </div>
  );
});
