"use client";

import { forwardRef, type ComponentRef } from "react";
import { Picker as SpectrumPicker, PickerItem, PickerSection, type PickerProps, type PickerItemProps, type PickerSectionProps } from "@react-spectrum/s2/Picker";

export type { PickerProps };
export { PickerItem, PickerSection };
export type { PickerItemProps, PickerSectionProps };

export const Picker = forwardRef<ComponentRef<typeof SpectrumPicker>, PickerProps<object, 'single'>>(function Picker(props, ref) {
  return <div className="spectrum-component"><SpectrumPicker {...props} ref={ref} /></div>;
});

Picker.displayName = "Picker";
