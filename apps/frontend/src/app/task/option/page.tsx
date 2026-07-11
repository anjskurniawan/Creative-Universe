"use client";

import { useState, useEffect } from "react";
import { SideMenu, type SideMenuItem, type SideMenuVariant } from "@/components/side-menu";
import { apiFetch } from "@/lib/api";
import { type TaskCardConfig } from "@/components/taskcard";
import { useAuth } from "@/providers/auth-provider";

const PRIMARY_MENU: SideMenuItem[] = [
  {
    label: "Tugas Hari Ini",
    icon: "today",
    href: "/task",
  },
  { label: "Tugas Belum Selesai", icon: "assignment_late" },
  { label: "Tugas Bulan Ini", icon: "calendar_month" },
  { label: "Rekap Performa", icon: "analytics" },
  {
    label: "Option Page",
    icon: "settings",
    href: "/task/option",
    status: "Active",
  },
];

const SECONDARY_MENU: SideMenuItem[] = [
  { label: "Notifikasi", icon: "notifications" },
  { label: "Pesan", icon: "mail", href: "/messages" },
  { label: "Pengaturan", icon: "settings", href: "/settings" },
];

export default function OptionPage() {
  const [mobileSidebarVariant, setMobileSidebarVariant] = useState<SideMenuVariant>("Collaps");
  const [desktopSidebarVariant, setDesktopSidebarVariant] = useState<SideMenuVariant>("Collaps");

  const [activeTab, setActiveTab] = useState<"General" | "Overlays" | "Status" | "Colors" | "FormInput">("General");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { hasRole, user, isLoading: isAuthLoading } = useAuth();

  // States
  const [task_page_title, set_task_page_title] = useState("");
  const [task_page_subtitle, set_task_page_subtitle] = useState("");
  
  const [config, setConfig] = useState<TaskCardConfig>({});

  const handleConfigChange = (key: keyof TaskCardConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const ALL_KEYS = [
    "task_page_title", "task_page_subtitle", "vendor_options",
    "delete_overlay_title", "delete_overlay_cancel", "delete_overlay_confirm",
    "upload_overlay_title_support", "upload_overlay_title_draft", "upload_overlay_cancel", "upload_overlay_submit", "upload_overlay_saving",
    "submit_link_title", "submit_link_desc", "submit_link_placeholder", "submit_link_cancel", "submit_link_submit",
    "view_link_title", "view_link_desc", "view_link_cancel", "view_link_copy",
    "btn_status_draft", "btn_status_progress", "btn_status_approve", "btn_status_email",
    "detail_status_1", "detail_status_2", "detail_dropdown_file", "detail_dropdown_upload", "detail_link_file",
    "task_empty_state",
    "color_done_bg", "color_done_text", "color_progress_bg", "color_progress_text", "color_delete_bg", "color_delete_text",
    "icon_file_empty", "icon_file_filled"
  ];

  useEffect(() => {
    async function loadSettings() {
      if (isAuthLoading) return;
      if (!user) return;
      
      if (!hasRole("Root") && !hasRole("Manajer")) {
        window.location.replace("/task");
        return;
      }
      
      try {
        const data = await apiFetch<any>(`/settings?keys=${ALL_KEYS.join(",")}`);
        set_task_page_title(data?.task_page_title || "Branding Key Visual Retail");
        set_task_page_subtitle(data?.task_page_subtitle || "Kelola dan selesaikan tugas yang belum beres tepat waktu.");
        
        const loadedConfig: any = {};
        for (const key of ALL_KEYS) {
          if (key !== "task_page_title" && key !== "task_page_subtitle" && data?.[key]) {
            loadedConfig[key] = data[key];
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
  }, [hasRole, user, isAuthLoading]);

  if (isAuthLoading || isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!hasRole("Root") && !hasRole("Manajer")) {
    return null; // Akan dialihkan oleh useEffect
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiFetch("/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            task_page_title,
            task_page_subtitle,
            ...config
          }
        })
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
    { id: "General", label: "Teks Umum" },
    { id: "Overlays", label: "Teks Overlay" },
    { id: "Status", label: "Teks Status" },
    { id: "Colors", label: "Warna & Ikon" },
    { id: "FormInput", label: "Form Input" },
  ] as const;

  return (
    <div className="grid min-h-screen grid-cols-[auto_minmax(0,1fr)] bg-[#f6faff] text-[#222]">
      <SideMenu
        variant={mobileSidebarVariant}
        primaryItems={PRIMARY_MENU}
        secondaryItems={SECONDARY_MENU}
        onVariantChange={setMobileSidebarVariant}
        className="lg:hidden"
      />
      <SideMenu
        variant={desktopSidebarVariant}
        primaryItems={PRIMARY_MENU}
        secondaryItems={SECONDARY_MENU}
        onVariantChange={setDesktopSidebarVariant}
        className="hidden lg:flex"
      />

      <main className="min-w-0 overflow-hidden px-4 py-8 sm:px-8 lg:pl-12 lg:pr-16">
        <div className="w-full max-w-4xl">
          <header className="min-h-[140px] gap-6 2xl:flex 2xl:items-center 2xl:justify-between">
            <div className="w-full max-w-[590px] shrink-0">
              <h1 className="text-[44px] font-semibold leading-[52px] tracking-[-0.96px] text-[#222] sm:text-[48px] sm:leading-[60px]">
                Option Page
              </h1>
              <p className="mt-3 text-base leading-5 tracking-[0.32px] text-[#6b7280]">
                Pengaturan dan Opsi Khusus (CMS) untuk halaman Task dan TaskCard.
              </p>
            </div>
          </header>

          <section className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full mb-20">
            <div className="flex overflow-x-auto border-b border-gray-200">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 text-sm font-semibold whitespace-nowrap focus:outline-none transition-colors border-b-2 ${
                    activeTab === tab.id ? "border-[#8474f9] text-[#8474f9]" : "border-transparent text-gray-500 hover:text-gray-700"
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
              <form onSubmit={handleSave} className="p-6">
                
                {/* GENERAL TAB */}
                {activeTab === "General" && (
                  <div className="flex flex-col gap-5">
                    <h2 className="text-xl font-semibold mb-2">Teks Halaman Task</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Judul Halaman</label>
                        <input
                          type="text"
                          value={task_page_title}
                          onChange={(e) => set_task_page_title(e.target.value)}
                          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                          placeholder="Branding Key Visual Retail"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Sub-Judul Halaman</label>
                        <input
                          type="text"
                          value={task_page_subtitle}
                          onChange={(e) => set_task_page_subtitle(e.target.value)}
                          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                          placeholder="Kelola dan selesaikan tugas..."
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
                          <label className="text-xs font-semibold text-gray-600">Badge "Link File"</label>
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

                {/* COLORS & ICONS TAB */}
                {activeTab === "Colors" && (
                  <div className="flex flex-col gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Pengaturan Warna Aksen (HEX)</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Done Colors */}
                        <div className="flex items-center gap-4 border rounded-xl p-4">
                          <input 
                            type="color" 
                            value={config.color_done_bg || "#e8faea"} 
                            onChange={(e) => handleConfigChange("color_done_bg", e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer border-none"
                          />
                          <div className="flex flex-col gap-1 flex-1">
                            <label className="text-xs font-semibold text-gray-600">Selesai (Done) Background</label>
                            <span className="text-xs font-mono text-gray-500">{config.color_done_bg || "#e8faea"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 border rounded-xl p-4">
                          <input 
                            type="color" 
                            value={config.color_done_text || "#2b9915"} 
                            onChange={(e) => handleConfigChange("color_done_text", e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer border-none"
                          />
                          <div className="flex flex-col gap-1 flex-1">
                            <label className="text-xs font-semibold text-gray-600">Selesai (Done) Teks</label>
                            <span className="text-xs font-mono text-gray-500">{config.color_done_text || "#2b9915"}</span>
                          </div>
                        </div>

                        {/* Progress Colors */}
                        <div className="flex items-center gap-4 border rounded-xl p-4">
                          <input 
                            type="color" 
                            value={config.color_progress_bg || "#8474f9"} 
                            onChange={(e) => handleConfigChange("color_progress_bg", e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer border-none"
                          />
                          <div className="flex flex-col gap-1 flex-1">
                            <label className="text-xs font-semibold text-gray-600">Proses (Progress) Background</label>
                            <span className="text-xs font-mono text-gray-500">{config.color_progress_bg || "#8474f9"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 border rounded-xl p-4">
                          <input 
                            type="color" 
                            value={config.color_progress_text || "#ffffff"} 
                            onChange={(e) => handleConfigChange("color_progress_text", e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer border-none"
                          />
                          <div className="flex flex-col gap-1 flex-1">
                            <label className="text-xs font-semibold text-gray-600">Proses (Progress) Teks</label>
                            <span className="text-xs font-mono text-gray-500">{config.color_progress_text || "#ffffff"}</span>
                          </div>
                        </div>

                        {/* Delete Colors */}
                        <div className="flex items-center gap-4 border rounded-xl p-4">
                          <input 
                            type="color" 
                            value={config.color_delete_bg || "#ff5b55"} 
                            onChange={(e) => handleConfigChange("color_delete_bg", e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer border-none"
                          />
                          <div className="flex flex-col gap-1 flex-1">
                            <label className="text-xs font-semibold text-gray-600">Hapus (Delete) Background</label>
                            <span className="text-xs font-mono text-gray-500">{config.color_delete_bg || "#ff5b55"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 border rounded-xl p-4">
                          <input 
                            type="color" 
                            value={config.color_delete_text || "#ffffff"} 
                            onChange={(e) => handleConfigChange("color_delete_text", e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer border-none"
                          />
                          <div className="flex flex-col gap-1 flex-1">
                            <label className="text-xs font-semibold text-gray-600">Hapus (Delete) Teks</label>
                            <span className="text-xs font-mono text-gray-500">{config.color_delete_text || "#ffffff"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr />

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Pengaturan Ikon File (Material Icons)</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Ikon Slot Kosong</label>
                          <input
                            type="text"
                            value={config.icon_file_empty || ""}
                            onChange={(e) => handleConfigChange("icon_file_empty", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="add_circle"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-gray-600">Ikon Slot Terisi</label>
                          <input
                            type="text"
                            value={config.icon_file_filled || ""}
                            onChange={(e) => handleConfigChange("icon_file_filled", e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#8474f9]"
                            placeholder="arrow_drop_down_circle"
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
                    className="px-8 py-3 bg-[#8474f9] text-white font-semibold rounded-xl shadow-sm hover:bg-[#6c5bde] transition-colors disabled:opacity-50"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
