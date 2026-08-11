"use client";

import { forwardRef, type ComponentRef } from "react";
import { TableView as SpectrumTableView, TableHeader, TableBody, Column, Row, Cell, type TableViewProps, type TableHeaderProps, type TableBodyProps, type ColumnProps, type RowProps, type CellProps } from "@react-spectrum/s2/TableView";

export type { TableViewProps };
export { TableHeader, TableBody, Column, Row, Cell };
export type { TableHeaderProps, TableBodyProps, ColumnProps, RowProps, CellProps };

export const TableView = forwardRef<ComponentRef<typeof SpectrumTableView>, TableViewProps>(function TableView(props, ref) {
  return <div className="spectrum-component"><SpectrumTableView {...props} ref={ref} /></div>;
});

TableView.displayName = "TableView";
