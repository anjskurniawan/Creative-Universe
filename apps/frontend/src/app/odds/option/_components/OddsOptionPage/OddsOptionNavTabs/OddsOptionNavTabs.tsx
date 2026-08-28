"use client";

import { useState } from "react";

export type OddsOptionTab = "categories" | "rules" | "designers" | "schedules";

const tabs: Array<{ id: OddsOptionTab; label: string }> = [
  { id: "categories", label: "Kategori" },
  { id: "rules", label: "System Rules" },
  { id: "designers", label: "Profil Designer" },
  { id: "schedules", label: "Jadwal" },
];

type OddsOptionNavTabsProps = {
  defaultTab?: OddsOptionTab;
  onChange?: (tab: OddsOptionTab) => void;
};

export function OddsOptionNavTabs({ defaultTab = "categories", onChange }: OddsOptionNavTabsProps) {
  const [activeTab, setActiveTab] = useState<OddsOptionTab>(defaultTab);

  const selectTab = (tab: OddsOptionTab) => {
    setActiveTab(tab);
    onChange?.(tab);
  };

  return (
    <nav aria-label="Navigasi pengaturan ODDS" className="mt-5 flex w-full gap-1 overflow-x-auto rounded-xl border border-[#d7ecf8] bg-white p-1.5">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => selectTab(tab.id)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a4ff] focus-visible:ring-offset-2 ${active ? "bg-[#00a4ff] text-white shadow-sm" : "text-[#526677] hover:bg-[#f1f9fd] hover:text-[#0077bf]"}`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
