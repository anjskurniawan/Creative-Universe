"use client";

import { forwardRef, type ComponentRef } from "react";
import { TreeView as SpectrumTreeView, TreeViewItem, type TreeViewProps, type TreeViewItemProps } from "@react-spectrum/s2/TreeView";

export type { TreeViewProps };
export { TreeViewItem };
export type { TreeViewItemProps };

export const TreeView = forwardRef<ComponentRef<typeof SpectrumTreeView>, TreeViewProps<object>>(function TreeView(props, ref) {
  return <div className="spectrum-component"><SpectrumTreeView {...props} ref={ref} /></div>;
});

TreeView.displayName = "TreeView";
