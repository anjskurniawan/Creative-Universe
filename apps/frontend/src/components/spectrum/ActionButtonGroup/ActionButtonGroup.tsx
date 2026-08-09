"use client";

import { forwardRef, type ComponentRef } from "react";
import {
  ActionButtonGroup as SpectrumActionButtonGroup,
  ActionButton,
  Text,
  type ActionButtonGroupProps,
} from "@react-spectrum/s2/ActionButtonGroup";

export { ActionButton, Text };
export type { ActionButtonGroupProps };

type SpectrumActionButtonGroupRef = ComponentRef<typeof SpectrumActionButtonGroup>;

export const ActionButtonGroup = forwardRef<SpectrumActionButtonGroupRef, ActionButtonGroupProps>(
  function ActionButtonGroup(props, ref) {
    return (
      <div className="spectrum-component">
        <SpectrumActionButtonGroup {...props} ref={ref} />
      </div>
    );
  },
);
