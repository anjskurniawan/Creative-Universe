"use client";

import { forwardRef, type ComponentRef } from "react";
import {
  ActionMenu as SpectrumActionMenu,
  Keyboard,
  MenuItem,
  Text,
  type ActionMenuProps,
} from "@react-spectrum/s2/ActionMenu";

export { Keyboard, MenuItem, Text };
export type { ActionMenuProps };

type SpectrumActionMenuRef = ComponentRef<typeof SpectrumActionMenu>;

export const ActionMenu = forwardRef<SpectrumActionMenuRef, ActionMenuProps<object>>(
  function ActionMenu(props, ref) {
    return (
      <div className="spectrum-component">
        <SpectrumActionMenu {...props} ref={ref} />
      </div>
    );
  },
);
