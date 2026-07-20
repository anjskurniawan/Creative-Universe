"use client";

import { useState, useEffect } from "react";
import { type SideMenuItem } from "@/components/side-menu";
import { coreApi } from "@/core/api";
import { type TaskCardConfig } from "@/components/taskcard";
import { useAuth } from "@/providers/auth-provider";
import { TaskDesktopPageTransition } from "@/components/task-desktop-page-transition";
import { PerformanceNavbar } from "@/features/kv-retail/components/performance-navbar";
import { PerformanceSidebar } from "@/features/kv-retail/components/performance-sidebar";
import { useKvRetailDesktopSidebar } from "@/features/kv-retail/hooks";

const PRIMARY_MENU: SideMenuItem[] = [
  {
    label: "Hari ini",
    icon: "today",
    href: "/kv-retail",
  },
  { label: "Belum selesai", icon: "assignment_late", href: "/kv-retail/unfinished" },
  { label: "Bulan ini", icon: "calendar_month", href: "/kv-retail/month" },
  { label: "Report", icon: "analytics", href: "/kv-retail/performance" },
  {
    label: "Pengaturan",
    icon: "settings",
    href: "/kv-retail/option",
    status: "Active",
  },
];

const KV_RETAIL_SETTING_KEYS = [
  "task_page_title_today", "task_page_title_unfinished", "task_page_title_month", "vendor_options",
  "delete_overlay_title", "delete_overlay_cancel", "delete_overlay_confirm",
  "upload_overlay_title_support", "upload_overlay_title_draft", "upload_overlay_cancel", "upload_overlay_submit", "upload_overlay_saving",
  "submit_link_title", "submit_link_desc", "submit_link_placeholder", "submit_link_cancel", "submit_link_submit",
  "view_link_title", "view_link_desc", "view_link_cancel", "view_link_copy",
  "btn_status_draft", "btn_status_progress", "btn_status_approve", "btn_status_email",
  "detail_status_1", "detail_status_2", "detail_dropdown_file", "detail_dropdown_upload", "detail_link_file",
  "task_empty_state",
] as const;

export default function OptionPage() {
  const [desktopTheme, setDesktopTheme] = useState<"light" | "dark" | "retro">("light");
  const { expanded: desktopShellExpanded, toggleExpanded: toggleDesktopShellExpanded } = useKvRetailDesktopSidebar();

  const [activeTab, setActiveTab] = useState<"General" | "Overlays" | "Status" | "FormInput">("General");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { hasPermission, user, isLoading: isAuthLoading } = useAuth();

  // States
  const [task_page_title_today, setTaskPageTitleToday] = useState("Hari ini");
  const [task_page_title_unfinished, setTaskPageTitleUnfinished] = useState("Belum selesai");
  const [task_page_title_month, setTaskPageTitleMonth] = useState("Bulan ini");
  
  const [config, setConfig] = useState<TaskCardConfig>({});

  const handleConfigChange = (key: keyof TaskCardConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    async function loadSettings() {
      if (isAuthLoading) return;
      if (!user) return;
      
      if (!hasPermission("kv-retail.settings.manage")) {
        window.location.replace("/kv-retail");
        return;
      }
      
      try {
        const data = await coreApi.settings.get<Record<string, string>>([...KV_RETAIL_SETTING_KEYS]);
        setTaskPageTitleToday(data?.task_page_title_today || "Hari ini");
        setTaskPageTitleUnfinished(data?.task_page_title_unfinished || "Belum selesai");
        setTaskPageTitleMonth(data?.task_page_title_month || "Bulan ini");
        
        const loadedConfig: TaskCardConfig = {};
        for (const key of KV_RETAIL_SETTING_KEYS) {
          if (!key.startsWith("task_page_title_") && data?.[key]) {
            loadedConfig[key as keyof TaskCardConfig] = data[key];
          }
        }
        setConfig(loadedConfig);
      } catch (err) {
        console.error("Gagal memuat pengaturan:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, [hasPermission, user, isAuthLoading]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6faff] p-6 lg:bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]">
        <div className="flex min-h-[calc(100vh-48px)] w-full flex-col overflow-hidden rounded-[26px] border border-white/80 bg-white/80 shadow-[0_14px_42px_rgba(44,42,39,0.16)] backdrop-blur-md">
          <div className="h-16 shrink-0 border-b border-black/[0.045] bg-white/55" />
          <div className="flex flex-1 items-center justify-center">
            <div className="flex items-center gap-3">
              <span className="size-5 animate-spin rounded-full border-2 border-[#00a4ff]/25 border-t-[#00a4ff]" aria-hidden="true" />
              <p className="text-sm font-medium text-[#000675]">Memuat pengaturan...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasPermission("kv-retail.settings.manage")) {
    return null; // Akan dialihkan oleh useEffect
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await coreApi.settings.update({
          settings: {
            task_page_title_today,
            task_page_title_unfinished,
            task_page_title_month,
            ...config
          }
      });
      alert("Pengaturan halaman Task berhasil disimpan!");
    } catch (err) {
      console.error("Gagal menyimpan pengaturan:", err);
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "General", label: "Halaman" },
    { id: "Overlays", label: "Teks Overlay" },
    { id: "Status", label: "Teks Status" },
    { id: "FormInput", label: "Form Input" },
  ] as const;

  return (
    <>
      <div className={`h-dvh overflow-hidden p-3 lg:hidden ${desktopTheme === "dark" ? "bg-[radial-gradient(circle_at_8%_6%,#294c3b_0,transparent_28%),radial-gradient(circle_at_91%_4%,#242a27_0,transparent_38%),linear-gradient(135deg,#111513_0%,#0b0d0c_58%,#1a1e1c_100%)]" : desktopTheme === "retro" ? "bg-[#dfe2d3] font-mono" : "bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]"}`}>
        <div className={`flex h-[calc(100dvh-24px)] flex-col overflow-hidden rounded-[22px] ${desktopTheme === "dark" ? "border border-white/10 bg-[#111413]/90" : desktopTheme === "retro" ? "border-[3px] border-[#24252b] bg-[#c9ccc0] shadow-[0_6px_0_#24252b]" : "border border-white/80 bg-white/80 shadow-[0_12px_32px_rgba(0,4,117,0.2)] backdrop-blur-md"}`}>
          <PerformanceNavbar theme={desktopTheme} title="Pengaturan" compact compactMenuItems={PRIMARY_MENU} />
          <main className="flex min-h-0 flex-1 px-5 pt-6">
            <h1 className={`text-4xl font-medium leading-none tracking-[-0.05em] ${desktopTheme === "dark" ? "text-[#f1f1f1]" : "text-[#181818]"}`}>Pengaturan</h1>
          </main>
        </div>
      </div>
      <div className={`hidden text-[#222] lg:flex lg:h-screen lg:min-h-0 lg:flex-col lg:p-6 ${desktopTheme === "dark" ? "lg:bg-[radial-gradient(circle_at_8%_6%,#294c3b_0,transparent_28%),radial-gradient(circle_at_91%_4%,#242a27_0,transparent_38%),linear-gradient(135deg,#111513_0%,#0b0d0c_58%,#1a1e1c_100%)]" : desktopTheme === "retro" ? "lg:bg-[#dfe2d3]" : "bg-[#f6faff] lg:bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]"}`}>


      <div className={`cu-option-content-enter min-h-screen lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden ${desktopTheme === "light" ? "lg:rounded-[26px] lg:border lg:border-white/80 lg:bg-white/80 lg:shadow-[0_14px_42px_rgba(44,42,39,0.16)] lg:backdrop-blur-md" : desktopTheme === "dark" ? "lg:rounded-[26px] lg:border lg:border-white/10 lg:bg-[#111413]/90 lg:shadow-[0_14px_42px_rgba(0,0,0,0.45)] lg:backdrop-blur-md" : "lg:rounded-[30px] lg:border-[3px] lg:border-[#24252b] lg:bg-[#c9ccc0] lg:font-mono lg:shadow-[0_8px_0_#24252b]"}`}>
        <div className="hidden lg:block"><PerformanceNavbar theme={desktopTheme} title="Pengaturan" /></div>
        <div className="lg:flex lg:min-h-0 lg:flex-1">
          <PerformanceSidebar className="hidden lg:flex" theme={desktopTheme} activeHref="/kv-retail/option" ariaLabel="Navigasi Pengaturan" onToggleTheme={() => setDesktopTheme((theme) => theme === "dark" ? "light" : "dark")} onToggleRetro={() => setDesktopTheme((theme) => theme === "retro" ? "light" : "retro")} expanded={desktopShellExpanded} onToggleExpanded={toggleDesktopShellExpanded} />
      <TaskDesktopPageTransition className="min-w-0 overflow-visible px-4 py-8 sm:px-8 lg:relative lg:m-4 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:px-0 lg:py-0">
        <div className="w-full max-w-4xl lg:max-w-none">
          <header className="min-h-[45px]">
            <div>
              <h1 className={`text-4xl font-medium leading-none tracking-[-0.72px] ${desktopTheme === "dark" ? "text-[#f1f1f1]" : desktopTheme === "retro" ? "text-[#24252b]" : "text-[#181818]"}`}>
                Pengaturan
              </h1>
            </div>
          </header>

          <section className={`cu-kv-option-card cu-kv-option-card--${desktopTheme} mt-4 mb-20 w-full overflow-visible rounded-[20px] p-2 shadow-sm ${desktopTheme === "dark" ? "border border-white/10 bg-[#171717]" : desktopTheme === "retro" ? "border-2 border-[#24252b] bg-[#eceee6] shadow-[3px_3px_0_#24252b]" : "border border-[#dbe9f3] bg-white"}`}>
            <div className={`flex gap-1 overflow-x-auto rounded-xl p-1 ${desktopTheme === "dark" ? "bg-[#202820]" : desktopTheme === "retro" ? "border border-[#24252b] bg-[#dfe2d3]" : "bg-[#f3faff]"}`}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap focus:outline-none transition-colors ${
                    activeTab === tab.id
                      ? desktopTheme === "dark" ? "bg-[#b0ff5e] text-[#181818]" : desktopTheme === "retro" ? "bg-[#ba0dcb] text-white" : "bg-white text-[#000675] shadow-sm"
                      : desktopTheme === "dark" ? "text-[#b9b9b9] hover:bg-white/5 hover:text-[#f1f1f1]" : desktopTheme === "retro" ? "text-[#24252b] hover:bg-[#c9ccc0]" : "text-[#61717a] hover:bg-white hover:text-[#000675]"
                  }`}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {isLoading ? (
              <div className="p-12 flex justify-center text-gray-500">Memuat pengaturan...</div>
            ) : (
              <form onSubmit={handleSave} className="p-5 md:p-8">
                
                {/* GENERAL TAB */}
                {activeTab === "General" && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#00a4ff]">Navigasi task</p>
                      <h2 className="mt-1 text-xl font-semibold text-[#181818]">Nama halaman</h2>
                      <p className="mt-1 text-sm text-gray-500">Nama ini digunakan pada heading desktop dan breadcrumb halaman terkait.</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Hari ini</label>
                        <input
                          type="text"
                          value={task_page_title_today}
                          onChange={(e) => setTaskPageTitleToday(e.target.value)}
                          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                          placeholder="Hari ini"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Belum selesai</label>
                        <input
                          type="text"
                          value={task_page_title_unfinished}
                          onChange={(e) => setTaskPageTitleUnfinished(e.target.value)}
                          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                          placeholder="Belum selesai"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Bulan ini</label>
                        <input
                          type="text"
                          value={task_page_title_month}
                          onChange={(e) => setTaskPageTitleMonth(e.target.value)}
                          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                          placeholder="Bulan ini"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Teks Kosong (Empty State)</label>
                        <input
                          type="text"
                          value={config.task_empty_state || ""}
                          onChange={(e) => handleConfigChange("task_empty_state", e.target.value)}
                          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                          placeholder="Belum ada tugas yang sesuai."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* FORM INPUT TAB */}
                {activeTab === "FormInput" && (
                  <div className="flex flex-col gap-5">
                    <h2 className="text-xl font-semibold mb-2">Form Pembuatan Tugas</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Pilihan Vendor Dinamis</label>
                        <textarea
                          rows={2}
                          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8474f9] resize-y"
                          value={config.vendor_options || ""}
                          onChange={(e) => handleConfigChange("vendor_options", e.target.value)}
                          placeholder="Contoh: Mireco, Fushion, Studio X"
                        />
                        <p className="text-xs text-gray-500">Pisahkan nama vendor dengan tanda koma (,).</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* OVERLAYS TAB */}
                {activeTab === "Overlays" && (
                  <div className="flex flex-col gap-8">
                    {/* Delete Overlay */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#ff5b55] mb-3">Delete Overlay</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                          <label className="text-xs font-semibold text-gray-600">Judul Konfirmasi</label>
                          <input
                            type="text"
                            value={config.delete_overlay_title || ""}
                            onChange={(e) => handleConfigChange("delete_overlay_title", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Apakah Anda yakin ingin menghapus tugas ini?"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Tombol Batal</label>
                          <input
                            type="text"
                            value={config.delete_overlay_cancel || ""}
                            onChange={(e) => handleConfigChange("delete_overlay_cancel", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Batal"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Tombol Hapus</label>
                          <input
                            type="text"
                            value={config.delete_overlay_confirm || ""}
                            onChange={(e) => handleConfigChange("delete_overlay_confirm", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Ya, Hapus"
                          />
                        </div>
                      </div>
                    </div>

                    <hr />

                    {/* Upload Overlay */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#8474f9] mb-3">Upload Overlay</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Judul File Support</label>
                          <input
                            type="text"
                            value={config.upload_overlay_title_support || ""}
                            onChange={(e) => handleConfigChange("upload_overlay_title_support", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="3D Gambar"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Judul File Draft</label>
                          <input
                            type="text"
                            value={config.upload_overlay_title_draft || ""}
                            onChange={(e) => handleConfigChange("upload_overlay_title_draft", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Draft"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Tombol Batal</label>
                          <input
                            type="text"
                            value={config.upload_overlay_cancel || ""}
                            onChange={(e) => handleConfigChange("upload_overlay_cancel", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Batal"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Tombol Simpan</label>
                          <input
                            type="text"
                            value={config.upload_overlay_submit || ""}
                            onChange={(e) => handleConfigChange("upload_overlay_submit", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Simpan File"
                          />
                        </div>
                        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                          <label className="text-xs font-semibold text-gray-600">Teks Menyimpan</label>
                          <input
                            type="text"
                            value={config.upload_overlay_saving || ""}
                            onChange={(e) => handleConfigChange("upload_overlay_saving", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Menyimpan..."
                          />
                        </div>
                      </div>
                    </div>

                    <hr />

                    {/* Submit Link Overlay */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#8474f9] mb-3">Submit Link Overlay</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Judul</label>
                          <input
                            type="text"
                            value={config.submit_link_title || ""}
                            onChange={(e) => handleConfigChange("submit_link_title", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Input Link File:"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Placeholder</label>
                          <input
                            type="text"
                            value={config.submit_link_placeholder || ""}
                            onChange={(e) => handleConfigChange("submit_link_placeholder", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Link File Sharing"
                          />
                        </div>
                        <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                          <label className="text-xs font-semibold text-gray-600">Deskripsi</label>
                          <input
                            type="text"
                            value={config.submit_link_desc || ""}
                            onChange={(e) => handleConfigChange("submit_link_desc", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Masukkan link file design..."
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Tombol Batal</label>
                          <input
                            type="text"
                            value={config.submit_link_cancel || ""}
                            onChange={(e) => handleConfigChange("submit_link_cancel", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Batal"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Tombol Kirim</label>
                          <input
                            type="text"
                            value={config.submit_link_submit || ""}
                            onChange={(e) => handleConfigChange("submit_link_submit", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Kirim"
                          />
                        </div>
                      </div>
                    </div>

                    <hr />

                    {/* View Link Overlay */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#2b9915] mb-3">View Link Overlay</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Judul</label>
                          <input
                            type="text"
                            value={config.view_link_title || ""}
                            onChange={(e) => handleConfigChange("view_link_title", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Tautan File Tersimpan:"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Deskripsi</label>
                          <input
                            type="text"
                            value={config.view_link_desc || ""}
                            onChange={(e) => handleConfigChange("view_link_desc", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Tautan ini telah dilampirkan..."
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Tombol Kembali</label>
                          <input
                            type="text"
                            value={config.view_link_cancel || ""}
                            onChange={(e) => handleConfigChange("view_link_cancel", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Kembali"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Tombol Copy</label>
                          <input
                            type="text"
                            value={config.view_link_copy || ""}
                            onChange={(e) => handleConfigChange("view_link_copy", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Copy Link"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STATUS TAB */}
                {activeTab === "Status" && (
                  <div className="flex flex-col gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Teks Tahapan Tugas (Buttons)</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Tahap 1</label>
                          <input
                            type="text"
                            value={config.btn_status_draft || ""}
                            onChange={(e) => handleConfigChange("btn_status_draft", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="ACC Draft"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Tahap 2</label>
                          <input
                            type="text"
                            value={config.btn_status_progress || ""}
                            onChange={(e) => handleConfigChange("btn_status_progress", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Progress Design"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Tahap 3</label>
                          <input
                            type="text"
                            value={config.btn_status_approve || ""}
                            onChange={(e) => handleConfigChange("btn_status_approve", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Approval Design"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Tahap 4</label>
                          <input
                            type="text"
                            value={config.btn_status_email || ""}
                            onChange={(e) => handleConfigChange("btn_status_email", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Kirim Email"
                          />
                        </div>
                      </div>
                    </div>

                    <hr />

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Teks Detail File & Badges</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Status File 1</label>
                          <input
                            type="text"
                            value={config.detail_status_1 || ""}
                            onChange={(e) => handleConfigChange("detail_status_1", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="3D Gambar Kerja"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Status File 2</label>
                          <input
                            type="text"
                            value={config.detail_status_2 || ""}
                            onChange={(e) => handleConfigChange("detail_status_2", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Draft Final"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Dropdown Upload</label>
                          <input
                            type="text"
                            value={config.detail_dropdown_upload || ""}
                            onChange={(e) => handleConfigChange("detail_dropdown_upload", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Upload"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Dropdown File Tercantum</label>
                          <input
                            type="text"
                            value={config.detail_dropdown_file || ""}
                            onChange={(e) => handleConfigChange("detail_dropdown_file", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="File {N}"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Badge &quot;Link File&quot;</label>
                          <input
                            type="text"
                            value={config.detail_link_file || ""}
                            onChange={(e) => handleConfigChange("detail_link_file", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="Link File"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-12 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`rounded-xl px-8 py-3 font-semibold shadow-sm transition-colors disabled:opacity-50 ${desktopTheme === "dark" ? "bg-[#b0ff5e] text-[#181818] hover:bg-[#c6ff89]" : desktopTheme === "retro" ? "bg-[#ba0dcb] text-white hover:bg-[#9c0bac]" : "bg-[#00a4ff] text-white hover:bg-[#008ee0]"}`}
                  >
                    {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </TaskDesktopPageTransition>
        </div>
      </div>
      </div>
    </>
  );
}
