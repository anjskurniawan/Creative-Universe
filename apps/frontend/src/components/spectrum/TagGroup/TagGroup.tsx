"use client";

import { forwardRef, type ComponentRef } from "react";
import { TagGroup as SpectrumTagGroup, Tag, type TagGroupProps, type TagProps } from "@react-spectrum/s2/TagGroup";

export type { TagGroupProps };
export { Tag };
export type { TagProps };

export const TagGroup = forwardRef<ComponentRef<typeof SpectrumTagGroup>, TagGroupProps<object>>(function TagGroup(props, ref) {
  return <div className="spectrum-component"><SpectrumTagGroup {...props} ref={ref} /></div>;
});

TagGroup.displayName = "TagGroup";
