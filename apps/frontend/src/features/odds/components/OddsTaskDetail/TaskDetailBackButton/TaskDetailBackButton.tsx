import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

type TaskDetailBackButtonProps = Pick<ComponentPropsWithoutRef<typeof Link>, "className"> & {
  "data-qa-component"?: string;
};

export function TaskDetailBackButton({ className = "", "data-qa-component": qaComponent }: TaskDetailBackButtonProps) {
  return (
    <Link href="/odds" data-qa-component={qaComponent} className={`group inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-[#cfeaf7] bg-white/90 px-3.5 text-xs font-semibold text-[#526677] shadow-[0_4px_12px_rgba(0,116,180,0.08)] transition-all hover:-translate-x-0.5 hover:border-[#8bd5f5] hover:bg-[#f1faff] hover:text-[#0077bf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a4ff]/30 focus-visible:ring-offset-2 ${className}`}>
      <span className="flex size-5 items-center justify-center rounded-full bg-[#e9f7ff] text-[#0077bf] transition-colors group-hover:bg-[#d8f1ff]"><MaterialIcon name="arrow_back" size="xs" /></span>
      <span>Kembali</span>
    </Link>
  );
}
