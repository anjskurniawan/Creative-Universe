"use client";

import { forwardRef } from "react";
import { TextArea as SpectrumTextArea, type TextAreaProps as SpectrumTextAreaProps, type TextFieldRef } from "@react-spectrum/s2/TextArea";
export type TextAreaProps = SpectrumTextAreaProps;
export type TextAreaRef = TextFieldRef<HTMLTextAreaElement>;

export const TextArea = forwardRef<TextAreaRef, TextAreaProps>(function TextArea(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumTextArea {...props} ref={ref} />
    </div>
  );
});
