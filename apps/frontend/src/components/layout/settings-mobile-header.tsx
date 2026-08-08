import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";

export default function SettingsMobileHeader({ label }: { label: string }) {
  return (
    <div className="mb-5 flex items-center gap-3 border-b border-cu-line pb-4 lg:hidden">
      <Link href="/settings" aria-label="Kembali ke menu pengaturan" className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-cu-line bg-cu-surface text-cu-ink transition hover:bg-cu-panel-soft">
        <MaterialIcon name="arrow_back" size="sm" />
      </Link>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-cu-muted">Pengaturan</p>
        <h1 className="truncate text-base font-semibold text-cu-ink">{label}</h1>
      </div>
    </div>
  );
}
