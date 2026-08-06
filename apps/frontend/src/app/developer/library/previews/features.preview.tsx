"use client";

import { useState } from "react";
import { DefaultStatsGrid } from "@/components/dashboard/default-stats-grid";
import { QuickActionsSection } from "@/components/dashboard/quick-actions-section";
import { SystemStatusGrid } from "@/components/panel/maintenance/system-status-grid";
import { GroupAccordion } from "@/components/creative-report/group-accordion";

const frame = "contents";

export function DefaultStatsGridPreview() {
  return <div className={frame}><DefaultStatsGrid stats={{ active_users: 128, roles: ["designer"], pending_users: 4, is_root: false, root_metrics: null }} /></div>;
}

export function QuickActionsSectionPreview() {
  return <div className={frame}><QuickActionsSection hasPermission={() => true} /></div>;
}

export function SystemStatusGridPreview() {
  return <div className={frame}><SystemStatusGrid isLoading={false} status={{ app_env: "local", cache_driver: "file", queue_connection: "database", failed_jobs_count: 0, disk_free_space: "48 GB", log_file_size: "12 MB" }} /></div>;
}

export function GroupAccordionPreview() {
  const [open, setOpen] = useState(true);
  return <div className={frame}><GroupAccordion group={{ id: 1, name: "Creative Technology", staff_count: 12 } as never} index={0} isOpen={open} onToggle={() => setOpen((value) => !value)}><div className="rounded-b-xl border border-t-0 border-[#c9bbfc] bg-white p-4 text-sm text-slate-600">Isi kelompok assessment.</div></GroupAccordion></div>;
}
