import React from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon: string;
  iconBgClass?: string;
  iconColorClass?: string;
  borderHoverClass?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBgClass = "bg-slate-50",
  iconColorClass = "text-slate-400",
  borderHoverClass = "hover:border-brand/40",
  className = "",
}: StatCardProps) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-cu-line bg-white/75 backdrop-blur-md p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(0,164,255,0.12)] flex items-center justify-between gap-4 ${borderHoverClass} ${className}`}>
      {/* Ambient hover glow background */}
      <div className="absolute -right-6 -bottom-6 size-24 rounded-full bg-gradient-to-br from-brand/20 to-cu-info/20 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100 pointer-events-none" />

      <div className="relative z-10">
        <p className="mb-1 text-sm text-cu-muted font-sans font-medium">{title}</p>
        <p className="text-3xl font-bold text-cu-ink font-sans leading-none tracking-tight">{value}</p>
        {subtitle && <div className="mt-2.5 text-xs font-sans">{subtitle}</div>}
      </div>
      
      <div className={`relative z-10 flex size-12 shrink-0 items-center justify-center rounded-xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${iconBgClass} ${iconColorClass}`}>
        <MaterialIcon name={icon} size="md" />
      </div>
    </div>
  );
}
