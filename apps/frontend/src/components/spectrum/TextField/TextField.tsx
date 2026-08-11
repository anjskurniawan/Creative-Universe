"use client";

import { forwardRef } from "react";
import {
  TextField as SpectrumTextField,
  TextFieldContext,
  type TextFieldProps,
  type TextFieldRef,
} from "@react-spectrum/s2/TextField";

export { TextFieldContext };
export type { TextFieldProps, TextFieldRef };

export const TextField = forwardRef<TextFieldRef, TextFieldProps>(function TextField(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumTextField {...props} ref={ref} />
    </div>
  );
});
