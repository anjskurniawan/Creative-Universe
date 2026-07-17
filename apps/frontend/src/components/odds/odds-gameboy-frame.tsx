import type { ReactNode } from "react";

export function OddsGameboyFrame({
  label,
  action,
  children,
  className = "",
}: {
  label: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`flex min-h-0 w-full flex-col rounded-[30px] border-[3px] border-[#24252b] bg-[#c9ccc0] p-3 font-mono text-[#24252b] shadow-[0_8px_0_#24252b] sm:p-4 lg:p-5 ${className}`}>
      <div className="mb-4 flex shrink-0 items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.16em]">
        <span className="flex min-w-0 items-center gap-2">
          <span className="size-2 shrink-0 rounded-full bg-[#ba0dcb] shadow-[0_0_0_2px_#24252b]" />
          <span className="truncate">{label}</span>
        </span>
        {action}
      </div>
      {children}
    </section>
  );
}
