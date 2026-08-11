"use client";

import { forwardRef, type ComponentRef } from "react";
import { Menu as SpectrumMenu, MenuItem, MenuSection, type MenuProps, type MenuItemProps, type MenuSectionProps } from "@react-spectrum/s2/Menu";

export type { MenuProps };
export { MenuItem, MenuSection };
export type { MenuItemProps, MenuSectionProps };

export const Menu = forwardRef<ComponentRef<typeof SpectrumMenu>, MenuProps<object>>(function Menu(props, ref) {
  return <div className="spectrum-component"><SpectrumMenu {...props} ref={ref} /></div>;
});

Menu.displayName = "Menu";
