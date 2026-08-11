"use client";

import { forwardRef, type ComponentRef } from "react";
import { ListView as SpectrumListView, ListViewItem, type ListViewProps, type ListViewItemProps } from "@react-spectrum/s2/ListView";

export type { ListViewProps };
export { ListViewItem };
export type { ListViewItemProps };

export const ListView = forwardRef<ComponentRef<typeof SpectrumListView>, ListViewProps<object>>(function ListView(props, ref) {
  return <div className="spectrum-component"><SpectrumListView {...props} ref={ref} /></div>;
});

ListView.displayName = "ListView";
