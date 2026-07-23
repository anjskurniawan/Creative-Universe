"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { type SideMenuItem } from "@/components/side-menu";
import { TaskDesktopPageTransition } from "@/components/task-desktop-page-transition";
import { type TaskcardMobileChange, type TaskcardMobileTone } from "@/components/taskcard-mobile";
import { TaskCardMobile, type TaskCardConfig } from "@/components/taskcard";
import { TaskCard, type TaskCardState } from "@/components/task-card";
import { TaskFormModal } from "@/components/task-form-modal";
import { PerformanceNavbar } from "@/features/kv-retail/components/performance-navbar";
import { PerformanceSidebar } from "@/features/kv-retail/components/performance-sidebar";
import { resolveStorageUrl } from "@/core/api/client";
import { coreApi } from "@/core/api";
import { kvRetailApi, type KvRetailTask, type KvRetailTaskDeletedEvent, type KvRetailTaskEvent } from "@/features/kv-retail/api";
import { useKvRetailDesktopSidebar, useKvRetailTasks } from "@/features/kv-retail/hooks";
import { getEchoClient } from "@/core/realtime";
import { useAuth } from "@/providers/auth-provider";

type MetricState = "Total" | "Progress" | "OnTrack" | "Terlambat" | "Done";
type DesktopTheme = "light" | "dark" | "retro";

export type TaskPageScope = "all" | "unfinished" | "current-month";

type TaskSettings = Partial<TaskCardConfig> & {
  task_page_title_today?: string;
  task_page_title_unfinished?: string;
  task_page_title_month?: string;
};

const TASK_SETTING_KEYS = "task_page_title_today,task_page_title_unfinished,task_page_title_month,vendor_options,delete_overlay_title,delete_overlay_cancel,delete_overlay_confirm,upload_overlay_title_support,upload_overlay_title_draft,upload_overlay_cancel,upload_overlay_submit,upload_overlay_saving,submit_link_title,submit_link_desc,submit_link_placeholder,submit_link_cancel,submit_link_submit,view_link_title,view_link_desc,view_link_cancel,view_link_copy,btn_status_draft,btn_status_progress,btn_status_approve,btn_status_email,detail_status_1,detail_status_2,detail_dropdown_file,detail_dropdown_upload,detail_link_file,task_empty_state".split(",");

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
    if (!timestamp) return [];

    const isBottleneck = task.timing_evaluation?.violations?.[label]?.late;
    const recordedReason = task.delay_reasons?.[label]?.reason ?? task.delay_reasons?.[key]?.reason;
    return [{
      label,
      timestamp: isBottleneck ? `${timestamp} · Bottleneck` : timestamp,
      reason: recordedReason || (isBottleneck ? "Melewati batas waktu pada tahap ini." : undefined),
    }];
  });
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

function getMobileAssignedAvatars(users?: unknown[]) {
  if (!Array.isArray(users)) return [];

  return users.flatMap((user) => {
    if (typeof user !== "object" || user === null || !("name" in user)) return [];
    const record = user as Record<string, unknown>;
    const name = typeof record.name === "string" ? record.name : "";
    if (!name) return [];
    const photoPath = [record.avatar_url, record.profile_photo_url, record.photo_url, record.avatar]
      .find((value): value is string => typeof value === "string" && value.length > 0);
    return [{ name, photoUrl: photoPath ? resolveStorageUrl(photoPath) : null }];
  });
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
    label: "Daftar Tugas",
    icon: "list_alt_check",
    href: "/kv-retail",
    status: "Active",
  },
  { label: "Segera Selesaikan", icon: "alarm", href: "/kv-retail/unfinished" },
  { label: "Tugas Bulan Ini", icon: "calendar_month", href: "/kv-retail/month" },
  { label: "Performa", icon: "analytics", href: "/kv-retail/performance" },
  {
    label: "Setting",
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
  OnTrack: {
    iconBox: "bg-[#e5f6fd]",
    icon: "text-[#0288d1]",
  },
  Terlambat: {
    iconBox: "bg-[#ffe2dd]",
    icon: "text-[#ff5b55]",
  },
  Done: {
    iconBox: "bg-[#efffee]",
    icon: "text-[#2b9915]",
  },
};

function CombinedMetricCard({ 
  metrics,
  actionButton,
  theme,
  fill = false,
}: { 
  metrics: { title: string; value: number; icon: string; state: MetricState }[];
  actionButton?: React.ReactNode;
  theme: DesktopTheme;
  fill?: boolean;
}) {
  if (metrics.length === 0 && !actionButton) return null;
  const isDark = theme === "dark";
  const isRetro = theme === "retro";
  return (
    <div className={`flex ${fill ? "w-full" : "w-full"} min-w-0 items-stretch overflow-hidden rounded-2xl ${isDark ? "border border-white/10 bg-[#171717] shadow-[0_10px_26px_rgba(0,0,0,0.2)]" : isRetro ? "border-2 border-[#24252b] bg-[#eceee6] shadow-[3px_3px_0_#24252b]" : "border border-[#e5e7eb] bg-white shadow-sm"}`}>
      {actionButton && (
        <div className={`z-[1] flex shrink-0 items-center justify-center ${isDark ? "border-r border-white/10" : isRetro ? "border-r-2 border-[#24252b]" : "border-r border-[#e5e7eb]"}`}>
          {actionButton}
        </div>
      )}
      <div className={`kv-retail-kpi-scroll flex min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isDark ? "divide-x divide-white/10" : isRetro ? "divide-x divide-[#24252b]/20" : "divide-x divide-[#e5e7eb]"}`}>
      {metrics.map((metric) => {
        const tone = metricToneClasses[metric.state];
        return (
          <div key={metric.state} className={`flex h-[76px] items-center gap-4 px-5 py-3 min-w-[150px] shrink-0 ${fill ? "flex-1 justify-start" : ""}`}>
            <div
              className={[
                "flex size-11 shrink-0 items-center justify-center rounded-xl",
                isDark ? "bg-[#202820]" : isRetro ? "bg-[#dfe2d3]" : tone.iconBox,
              ].join(" ")}
            >
              <MaterialIcon
                name={metric.icon}
                size="auto"
                weight={400}
                filled={false}
                className={["text-[22px] leading-none", isDark ? "text-[#b0ff5e]" : isRetro ? "text-[#24252b]" : tone.icon].join(" ")}
              />
            </div>
            <div className="flex flex-col">
              <p className={`text-[22px] font-bold leading-none ${isDark ? "text-[#f1f1f1]" : "text-[#111827]"}`}>
                {metric.value}
              </p>
              <p className={`mt-1.5 whitespace-nowrap text-[12px] font-medium ${isDark ? "text-[#b9b9b9]" : "text-[#6b7280]"}`}>
                {metric.title}
              </p>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

function AddTaskButton({ onClick, theme }: { onClick?: () => void; theme: DesktopTheme }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add Button"
      className={`flex h-[76px] w-[76px] shrink-0 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 ${theme === "dark" ? "bg-[#b0ff5e] text-[#181818] hover:bg-[#c6ff89] focus-visible:ring-[#b0ff5e]/40" : theme === "retro" ? "bg-[#ba0dcb] text-white hover:bg-[#9c0bac] focus-visible:ring-[#ba0dcb]/40" : "bg-[#ec4899] text-white hover:bg-[#db2777] focus-visible:ring-[#ec4899]/40"}`}
    >
      <MaterialIcon
        name="add"
        size="auto"
        weight={300}
        filled={false}
        className="text-[48px] leading-none"
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
  theme,
  compact = false,
}: {
  icon: string;
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  theme: DesktopTheme;
  compact?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === "dark";
  const isRetro = theme === "retro";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`${label}: ${value === options[0] ? label : value}`}
        className={`flex shrink-0 items-center justify-center gap-2.5 rounded-xl px-4 tracking-[0.32px] transition-colors focus-visible:outline-none focus-visible:ring-2 ${compact ? "size-12 px-0 text-sm" : "h-[76px] text-base"} ${isDark ? "border border-white/10 bg-[#171717] text-[#f1f1f1] hover:bg-[#202820] focus-visible:ring-[#b0ff5e]/30" : isRetro ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] hover:bg-[#dfe2d3] focus-visible:ring-[#ba0dcb]/30" : "border border-[#d7dcdd] bg-white text-[#525e61] hover:border-[#bfc7c9] hover:bg-[#fbfdff] focus-visible:ring-[#8474f9]/25"}`}
      >
        <MaterialIcon
          name={icon}
          size="auto"
          weight={300}
          filled={false}
          className="text-[24px] leading-none"
        />
        {!compact && <span className="hidden max-w-[120px] truncate 2xl:inline">{value === options[0] ? label : value}</span>}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className={`absolute left-0 top-[110%] z-20 flex w-48 flex-col rounded-xl p-1 ${isDark ? "border border-white/10 bg-[#171717] shadow-[0_12px_30px_rgba(0,0,0,0.36)]" : isRetro ? "border-2 border-[#24252b] bg-[#eceee6] shadow-[3px_3px_0_#24252b]" : "border border-[#e5e7eb] bg-white shadow-lg"}`}>
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-start rounded-lg px-3 py-2 text-sm transition-colors ${
                  value === opt
                    ? isDark ? "bg-[#b0ff5e] font-medium text-[#181818]" : isRetro ? "bg-[#ba0dcb] font-medium text-white" : "bg-violet-50 font-medium text-[#8474f9]"
                    : isDark ? "text-[#f1f1f1] hover:bg-[#202820]" : isRetro ? "text-[#24252b] hover:bg-[#dfe2d3]" : "text-gray-700 hover:bg-gray-100"
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
  const [desktopTheme, setDesktopTheme] = useState<"light" | "dark" | "retro">("light");
  const { expanded: desktopShellExpanded, toggleExpanded: toggleDesktopShellExpanded } = useKvRetailDesktopSidebar();
  
  const { tasks, isLoading: isTasksLoading, refresh: fetchTasks, merge: mergeTask, mutate: mutateTask, remove: removeTask } = useKvRetailTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const { user, hasPermission } = useAuth();
  const [filterVendor, setFilterVendor] = useState("Semua Vendor");
  const [sortOption, setSortOption] = useState("Tenggat Waktu Terdekat");


  const [todayTitle, setTodayTitle] = useState("Daftar Tugas");
  const [unfinishedTitle, setUnfinishedTitle] = useState("Segera Selesaikan");
  const [monthTitle, setMonthTitle] = useState("Tugas Bulan Ini");
  const [taskConfig, setTaskConfig] = useState<TaskCardConfig>({});
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const summaryScrollDrag = useRef({ pointerId: -1, startX: 0, scrollLeft: 0 });
  const taskListScrollRef = useRef<HTMLDivElement>(null);
  const [showTaskListFade, setShowTaskListFade] = useState(false);
  const mobileTaskListScrollRef = useRef<HTMLElement>(null);
  const [showMobileTaskListFade, setShowMobileTaskListFade] = useState(false);
  const scopedPageTitle = scope === "current-month"
    ? monthTitle
    : scope === "unfinished"
    ? unfinishedTitle
    : todayTitle;
  const desktopTaskRoute = scope === "unfinished"
    ? "/kv-retail/unfinished"
    : scope === "current-month"
    ? "/kv-retail/month"
    : "/kv-retail";
  const desktopNavigationTitle = scopedPageTitle;
  const isTaskAdministrator = hasPermission("kv-retail.tasks.create");
  const isMentionOnlyUser = Boolean(user && !isTaskAdministrator);
  const compactMobileMenuItems = useMemo(
    () => PRIMARY_MENU
      .filter((item) => !isMentionOnlyUser || item.label === "Daftar Tugas")
      .map(({ label, href }) => ({ label, href })),
    [isMentionOnlyUser],
  );

  useEffect(() => {
    if (isMentionOnlyUser && scope !== "all") {
      window.location.replace("/kv-retail");
    }
  }, [isMentionOnlyUser, scope]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await coreApi.settings.get<TaskSettings>(TASK_SETTING_KEYS);
        if (data?.task_page_title_today) setTodayTitle(data.task_page_title_today);
        if (data?.task_page_title_unfinished) setUnfinishedTitle(data.task_page_title_unfinished);
        if (data?.task_page_title_month) setMonthTitle(data.task_page_title_month);
        
        // Populate config
        const newConfig: TaskCardConfig = {};
        for (const key in data) {
          if (!key.startsWith("task_page_title_")) {
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
    channel.listen(".kv-retail.task.deleted", (event: KvRetailTaskDeletedEvent) => removeTask(event.task_id));

    return () => {
      channel.stopListening(".kv-retail.task.assigned");
      channel.stopListening(".kv-retail.task.updated");
      channel.stopListening(".kv-retail.task.deleted");
    };
  }, [fetchTasks, mergeTask, removeTask, user?.id]);


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

  const handleTitleSave = async (taskId: number, taskName: string) => {
    await mutateTask(
      taskId,
      (task) => ({ ...task, task_name: taskName }),
      () => kvRetailApi.tasks.updateTitle(taskId, taskName),
    );
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

  const totalTasks = scopedTasks.length;
  const inProgress = scopedTasks.filter(t => t.status !== "Done").length;
  const terlambat = scopedTasks.filter(t => {
    if (t.status === "Done") return false;
    if (!t.deadline_date) return false;
    const d = new Date(t.deadline_date);
    const diff = Math.ceil((d.getTime() - currentTime) / (1000 * 3600 * 24));
    return diff < 0; // past deadline
  }).length;
  const onTrack = inProgress - terlambat;
  const selesai = scopedTasks.filter(t => t.status === "Done").length;

  const dynamicMetrics = [
    { state: "Total" as MetricState, title: "Total Tugas", value: totalTasks, icon: "assignment" },
    { state: "Progress" as MetricState, title: "In Progress", value: inProgress, icon: "hourglass_bottom" },
    { state: "OnTrack" as MetricState, title: "On Track", value: onTrack, icon: "track_changes" },
    { state: "Terlambat" as MetricState, title: "Terlambat", value: terlambat, icon: "warning_amber" },
    { state: "Done" as MetricState, title: "Selesai", value: selesai, icon: "check_circle" },
  ];

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

  useEffect(() => {
    const scrollArea = taskListScrollRef.current;
    if (!scrollArea) return;

    const updateScrollFade = () => {
      const hasMoreContent = scrollArea.scrollHeight - scrollArea.clientHeight > 2;
      const isAtBottom = scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 2;
      setShowTaskListFade(hasMoreContent && !isAtBottom);
    };

    updateScrollFade();
    scrollArea.addEventListener("scroll", updateScrollFade, { passive: true });
    const observer = new ResizeObserver(updateScrollFade);
    observer.observe(scrollArea);
    if (scrollArea.firstElementChild) observer.observe(scrollArea.firstElementChild);

    return () => {
      scrollArea.removeEventListener("scroll", updateScrollFade);
      observer.disconnect();
    };
  }, [filteredTasks.length]);

  useEffect(() => {
    const scrollArea = mobileTaskListScrollRef.current;
    if (!scrollArea) return;

    const updateScrollFade = () => {
      const hasMoreContent = scrollArea.scrollHeight - scrollArea.clientHeight > 2;
      const isAtBottom = scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 2;
      setShowMobileTaskListFade(hasMoreContent && !isAtBottom);
    };

    updateScrollFade();
    scrollArea.addEventListener("scroll", updateScrollFade, { passive: true });
    const observer = new ResizeObserver(updateScrollFade);
    observer.observe(scrollArea);
    return () => {
      scrollArea.removeEventListener("scroll", updateScrollFade);
      observer.disconnect();
    };
  }, [filteredTasks.length]);

  return (
    <>
      <div
        className={`h-dvh overflow-hidden p-3 lg:hidden ${desktopTheme === "dark" ? "bg-[radial-gradient(circle_at_8%_6%,#294c3b_0,transparent_28%),radial-gradient(circle_at_91%_4%,#242a27_0,transparent_38%),linear-gradient(135deg,#111513_0%,#0b0d0c_58%,#1a1e1c_100%)]" : desktopTheme === "retro" ? "bg-[#dfe2d3] font-mono" : "bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]"}`}
        data-kv-retail-mobile-theme={desktopTheme}
      >
        <div className={`flex h-[calc(100dvh-24px)] flex-col overflow-hidden rounded-[22px] ${desktopTheme === "dark" ? "border border-white/10 bg-[#111413]/90 shadow-[0_12px_32px_rgba(0,0,0,0.34)]" : desktopTheme === "retro" ? "border-[3px] border-[#24252b] bg-[#c9ccc0] shadow-[0_6px_0_#24252b]" : "border border-white/80 bg-white/80 shadow-[0_12px_32px_rgba(0,4,117,0.2)] backdrop-blur-md"}`}>
          <PerformanceNavbar
            theme={desktopTheme}
            title={desktopNavigationTitle}
            compact
            compactMenuItems={compactMobileMenuItems}
          />
          <main aria-label={`${scopedPageTitle} mobile`} className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-6 pt-6">
            <h1 className={`shrink-0 text-4xl font-medium leading-none tracking-[-0.05em] ${desktopTheme === "dark" ? "text-[#f1f1f1]" : "text-[#181818]"}`}>
              {scopedPageTitle}
            </h1>
            <div className="mt-5 flex shrink-0 min-w-0 items-stretch gap-2">
              {scope === "all" && !isMentionOnlyUser && (
                <button
                  type="button"
                  aria-label="Buat tugas baru"
                  onClick={() => setIsModalOpen(true)}
                  className={`flex h-[76px] w-16 shrink-0 items-center justify-center rounded-2xl transition-colors focus-visible:outline-none focus-visible:ring-2 ${desktopTheme === "dark" ? "bg-[#b0ff5e] text-[#181818] hover:bg-[#c6ff89] focus-visible:ring-[#b0ff5e]/40" : desktopTheme === "retro" ? "border-2 border-[#24252b] bg-[#ba0dcb] text-white shadow-[3px_3px_0_#24252b] hover:bg-[#9c0bac] focus-visible:ring-[#ba0dcb]/40" : "bg-[#ec4899] text-white shadow-[0_8px_18px_rgba(236,72,153,0.24)] hover:bg-[#db2777] focus-visible:ring-[#ec4899]/40"}`}
                >
                  <MaterialIcon name="add" size="auto" weight={400} className="text-3xl" />
                </button>
              )}
              <div className="relative min-w-0 flex-1">
                <CombinedMetricCard metrics={desktopMetrics} theme={desktopTheme} fill={scope === "unfinished"} />
                {desktopMetrics.length > 1 && <div aria-hidden="true" className={`pointer-events-none absolute inset-y-0 right-0 w-10 rounded-r-2xl bg-gradient-to-l ${desktopTheme === "dark" ? "from-[#171717] via-[#171717]/55 to-transparent" : desktopTheme === "retro" ? "from-[#eceee6] via-[#eceee6]/55 to-transparent" : "from-white via-white/55 to-transparent"}`} />}
              </div>
            </div>
            <section aria-label="Cari dan filter tugas" className="mt-3 flex shrink-0 items-center gap-2">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Cari tugas, proyek, atau lokasi</span>
                <MaterialIcon
                  name="search"
                  size="auto"
                  weight={400}
                  className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl ${desktopTheme === "dark" ? "text-[#b0ff5e]" : desktopTheme === "retro" ? "text-[#24252b]" : "text-[#525e61]"}`}
                />
                <input
                  type="search"
                  placeholder="Cari tugas..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className={`h-12 w-full rounded-xl py-3 pl-11 pr-3 text-sm outline-none ${desktopTheme === "dark" ? "border border-white/10 bg-[#171717] text-[#f1f1f1] placeholder:text-[#7d827f] focus:border-[#b0ff5e]" : desktopTheme === "retro" ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] placeholder:text-[#687065] focus:border-[#ba0dcb]" : "border border-[#d7dcdd] bg-white text-[#222] placeholder:text-[#aeb6b8] focus:border-[#8474f9]"}`}
                />
              </label>
              <ToolbarDropdown icon="storefront" label="Vendor" options={vendorOptions} value={filterVendor} onChange={setFilterVendor} theme={desktopTheme} compact />
              <ToolbarDropdown icon="sort" label="Urutkan" options={sortOptions} value={sortOption} onChange={setSortOption} theme={desktopTheme} compact />
            </section>
            <div className="relative mt-4 min-h-0 flex-1">
            <section
              ref={mobileTaskListScrollRef}
              aria-label="Daftar tugas"
              className="flex h-full flex-col gap-3 overflow-y-auto pb-2 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={showMobileTaskListFade ? {
                maskImage: "linear-gradient(to bottom, #000 0, #000 calc(100% - 28px), transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, #000 0, #000 calc(100% - 28px), transparent 100%)",
              } : undefined}
            >
              {isTasksLoading && Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className={`h-24 animate-pulse rounded-2xl ${desktopTheme === "dark" ? "bg-white/5" : desktopTheme === "retro" ? "border-2 border-[#24252b] bg-[#dfe2d3]" : "bg-white/70"}`} />
              ))}
              {!isTasksLoading && filteredTasks.map((task) => (
                <TaskCardMobile
                  key={task.id}
                  title={task.task_name || "Tugas tanpa judul"}
                  dateRange={`${formatMobileTaskDate(task.task_given_date)} - ${formatMobileTaskDate(task.deadline_date)}`}
                  vendor={task.pic_vendor || "-"}
                  assignedTo={getMobileAssignedUsers(task.users)}
                  assignedAvatars={getMobileAssignedAvatars(task.users)}
                  status={(TASK_CARD_STATES.includes(task.status as TaskCardState) ? task.status : "0") as TaskCardState}
                  tone={getMobileTaskTone(task)}
                  changes={getMobileTaskChanges(task)}
                  countdownLabel={getMobileCountdown(task)}
                  delayReasonStage={requiredDelayReasonStage(task)}
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
                  theme={desktopTheme}
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
              {!isTasksLoading && filteredTasks.length === 0 && (
                <p className={`py-8 text-center text-sm ${desktopTheme === "dark" ? "text-[#a7ada8]" : desktopTheme === "retro" ? "text-[#687065]" : "text-[#707780]"}`}>
                  {taskConfig.task_empty_state || "Belum ada tugas yang sesuai."}
                </p>
              )}
            </section>
            </div>
          </main>
        </div>
      </div>



      <div className={`hidden h-screen min-h-0 flex-col text-[#222] lg:flex ${desktopTheme === "dark" ? "bg-[radial-gradient(circle_at_8%_6%,#294c3b_0,transparent_28%),radial-gradient(circle_at_91%_4%,#242a27_0,transparent_38%),linear-gradient(135deg,#111513_0%,#0b0d0c_58%,#1a1e1c_100%)] p-6" : desktopTheme === "retro" ? "bg-[#dfe2d3] p-6" : "bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)] p-6"}`}>


      <div className={`flex min-h-0 flex-1 flex-col overflow-hidden ${desktopTheme === "light" ? "rounded-[26px] border border-white/80 bg-white/80 shadow-[0_14px_42px_rgba(44,42,39,0.16)] backdrop-blur-md" : desktopTheme === "dark" ? "rounded-[26px] border border-white/10 bg-[#111413]/90 shadow-[0_14px_42px_rgba(0,0,0,0.45)] backdrop-blur-md" : "rounded-[30px] border-[3px] border-[#24252b] bg-[#c9ccc0] font-mono shadow-[0_8px_0_#24252b]"}`}>
      <PerformanceNavbar theme={desktopTheme} title={desktopNavigationTitle} />
      <div className="flex min-h-0 flex-1">
      <PerformanceSidebar theme={desktopTheme} activeHref={desktopTaskRoute} ariaLabel={`Navigasi ${desktopNavigationTitle}`} onToggleTheme={() => setDesktopTheme((theme) => theme === "dark" ? "light" : "dark")} onToggleRetro={() => setDesktopTheme((theme) => theme === "retro" ? "light" : "retro")} expanded={desktopShellExpanded} onToggleExpanded={toggleDesktopShellExpanded} />

      <TaskDesktopPageTransition className="relative m-4 min-w-0 flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="w-full shrink-0 pb-4">
          <header className="flex min-h-[45px] flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className={`text-4xl font-medium leading-none tracking-[-0.72px] ${desktopTheme === "dark" ? "text-[#f1f1f1]" : desktopTheme === "retro" ? "text-[#24252b]" : "text-[#181818]"}`}>
                {desktopNavigationTitle}
              </h1>
            </div>
          </header>

          <div className="mt-4 flex min-w-0 items-center gap-3">
            <div className="min-w-[240px] w-[min(52%,860px)]">
              <CombinedMetricCard
                metrics={desktopMetrics}
                theme={desktopTheme}
                actionButton={scope === "all" && !isMentionOnlyUser ? <AddTaskButton theme={desktopTheme} onClick={() => setIsModalOpen(true)} /> : undefined}
              />
            </div>

            <section
              aria-label="Filter tugas"
              className="flex min-w-0 flex-1 flex-nowrap items-center gap-[9px]"
            >
              <label className="relative block h-[76px] min-w-0 flex-1">
                <span className="sr-only">Cari tugas, proyek, atau lokasi ...</span>
                <MaterialIcon
                  name="search"
                  size="auto"
                  weight={300}
                  filled={false}
                  className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[24px] leading-none ${desktopTheme === "dark" ? "text-[#b0ff5e]" : desktopTheme === "retro" ? "text-[#24252b]" : "text-[#525e61]"}`}
                />
                <input
                  type="search"
                  placeholder="Cari tugas, proyek, atau lokasi ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`h-[76px] w-full rounded-xl py-4 pl-[50px] pr-4 text-base tracking-[0.32px] outline-none ${desktopTheme === "dark" ? "border border-white/10 bg-[#171717] text-[#f1f1f1] placeholder:text-[#7d827f] focus:border-[#b0ff5e] focus:ring-2 focus:ring-[#b0ff5e]/20" : desktopTheme === "retro" ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] placeholder:text-[#687065] focus:border-[#ba0dcb] focus:ring-2 focus:ring-[#ba0dcb]/20" : "border border-[#d7dcdd] bg-white text-[#222] placeholder:text-[#aeb6b8] focus:border-[#8474f9] focus:ring-2 focus:ring-[#8474f9]/15"}`}
                />
              </label>

              <ToolbarDropdown 
                icon="storefront" 
                label="Vendor" 
                options={vendorOptions}
                value={filterVendor}
                onChange={setFilterVendor}
                theme={desktopTheme}
              />
              <ToolbarDropdown 
                icon="sort" 
                label="Urutkan" 
                options={sortOptions}
                value={sortOption}
                onChange={setSortOption}
                theme={desktopTheme}
              />
            </section>
          </div>
        </div>

        <section
          aria-label="Task Card"
          className="relative flex-1 min-h-0 w-full"
        >
          <div ref={taskListScrollRef} className="h-full overflow-y-auto pb-20 pr-2 -mr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col items-stretch gap-3">
              {isTasksLoading && Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={`h-[122px] animate-pulse rounded-2xl ${desktopTheme === "dark" ? "bg-[#202820]" : desktopTheme === "retro" ? "border-2 border-[#24252b] bg-[#dfe2d3]" : "bg-[#f3faff]"}`} />
              ))}
              {!isTasksLoading && filteredTasks.map((task) => (
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
                  isLate={Boolean(task.timing_evaluation?.late)}
                  onTitleSave={(taskName) => handleTitleSave(task.id, taskName)}
                  delayReasonStage={requiredDelayReasonStage(task)}
                  onStepClick={(step, delayReason) => handleStepClick(task.id, step, delayReason)}
                  onNextClick={(link, delayReason) => handleNextClick(task.id, link, delayReason)}
                  onDeleteConfirm={() => handleDelete(task.id)}
                  onRefresh={fetchTasks}
                config={taskConfig}
                theme={desktopTheme}
                />
              ))}
              {!isTasksLoading && filteredTasks.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  {taskConfig.task_empty_state || "Belum ada tugas yang sesuai."}
                </div>
              )}
            </div>
          </div>
          {showTaskListFade && (
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t ${desktopTheme === "dark" ? "from-[#111413]/55 via-[#111413]/20 to-transparent" : desktopTheme === "retro" ? "from-[#c9ccc0]/55 via-[#c9ccc0]/20 to-transparent" : "from-white/55 via-white/20 to-transparent"}`}
            />
          )}
        </section>
      </TaskDesktopPageTransition>

      </div>
      </div>
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
