import { MaterialIcon } from "@/components/ui/material-icon";

export type TaskDetailTab = "brief" | "output" | "revision" | "discussion" | "audit" | "history" | "actions" | "info";
const tabs: Array<[TaskDetailTab, string, string]> = [["info", "info", "Info Task"], ["brief", "description", "Brief"], ["output", "folder_open", "Output"], ["revision", "edit_note", "Revisi"], ["discussion", "chat", "Diskusi"], ["audit", "timer", "Audit"], ["history", "history", "Log Task"], ["actions", "bolt", "Aksi"]];

type TaskDetailTabsProps = { activeTab: TaskDetailTab; onChange: (tab: TaskDetailTab) => void; mobileOpen: boolean; onMobileOpenChange: (open: boolean) => void; navClass: string; tabButtonClass: (tab: string) => string; className?: string; "data-qa-component"?: string };

export function TaskDetailTabs({ activeTab, onChange, mobileOpen, onMobileOpenChange, navClass, tabButtonClass, className = "", "data-qa-component": qaComponent }: TaskDetailTabsProps) {
  const active = tabs.find(([tab]) => tab === activeTab) ?? tabs[0];
  return <>
    <div className="relative lg:hidden">
      <button type="button" onClick={() => onMobileOpenChange(!mobileOpen)} className="flex h-11 w-full items-center justify-between rounded-xl border border-[#BDEAFF]/60 bg-white px-3 text-left text-sm font-semibold text-[#04044A] shadow-[0_4px_14px_rgba(0,164,255,0.06)] outline-none transition hover:border-cu-info focus:border-cu-info focus:ring-2 focus:ring-cu-info/15" aria-expanded={mobileOpen}><span className="flex items-center gap-2"><MaterialIcon name={active[1]} size="sm" />{active[2]}</span><MaterialIcon name="expand_more" size="sm" className={`text-cu-muted transition-transform ${mobileOpen ? "rotate-180" : ""}`} /></button>
      {mobileOpen && <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-[#BDEAFF]/70 bg-white p-1.5 shadow-[0_12px_30px_rgba(0,80,140,0.16)]">{tabs.map(([value, icon, label]) => <button key={value} type="button" onClick={() => { onChange(value); onMobileOpenChange(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${activeTab === value ? "bg-cu-info/10 font-semibold text-cu-info" : "text-[#04044A] hover:bg-[#F3FAFF]"}`}><MaterialIcon name={icon} size="sm" /><span>{label}</span></button>)}</div>}
    </div>
    <nav className={`${navClass} ${className} hidden min-h-11 w-full shrink-0 lg:flex !px-4`} data-qa-component={qaComponent} aria-label="Detail task">{tabs.map(([tab, icon, label]) => <button key={tab} type="button" onClick={() => onChange(tab)} className={`inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-t-xl rounded-b-none !px-2 text-sm font-semibold transition-all duration-200 ${tab === "info" ? "lg:hidden" : ""} ${tabButtonClass(tab)}`}><MaterialIcon name={icon} size="sm" style={{ fontSize: "20px" }} />{label}</button>)}</nav>
  </>;
}
