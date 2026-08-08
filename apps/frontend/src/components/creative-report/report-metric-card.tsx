import { MaterialIcon } from "@/components/ui/material-icon";

export type CreativeReportMetric = { label: string; value: string; icon: string; tone: string; accent: string };

export interface CreativeReportMetricCardProps {
  metric: CreativeReportMetric;
}

export function CreativeReportMetricCard({ metric }: CreativeReportMetricCardProps) {
  return (
    <article className="group relative flex h-20 min-w-0 items-center gap-3 overflow-hidden rounded-2xl border border-sky bg-white px-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md">
      <span className="absolute -right-6 -top-8 size-20 rounded-full bg-brand/5 transition-transform duration-300 group-hover:scale-125" aria-hidden="true" />
      <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors duration-200 group-hover:bg-brand group-hover:text-white">
        <MaterialIcon name={metric.icon} size="sm" />
      </span>
      <div className="relative min-w-0">
        <p className="truncate text-xs font-medium text-slate-500">{metric.label}</p>
        <p className="mt-1 truncate text-xl font-bold leading-none tracking-tight text-label">{metric.value}</p>
      </div>
    </article>
  );
}
