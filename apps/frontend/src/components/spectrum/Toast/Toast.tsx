"use client";

import {
  ToastContainer as SpectrumToastContainer,
  ToastQueue,
  type ToastContainerProps,
  type ToastOptions,
} from "@react-spectrum/s2/Toast";

export { ToastQueue };
export type { ToastContainerProps, ToastOptions };

export function Toast(props: ToastContainerProps) {
  return (
    <div className="spectrum-component">
      <SpectrumToastContainer {...props} />
    </div>
  );
}

export const ToastContainer = Toast;
