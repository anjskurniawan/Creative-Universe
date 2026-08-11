"use client";

import { forwardRef, type ComponentRef } from "react";
import {
  SideNav as SpectrumSideNav,
  SideNavHeader,
  SideNavItem,
  SideNavItemContent,
  SideNavItemLink,
  SideNavSection,
  Text,
  type SideNavProps,
} from "@react-spectrum/s2/SideNav";

export { SideNavHeader, SideNavItem, SideNavItemContent, SideNavItemLink, SideNavSection, Text };
export type { SideNavProps };

type SpectrumSideNavRef = ComponentRef<typeof SpectrumSideNav>;

export const SideNav = forwardRef<SpectrumSideNavRef, SideNavProps<object>>(function SideNav(props, ref) {
  return (
    <div className="spectrum-component">
      <SpectrumSideNav {...props} ref={ref} />
    </div>
  );
});
