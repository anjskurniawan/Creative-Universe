"use client";

import { forwardRef, type ComponentRef } from "react";
import {
  ComboBox as SpectrumComboBox,
  ComboBoxItem,
  ComboBoxSection,
  Header,
  Heading,
  Text,
  type ComboBoxItemProps,
  type ComboBoxProps,
  type ComboBoxSectionProps,
} from "@react-spectrum/s2/ComboBox";

export { ComboBoxItem, ComboBoxSection, Header, Heading, Text };
export type { ComboBoxItemProps, ComboBoxProps, ComboBoxSectionProps };

type ComboBoxRef = ComponentRef<typeof SpectrumComboBox>;

export const ComboBox = forwardRef<ComboBoxRef, ComboBoxProps<object>>(function ComboBox(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumComboBox {...props} ref={ref} />
    </div>
  );
});
