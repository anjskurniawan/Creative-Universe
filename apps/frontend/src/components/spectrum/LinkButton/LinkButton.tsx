"use client";

import { forwardRef, type ComponentRef } from "react";
import { LinkButton as SpectrumLinkButton, type LinkButtonProps as SpectrumLinkButtonProps } from "@react-spectrum/s2/LinkButton";

export type LinkButtonProps = SpectrumLinkButtonProps;

type LinkButtonRef = ComponentRef<typeof SpectrumLinkButton>;

export const LinkButton = forwardRef<LinkButtonRef, LinkButtonProps>(function LinkButton(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumLinkButton {...props} ref={ref} />
    </div>
  );
});
