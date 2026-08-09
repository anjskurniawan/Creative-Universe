"use client";

import { forwardRef, type ComponentRef } from "react";
import { ActionBar as SpectrumActionBar, type ActionBarProps } from "@react-spectrum/s2/ActionBar";
import { ActionButton } from "@react-spectrum/s2/ActionButton";

export { ActionButton };
export type { ActionBarProps };

type SpectrumActionBarRef = ComponentRef<typeof SpectrumActionBar>;

export const ActionBar = forwardRef<SpectrumActionBarRef, ActionBarProps>(function ActionBar(props, ref) {
  return <div className="spectrum-component"><SpectrumActionBar {...props} ref={ref} /></div>;
});
