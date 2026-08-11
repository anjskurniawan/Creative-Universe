"use client";

import { forwardRef, type ComponentRef } from "react";
import { Tabs as SpectrumTabs, TabList, Tab, TabPanel, type TabsProps, type TabListProps, type TabProps, type TabPanelProps } from "@react-spectrum/s2/Tabs";

export type { TabsProps };
export { TabList, Tab, TabPanel };
export type { TabListProps, TabProps, TabPanelProps };

export const Tabs = forwardRef<ComponentRef<typeof SpectrumTabs>, TabsProps>(function Tabs(props, ref) {
  return <div className="spectrum-component"><SpectrumTabs {...props} ref={ref} /></div>;
});

Tabs.displayName = "Tabs";
