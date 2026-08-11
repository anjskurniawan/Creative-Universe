"use client";

import { forwardRef, type ComponentRef } from "react";
import { Form as SpectrumForm, type FormProps } from "@react-spectrum/s2/Form";

export type { FormProps };

export const Form = forwardRef<ComponentRef<typeof SpectrumForm>, FormProps>(function Form(props, ref) {
  return <div className="spectrum-component"><SpectrumForm {...props} ref={ref} /></div>;
});

Form.displayName = "Form";
