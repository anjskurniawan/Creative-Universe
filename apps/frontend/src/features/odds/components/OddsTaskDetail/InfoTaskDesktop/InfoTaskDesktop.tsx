import type { ComponentPropsWithoutRef } from "react";

export type InfoTaskDesktopRow = { label: string; value: string };

type InfoTaskDesktopProps = Omit<ComponentPropsWithoutRef<"section">, "children"> & {
  rows: InfoTaskDesktopRow[];
  cardClass: string;
};

export function InfoTaskDesktop({ rows, cardClass, className = "", ...props }: InfoTaskDesktopProps) {
  return (
    <section {...props} className={`${cardClass} ${className}`} aria-label="Info Task">
      <h2 className="mb-4 text-base font-bold text-cu-ink">Info Task</h2>
      <div className="flex-1 space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 border-b border-cu-border/60 pb-3 text-sm last:border-b-0">
            <span className="text-cu-muted">{row.label}</span>
            <span className="text-right font-semibold text-cu-ink">{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
