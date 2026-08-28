"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { OddsOptionNavTabs, type OddsOptionTab } from "./OddsOptionNavTabs/OddsOptionNavTabs";
import { OddsOptionMenu } from "./OddsOptionMenu/OddsOptionMenu";
import { OddsCategoryCreatePanel } from "./OddsCategoryCreatePanel/OddsCategoryCreatePanel";
import { OddsCategoryListPanel } from "./OddsCategoryListPanel/OddsCategoryListPanel";

export default function OddsOptionPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<OddsOptionTab>("categories");
  const [activeMenu, setActiveMenu] = useState("add-category");
  const isRoot = user?.roles.some((role) => role.trim().toLowerCase() === "root") ?? false;

  useEffect(() => {
    if (!isLoading && !isRoot) router.replace("/odds");
  }, [isLoading, isRoot, router]);

  if (isLoading || !isRoot) return null;

  return (
    <section className="cu-style flex h-full min-h-0 w-full flex-col">
      <h1 className="shrink-0 text-3xl font-semibold tracking-[-0.04em] text-slate-800">Pengaturan</h1>
      <OddsOptionNavTabs defaultTab={activeTab} onChange={setActiveTab} />
      <section aria-label="Konten pengaturan ODDS" className="mt-4 grid min-h-0 flex-1 grid-cols-5 overflow-hidden rounded-xl border border-[#d7ecf8] bg-white">
        <aside aria-label="Daftar menu pengaturan" className="min-h-0 border-r border-[#d7ecf8]">
          {activeTab === "categories" && <OddsOptionMenu items={[{ id: "add-category", label: "Tambah Kategori" }, { id: "manage-category", label: "Kelola Kategori" }]} activeId={activeMenu} onChange={setActiveMenu} />}
        </aside>
        <div aria-label="Area pengaturan" className="col-span-4 min-h-0 overflow-y-auto">{activeTab === "categories" && activeMenu === "add-category" && <OddsCategoryCreatePanel />}{activeTab === "categories" && activeMenu === "manage-category" && <OddsCategoryListPanel />}</div>
      </section>
    </section>
  );
}
