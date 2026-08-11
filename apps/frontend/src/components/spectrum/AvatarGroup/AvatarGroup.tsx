"use client";

import { forwardRef, type ComponentRef } from "react";
import {
  Avatar as SpectrumAvatar,
  AvatarGroup as SpectrumAvatarGroup,
  type AvatarGroupProps,
  type AvatarProps,
} from "@react-spectrum/s2/AvatarGroup";

export { SpectrumAvatar as Avatar };
export type { AvatarGroupProps, AvatarProps };

type SpectrumAvatarGroupRef = ComponentRef<typeof SpectrumAvatarGroup>;

export const AvatarGroup = forwardRef<SpectrumAvatarGroupRef, AvatarGroupProps>(function AvatarGroup(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumAvatarGroup {...props} ref={ref} />
    </div>
  );
});
