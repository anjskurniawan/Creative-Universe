"use client";

import { forwardRef, type ComponentRef } from "react";
import { Badge as SpectrumBadge, type BadgeProps } from "@react-spectrum/s2/Badge";

export type { BadgeProps };

type SpectrumBadgeRef = ComponentRef<typeof SpectrumBadge>;

export const Badge = forwardRef<SpectrumBadgeRef, BadgeProps>(function Badge(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumBadge {...props} ref={ref} />
    </div>
  );
});
