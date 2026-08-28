import type { ComponentPropsWithoutRef } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

type RevisionMessageProps = {
  message: string;
} & Pick<ComponentPropsWithoutRef<"aside">, "className"> & { "data-qa-component"?: string };

export function RevisionMessage({ message, className = "", "data-qa-component": qaComponent }: RevisionMessageProps) {
  return (
    <aside className={`flex h-full min-h-0 flex-1 flex-col rounded-2xl border border-cu-info/25 bg-cu-info/5 p-4 ${className}`} data-qa-component={qaComponent}>
      <div className="flex items-center gap-2 text-sm font-semibold text-cu-ink">
        <MaterialIcon name="edit_note" size="sm" />
        Alasan Revisi Brief
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-cu-muted">{message || "Belum ada alasan revisi dari desainer."}</p>
    </aside>
  );
}
