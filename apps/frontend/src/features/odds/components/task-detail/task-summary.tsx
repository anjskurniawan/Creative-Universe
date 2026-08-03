import type { OddsTask } from "@/features/odds/api";

type TaskSummaryProps = { task: OddsTask; cardClass: string; textLabelClass: string; textValueClass: string; formatDate: (value: string | null | undefined, includeTime?: boolean) => string; statusLabel: (value: string) => string; className?: string; "data-qa-component"?: string };

export function TaskSummary({ task, cardClass, textLabelClass, textValueClass, formatDate, statusLabel, className = "", "data-qa-component": qaComponent }: TaskSummaryProps) {
  const assignedDesigner = task.assigned_designer ?? task.assignedDesigner;
  const fields = [["Kategori", task.category?.name ?? "-"], ["Tanggal Submit", formatDate(task.created_at, true)], ["Perequest", task.requester?.name?.trim().split(/\s+/)[0] ?? "-"], ["Desainer", assignedDesigner?.name?.trim().split(/\s+/)[0] ?? "Belum ada desainer"], ["Deadline", formatDate(task.deadline, true)], ["Status", statusLabel(task.status)]] as const;
  return <div className={`${cardClass} hidden lg:flex flex-row flex-nowrap items-stretch gap-x-4 overflow-x-auto md:p-5 flex-grow-0 ${className}`} data-qa-component={qaComponent}>{fields.map(([label, value], index) => <div key={label} className={index === fields.length - 1 ? "" : "w-fit shrink-0 border-r border-cu-border pr-4"}><span className={textLabelClass}>{label}</span><span className={textValueClass}>{value}</span></div>)}</div>;
}
