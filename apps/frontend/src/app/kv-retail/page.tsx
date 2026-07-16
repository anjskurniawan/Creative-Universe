"use client";

import { useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { Navbar } from "@/components/navbar";
import { SideMenu, type SideMenuItem, type SideMenuVariant } from "@/components/side-menu";
import { TaskMobileNavigation } from "@/components/task-mobile-navigation";
import { TaskDesktopPageTransition } from "@/components/task-desktop-page-transition";
import { TaskcardMobileFullCard, type TaskcardMobileChange, type TaskcardMobileTone } from "@/components/taskcard-mobile";
import { type TaskCardConfig } from "@/components/taskcard";
import { TaskCard, type TaskCardState } from "@/components/task-card";
import { TaskFormModal } from "@/components/task-form-modal";
import { resolveStorageUrl } from "@/core/api/client";
import { coreApi } from "@/core/api";
import { kvRetailApi, type KvRetailTask, type KvRetailTaskEvent } from "@/features/kv-retail/api";
import { useKvRetailTasks } from "@/features/kv-retail/hooks";
import { getEchoClient } from "@/core/realtime";
import { useAuth } from "@/providers/auth-provider";

type MetricState = "Total" | "Progress" | "Mendesak" | "Done";
type MobileTaskFilterMenu = "vendor" | "sort" | null;
export type TaskPageScope = "all" | "unfinished" | "current-month";

type TaskSettings = Partial<TaskCardConfig> & {
  task_page_title?: string;
  task_page_subtitle?: string;
};

const TASK_SETTING_KEYS = "task_page_title,task_page_subtitle,vendor_options,delete_overlay_title,delete_overlay_cancel,delete_overlay_confirm,upload_overlay_title_support,upload_overlay_title_draft,upload_overlay_cancel,upload_overlay_submit,upload_overlay_saving,submit_link_title,submit_link_desc,submit_link_placeholder,submit_link_cancel,submit_link_submit,view_link_title,view_link_desc,view_link_cancel,view_link_copy,btn_status_draft,btn_status_progress,btn_status_approve,btn_status_email,detail_status_1,detail_status_2,detail_dropdown_file,detail_dropdown_upload,detail_link_file,task_empty_state,color_done_bg,color_done_text,color_progress_bg,color_progress_text,color_delete_bg,color_delete_text,icon_file_empty,icon_file_filled".split(",");

function normalizeFileList(value: unknown): (string | null)[] | undefined {
  if (!Array.isArray(value)) return undefined;

  return value.map((item) => (typeof item === "string" ? item : null));
}

function formatMobileTaskDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

function getMobileTaskTone(task: KvRetailTask): TaskcardMobileTone {
  if (task.status === "Done") return "done";
  if (!task.deadline_date) return "default";

  const deadline = new Date(task.deadline_date);
  if (Number.isNaN(deadline.getTime())) return "default";

  deadline.setHours(0, 0, 0, 0);
  return deadline.getTime() < new Date().setHours(0, 0, 0, 0) ? "emergency" : "default";
}

function delayReasonStageForStatus(status: TaskCardState): string | null {
  const stages: Partial<Record<TaskCardState, string>> = {
    "Progress Design": "ACC Draft",
    "Approval Design": "Progress Design",
    "Kirim Email": "Approval Design",
  };

  return stages[status] ?? null;
}

function nextTaskStatus(status: string): TaskCardState | null {
  const currentIndex = TASK_CARD_STATES.indexOf(status as TaskCardState);
  return currentIndex >= 0 && currentIndex < TASK_CARD_STATES.length - 1
    ? TASK_CARD_STATES[currentIndex + 1]
    : null;
}

function requiredDelayReasonStage(task: KvRetailTask): string | undefined {
  const nextStatus = nextTaskStatus(task.status);
  const stage = nextStatus ? delayReasonStageForStatus(nextStatus) : null;

  return stage && task.timing_evaluation?.violations?.[stage]?.late ? stage : undefined;
}

function getMobileTaskChanges(task: KvRetailTask): TaskcardMobileChange[] {
  const labels: Array<[string, string]> = [
    ["ACC Draft", "ACC Draft"],
    ["Progress", "Progress Design"],
    ["Approve", "Approval Design"],
    ["Email", "Kirim Email"],
  ];

  return labels.flatMap<TaskcardMobileChange>(([key, label]) => {
    const timestamp = task.task_timestamps?.[key];
    return timestamp ? [{ label, timestamp }] : [];
  }).concat(
    Object.entries(task.timing_evaluation?.violations ?? {})
      .filter(([, violation]) => violation.late)
      .map(([stage]) => ({ label: `Bottleneck: ${stage} terlambat` })),
  );
}

function getMobileAssignedUsers(users?: unknown[]) {
  if (!Array.isArray(users)) return "";

  return users
    .map((user) => {
      if (typeof user !== "object" || user === null || !("name" in user)) return "";
      const name = (user as { name?: unknown }).name;
      return typeof name === "string" ? name : "";
    })
    .filter(Boolean)
    .join(", ");
}

function getMobileCountdown(task: KvRetailTask) {
  if (!task.deadline_date) return "Tanpa tenggat";
  const deadline = new Date(task.deadline_date);
  if (Number.isNaN(deadline.getTime())) return "Tanpa tenggat";

  deadline.setHours(0, 0, 0, 0);
  const days = Math.round((deadline.getTime() - new Date().setHours(0, 0, 0, 0)) / 86_400_000);
  if (days < 0) return `Telat ${Math.abs(days)} Hari`;
  if (days === 0) return "Hari Ini";
  return `${days} Hari lagi`;
}

function getCurrentMonthTaskSubtitle() {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const now = new Date();
  return `Tugas bulan ${months[now.getMonth()]} ${now.getFullYear()}`;
}

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
    href: "/kv-retail",
    status: "Active",
  },
  { label: "Tugas Belum Selesai", icon: "assignment_late", href: "/kv-retail/unfinished" },
  { label: "Tugas Bulan Ini", icon: "calendar_month", href: "/kv-retail/month" },
  { label: "Rekap Performa", icon: "analytics", href: "/kv-retail/performance" },
  {
    label: "Option Page",
    icon: "settings",
    href: "/kv-retail/option",
  },
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

export function TaskPage({ scope = "all" }: { scope?: TaskPageScope }) {
  const [mobileSidebarVariant, setMobileSidebarVariant] =
    useState<SideMenuVariant>("Collaps");
  const [desktopSidebarVariant, setDesktopSidebarVariant] =
    useState<SideMenuVariant>("Expand");
  
  const { tasks, refresh: fetchTasks, merge: mergeTask, mutate: mutateTask, remove: removeTask } = useKvRetailTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const { user, hasPermission } = useAuth();
  const [filterVendor, setFilterVendor] = useState("Semua Vendor");
  const [sortOption, setSortOption] = useState("Tenggat Waktu Terdekat");
  const [mobileFilterMenu, setMobileFilterMenu] = useState<MobileTaskFilterMenu>(null);

  const [pageTitle, setPageTitle] = useState("Branding Key Visual Retail");
  const [pageSubtitle, setPageSubtitle] = useState("Kelola dan selesaikan tugas yang belum beres tepat waktu.");
  const [taskConfig, setTaskConfig] = useState<TaskCardConfig>({});
  const [currentTime, setCurrentTime] = useState(0);
  const summaryScrollDrag = useRef({ pointerId: -1, startX: 0, scrollLeft: 0 });
  const scopedPageSubtitle = scope === "current-month"
    ? getCurrentMonthTaskSubtitle()
    : scope === "unfinished"
    ? "Daftar tugas yang belum selesai."
    : pageSubtitle;
  const activeTaskMenuLabel = scope === "unfinished"
    ? "Tugas Belum Selesai"
    : scope === "current-month"
    ? "Tugas Bulan Ini"
    : "Tugas Hari Ini";
  const isTaskAdministrator = hasPermission("kv-retail.tasks.create");
  const isMentionOnlyUser = Boolean(user && !isTaskAdministrator);
  const primaryMenuItems = PRIMARY_MENU
    .filter((item) => !isMentionOnlyUser || item.label === "Tugas Hari Ini")
    .map((item) => ({
    ...item,
    status: item.label === activeTaskMenuLabel ? "Active" as const : undefined,
  }));

  useEffect(() => {
    if (isMentionOnlyUser && scope !== "all") {
      window.location.replace("/kv-retail");
    }
  }, [isMentionOnlyUser, scope]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await coreApi.settings.get<TaskSettings>(TASK_SETTING_KEYS);
        if (data?.task_page_title) setPageTitle(data.task_page_title);
        if (data?.task_page_subtitle) setPageSubtitle(data.task_page_subtitle);
        
        // Populate config
        const newConfig: TaskCardConfig = {};
        for (const key in data) {
          if (key !== "task_page_title" && key !== "task_page_subtitle") {
            const configKey = key as keyof TaskCardConfig;
            newConfig[configKey] = data[configKey];
          }
        }
        setTaskConfig(newConfig);
      } catch (err) {
        console.error("Gagal memuat pengaturan:", err);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const echo = getEchoClient();
    if (!echo) return;

    const channelName = `App.Models.Core.User.${user.id}`;
    const channel = echo.private(channelName);
    const refreshAssignedTasks = (event: KvRetailTaskEvent) => {
      if (event?.task) {
        setCurrentTime(Date.now());
        mergeTask(event.task);
        return;
      }

      void fetchTasks();
    };

    channel.listen(".kv-retail.task.assigned", refreshAssignedTasks);
    channel.listen(".kv-retail.task.updated", refreshAssignedTasks);

    return () => {
      channel.stopListening(".kv-retail.task.assigned");
      channel.stopListening(".kv-retail.task.updated");
    };
  }, [fetchTasks, mergeTask, user?.id]);


  const handleStepClick = async (taskId: number, step: string, delayReason?: string) => {
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

    const reasonStage = delayReasonStageForStatus(mappedState);
    const requiresReason = Boolean(reasonStage && task.timing_evaluation?.violations?.[reasonStage]?.late);
    if (requiresReason && !delayReason) return;

    const newTimestamps = { ...(task.task_timestamps || {}), [step]: formatted };

    try {
      setCurrentTime(now.getTime());
      await mutateTask(
        taskId,
        (currentTask) => ({ ...currentTask, status: mappedState, task_timestamps: newTimestamps }),
        () => kvRetailApi.tasks.updateStatus(taskId, {
          status: mappedState,
          task_timestamps: newTimestamps,
          ...(delayReason ? { delay_reason: delayReason } : {}),
        }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextClick = async (taskId: number, link?: string, delayReason?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const currentIndex = TASK_CARD_STATES.indexOf(task.status as TaskCardState);
    if (currentIndex === TASK_CARD_STATES.length - 1) return; // Prevent resetting when already Done
    
    const nextIndex = currentIndex + 1;
    const nextStatus = TASK_CARD_STATES[nextIndex];
    const reasonStage = delayReasonStageForStatus(nextStatus);
    const requiresReason = Boolean(reasonStage && task.timing_evaluation?.violations?.[reasonStage]?.late);
    if (requiresReason && !delayReason) return;

    try {
      const payload: { status: TaskCardState; file_link?: string; delay_reason?: string } = { status: nextStatus };
      if (link) payload.file_link = link;
      if (delayReason) payload.delay_reason = delayReason;

      setCurrentTime(new Date().getTime());
      await mutateTask(
        taskId,
        (currentTask) => ({ ...currentTask, status: nextStatus, file_link: link ?? currentTask.file_link }),
        () => kvRetailApi.tasks.updateStatus(taskId, payload),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      await kvRetailApi.tasks.remove(taskId);
      removeTask(taskId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMobileFileUpload = async (taskId: number, fileType: "support_file" | "draft_file", fileIndex: number, file: File) => {
    const formData = new FormData();
    formData.append(fileType, file);
    formData.append("file_index", String(fileIndex));

    const savedTask = await kvRetailApi.tasks.uploadFile(taskId, formData);
    mergeTask(savedTask);
  };

  const handleMobileSubmitLink = async (taskId: number, fileLink: string, delayReason?: string) => {
    await handleNextClick(taskId, fileLink, delayReason);
  };

  const handleMobileViewFile = (file: string) => {
    window.open(resolveStorageUrl(file) ?? undefined, "_blank");
  };

  const scopedTasks = tasks.filter((task) => {
    if (scope === "unfinished") return task.status !== "Done";
    if (scope !== "current-month") return true;

    const taskDate = new Date(task.task_given_date || task.created_at || "");
    const now = new Date();
    return !Number.isNaN(taskDate.getTime()) &&
      taskDate.getMonth() === now.getMonth() &&
      taskDate.getFullYear() === now.getFullYear();
  });

  const totalTasks = scopedTasks.filter(t => t.status !== "Done").length;
  const inProgress = scopedTasks.filter(t => ["ACC Draft", "Progress Design", "Approval Design", "Kirim Email"].includes(t.status)).length;
  const mendesak = scopedTasks.filter(t => {
    if (t.status === "Done") return false;
    if (!t.deadline_date) return false;
    const d = new Date(t.deadline_date);
    const diff = Math.ceil((d.getTime() - currentTime) / (1000 * 3600 * 24));
    return diff <= 1; // 1 day left, or negative (past deadline)
  }).length;
  const selesai = scopedTasks.filter(t => t.status === "Done").length;

  const dynamicMetrics = [
    { state: "Total" as MetricState, title: "Total Tugas", value: totalTasks, icon: "assignment" },
    { state: "Progress" as MetricState, title: "In Progress", value: inProgress, icon: "hourglass_bottom" },
    { state: "Mendesak" as MetricState, title: "Mendesak", value: mendesak, icon: "warning_amber" },
    { state: "Done" as MetricState, title: "Selesai", value: selesai, icon: "check_circle" },
  ];
  const mobileMetrics = scope === "unfinished"
    ? dynamicMetrics.filter((metric) => metric.state === "Total")
    : dynamicMetrics;
  const desktopMetrics = scope === "unfinished"
    ? dynamicMetrics.filter((metric) => metric.state === "Total")
    : dynamicMetrics;

  const vendorOptions = [
    "Semua Vendor",
    ...Array.from(new Set(scopedTasks.map(t => t.pic_vendor).filter((vendor): vendor is string => Boolean(vendor)))),
  ];
  const sortOptions = ["Tenggat Waktu Terdekat", "Tenggat Waktu Terjauh", "Terbaru Ditambahkan"];

  const filteredTasks = [...scopedTasks].filter((task) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = task.task_name?.toLowerCase().includes(q);
      const matchVendor = task.pic_vendor?.toLowerCase().includes(q);
      if (!matchName && !matchVendor) return false;
    }
    
    if (filterVendor !== "Semua Vendor" && task.pic_vendor !== filterVendor) return false;

    return true;
  }).sort((a, b) => {
    // 1. Send "Done" tasks to the bottom
    const aDone = a.status === "Done" ? 1 : 0;
    const bDone = b.status === "Done" ? 1 : 0;
    if (aDone !== bDone) {
      return aDone - bDone;
    }

    // 2. Then apply the chosen sort option
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
    <>
      <div className="lg:hidden">
        <Navbar />
      </div>

      <main className="min-h-[calc(100dvh-72px)] bg-white px-4 pt-3 lg:hidden">
        <header>
          <h1 className="text-lg font-semibold leading-6 text-black">
            {pageTitle}
          </h1>
          <p className="mt-0.5 text-xs leading-4 text-[#7b868a]">
            {scopedPageSubtitle}
          </p>
        </header>

        <section
          aria-label="Ringkasan tugas"
          className="mt-3 flex touch-pan-x select-none overflow-x-auto border-b-2 border-[#aeb6b8] no-scrollbar cursor-grab active:cursor-grabbing"
          onPointerDown={(event) => {
            if ((event.target as HTMLElement).closest("button")) return;

            summaryScrollDrag.current = {
              pointerId: event.pointerId,
              startX: event.clientX,
              scrollLeft: event.currentTarget.scrollLeft,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (summaryScrollDrag.current.pointerId !== event.pointerId) return;

            event.currentTarget.scrollLeft =
              summaryScrollDrag.current.scrollLeft -
              (event.clientX - summaryScrollDrag.current.startX);
          }}
          onPointerUp={(event) => {
            if (summaryScrollDrag.current.pointerId !== event.pointerId) return;
            summaryScrollDrag.current.pointerId = -1;
            event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={() => {
            summaryScrollDrag.current.pointerId = -1;
          }}
        >
          {scope === "all" && !isMentionOnlyUser && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex shrink-0 items-center gap-1 border-b-2 border-[#ea4c89] px-2 py-2 text-xs leading-4 text-[#3b4446]"
            >
              <MaterialIcon name="add" size="auto" weight={400} className="text-base leading-none" />
              Buat Tugas
            </button>
          )}
          {mobileMetrics.map((metric) => (
            <div
              key={metric.state}
              className="flex shrink-0 items-center gap-1 px-2 py-2 text-xs leading-4 text-[#aeb6b8]"
            >
              <span>{metric.value}</span>
              <span>{metric.title}</span>
            </div>
          ))}
        </section>

        <section aria-label="Filter tugas" className="mt-3 flex items-center gap-1">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Cari tugas, proyek, atau lokasi ...</span>
            <MaterialIcon
              name="search"
              size="auto"
              weight={400}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl leading-none text-[#525e61]"
            />
            <input
              type="search"
              placeholder="Cari tugas, proyek, atau lokasi ..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-9 w-full rounded-xl border border-[#d7dcdd] bg-white py-2 pl-10 pr-3 text-xs tracking-[0.24px] text-[#3b4446] outline-none placeholder:text-[#aeb6b8] focus:border-[#ea4c89] focus:ring-2 focus:ring-[#ea4c89]/15"
            />
          </label>
          <div className="relative flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label="Filter vendor"
              aria-expanded={mobileFilterMenu === "vendor"}
              onClick={() => setMobileFilterMenu((current) => current === "vendor" ? null : "vendor")}
              className="flex size-9 items-center justify-center rounded-xl border border-[#d7dcdd] text-[#525e61]"
            >
              <MaterialIcon name="storefront" size="auto" weight={400} className="text-xl leading-none" />
            </button>
            <button
              type="button"
              aria-label="Urutkan tugas"
              aria-expanded={mobileFilterMenu === "sort"}
              onClick={() => setMobileFilterMenu((current) => current === "sort" ? null : "sort")}
              className="flex size-9 items-center justify-center rounded-xl border border-[#d7dcdd] text-[#525e61]"
            >
              <MaterialIcon name="filter_list" size="auto" weight={400} className="text-xl leading-none" />
            </button>

            {mobileFilterMenu && (
              <>
                <button
                  type="button"
                  aria-label="Tutup menu filter"
                  onClick={() => setMobileFilterMenu(null)}
                  className="fixed inset-0 z-10 cursor-default"
                />
                <div className="absolute right-0 top-11 z-20 flex w-56 flex-col gap-1 rounded-xl border border-[#d7dcdd] bg-white p-1.5 shadow-lg">
                  <p className="px-2 py-1 text-xs font-semibold text-[#525e61]">
                    {mobileFilterMenu === "vendor" ? "Filter Vendor" : "Urutkan Tugas"}
                  </p>
                  {(mobileFilterMenu === "vendor" ? vendorOptions : sortOptions).map((option) => {
                    const selected = mobileFilterMenu === "vendor" ? filterVendor === option : sortOption === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          if (mobileFilterMenu === "vendor") setFilterVendor(option);
                          else setSortOption(option);
                          setMobileFilterMenu(null);
                        }}
                        className={[
                          "rounded-lg px-2 py-2 text-left text-xs leading-4",
                          selected ? "bg-[#eeebff] font-semibold text-[#8474f9]" : "text-[#3b4446] hover:bg-[#f3f4f6]",
                        ].join(" ")}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>

        <section aria-label="Daftar tugas" className="mt-4 flex flex-col gap-2 pb-20">
          {filteredTasks.map((task) => (
            <TaskcardMobileFullCard
              key={task.id}
              title={task.task_name || "Tugas tanpa judul"}
              dateRange={`${formatMobileTaskDate(task.task_given_date)} - ${formatMobileTaskDate(task.deadline_date)}`}
              vendor={task.pic_vendor || "-"}
              assignedTo={getMobileAssignedUsers(task.users)}
              status={task.status === "0" ? "-" : task.status}
              tone={getMobileTaskTone(task)}
              delayReasonStage={requiredDelayReasonStage(task)}
              changes={getMobileTaskChanges(task)}
              countdownLabel={getMobileCountdown(task)}
              fileLabels={[
                taskConfig.detail_status_1 || "3D Gambar Kerja",
                taskConfig.detail_status_2 || "Draft Final",
              ]}
              uploadedFileStates={[
                Boolean(normalizeFileList(task.support_file_path)?.some(Boolean)),
                Boolean(normalizeFileList(task.draft_file_path)?.some(Boolean)),
              ]}
              fileSlotFiles={[
                normalizeFileList(task.support_file_path) || [null, null, null],
                normalizeFileList(task.draft_file_path) || [null, null, null],
              ]}
              fileLink={task.file_link}
              defaultOpen={false}
              onChangeStatus={(delayReason) => {
                const nextStep: Record<string, "ACC Draft" | "Progress" | "Approve" | "Email" | null> = {
                  "0": "ACC Draft",
                  "ACC Draft": "Progress",
                  "Progress Design": "Approve",
                  "Approval Design": "Email",
                  "Kirim Email": null,
                  Done: null,
                };
                const step = nextStep[task.status];
                if (step) return handleStepClick(task.id, step, delayReason);
                return handleNextClick(task.id, undefined, delayReason);
              }}
              onDelete={() => handleDelete(task.id)}
              onUpload={(file, groupIndex, fileIndex) => handleMobileFileUpload(task.id, groupIndex === 0 ? "support_file" : "draft_file", fileIndex, file)}
              onViewFile={handleMobileViewFile}
              onSubmitLink={(fileLink, delayReason) => handleMobileSubmitLink(task.id, fileLink, delayReason)}
            />
          ))}
          {filteredTasks.length === 0 && (
            <p className="py-8 text-center text-xs text-[#7b868a]">
              {taskConfig.task_empty_state || "Belum ada tugas yang sesuai."}
            </p>
          )}
        </section>
      </main>

      <div className="lg:hidden">
        <TaskMobileNavigation
          items={primaryMenuItems}
          activeLabel={activeTaskMenuLabel}
        />
      </div>

      <div className="hidden min-h-screen grid-cols-[auto_minmax(0,1fr)] bg-[#f6faff] text-[#222] lg:grid">
      <SideMenu
        variant={mobileSidebarVariant}
        primaryItems={primaryMenuItems}
        onVariantChange={setMobileSidebarVariant}
        className="lg:hidden"
      />
      <SideMenu
        variant={desktopSidebarVariant}
        primaryItems={primaryMenuItems}
        onVariantChange={setDesktopSidebarVariant}
        className="hidden lg:flex"
      />

      <TaskDesktopPageTransition className="min-w-0 flex h-screen flex-col overflow-hidden px-4 sm:px-8 lg:pl-12 lg:pr-16">
        <div className="w-full shrink-0 pt-8 pb-4">
          <div>
            <header className="min-h-[140px] gap-6 2xl:flex 2xl:items-center 2xl:justify-between">
              <div className="w-full max-w-[590px] shrink-0">
                <h1 className="text-[44px] font-semibold leading-[52px] tracking-[-0.96px] text-[#222] sm:text-[48px] sm:leading-[60px]">
                  {pageTitle}
                </h1>
                <p className="mt-3 text-base leading-5 tracking-[0.32px] text-[#6b7280]">
                  {scopedPageSubtitle}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-[15px] 2xl:mt-0 2xl:w-[996px] 2xl:justify-end">
                {scope === "all" && !isMentionOnlyUser && <AddTaskButton onClick={() => setIsModalOpen(true)} />}
                {desktopMetrics.map((metric) => (
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
                icon="storefront" 
                label="Vendor" 
                options={vendorOptions}
                value={filterVendor}
                onChange={setFilterVendor}
              />
              <ToolbarDropdown 
                icon="sort" 
                label="Urutkan" 
                options={sortOptions}
                value={sortOption}
                onChange={setSortOption}
              />
            </section>
          </div>
        </div>

        <section
          aria-label="Task Card"
          className="flex-1 overflow-y-auto w-full pb-20 pr-2 -mr-2 no-scrollbar"
        >
          <div className="flex flex-col items-stretch gap-3">
            {filteredTasks.map((task) => (
              <TaskCard 
                key={task.id}
                id={task.id}
                currentUser={user}
                createdBy={task.created_by ?? undefined}
                state={task.status as TaskCardState} 
                timestamps={task.task_timestamps || {}}
                title={task.task_name ?? undefined}
                picVendor={task.pic_vendor ?? undefined}
                givenDate={task.task_given_date ?? undefined}
                deadlineDate={task.deadline_date ?? undefined}
                assignedUsers={task.users}
                supportFileUrl={normalizeFileList(task.support_file_path)}
                draftFileUrl={normalizeFileList(task.draft_file_path)}
                fileLink={task.file_link}
                delayReasonStage={requiredDelayReasonStage(task)}
                onStepClick={(step, delayReason) => handleStepClick(task.id, step, delayReason)}
                onNextClick={(link, delayReason) => handleNextClick(task.id, link, delayReason)}
                onDeleteConfirm={() => handleDelete(task.id)}
                onRefresh={fetchTasks}
                config={taskConfig}
              />
            ))}
            {filteredTasks.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                {taskConfig.task_empty_state || "Belum ada tugas yang sesuai."}
              </div>
            )}
          </div>
        </section>
      </TaskDesktopPageTransition>

      </div>

      <TaskFormModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchTasks(); // refresh after add
        }} 
      />
    </>
  );
}

export default TaskPage;
