import React from "react";

export interface Column<T> {
  header: React.ReactNode;
  render: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string | number;
  emptyState?: React.ReactNode;
  className?: string;
  tableClassName?: string;
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  emptyState,
  className = "",
  tableClassName = "",
}: TableProps<T>) {
  return (
    <div className={`overflow-x-auto w-full ${className}`}>
      <table className={`w-full border-collapse text-left text-xs ${tableClassName}`}>
        <thead>
          <tr className="bg-[#f7f5ff] text-[12px] font-semibold text-[#3b4446]">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`border-b border-r border-[#ded7fb] last:border-r-0 px-3 py-4 ${col.headerClassName || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-xs text-[#3b4446]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-cu-muted italic">
                {emptyState || "Tidak ada data tersedia"}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={keyExtractor(item, index)}
                className="group transition hover:bg-cu-panel-soft/30"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`border-b border-[#ece8fb] px-3 py-2 align-middle ${col.className || ""}`}
                  >
                    {col.render(item, index)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
