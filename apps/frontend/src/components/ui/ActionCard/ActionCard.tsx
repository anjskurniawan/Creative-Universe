import React from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

export interface ActionCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  iconColorClass?: string;
  className?: string;
}

export function ActionCard({
  title,
  description,
  icon,
  href,
  iconColorClass = "text-slate-400",
  className = "",
}: ActionCardProps) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-2xl border border-cu-line bg-white/75 backdrop-blur-md p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(0,164,255,0.08)] hover:border-brand/30 flex flex-col gap-3 ${className}`}
    >
      {/* Ambient hover glow */}
      <div className="absolute -right-6 -bottom-6 size-20 rounded-full bg-gradient-to-br from-brand/10 to-cu-info/10 opacity-0 blur-lg transition-all duration-500 group-hover:opacity-100 pointer-events-none" />

      <div className="relative z-10 flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 transition-all duration-300 group-hover:scale-110">
          <MaterialIcon name={icon} size="sm" className={iconColorClass} />
        </div>
        <span className="text-sm font-bold text-cu-ink transition-colors duration-200 group-hover:text-brand font-sans leading-none">{title}</span>
      </div>
      
      <p className="relative z-10 text-xs text-cu-muted font-sans leading-relaxed">{description}</p>
    </Link>
  );
}
