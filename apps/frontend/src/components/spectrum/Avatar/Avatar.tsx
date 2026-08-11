"use client";

import { forwardRef, type ComponentRef } from "react";
import {
  Avatar as SpectrumAvatar,
  type AvatarProps,
} from "@react-spectrum/s2/Avatar";

export type { AvatarProps };

type SpectrumAvatarRef = ComponentRef<typeof SpectrumAvatar>;

export const Avatar = forwardRef<SpectrumAvatarRef, AvatarProps>(function Avatar(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumAvatar {...props} ref={ref} />
    </div>
  );
});
