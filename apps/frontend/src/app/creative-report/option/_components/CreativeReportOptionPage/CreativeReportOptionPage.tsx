"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import { useAuth } from "@/hooks/auth";
import { AspectsConfiguration } from "@/app/creative-report/option/_components/AspectsConfiguration/AspectsConfiguration";
import { CreativeMemberManagement } from "@/app/creative-report/option/_components/CreativeMemberManagement/CreativeMemberManagement";

/**
 * Halaman Utama Pengaturan Creative Report (Tabs & Access Gate)
 */
export default function CreativeReportOptionPage() {
  // Validasi Role User
  const { hasRole } = useAuth();
  const canManageMembers = hasRole("Root") || hasRole("Manajer");
  
  // Tab Aktif
  const [activeTab, setActiveTab] = useState<"validation" | "historical" | "aspects">("validation");

  // Definisi Item Tab Pengaturan
  const tabs = [
    { id: "validation" as const, label: "Agent", icon: "how_to_reg" },
    { id: "historical" as const, label: "Add Agent", icon: "history" },
    { id: "aspects" as const, label: "Performa", icon: "tune" },
  ];

  return (
    <main className="cu-style flex h-full min-w-0 w-full flex-1 flex-col">
      <div className="flex h-full min-h-0 w-full flex-1 flex-col">
        {/* Title Header */}
        <header className="flex min-h-[45px] items-center justify-between gap-6 pb-4">
          <div>
            <h1 className="text-4xl font-medium leading-none tracking-[-0.72px] text-[#24252b]">
              Setting
            </h1>
          </div>
        </header>

        {/* Tabbed Layout Area */}
        <div className="flex h-full min-h-0 w-full flex-1 flex-col">
          {canManageMembers ? (
            <>
              <section className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-[#e1e8eb] bg-white shadow-sm">
                {/* Tab Navigation */}
                <div className="flex flex-nowrap gap-1 overflow-x-auto border-b p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-[#e1e8eb]">
                  {tabs.map((tab) => {
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${active ? "bg-[#6d46eb] text-white" : "text-slate-600 hover:bg-slate-100"}`}
                      >
                        <MaterialIcon name={tab.icon} className="text-base" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
                {/* Tab Content Panel */}
                <div className="min-h-0 flex-1 overflow-y-auto p-5 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
                  {activeTab === "validation" && <CreativeMemberManagement section="pending" />}
                  {activeTab === "historical" && <CreativeMemberManagement section="historical" />}
                  {activeTab === "aspects" && <AspectsConfiguration />}
                </div>
              </section>
            </>
          ) : (
            /* Warning Akses Terbatas */
            <div className="p-8 text-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
              <MaterialIcon name="info" className="text-4xl mx-auto mb-2 opacity-80" />
              <p className="text-sm font-medium">Anda tidak memiliki akses untuk mengelola anggota Creative.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
