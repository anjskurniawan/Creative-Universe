import React from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export interface EditMemberTabsProps {
  activeTab: "identity" | "specialties";
  onTabChange: (tab: "identity" | "specialties") => void;
}

export function EditMemberTabs({ activeTab, onTabChange }: EditMemberTabsProps) {
  const tabs = [
    ["identity", "badge", "Personal"],
    ["specialties", "category", "Spesialisasi ODDS"],
  ] as const;

  return (
    <nav
      className="flex w-full flex-nowrap gap-2 overflow-x-auto border-b p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-[#edf0f2] bg-[#fbfcfd]"
      aria-label="Pengaturan Creative Agent"
    >
      {tabs.map(([tab, icon, label]) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`group flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
            activeTab === tab
              ? "border-[#6d46eb] bg-[#6d46eb] text-white shadow-[0_5px_14px_rgba(109,70,235,0.2)]"
              : "border-transparent text-slate-600 hover:border-[#e0dafe] hover:bg-white"
          }`}
        >
          <span
            className={`flex size-6 items-center justify-center rounded-md ${
              activeTab === tab ? "bg-white/15" : "bg-[#f0edff] text-[#6d46eb]"
            }`}
          >
            <MaterialIcon name={icon} size="xs" />
          </span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
