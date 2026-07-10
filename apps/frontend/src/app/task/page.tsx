"use client";

import { useState, useEffect } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { SideMenu, type SideMenuItem, type SideMenuVariant } from "@/components/side-menu";
import { TaskCard, type TaskCardState } from "@/components/task-card";
import { TaskFormModal } from "@/components/task-form-modal";
import { apiFetch } from "@/lib/api";

type MetricState = "Total" | "Progress" | "Mendesak" | "Done";

const TASK_CARD_STATES: TaskCardState[] = [
  "0",
  "ACC Draft",
  "Progress Design",
  "Approval Design",
  "Kirim Email",
  "Done",
];



const PRIMARY_MENU: SideMenuItem[] = [
  {
    label: "Tugas Hari Ini",
    icon: "today",
    href: "/task",
    status: "Active",
  },
  { label: "Tugas Belum Selesai", icon: "assignment_late" },
  { label: "Tugas Bulan Ini", icon: "calendar_month" },
  { label: "Rekap Performa", icon: "analytics" },
];

const SECONDARY_MENU: SideMenuItem[] = [
  { label: "Notifikasi", icon: "notifications" },
  { label: "Pesan", icon: "mail", href: "/messages" },
  { label: "Pengaturan", icon: "settings", href: "/settings" },
];

const metricToneClasses: Record<MetricState, { iconBox: string; icon: string }> = {
  Total: {
    iconBox: "bg-[#eef2ff]",
    icon: "text-[#8474f9]",
  },
  Progress: {
    iconBox: "bg-[#fff8ee]",
    icon: "text-[#f18728]",
  },
  Mendesak: {
    iconBox: "bg-[#ffe2dd]",
    icon: "text-[#ff5b55]",
  },
  Done: {
    iconBox: "bg-[#efffee]",
    icon: "text-[#2b9915]",
  },
};

function MetricCard({
  title,
  value,
  icon,
  state,
}: {
  title: string;
  value: number;
  icon: string;
  state: MetricState;
}) {
  const tone = metricToneClasses[state];

  return (
    <div className="flex h-[76px] shrink-0 items-center gap-4 rounded-2xl border border-[#e5e7eb] bg-white px-5 py-3 shadow-sm min-w-[150px]">
      <div
        className={[
          "flex size-11 shrink-0 items-center justify-center rounded-xl",
          tone.iconBox,
        ].join(" ")}
      >
        <MaterialIcon
          name={icon}
          size="auto"
          weight={400}
          filled={false}
          className={["text-[22px] leading-none", tone.icon].join(" ")}
        />
      </div>

      <div className="flex flex-col">
        <p className="text-[22px] font-bold leading-none text-[#111827]">
          {value}
        </p>
        <p className="text-[12px] font-medium text-[#6b7280] mt-1.5 whitespace-nowrap">
          {title}
        </p>
      </div>
    </div>
  );
}

function AddTaskButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add Button"
      className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-[#ec4899] text-white transition-colors hover:bg-[#db2777] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ec4899]/40"
    >
      <MaterialIcon
        name="add"
        size="auto"
        weight={300}
        filled={false}
        className="text-[56px] leading-none"
      />
    </button>
  );
}

function ToolbarDropdown({
  icon,
  label,
  options,
  value,
  onChange,
}: {
  icon: string;
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 shrink-0 items-center justify-center gap-2.5 rounded-xl border border-[#d7dcdd] bg-white px-4 text-base tracking-[0.32px] text-[#525e61] transition-colors hover:border-[#bfc7c9] hover:bg-[#fbfdff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8474f9]/25"
      >
        <MaterialIcon
          name={icon}
          size="auto"
          weight={300}
          filled={false}
          className="text-[24px] leading-none"
        />
        <span className="max-w-[120px] truncate">{value === options[0] ? label : value}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute left-0 top-[110%] z-20 flex w-48 flex-col rounded-xl border border-[#e5e7eb] bg-white p-1 shadow-lg">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-start rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${
                  value === opt ? "bg-violet-50 font-medium text-[#8474f9]" : "text-gray-700"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function TaskPage() {
  const [mobileSidebarVariant, setMobileSidebarVariant] =
    useState<SideMenuVariant>("Collaps");
  const [desktopSidebarVariant, setDesktopSidebarVariant] =
    useState<SideMenuVariant>("Collaps");
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [filterVendor, setFilterVendor] = useState("Semua Vendor");
  const [sortOption, setSortOption] = useState("Tenggat Waktu Terdekat");

  const fetchTasks = async () => {
    try {
      const data = await apiFetch<any[]>('/homework-tasks');
      setTasks(data);
    } catch (err) {
      console.error("Gagal memuat tugas", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStepClick = async (taskId: number, step: string) => {
    const now = new Date();
    const pad = (num: number) => String(num).padStart(2, "0");
    const formatted = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    
    let mappedState: TaskCardState = "0";
    if (step === "ACC Draft") mappedState = "ACC Draft";
    else if (step === "Progress") mappedState = "Progress Design";
    else if (step === "Approve") mappedState = "Approval Design";
    else if (step === "Email") mappedState = "Kirim Email";

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newTimestamps = { ...(task.task_timestamps || {}), [step]: formatted };

    try {
      await apiFetch(`/homework-tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: mappedState,
          task_timestamps: newTimestamps,
        })
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextClick = async (taskId: number, link?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const states: TaskCardState[] = ["0", "ACC Draft", "Progress Design", "Approval Design", "Kirim Email", "Done"];
    const currentIndex = states.indexOf(task.status as TaskCardState);
    if (currentIndex === states.length - 1) return; // Prevent resetting when already Done
    
    const nextIndex = currentIndex + 1;
    
    try {
      const payload: any = { status: states[nextIndex] };
      if (link) payload.file_link = link;

      await apiFetch(`/homework-tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      await apiFetch(`/homework-tasks/${taskId}`, {
        method: 'DELETE',
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const totalTasks = tasks.filter(t => t.status !== "Done").length;
  const inProgress = tasks.filter(t => ["ACC Draft", "Progress Design", "Approval Design", "Kirim Email"].includes(t.status)).length;
  const mendesak = tasks.filter(t => {
    if (t.status === "Done") return false;
    if (!t.deadline_date) return false;
    const d = new Date(t.deadline_date);
    const diff = Math.ceil((d.getTime() - Date.now()) / (1000 * 3600 * 24));
    return diff <= 4 && diff >= 0;
  }).length;
  const selesai = tasks.filter(t => t.status === "Done").length;

  const dynamicMetrics = [
    { state: "Total" as MetricState, title: "Total Tugas", value: totalTasks, icon: "assignment" },
    { state: "Progress" as MetricState, title: "In Progress", value: inProgress, icon: "hourglass_bottom" },
    { state: "Mendesak" as MetricState, title: "Mendesak", value: mendesak, icon: "warning_amber" },
    { state: "Done" as MetricState, title: "Selesai", value: selesai, icon: "check_circle" },
  ];

  const vendorOptions = ["Semua Vendor", ...Array.from(new Set(tasks.map(t => t.pic_vendor).filter(Boolean)))];
  
  const filteredTasks = [...tasks].filter((task) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = task.task_name?.toLowerCase().includes(q);
      const matchVendor = task.pic_vendor?.toLowerCase().includes(q);
      if (!matchName && !matchVendor) return false;
    }
    
    if (filterStatus === "Belum Selesai" && task.status === "Done") return false;
    if (filterStatus === "Selesai" && task.status !== "Done") return false;
    if (filterStatus === "In Progress" && (task.status === "0" || task.status === "Done")) return false;

    if (filterVendor !== "Semua Vendor" && task.pic_vendor !== filterVendor) return false;

    return true;
  }).sort((a, b) => {
    if (sortOption === "Terbaru Ditambahkan") {
      return new Date(b.created_at || b.task_given_date || 0).getTime() - new Date(a.created_at || a.task_given_date || 0).getTime();
    }
    if (sortOption === "Tenggat Waktu Terdekat") {
      return new Date(a.deadline_date || 0).getTime() - new Date(b.deadline_date || 0).getTime();
    }
    if (sortOption === "Tenggat Waktu Terjauh") {
      return new Date(b.deadline_date || 0).getTime() - new Date(a.deadline_date || 0).getTime();
    }
    return 0;
  });

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
        <div className="w-full">
          <header className="min-h-[140px] gap-6 2xl:flex 2xl:items-center 2xl:justify-between">
            <div className="w-full max-w-[590px] shrink-0">
              <h1 className="text-[44px] font-semibold leading-[52px] tracking-[-0.96px] text-[#222] sm:text-[48px] sm:leading-[60px]">
                Homework Task Reminder
              </h1>
              <p className="text-base leading-5 tracking-[0.32px] text-[#6b7280]">
                Kelola dan selesaikan tugas yang belum beres tepat waktu.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-[15px] 2xl:mt-0 2xl:w-[996px] 2xl:justify-end">
              <AddTaskButton onClick={() => setIsModalOpen(true)} />
              {dynamicMetrics.map((metric) => (
                <MetricCard key={metric.state} {...metric} />
              ))}
            </div>
          </header>

          <section
            aria-label="Filter tugas"
            className="mt-4 flex flex-wrap items-center gap-[9px]"
          >
            <label className="relative block h-14 w-full max-w-[599px]">
              <span className="sr-only">Cari tugas, proyek, atau lokasi ...</span>
              <MaterialIcon
                name="search"
                size="auto"
                weight={300}
                filled={false}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[24px] leading-none text-[#525e61]"
              />
              <input
                type="search"
                placeholder="Cari tugas, proyek, atau lokasi ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 w-full rounded-xl border border-[#d7dcdd] bg-white py-4 pl-[50px] pr-4 text-base tracking-[0.32px] text-[#222] outline-none placeholder:text-[#aeb6b8] focus:border-[#8474f9] focus:ring-2 focus:ring-[#8474f9]/15"
              />
            </label>

            <ToolbarDropdown 
              icon="filter_alt" 
              label="Status" 
              options={["Semua Status", "Belum Selesai", "In Progress", "Selesai"]}
              value={filterStatus}
              onChange={setFilterStatus}
            />
            <ToolbarDropdown 
              icon="storefront" 
              label="Vendor" 
              options={vendorOptions}
              value={filterVendor}
              onChange={setFilterVendor}
            />
            <ToolbarDropdown 
              icon="sort" 
              label="Urutkan" 
              options={["Tenggat Waktu Terdekat", "Tenggat Waktu Terjauh", "Terbaru Ditambahkan"]}
              value={sortOption}
              onChange={setSortOption}
            />
          </section>

          <section
            aria-label="Task Card"
            className="mt-4 flex flex-col items-stretch gap-3 w-full"
          >
            {filteredTasks.map((task) => (
              <TaskCard 
                key={task.id}
                id={task.id}
                state={task.status as TaskCardState} 
                timestamps={task.task_timestamps || {}}
                title={task.task_name}
                picVendor={task.pic_vendor}
                givenDate={task.task_given_date}
                deadlineDate={task.deadline_date}
                assignedUsers={task.users}
                supportFileUrl={task.support_file_path}
                draftFileUrl={task.draft_file_path}
                fileLink={task.file_link}
                onStepClick={(step) => handleStepClick(task.id, step)}
                onNextClick={(link) => handleNextClick(task.id, link)}
                onDeleteConfirm={() => handleDelete(task.id)}
                onRefresh={fetchTasks}
              />
            ))}
            {filteredTasks.length === 0 && (
              <div className="py-12 text-center text-gray-500">Belum ada tugas yang sesuai.</div>
            )}
          </section>
        </div>
      </main>

      <TaskFormModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchTasks(); // refresh after add
        }} 
      />
    </div>
  );
}
