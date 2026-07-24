"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, Suspense, useRef, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import { HeaderTitle } from "@/components/header-title";
import { MaterialIcon } from "@/components/material-icon";
import { ScheduleConfig } from "@/features/odds/components/schedule-config";
import { OddsGameboyFrame } from "@/components/odds/odds-gameboy-frame";
import { OddsRichTextEditor, stripRichText } from "@/components/odds-rich-text-editor";
import { OddsDesignerTaskRowCard } from "@/components/odds-designer-task-row-card";
import { OddsTaskChat } from "@/components/odds-task-chat";
import { useAuth } from "@/providers/auth-provider";
import { useOddsTheme } from "./odds-theme-context";
import TaskCardDate from "@/components/taskcard/date";
import {
  OddsAssignableUser,
  OddsCategory,
  OddsDailyReport,
  OddsDesignerProfile,
  OddsRanking,
  OddsReportSummary,
  OddsTask,
  OddsUser,
  OddsTaskCancelRequest,
  OddsTaskResult,
  OddsTaskSkipRequest,
  OddsTaskRevision,
  OddsSystemRule,
  uploadOddsTaskAttachment,
  createOddsCategory,
  createOddsDesignerProfile,
  createOddsSystemRule,
  deleteOddsCategory,
  deleteOddsDesignerProfile,
  deleteOddsSystemRule,
  deleteOddsTask,
  getOddsAssignableUsers,
  getOddsConfigCategories,
  getOddsConfigDesignerProfiles,
  getOddsDailyReports,
  getOddsRankings,
  getOddsReportSummary,
  getOddsSystemRules,
  getOddsTasks,
  formatOddsDate,
  acceptOddsBrief,
  clientReviewOddsTask,
  oddsError,
  requestOddsCancel,
  returnOddsBrief,
  pauseOddsTask,
  spvReviewOddsTask,
  rateOddsTask,
  reviewOddsCancelRequest,
  reviewOddsQueueSkip,
  reviewOddsExtraRevision,
  reviewOddsUrgentRevision,
  statusLabel,
  startOddsTask,
  submitOddsResult,
  updateOddsCategory,
  updateOddsDesignerProfile,
  updateOddsSystemRule,
} from "@/features/odds/api";

type CategoryForm = {
  id: number | null;
  name: string;
  score_weight: string;
  normal_revision_limit: string;
  sla_minutes: string;
  important_matrix: string;
  is_active: boolean;
};

type DesignerForm = {
  id: number | null;
  user_id: string;
  status: "available" | "off";
  specializations: Array<string | number>;
  leave_dates_text: string;
  is_active: boolean;
};

type RuleForm = {
  id: number | null;
  key: string;
  value: string;
  description: string;
  is_active: boolean;
};

const emptyCategoryForm: CategoryForm = {
  id: null,
  name: "",
  score_weight: "1",
  normal_revision_limit: "2",
  sla_minutes: "1440",
  important_matrix: "Q4",
  is_active: true,
};

const emptyDesignerForm: DesignerForm = {
  id: null,
  user_id: "",
  status: "available",
  specializations: [],
  leave_dates_text: "",
  is_active: true,
};

const emptyRuleForm: RuleForm = {
  id: null,
  key: "",
  value: "{\n  \"count\": 2\n}",
  description: "",
  is_active: true,
};

const statusOptions = [
  { value: "available", label: "Available" },
  { value: "off", label: "Offline" },
] as const;

type ConfigSection =
  | "categories"
  | "designers"
  | "rules"
  | "schedules"
  | "spv_review"
  | "client_review"
  | "special_revisions"
  | "cancel_requests"
  | "skip_requests"
  | "reports"
  | "rankings"
  | "all_tasks"
  | "designer_today_tasks"
  | "designer_all_tasks"
  | "designer_review"
  | "designer_revisions"
  | "designer_done"
  | "designer_report"
  | "designer_settings"
  | "client_all_requests"
  | "client_action_required"
  | "client_in_progress"
  | "client_archive"
  | "workspace";

const configSections: Array<{
  id: ConfigSection;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    id: "categories",
    label: "Kategori",
    icon: "category",
    description: "Bobot, revisi, workload, dan SLA.",
  },
  {
    id: "designers",
    label: "Profil Desainer",
    icon: "groups",
    description: "Status, spesialisasi, dan kapasitas.",
  },
  {
    id: "rules",
    label: "System Rules",
    icon: "rule",
    description: "Aturan otomatis ODDS.",
  },
  {
    id: "schedules",
    label: "Jadwal & Libur",
    icon: "calendar_month",
    description: "Kapasitas global dan kalender libur.",
  },
  {
    id: "designer_today_tasks",
    label: "Tugas Hari Ini",
    icon: "today",
    description: "Tugas yang masuk kapasitas hari ini.",
  },
  {
    id: "designer_all_tasks",
    label: "Semua Tugas",
    icon: "assignment",
    description: "Riwayat tugas.",
  },
  {
    id: "designer_review",
    label: "Menunggu Review",
    icon: "pending_actions",
    description: "Tugas dalam review.",
  },
  {
    id: "designer_revisions",
    label: "Revisi",
    icon: "error",
    description: "Revisi dikembalikan.",
  },
  {
    id: "designer_done",
    label: "Selesai",
    icon: "task_alt",
    description: "Tugas selesai.",
  },
  {
    id: "designer_report",
    label: "Laporan Kinerja",
    icon: "monitoring",
    description: "Laporan statistik pribadi.",
  },
  {
    id: "designer_settings",
    label: "Pengaturan & Jadwal",
    icon: "manage_accounts",
    description: "Pengaturan status desainer.",
  },
  {
    id: "client_all_requests",
    label: "Semua Request",
    icon: "assignment",
    description: "Seluruh permintaan Anda.",
  },
  {
    id: "client_action_required",
    label: "Perlu Review",
    icon: "pending_actions",
    description: "Tugas menunggu ACC.",
  },
  {
    id: "client_in_progress",
    label: "Sedang Diproses",
    icon: "autorenew",
    description: "Memantau progres desain.",
  },
  {
    id: "client_archive",
    label: "Arsip",
    icon: "archive",
    description: "Riwayat tugas selesai.",
  },
  {
    id: "schedules",
    label: "Jadwal & Libur",
    icon: "calendar_month",
    description: "Kapasitas global dan kalender libur.",
  },
  {
    id: "spv_review",
    label: "Review Leader Creative",
    icon: "rate_review",
    description: "Output menunggu ACC atau revisi.",
  },
  {
    id: "client_review",
    label: "Review Client",
    icon: "reviews",
    description: "Hasil sudah lolos SPV.",
  },
  {
    id: "special_revisions",
    label: "Extra / Urgent",
    icon: "priority_high",
    description: "Approval revisi tambahan.",
  },
  {
    id: "cancel_requests",
    label: "Cancel",
    icon: "cancel",
    description: "Review permintaan batal.",
  },
  {
    id: "skip_requests",
    label: "Skip Antrean",
    icon: "skip_next",
    description: "Review permintaan skip antrean desainer.",
  },
  {
    id: "reports",
    label: "Reports",
    icon: "monitoring",
    description: "Daily report dan insight.",
  },
  {
    id: "rankings",
    label: "Rankings",
    icon: "leaderboard",
    description: "Ranking desainer.",
  },
  {
    id: "all_tasks",
    label: "Semua Task",
    icon: "assignment",
    description: "Monitoring status ODDS.",
  },
];

function PerformanceChart({ points, theme }: { points: number[]; theme: string }) {
  const accentColor = theme === "dark" ? "#b0ff5e" : theme === "retro" ? "#ba0dcb" : "#00a4ff";
  const svgWidth = 500;
  const svgHeight = 80;
  const maxVal = Math.max(...points, 100);
  const minVal = 0;
  const range = maxVal - minVal || 1;
  
  const coords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * (svgWidth - 20) + 10;
    const y = svgHeight - ((val - minVal) / range) * (svgHeight - 20) - 10;
    return { x, y, val };
  });
  
  const pathData = coords.reduce((acc, c, idx) => {
    return acc + `${idx === 0 ? "M" : "L"} ${c.x} ${c.y}`;
  }, "");
  
  return (
    <div className="relative w-full h-[80px]">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible" fill="none">
        <path d={pathData} stroke={accentColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c, idx) => (
          <g key={idx}>
            <circle cx={c.x} cy={c.y} r="3.5" fill={accentColor} />
            <circle cx={c.x} cy={c.y} r="6.5" stroke={accentColor} strokeWidth="1.2" className="opacity-35" />
          </g>
        ))}
      </svg>
    </div>
  );
}

function DesignerMetric({
  label,
  value,
  icon = "check_circle",
  bottomLeft,
  bottomRight,
  hideDefaultBottomLeft = false,
}: {
  label: string;
  value: string | number;
  icon?: string;
  bottomLeft?: React.ReactNode;
  bottomRight?: React.ReactNode;
  hideDefaultBottomLeft?: boolean;
}) {
  const { theme } = useOddsTheme();
  const light = theme !== "dark";
  const retro = theme === "retro";

  const panelClass = retro
    ? "border-2 border-[#24252b] bg-[#eceee6] shadow-[inset_0_0_0_2px_#c9ccc0]"
    : light
    ? "bg-white/90 shadow-[0_5px_14px_rgba(44,42,39,0.06)]"
    : "border border-white/[0.05] bg-[#171717] shadow-[0_5px_14px_rgba(0,0,0,0.24)]";

  const innerBoxClass = retro
    ? "border border-[#24252b] bg-[#dfe2d3]"
    : light
    ? "bg-[#f3faff]"
    : "bg-[#0e0e0e]";

  const labelColorClass = retro
    ? "font-medium text-[#24252b]"
    : light
    ? "text-[#3B4446]"
    : "text-[#f1f1f1]";

  const valueColorClass = light ? "text-[#3B4446]" : "text-white";

  const bottomColorClass = retro ? "text-[#555850]" : light ? "text-[#7D7C7C]" : "text-[#b9b9b9]";

  const primaryIconColor = light ? (retro ? "#ba0dcb" : "#00A4FF") : "#e4e4e4";

  return (
    <article className={`relative flex h-[211px] min-h-[130px] w-full min-w-[200px] flex-col items-center justify-center gap-2 rounded-lg p-2 transition ${panelClass}`}>
      <div className="flex w-full shrink-0 items-center justify-between">
        <p className={`whitespace-nowrap text-sm font-medium leading-none ${labelColorClass}`}>{label}</p>
        <button 
          type="button" 
          aria-label={`Detail ${label}`} 
          className="flex size-5 items-center justify-center rounded-md text-[#00A4FF] transition hover:bg-[#00A4FF]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A4FF]/40"
        >
          <MaterialIcon name="more_horiz" size="auto" className="text-xl" />
        </button>
      </div>

      <div className={`flex min-h-0 w-full flex-1 items-center justify-between rounded px-4 ${innerBoxClass}`}>
        <p className={`whitespace-nowrap text-[30px] font-semibold leading-none tracking-[-0.6px] ${valueColorClass}`}>
          {value}
        </p>
        <span className="flex size-10 shrink-0 items-center justify-center" style={{ color: primaryIconColor }}>
          <MaterialIcon name={icon} size="lg" style={{ fontSize: "40px", lineHeight: 1 }} />
        </span>
      </div>

      <div className={`flex min-h-5 w-full shrink-0 flex-wrap items-center justify-between gap-y-1 text-xs font-normal leading-none tracking-[0.24px] ${bottomColorClass}`}>
        <div>{hideDefaultBottomLeft ? bottomLeft : bottomLeft ?? "Performance increased by"}</div>
        {bottomRight && (
          <div className={`${hideDefaultBottomLeft ? "" : "ml-auto"} flex items-center gap-1 text-xs leading-none`}>
            {bottomRight}
          </div>
        )}
      </div>
    </article>
  );
}


function OddsPageContent() {
  const { hasPermission, user } = useAuth();
  const { theme } = useOddsTheme();
  const canManageConfig = hasPermission("manage-odds-config");
  const canManageUsers = hasPermission("manage-users");
  const canShowConfigSections = canManageConfig && canManageUsers;
  const canReviewSpv = hasPermission("review-odds-spv");
  const canViewAllTasks = hasPermission("view-all-odds-tasks");
  const canApproveExtra = hasPermission("approve-odds-extra-revisions");
  const canApproveUrgent = hasPermission("approve-odds-urgent-revisions");
  const canManageEscalations = hasPermission("manage-odds-escalations");
  const canReviewQueueSkip = hasPermission("review-odds-queue-skip");
  const canViewReports = hasPermission("view-odds-reports");
  const canViewRankings = hasPermission("view-odds-rankings");
  const canUseControl = canManageConfig || canReviewSpv || canViewAllTasks || canApproveExtra || canApproveUrgent || canManageEscalations || canReviewQueueSkip || canViewReports || canViewRankings;
  const canCreateTask = hasPermission("create-odds-tasks");
  const canViewAssignedTasks = hasPermission("view-assigned-odds-tasks");

  const [categories, setCategories] = useState<OddsCategory[]>([]);
  const [designerProfiles, setDesignerProfiles] = useState<OddsDesignerProfile[]>([]);
  const [rules, setRules] = useState<OddsSystemRule[]>([]);
  const [assignableUsers, setAssignableUsers] = useState<OddsAssignableUser[]>([]);
  const [tasks, setTasks] = useState<OddsTask[]>([]);
  const [dailyReports, setDailyReports] = useState<OddsDailyReport[]>([]);
  const [reportSummary, setReportSummary] = useState<OddsReportSummary | null>(null);
  const [rankings, setRankings] = useState<OddsRanking[]>([]);
  const [rankingPeriod, setRankingPeriod] = useState<"daily" | "monthly" | "yearly">("daily");
  const [reviewNote, setReviewNote] = useState("");
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategoryForm);
  const [designerForm, setDesignerForm] = useState<DesignerForm>(emptyDesignerForm);
  const [ruleForm, setRuleForm] = useState<RuleForm>(emptyRuleForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [activeChatTaskId, setActiveChatTaskId] = useState<number | null>(null);
  const [activeOutputTaskId, setActiveOutputTaskId] = useState<number | null>(null);
  const [outputShareLink, setOutputShareLink] = useState("");
  const [outputFiles, setOutputFiles] = useState<File[]>([]);
  const [outputTotal, setOutputTotal] = useState("");
  const [outputDragActive, setOutputDragActive] = useState(false);
  const [outputBusy, setOutputBusy] = useState(false);
  const [adminTaskAction, setAdminTaskAction] = useState<{ taskId: number; type: string; nonce: number } | null>(null);
  const [timerNow, setTimerNow] = useState(() => Date.now());
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimerNow(Date.now());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const parseDateMs = (dateStr?: string | number | null): number => {
    if (!dateStr) return NaN;
    if (typeof dateStr === "number") return dateStr;
    let str = String(dateStr).trim();
    if (!str) return NaN;
    if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/.test(str)) {
      str = str.replace(" ", "T");
    }
    return new Date(str).getTime();
  };

  const getTaskDuration = (task?: OddsTask) => {
    if (!task) return 0;
    const timeLogs = task.time_logs ?? task.timeLogs ?? [];
    const designerTimeLogs = timeLogs.filter((log) => ["work", "revision"].includes(log.log_type));
    const isRunning = task.status === "in_progress";
    
    const durationSeconds = (log: typeof designerTimeLogs[0], nowMs = Date.now()) => {
      if (log.stopped_at || !isRunning) return log.duration_seconds ?? 0;
      const started = parseDateMs(log.started_at);
      if (Number.isNaN(started)) return log.duration_seconds ?? 0;
      return Math.max(0, Math.floor((nowMs - started) / 1000));
    };

    const totalSeconds = designerTimeLogs.reduce((total, log) => total + durationSeconds(log, timerNow), 0);
    if (totalSeconds > 0 || designerTimeLogs.length > 0) return totalSeconds;
    if (!isRunning) return 0;
    const fallbackStart = parseDateMs(task.updated_at ?? task.created_at);
    return Number.isNaN(fallbackStart) ? 0 : Math.max(0, Math.floor((timerNow - fallbackStart) / 1000));
  };

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0"),
    ].join(":");
  };

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const visibleConfigSections = useMemo(() => {
    return configSections.filter((section) => {
      if (["categories", "designers", "rules", "schedules"].includes(section.id)) return canShowConfigSections;
      if (section.id === "spv_review") return canReviewSpv;
      if (section.id === "client_review") return canReviewSpv || canViewAllTasks;
      if (section.id === "special_revisions") return canApproveExtra || canApproveUrgent;
      if (section.id === "cancel_requests") return canManageEscalations;
      if (section.id === "skip_requests") return canReviewQueueSkip;
      if (section.id === "reports") return canViewReports;
      if (section.id === "rankings") return canViewRankings;
      if (["designer_today_tasks", "designer_all_tasks", "designer_review", "designer_revisions", "designer_done", "designer_report", "designer_settings"].includes(section.id)) return canViewAssignedTasks && !canUseControl;
      if (["client_all_requests", "client_action_required", "client_in_progress", "client_archive"].includes(section.id)) return !canViewAssignedTasks && !canUseControl;
      return canViewAllTasks || canReviewSpv;
    });
  }, [canApproveExtra, canApproveUrgent, canManageEscalations, canReviewQueueSkip, canReviewSpv, canShowConfigSections, canViewAllTasks, canViewRankings, canViewReports, canViewAssignedTasks, canUseControl]);

  const searchParams = useSearchParams();
  const activeSectionParam = searchParams.get("section") as ConfigSection | null;
  const activeSection = useMemo(() => {
    if (activeSectionParam === "workspace") return "workspace";
    if (activeSectionParam && visibleConfigSections.some((s) => s.id === activeSectionParam)) {
      return activeSectionParam;
    }
    if (!activeSectionParam && !canUseControl) return "workspace";
    if (visibleConfigSections.some((section) => section.id === "all_tasks")) {
      return "all_tasks";
    }
    return visibleConfigSections[0]?.id ?? "all_tasks";
  }, [activeSectionParam, visibleConfigSections, canUseControl]);

  const effectiveActiveSection = useMemo(() => {
    if (activeSection === "workspace") return "workspace";
    return visibleConfigSections.some((section) => section.id === activeSection)
      ? activeSection
      : visibleConfigSections[0]?.id ?? "all_tasks";
  }, [visibleConfigSections, activeSection]);

  const activeSectionMeta = useMemo(() => {
    return visibleConfigSections.find((section) => section.id === effectiveActiveSection);
  }, [visibleConfigSections, effectiveActiveSection]);

  const categoryNameById = useMemo(() => {
    return new Map(categories.map((category) => [String(category.id), category.name]));
  }, [categories]);

  const selectedSpecializationIds = useMemo(() => {
    return new Set(designerForm.specializations.map(String));
  }, [designerForm.specializations]);

  const profiledUserIds = useMemo(() => {
    return new Set(
      designerProfiles
        .filter((profile) => profile.id !== designerForm.id)
        .map((profile) => profile.user_id)
    );
  }, [designerForm.id, designerProfiles]);

  const availableUsersForProfile = useMemo(() => {
    return assignableUsers.filter((item) => !profiledUserIds.has(item.id) || String(item.id) === designerForm.user_id);
  }, [assignableUsers, designerForm.user_id, profiledUserIds]);

  const taskMetrics = useMemo(() => {
    const active = tasks.filter((task) => !["done", "cancelled", "cancelled_by_spv"].includes(task.status)).length;
    const submitted = tasks.filter((task) => ["submitted", "brief_revision_requested"].includes(task.status)).length;
    const review = tasks.filter((task) => ["spv_review", "client_review"].includes(task.status)).length;
    const done = tasks.filter((task) => task.status === "done").length;

    return { active, submitted, review, done };
  }, [tasks]);

  const spvReviewTasks = useMemo(() => tasks.filter((task) => task.status === "spv_review"), [tasks]);
  const clientReviewTasks = useMemo(() => tasks.filter((task) => task.status === "client_review"), [tasks]);
  const specialRevisionRequests = useMemo(() => {
    return tasks.flatMap((task) => (task.revisions ?? []).map((revision) => ({ ...revision, task })))
      .filter((revision) => revision.status === "pending_spv" && ["extra", "urgent_final"].includes(revision.revision_type));
  }, [tasks]);
  const cancelRequests = useMemo(() => {
    return tasks.flatMap((task) => (task.cancel_requests ?? task.cancelRequests ?? []).map((request) => ({ ...request, task })))
      .filter((request) => request.status === "pending");
  }, [tasks]);
  const skipRequests = useMemo(() => {
    return tasks.flatMap((task) => (task.skip_requests ?? task.skipRequests ?? []).map((request) => ({ ...request, task })))
      .filter((request) => request.status === "pending");
  }, [tasks]);


  const loadConfig = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const taskPagePromise = getOddsTasks();
      const reportPromise = getOddsDailyReports();
      const summaryPromise = canViewReports ? getOddsReportSummary() : Promise.resolve<OddsReportSummary | null>(null);
      const rankingPromise = canViewRankings ? getOddsRankings(rankingPeriod) : Promise.resolve<OddsRanking[]>([]);
      const profilePromise = getOddsConfigDesignerProfiles();

      if (!canUseControl) {
        const [taskPage, profileList, reportList] = await Promise.all([taskPagePromise, profilePromise, reportPromise]);
        setTasks(taskPage.data);
        setDesignerProfiles(profileList);
        setDailyReports(reportList);
        return;
      }

      if (!canShowConfigSections) {
        const [taskPage, profileList, reportList, summary, rankingList] = await Promise.all([taskPagePromise, profilePromise, reportPromise, summaryPromise, rankingPromise]);
        setTasks(taskPage.data);
        setDesignerProfiles(profileList);
        setDailyReports(reportList);
        setReportSummary(summary);
        setRankings(rankingList);
        return;
      }

      const [categoryList, profileList, ruleList, userList, taskPage, reportList, summary, rankingList] = await Promise.all([
        getOddsConfigCategories(),
        profilePromise,
        getOddsSystemRules(),
        getOddsAssignableUsers(),
        taskPagePromise,
        reportPromise,
        summaryPromise,
        rankingPromise,
      ]);

      setCategories(categoryList);
      setDesignerProfiles(profileList);
      setRules(ruleList);
      setTasks(taskPage.data);
      setDailyReports(reportList);
      setReportSummary(summary);
      setRankings(rankingList);
      setAssignableUsers(userList);
      setDesignerForm((prev) => ({
        ...prev,
        user_id: prev.user_id || (userList[0] ? String(userList[0].id) : ""),
      }));
    } catch (err) {
      setError(oddsError(err));
    } finally {
      if (!silent) setLoading(false);
    }
  }, [canShowConfigSections, canUseControl, canViewRankings, canViewReports, rankingPeriod]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadConfig();
    }, 0);
    const interval = window.setInterval(() => {
      void loadConfig(true);
    }, 10000);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, [loadConfig]);

  const resetMessages = () => {
    setError(null);
    setNotice(null);
  };

  const submitCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    setSaving("category");

    const payload = {
      name: categoryForm.name,
      score_weight: Number(categoryForm.score_weight),
      normal_revision_limit: Number(categoryForm.normal_revision_limit),
      sla_minutes: Number(categoryForm.sla_minutes),
      important_matrix: categoryForm.important_matrix || "Q4",
      is_active: categoryForm.is_active,
    };

    try {
      if (categoryForm.id) {
        await updateOddsCategory(categoryForm.id, payload);
        setNotice("Kategori ODDS diperbarui.");
      } else {
        await createOddsCategory(payload);
        setNotice("Kategori ODDS dibuat.");
      }
      setCategoryForm(emptyCategoryForm);
      await loadConfig();
    } catch (err) {
      setError(oddsError(err));
    } finally {
      setSaving(null);
    }
  };

  const submitDesignerProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    setSaving("designer");

    const payload = {
      user_id: Number(designerForm.user_id),
      status: designerForm.status,
      specializations: designerForm.specializations,
      leave_dates: designerForm.leave_dates_text.split("\n").map((d) => d.trim()).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)),
      is_active: designerForm.is_active,
    };

    try {
      if (designerForm.id) {
        await updateOddsDesignerProfile(designerForm.id, payload);
        setNotice("Profil desainer ODDS diperbarui.");
      } else {
        await createOddsDesignerProfile(payload);
        setNotice("Profil desainer ODDS dibuat.");
      }
      setDesignerForm({
        ...emptyDesignerForm,
        user_id: availableUsersForProfile[0] ? String(availableUsersForProfile[0].id) : "",
      });
      await loadConfig();
    } catch (err) {
      setError(oddsError(err));
    } finally {
      setSaving(null);
    }
  };

  const submitRule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    setSaving("rule");

    try {
      const payload = {
        key: ruleForm.key,
        value: JSON.parse(ruleForm.value) as Record<string, unknown>,
        description: ruleForm.description,
        is_active: ruleForm.is_active,
      };

      if (ruleForm.id) {
        await updateOddsSystemRule(ruleForm.id, payload);
        setNotice("Rule ODDS diperbarui.");
      } else {
        await createOddsSystemRule(payload);
        setNotice("Rule ODDS dibuat.");
      }
      setRuleForm(emptyRuleForm);
      await loadConfig();
    } catch (err) {
      setError(err instanceof SyntaxError ? "Format JSON rule belum valid." : oddsError(err));
    } finally {
      setSaving(null);
    }
  };

  const removeCategory = async (category: OddsCategory) => {
    resetMessages();
    setSaving(`category-${category.id}`);
    try {
      await deleteOddsCategory(category.id);
      setNotice("Kategori ODDS dihapus.");
      await loadConfig();
    } catch (err) {
      setError(oddsError(err));
    } finally {
      setSaving(null);
    }
  };

  const removeDesignerProfile = async (profile: OddsDesignerProfile) => {
    resetMessages();
    setSaving(`designer-${profile.id}`);
    try {
      await deleteOddsDesignerProfile(profile.id);
      setNotice("Profil desainer ODDS dihapus.");
      await loadConfig();
    } catch (err) {
      setError(oddsError(err));
    } finally {
      setSaving(null);
    }
  };

  const removeRule = async (rule: OddsSystemRule) => {
    resetMessages();
    setSaving(`rule-${rule.id}`);
    try {
      await deleteOddsSystemRule(rule.id);
      setNotice("Rule ODDS dihapus.");
      await loadConfig();
    } catch (err) {
      setError(oddsError(err));
    } finally {
      setSaving(null);
    }
  };

  const editCategory = (category: OddsCategory) => {
    setCategoryForm({
      id: category.id,
      name: category.name,
      score_weight: String(category.score_weight),
      normal_revision_limit: String(category.normal_revision_limit),
      sla_minutes: String(category.sla_minutes),
      important_matrix: category.important_matrix ?? "Q4",
      is_active: category.is_active,
    });
  };

  const editDesignerProfile = (profile: OddsDesignerProfile) => {
    const savedSpecializations = profile.specializations ?? [];
    const visibleSpecializations = savedSpecializations.length > 0
      ? savedSpecializations.map(String)
      : categories.filter((category) => category.is_active).map((category) => String(category.id));

    setDesignerForm({
      id: profile.id,
      user_id: String(profile.user_id),
      status: profile.status as DesignerForm["status"],
      specializations: visibleSpecializations,
      leave_dates_text: (profile.leave_dates ?? []).join("\n"),
      is_active: profile.is_active,
    });
  };

  const editRule = (rule: OddsSystemRule) => {
    setRuleForm({
      id: rule.id,
      key: rule.key,
      value: JSON.stringify(rule.value, null, 2),
      description: rule.description ?? "",
      is_active: rule.is_active,
    });
  };

  const toggleSpecialization = (categoryId: number) => {
    const value = String(categoryId);
    setDesignerForm((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(value)
        ? prev.specializations.filter((item) => item !== value)
        : [...prev.specializations, value],
    }));
  };

  const runOperationalAction = async (label: string, action: () => Promise<unknown>, message: string) => {
    resetMessages();
    setSaving(label);
    try {
      await action();
      setNotice(message);
      setReviewNote("");
      await loadConfig();
    } catch (err) {
      setError(oddsError(err));
    } finally {
      setSaving(null);
    }
  };

  const reviewSpecialRevision = (revision: OddsTaskRevision, decision: "approved" | "rejected") => {
    const action = revision.revision_type === "urgent_final"
      ? () => reviewOddsUrgentRevision(revision.id, decision, reviewNote || undefined)
      : () => reviewOddsExtraRevision(revision.id, decision, reviewNote || undefined);

    void runOperationalAction(
      `revision-${revision.id}-${decision}`,
      action,
      decision === "approved" ? "Revisi tambahan disetujui." : "Revisi tambahan ditolak."
    );
  };

  const reviewCancel = (request: OddsTaskCancelRequest, decision: "approved" | "rejected") => {
    void runOperationalAction(
      `cancel-${request.id}-${decision}`,
      () => reviewOddsCancelRequest(request.id, decision, reviewNote || undefined),
      decision === "approved" ? "Cancel disetujui." : "Cancel ditolak."
    );
  };

  const reviewQueueSkip = (request: OddsTaskSkipRequest, decision: "approved" | "rejected") => {
    void runOperationalAction(
      `skip-${request.id}-${decision}`,
      () => reviewOddsQueueSkip(request.id, decision, reviewNote || undefined),
      decision === "approved" ? "Skip antrean disetujui." : "Skip antrean ditolak."
    );
  };

  if (effectiveActiveSection === "workspace") {
    // ── derive client dashboard data ─────────────────────────────────────────
    const doneTasks = tasks.filter((t) => t.status === "done");
    const ratedTasks = doneTasks.filter((t) => typeof t.rating === "number" && t.rating != null);
    const avgRating = ratedTasks.length > 0
      ? ratedTasks.reduce((sum, t) => sum + (t.rating as number), 0) / ratedTasks.length
      : null;

    const categoryCounts: Record<string, number> = {};
    tasks.forEach((t) => {
      const name = t.category?.name ?? "Lainnya";
      categoryCounts[name] = (categoryCounts[name] ?? 0) + 1;
    });
    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const totalCatCount = tasks.length || 1;

    const slaTotal = doneTasks.length;
    const slaOnTime = doneTasks.filter((t) => !t.overdue).length;
    const slaRate = slaTotal > 0 ? Math.round((slaOnTime / slaTotal) * 100) : null;

    const recentActivity = [...tasks]
      .sort((a, b) => new Date(b.updated_at ?? b.created_at).getTime() - new Date(a.updated_at ?? a.created_at).getTime())
      .slice(0, 6);

    const designerMap: Record<number, { name: string; count: number }> = {};
    tasks.forEach((t) => {
      const d = t.assigned_designer ?? t.assignedDesigner;
      if (d) {
        if (!designerMap[d.id]) designerMap[d.id] = { name: d.name, count: 0 };
        designerMap[d.id].count += 1;
      }
    });
    const topDesigners = Object.values(designerMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    const panelClass = theme === "dark"
      ? "border border-white/[0.05] bg-[#171717]"
      : theme === "retro"
      ? "border-2 border-[#24252b] bg-[#eceee6]"
      : "border border-[#e8eaed] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]";

    const mutedClass = theme === "dark" ? "text-[#a7ada8]" : theme === "retro" ? "text-[#687065]" : "text-[#6d7880]";
    const headingClass = theme === "dark" ? "text-[#f1f1f1]" : "text-[#181818]";
    const accentColor = theme === "dark" ? "#b0ff5e" : theme === "retro" ? "#ba0dcb" : "#00a4ff";
    const subBgClass = theme === "dark" ? "bg-[#0e0e0e]" : theme === "retro" ? "border border-[#24252b] bg-[#dfe2d3]" : "bg-[#f3faff]";
    const highlightColor = theme === "dark" ? "text-[#b0ff5e]" : theme === "retro" ? "text-[#ba0dcb]" : "text-[#00a4ff]";

    const formatActivityDate = (iso?: string) => {
      if (!iso) return "";
      const d = new Date(iso);
      const now = new Date();
      const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
      if (diffMin < 1) return "Baru saja";
      if (diffMin < 60) return `${diffMin} menit lalu`;
      const diffH = Math.floor(diffMin / 60);
      if (diffH < 24) return `${diffH} jam lalu`;
      return `${Math.floor(diffH / 24)} hari lalu`;
    };

    const statusActivityLabel: Record<string, string> = {
      queued: "masuk antrian",
      in_progress: "sedang dikerjakan",
      spv_review: "dalam review Leader Creative",
      client_review: "menunggu ACC Anda",
      revision: "dalam revisi",
      submitted: "telah di-submit",
      done: "telah selesai",
      cancelled: "dibatalkan",
      cancelled_by_spv: "dibatalkan oleh SPV",
    };

    const getGreeting = (name: string) => {
      const hr = new Date().getHours();
      const firstName = name.trim().split(/\s+/)[0] ?? "";
      if (hr < 12) return `Morning, ${firstName}`;
      if (hr < 17) return `Afternoon, ${firstName}`;
      return `Evening, ${firstName}`;
    };

    const todayStr = new Date().toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
    const monthYearStr = new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" });

    // Designer task derivations
    const todayTasksCount = tasks.filter(t => t.status === "in_progress").length;
    const queuedTasksCount = tasks.filter(t => t.status === "queued").length;
    const doneTasksCount = tasks.filter(t => t.status === "done").length;
    const revisionTasksCount = tasks.filter(t => t.status === "revision").length;

    return (
      <div className="flex flex-col gap-5 p-4">
        {/* Header */}
        <HeaderTitle>
          {!canViewAssignedTasks ? "Dashboard" : getGreeting(user?.name ?? "Designer")}
        </HeaderTitle>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Main layout */}
        {!canViewAssignedTasks ? (
          /* =========================================================================
             CLIENT VIEW
             ========================================================================= */
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              {/* Left: 4 Metrics + Kategori Terpopuler */}
              <div className="flex w-1/2 shrink-0 flex-col gap-4">
                {/* 4 Metric cards + create button — semua dalam 1 baris square */}
                <div className={`grid gap-2.5 ${canCreateTask ? "grid-cols-5" : "grid-cols-4"}`}>
                  <MiniMetric icon="pending_actions" label="Aktif" value={taskMetrics.active} />
                  <MiniMetric icon="assignment" label="Submit" value={taskMetrics.submitted} />
                  <MiniMetric icon="rate_review" label="Review" value={taskMetrics.review} />
                  <MiniMetric icon="task_alt" label="Done" value={taskMetrics.done} />
                  {canCreateTask && (
                    <Link
                      href="/odds/new"
                      className={`group aspect-square flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed transition ${
                        theme === "dark"
                          ? "border-white/10 hover:border-[#b0ff5e]/40 hover:bg-[#b0ff5e]/5"
                          : theme === "retro"
                          ? "border-[#24252b]/30 hover:border-[#ba0dcb]/50 hover:bg-[#ba0dcb]/5"
                          : "border-[#d7dcdd] hover:border-[#00a4ff]/40 hover:bg-[#00a4ff]/5"
                      }`}
                    >
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full transition group-hover:scale-110 ${
                          theme === "dark" ? "bg-[#b0ff5e]/10 text-[#b0ff5e]" : theme === "retro" ? "bg-[#ba0dcb]/10 text-[#ba0dcb]" : "bg-[#00a4ff]/10 text-[#00a4ff]"
                        }`}
                      >
                        <MaterialIcon name="add" size="auto" className="text-xl" />
                      </span>
                      <span className={`text-[10px] font-bold leading-tight text-center ${
                        theme === "dark" ? "text-[#b0ff5e]" : theme === "retro" ? "text-[#ba0dcb]" : "text-[#00a4ff]"
                      }`}>Request<br/>Baru</span>
                    </Link>
                  )}
                </div>

                {/* Kategori Terpopuler */}
                <div className={`rounded-2xl p-4 ${panelClass}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${mutedClass}`}>Distribusi</p>
                      <h2 className={`mt-1 text-sm font-semibold ${headingClass}`}>Kategori Terpopuler</h2>
                    </div>
                    <MaterialIcon name="category" size="auto" className="text-2xl" style={{ color: accentColor }} />
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {topCategories.length > 0 ? topCategories.map(([name, count]) => (
                      <div key={name}>
                        <div className={`mb-1 flex items-center justify-between text-[11px] ${mutedClass}`}>
                          <span className={headingClass}>{name}</span>
                          <b>{count} request</b>
                        </div>
                        <div className={`h-1.5 overflow-hidden rounded-full ${theme === "dark" ? "bg-white/10" : "bg-[#e6edf2]"}`}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${Math.max(6, (count / totalCatCount) * 100)}%`, backgroundColor: accentColor }}
                          />
                        </div>
                      </div>
                    )) : (
                      <p className={`text-sm ${mutedClass}`}>Belum ada data kategori.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: 5 Request Terakhir — flex-1 fills remaining width */}
              <div className={`flex-1 min-w-0 rounded-2xl p-4 ${panelClass}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${mutedClass}`}>Request Terbaru</p>
                    <h2 className={`mt-1 text-sm font-semibold ${headingClass}`}>5 Request Terakhir</h2>
                  </div>
                  <MaterialIcon name="receipt_long" size="auto" className="text-2xl" style={{ color: accentColor }} />
                </div>
                <div className="mt-3 space-y-2">
                  {loading ? (
                    <p className={`text-sm ${mutedClass}`}>Memuat request...</p>
                  ) : tasks.length > 0 ? [...tasks]
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .slice(0, 5)
                      .map((task) => {
                        const assignedDesigner = task.assigned_designer ?? task.assignedDesigner;
                        const statusColor: Record<string, string> = {
                          done: "#22c55e",
                          client_review: "#f59e0b",
                          in_progress: accentColor,
                          queued: "#94a3b8",
                          cancelled: "#ef4444",
                          cancelled_by_spv: "#ef4444",
                          revision: "#f97316",
                          spv_review: "#a78bfa",
                        };
                        const statusDot = statusColor[task.status] ?? "#94a3b8";
                        return (
                          <Link
                            key={task.id}
                            href={`/odds/detail?id=${task.id}`}
                            className={`flex items-center gap-3 rounded-xl px-3 py-3 transition hover:opacity-80 ${subBgClass}`}
                          >
                            <span className="mt-0.5 flex size-2 shrink-0 rounded-full" style={{ backgroundColor: statusDot }} />
                            <div className="min-w-0 flex-1">
                              <p className={`truncate text-xs font-semibold ${headingClass}`}>{task.design_purpose}</p>
                              <p className={`mt-0.5 text-[10px] ${mutedClass}`}>
                                {task.task_number}
                                {task.category?.name ? ` · ${task.category.name}` : ""}
                                {assignedDesigner ? ` · ${assignedDesigner.name}` : ""}
                              </p>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-1">
                              <StatusBadge status={task.status} />
                              <span className={`text-[10px] ${mutedClass}`}>{formatOddsDate(task.deadline, true)}</span>
                            </div>
                          </Link>
                        );
                      }) : (
                    <p className={`text-sm ${mutedClass}`}>Belum ada request yang dibuat.</p>
                  )}
                  {!loading && tasks.length > 5 && (
                    <Link
                      href="/odds?section=client_all_requests"
                      className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition hover:opacity-70 ${mutedClass}`}
                    >
                      Lihat semua {tasks.length} request
                      <MaterialIcon name="arrow_forward" size="auto" className="text-base" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Calendar widget + 4 content cards */}
            <div className="flex gap-4">
              {/* Calendar widget square */}
              {(() => {
                const now = new Date();
                const dayName = now.toLocaleDateString("id-ID", { weekday: "long" });
                const dayNum = now.getDate();
                const monthName = now.toLocaleDateString("id-ID", { month: "long" });
                const year = now.getFullYear();
                return (
                  <div className="shrink-0 self-stretch">
                    <div className={`h-full aspect-square flex flex-col items-center justify-center gap-1 rounded-2xl p-3 ${panelClass}`}>
                      <p className={`text-[14px] font-bold uppercase tracking-[0.14em] ${mutedClass}`}>{dayName}</p>
                      <p className="text-[90px] font-black leading-none" style={{ color: accentColor }}>{dayNum}</p>
                      <p className={`text-[20px] font-bold ${headingClass}`}>{monthName}</p>
                      <p className={`text-[14px] font-medium ${mutedClass}`}>{year}</p>
                    </div>
                  </div>
                );
              })()}

              {/* 4 cards in 2x2 grid */}
              <div className="grid flex-1 grid-cols-2 gap-4">
                {/* Rating */}
                <div className={`rounded-2xl p-4 ${panelClass}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${mutedClass}`}>Kepuasan</p>
                      <h2 className={`mt-1 text-sm font-semibold ${headingClass}`}>Rata-rata Rating</h2>
                    </div>
                    <MaterialIcon name="star" size="auto" className="text-2xl" style={{ color: accentColor }} />
                  </div>
                  <div className={`mt-3 flex items-center justify-between rounded-xl px-4 py-3 ${subBgClass}`}>
                    {avgRating !== null ? (
                      <>
                        <div>
                          <p className={`text-[32px] font-bold leading-none ${headingClass}`}>{avgRating.toFixed(1)}</p>
                          <p className={`mt-1 text-[10px] ${mutedClass}`}>dari {ratedTasks.length} tugas selesai</p>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <MaterialIcon
                              key={star}
                              name="star"
                              size="auto"
                              className="text-xl"
                              style={{ color: star <= Math.round(avgRating) ? accentColor : theme === "dark" ? "#333" : "#dde3e8" }}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className={`text-sm ${mutedClass}`}>Belum ada rating dari tugas selesai.</p>
                    )}
                  </div>
                </div>

                {/* SLA Performance */}
                <div className={`rounded-2xl p-4 ${panelClass}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${mutedClass}`}>Ketepatan Waktu</p>
                      <h2 className={`mt-1 text-sm font-semibold ${headingClass}`}>SLA Performance</h2>
                    </div>
                    <MaterialIcon name="target" size="auto" className="text-2xl" style={{ color: accentColor }} />
                  </div>
                  <div className={`mt-3 rounded-xl px-4 py-3 ${subBgClass}`}>
                    {slaRate !== null ? (
                      <>
                        <div className="flex items-center justify-between">
                          <p className={`text-[32px] font-bold leading-none ${headingClass}`}>{slaRate}%</p>
                          <p className={`text-[11px] font-medium ${slaRate >= 80 ? "text-green-500" : slaRate >= 50 ? "text-yellow-500" : "text-red-400"}`}>
                            {slaRate >= 80 ? "Sangat Baik" : slaRate >= 50 ? "Cukup" : "Perlu Perhatian"}
                          </p>
                        </div>
                        <div className={`mt-2 h-2 w-full overflow-hidden rounded-full ${theme === "dark" ? "bg-white/10" : "bg-[#e6edf2]"}`}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${slaRate}%`, backgroundColor: accentColor }} />
                        </div>
                        <p className={`mt-1.5 text-[10px] ${mutedClass}`}>{slaOnTime} dari {slaTotal} tugas selesai tepat waktu</p>
                      </>
                    ) : (
                      <p className={`text-sm ${mutedClass}`}>Belum ada data tugas selesai untuk dihitung.</p>
                    )}
                  </div>
                </div>

                {/* Top Designers */}
                <div className={`rounded-2xl p-4 ${panelClass}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${mutedClass}`}>Tim Desain</p>
                      <h2 className={`mt-1 text-sm font-semibold ${headingClass}`}>Desainer Pendukung</h2>
                    </div>
                    <MaterialIcon name="groups" size="auto" className="text-2xl" style={{ color: accentColor }} />
                  </div>
                  <div className="mt-3 space-y-2">
                    {topDesigners.length > 0 ? topDesigners.map((d) => (
                      <div key={d.name} className={`flex items-center justify-between rounded-xl px-3 py-2 ${subBgClass}`}>
                        <div className="flex items-center gap-2.5">
                          <span
                            className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                            style={{ backgroundColor: accentColor, color: theme === "dark" ? "#181818" : "white" }}
                          >
                            {d.name.charAt(0).toUpperCase()}
                          </span>
                          <span className={`text-sm font-medium ${headingClass}`}>{d.name}</span>
                        </div>
                        <span className={`text-[11px] font-semibold ${mutedClass}`}>{d.count} tugas</span>
                      </div>
                    )) : (
                      <p className={`text-sm ${mutedClass}`}>Belum ada desainer yang ditugaskan.</p>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className={`rounded-2xl p-4 ${panelClass}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${mutedClass}`}>Live Feed</p>
                      <h2 className={`mt-1 text-sm font-semibold ${headingClass}`}>Aktivitas Terbaru</h2>
                    </div>
                    <MaterialIcon name="timeline" size="auto" className="text-2xl" style={{ color: accentColor }} />
                  </div>
                  <div className="mt-3 space-y-2">
                    {loading ? (
                      <p className={`text-sm ${mutedClass}`}>Memuat aktivitas...</p>
                    ) : recentActivity.length > 0 ? recentActivity.map((task) => (
                      <Link
                        key={task.id}
                        href={`/odds/detail?id=${task.id}`}
                        className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:opacity-80 ${subBgClass}`}
                      >
                        <span
                          className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
                        >
                          <MaterialIcon name="fiber_manual_record" size="auto" className="text-[10px]" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-xs font-semibold ${headingClass}`}>{task.design_purpose}</p>
                          <p className={`mt-0.5 text-[10px] ${mutedClass}`}>
                            {task.task_number} · {statusActivityLabel[task.status] ?? task.status}
                          </p>
                        </div>
                        <span className={`shrink-0 text-[10px] ${mutedClass}`}>{formatActivityDate(task.updated_at ?? task.created_at)}</span>
                      </Link>
                    )) : (
                      <p className={`text-sm ${mutedClass}`}>Belum ada aktivitas.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             DESIGNER VIEW
             ========================================================================= */
          <div className="flex flex-col gap-4">
            {/* Row 1: Metrics + Score + Chart */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
              {/* Flexible Metrics Group (4 cards) */}
              <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                <DesignerMetric
                  label="Total Tugas Hari Ini"
                  value={`${todayTasksCount} task`}
                  icon="assignment"
                  hideDefaultBottomLeft
                  bottomRight={
                    <span className={`flex items-center gap-0.5 ${highlightColor}`}>
                      <MaterialIcon name="trending_up" size="auto" className="text-[14px]" />
                      15% <span className={`ml-0.5 opacity-70 ${theme === "dark" ? "text-[#a7ada8]" : theme === "retro" ? "text-[#687065]" : "text-[#7D7C7C]"}`}>vs Yesterday</span>
                    </span>
                  }
                />
                <DesignerMetric
                  label="Total Dalam Antrian"
                  value={`${queuedTasksCount} task`}
                  icon="schedule"
                  bottomLeft={
                    <span>
                      Data Update <span className={`${highlightColor} font-bold`}>{todayStr}</span>
                    </span>
                  }
                />
                <DesignerMetric
                  label="Tugas Selesai"
                  value={`${doneTasksCount} task`}
                  icon="check_circle"
                  bottomLeft={
                    <span>
                      Periode <span className={`${highlightColor} font-bold`}>{monthYearStr}</span>
                    </span>
                  }
                />
                <DesignerMetric
                  label="Antrian Revisi"
                  value={`${revisionTasksCount} task`}
                  icon="rate_review"
                  bottomLeft={
                    <span>
                      Data Update <span className={`${highlightColor} font-bold`}>{todayStr}</span>
                    </span>
                  }
                />
              </div>

              <DesignerLastRequestCard tasks={tasks} />

            </div>
          </div>
        )}
      </div>
    );
  }

  if (false && effectiveActiveSection === "all_tasks") {
    // === RETRO THEME ===
    if (theme === "retro") {
      return (
        <div className="relative h-full min-h-0 w-full p-4">
          <ConfigPanel title="All Tasks" icon="assignment" retroHeader>
            <AllTasksCards
              loading={loading}
              empty="Belum ada task ODDS."
              tasks={tasks}
            />
          </ConfigPanel>
        </div>
      );
    }

    // === DARK THEME ===
    if (theme === "dark") {
      return <DarkAllTasksSection loading={loading} tasks={tasks} />;
    }

    // === LIGHT THEME ===
    return <LightAllTasksSection loading={loading} tasks={tasks} />;
  }

  const sectionTitles: Record<string, string> = {
    categories: "Kategori",
    rules: "System Rules",
    designers: "Profil Designer",
    schedules: "Jadwal & Libur",
    spv_review: "Review Leader Creative",
    client_review: "Review Client",
    special_revisions: "Extra / Urgent",
    cancel_requests: "Cancel",
    skip_requests: "Skip Antrean",
    reports: "Report",
    rankings: "Ranking",
    all_tasks: "Semua Tugas",
    designer_today_tasks: "Tugas Hari Ini",
    designer_all_tasks: "Semua Tugas",
    designer_review: "Menunggu Review",
    designer_revisions: "Revisi",
    designer_done: "Selesai",
    designer_report: "Laporan Kinerja",
    designer_settings: "Pengaturan & Jadwal",
    client_all_requests: "Semua Request",
    client_action_required: "Perlu Review",
    client_in_progress: "Sedang Diproses",
    client_archive: "Arsip",
    workspace: "Dashboard"
  };

  const pageTitle = sectionTitles[effectiveActiveSection] || (canShowConfigSections ? "Konfigurasi ODDS" : "Review ODDS");
  const isDesignerTaskSection = [
    "all_tasks",
    "spv_review",
    "client_review",
    "special_revisions",
    "cancel_requests",
    "skip_requests",
    "designer_today_tasks",
    "designer_all_tasks",
    "designer_review",
    "designer_revisions",
    "designer_done",
  ].includes(effectiveActiveSection);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 lg:gap-6 lg:p-4">
      {/* Desktop header title */}
      <div className="hidden lg:block">
        <HeaderTitle>{pageTitle}</HeaderTitle>
      </div>

      {/* Mobile header — kv-retail style */}
      <div className="lg:hidden shrink-0">
        <h1 className={`text-4xl font-medium leading-none tracking-[-0.05em] ${
          theme === "dark" ? "text-[#f1f1f1]" : "text-[#181818]"
        }`}>
          {pageTitle}
        </h1>
        {/* Search bar — kv-retail style */}
        {isDesignerTaskSection && (
          <section aria-label="Cari task" className="mt-4 flex shrink-0 items-center">
            <label className="relative w-full">
              <span className="sr-only">Cari task</span>
              <MaterialIcon
                name="search"
                size="auto"
                weight={400}
                className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl ${
                  theme === "dark" ? "text-[#b0ff5e]" : theme === "retro" ? "text-[#24252b]" : "text-[#525e61]"
                }`}
              />
              <input
                type="search"
                placeholder="Cari task..."
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                className={`h-12 w-full rounded-xl py-3 pl-11 pr-3 text-sm outline-none ${
                  theme === "dark"
                    ? "border border-white/10 bg-[#171717] text-[#f1f1f1] placeholder:text-[#7d827f] focus:border-[#b0ff5e]"
                    : theme === "retro"
                    ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b] placeholder:text-[#687065] focus:border-[#ba0dcb]"
                    : "border border-[#d7dcdd] bg-white text-[#222] placeholder:text-[#aeb6b8] focus:border-[#00a4ff]"
                }`}
              />
            </label>
          </section>
        )}
      </div>

      {(error || notice) && (
        <div
          className={`rounded-xl border px-4 py-3 text-xs font-medium ${
            error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || notice}
        </div>
      )}

      <div className={`flex min-h-0 min-w-0 flex-1 flex-col ${isDesignerTaskSection ? "overflow-hidden" : "odds-scroll-hidden overflow-y-auto"}`}>
      {effectiveActiveSection === "categories" && (
      <section className="grid min-h-[calc(100vh-10rem)] gap-6 xl:h-[calc(100vh-10rem)] xl:grid-cols-[minmax(18rem,22rem)_minmax(0,1fr)]">
        <ConfigPanel title={categoryForm.id ? "Edit Kategori" : "Tambah Kategori"} icon="category" className="h-full" bodyClassName="flex min-h-0 flex-col">
          <form onSubmit={submitCategory} className="flex min-h-0 flex-1 flex-col space-y-3">
            <TextField
              label="Nama kategori"
              value={categoryForm.name}
              required
              help="Nama jenis pekerjaan yang akan dipilih client saat membuat request."
              onChange={(value) => setCategoryForm((prev) => ({ ...prev, name: value }))}
            />
            <SelectField
              label="Important Matrix"
              value={categoryForm.important_matrix}
              help="Skala prioritas bawaan untuk setiap task yang dibuat dalam kategori ini."
              options={[
                { value: "Q1", label: "Q1 - Quadran I (Mendesak & Penting)" },
                { value: "Q2", label: "Q2 - Quadran II (Penting)" },
                { value: "Q3", label: "Q3 - Quadran III (Mendesak)" },
                { value: "Q4", label: "Q4 - Quadran IV (Normal / Standar)" },
              ]}
              onChange={(value) => setCategoryForm((prev) => ({ ...prev, important_matrix: value }))}
            />
            <div className="grid grid-cols-2 gap-2">
              <NumberField
                label="Bobot score"
                value={categoryForm.score_weight}
                step="0.5"
                help="Nilai output ketika task kategori ini selesai dan masuk ranking."
                onChange={(value) => setCategoryForm((prev) => ({ ...prev, score_weight: value }))}
              />
              <NumberField
                label="Max revisi"
                value={categoryForm.normal_revision_limit}
                help="Jumlah revisi normal gratis sebelum masuk alur extra/urgent revision."
                onChange={(value) => setCategoryForm((prev) => ({ ...prev, normal_revision_limit: value }))}
              />

              <NumberField
                label="SLA (Menit)"
                value={categoryForm.sla_minutes}
                help="Deadline default dalam menit jika client tidak mengisi deadline khusus."
                onChange={(value) => setCategoryForm((prev) => ({ ...prev, sla_minutes: value }))}
              />
            </div>
            <CheckField
              label="Aktif"
              help="Jika nonaktif, kategori tidak muncul di form request client."
              checked={categoryForm.is_active}
              onChange={(value) => setCategoryForm((prev) => ({ ...prev, is_active: value }))}
            />
            <FormActions
              saving={saving === "category"}
              editing={Boolean(categoryForm.id)}
              onCancel={() => setCategoryForm(emptyCategoryForm)}
            />
          </form>
        </ConfigPanel>

        <ConfigPanel title="Kategori ODDS" icon="view_list" className="h-full min-h-0" bodyClassName="min-h-0 flex-1 overflow-hidden">
          <DataTable
            loading={loading}
            empty="Belum ada kategori."
            headers={["Nama", "Matrix", "Bobot", "Revisi", "SLA", "Status", ""]}
            className="flex h-full min-h-0 flex-col"
            scrollClassName="odds-scroll-hidden min-h-0 flex-1 overflow-auto"
            rows={categories.map((category) => {
              const matrix = (category.important_matrix || "Q4").toUpperCase();
              const matrixBadgeColor = 
                matrix === "Q1" ? "bg-red-500/20 text-red-500 border-red-500/30" :
                matrix === "Q2" ? "bg-orange-500/20 text-orange-500 border-orange-500/30" :
                matrix === "Q3" ? "bg-blue-500/20 text-blue-500 border-blue-500/30" :
                "bg-slate-500/20 text-slate-400 border-slate-500/30";

              return [
                category.name,
                <span key={`cat-matrix-${category.id}`} className={`px-2 py-0.5 rounded text-[10px] font-extrabold border shrink-0 ${matrixBadgeColor}`}>
                  {matrix}
                </span>,
                String(category.score_weight),
                String(category.normal_revision_limit),
                `${category.sla_minutes} menit`,
                category.is_active ? "Aktif" : "Nonaktif",
                <RowActions
                  key={`category-actions-${category.id}`}
                  disabled={Boolean(saving)}
                  onEdit={() => editCategory(category)}
                  onDelete={() => void removeCategory(category)}
                />,
              ];
            })}
          />
        </ConfigPanel>
      </section>
      )}

      {effectiveActiveSection === "designers" && (
      <section className="grid gap-6 xl:grid-cols-[minmax(18rem,22rem)_minmax(0,1fr)]">
        <ConfigPanel title={designerForm.id ? "Edit Profil Desainer" : "Tambah Profil Desainer"} icon="groups">
          <form onSubmit={submitDesignerProfile} className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-cu-muted">User</span>
              <select
                value={designerForm.user_id}
                onChange={(event) => setDesignerForm((prev) => ({ ...prev, user_id: event.target.value }))}
                required
                className="h-10 w-full rounded-lg border border-cu-border bg-white px-3 text-sm outline-none focus:border-cu-info"
              >
                <option value="">Pilih user</option>
                {availableUsersForProfile.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.roles.join(", ")})
                  </option>
                ))}
              </select>
              <FieldHelp>User dengan role Designer atau Videographer yang akan masuk antrean ODDS.</FieldHelp>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-cu-muted">Status</span>
              <select
                value={designerForm.status}
                onChange={(event) => setDesignerForm((prev) => ({ ...prev, status: event.target.value as DesignerForm["status"] }))}
                className="h-10 w-full rounded-lg border border-cu-border bg-white px-3 text-sm outline-none focus:border-cu-info"
              >
                {statusOptions.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
              <FieldHelp>Available bisa menerima task, Offline disembunyikan dari pilihan client.</FieldHelp>
            </label>
            <div className="rounded-lg border border-cu-border bg-cu-panel-soft px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-cu-muted">Makna status</p>
              <p className="mt-1 text-sm text-cu-ink">
                Status mengatur ketersediaan harian desainer. Checklist Aktif di bawah mengatur apakah profil ini dipakai sistem assignment.
              </p>
            </div>
            <div>
              <span className="mb-2 block text-xs font-medium text-cu-muted">Spesialisasi</span>
              <FieldHelp>Kategori yang dicentang adalah kategori yang cocok untuk desainer ini. Saat edit, spesialisasi tersimpan otomatis tercentang.</FieldHelp>
              <div className="odds-scroll-hidden grid max-h-40 gap-2 overflow-auto rounded-lg border border-cu-border p-2">
                {categories.map((category) => (
                  <CheckField
                    key={category.id}
                    label={`${category.name}${category.is_active ? "" : " (nonaktif)"}`}
                    checked={selectedSpecializationIds.has(String(category.id))}
                    onChange={() => toggleSpecialization(category.id)}
                  />
                ))}
                {categories.length === 0 && (
                  <p className="px-1 py-2 text-sm text-cu-muted">Kategori belum tersedia.</p>
                )}
              </div>
            </div>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-cu-muted">Tanggal Cuti (Opsional)</span>
              <textarea
                value={designerForm.leave_dates_text}
                onChange={(e) => setDesignerForm((prev) => ({ ...prev, leave_dates_text: e.target.value }))}
                rows={3}
                placeholder="2026-12-25&#10;2026-12-26"
                className="w-full resize-y rounded-lg border border-cu-border px-3 py-2 font-mono text-sm outline-none focus:border-cu-info"
              />
              <FieldHelp>Masukkan daftar tanggal cuti spesifik untuk desainer ini dalam format YYYY-MM-DD. Pisahkan per baris.</FieldHelp>
            </label>
            <CheckField
              label="Profil aktif untuk assignment"
              help="Jika nonaktif, profil tidak dipakai untuk assignment dan pilihan designer client."
              checked={designerForm.is_active}
              onChange={(value: boolean) => setDesignerForm((prev) => ({ ...prev, is_active: value }))}
            />
            <FormActions
              saving={saving === "designer"}
              editing={Boolean(designerForm.id)}
              onCancel={() => setDesignerForm(emptyDesignerForm)}
            />
          </form>
        </ConfigPanel>

        <ConfigPanel title="Profil Desainer" icon="badge">
          <DataTable
            loading={loading}
            empty="Belum ada profil desainer."
            headers={["User", "Status", "Profil Aktif", "Spesialisasi", ""]}
            rows={designerProfiles.map((profile) => [
              profile.user?.name ?? `User #${profile.user_id}`,
              profile.status === "available" ? "Available" : "Offline",
              profile.is_active ? "Ya" : "Tidak",
              (profile.specializations ?? []).length > 0
                ? (profile.specializations ?? []).map((id) => categoryNameById.get(String(id)) ?? `#${id}`).join(", ")
                : "Semua kategori",
              <RowActions
                key={`designer-actions-${profile.id}`}
                disabled={Boolean(saving)}
                onEdit={() => editDesignerProfile(profile)}
                onDelete={() => void removeDesignerProfile(profile)}
              />,
            ])}
          />
        </ConfigPanel>
      </section>
      )}

      {effectiveActiveSection === "rules" && (
      <section className="grid gap-6 xl:grid-cols-[minmax(18rem,22rem)_minmax(0,1fr)]">
        <ConfigPanel title={ruleForm.id ? "Edit Rule" : "Tambah Rule"} icon="rule">
          <form onSubmit={submitRule} className="space-y-3">
            <TextField
              label="Key"
              value={ruleForm.key}
              required
              help="Nama aturan sistem, misalnya brief_return_limit atau client_review_timeout_days."
              onChange={(value) => setRuleForm((prev) => ({ ...prev, key: value }))}
            />
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-cu-muted">Value JSON</span>
              <textarea
                value={ruleForm.value}
                onChange={(event) => setRuleForm((prev) => ({ ...prev, value: event.target.value }))}
                required
                rows={6}
                className="w-full resize-y rounded-lg border border-cu-border px-3 py-2 font-mono text-sm outline-none focus:border-cu-info"
              />
              <FieldHelp>Isi aturan dalam format JSON agar bisa dibaca backend, contoh {"{\"count\": 2}"}.</FieldHelp>
            </label>
            <TextField
              label="Deskripsi"
              value={ruleForm.description}
              help="Penjelasan singkat fungsi rule supaya tidak tertukar saat konfigurasi."
              onChange={(value) => setRuleForm((prev) => ({ ...prev, description: value }))}
            />
            <CheckField
              label="Aktif"
              help="Jika nonaktif, rule ini tidak dipakai oleh alur ODDS."
              checked={ruleForm.is_active}
              onChange={(value) => setRuleForm((prev) => ({ ...prev, is_active: value }))}
            />
            <FormActions
              saving={saving === "rule"}
              editing={Boolean(ruleForm.id)}
              onCancel={() => setRuleForm(emptyRuleForm)}
            />
          </form>
        </ConfigPanel>

        <ConfigPanel title="System Rules" icon="settings">
          <DataTable
            loading={loading}
            empty="Belum ada system rule."
            headers={["Key", "Value", "Deskripsi", "Status", ""]}
            rows={rules.map((rule) => [
              rule.key,
              <code key={`rule-value-${rule.id}`} className="text-xs text-cu-muted">{JSON.stringify(rule.value)}</code>,
              rule.description ?? "-",
              rule.is_active ? "Aktif" : "Nonaktif",
              <RowActions
                key={`rule-actions-${rule.id}`}
                disabled={Boolean(saving)}
                onEdit={() => editRule(rule)}
                onDelete={() => void removeRule(rule)}
              />,
            ])}
          />
        </ConfigPanel>
      </section>
      )}

      {effectiveActiveSection === "schedules" && (
        <ScheduleConfig />
      )}

      {false && effectiveActiveSection === "spv_review" && (
        <ConfigPanel title="Review Leader Creative" icon="rate_review">
          <p className="mb-4 text-sm text-cu-muted">
            Output yang sudah dikirim desainer. Buka detail untuk ACC ke client atau minta revisi leader.
          </p>
          <TaskOperationsTable
            loading={loading}
            empty="Belum ada output yang menunggu review Leader Creative."
            tasks={spvReviewTasks}
          />
        </ConfigPanel>
      )}

      {false && effectiveActiveSection === "client_review" && (
        <ConfigPanel title="Menunggu Review Client" icon="reviews">
          <p className="mb-4 text-sm text-cu-muted">
            Hasil yang sudah di-ACC SPV dan sedang menunggu keputusan client.
          </p>
          <TaskOperationsTable
            loading={loading}
            empty="Belum ada task yang menunggu review client."
            tasks={clientReviewTasks}
          />
        </ConfigPanel>
      )}

      {false && effectiveActiveSection === "special_revisions" && (
        <ConfigPanel title="Approval Extra / Urgent Revision" icon="priority_high">
          <p className="mb-4 text-sm text-cu-muted">
            Revisi normal yang melewati kuota akan masuk ke sini untuk keputusan SPV/Manajer.
          </p>
          <textarea
            value={reviewNote}
            onChange={(event) => setReviewNote(event.target.value)}
            rows={3}
            placeholder="Catatan keputusan"
            className="mb-4 w-full resize-y rounded-lg border border-cu-border px-3 py-2 text-sm outline-none focus:border-cu-info"
          />
          <DataTable
            loading={loading}
            empty="Belum ada extra atau urgent revision yang menunggu review."
            headers={["Task", "Tipe", "Catatan", "Client", "Designer", "Aksi"]}
            rows={specialRevisionRequests.map((revision) => {
              const task = revision.task;
              const assignedDesigner = task?.assigned_designer ?? task?.assignedDesigner;

              return [
                <div key={`special-task-${revision.id}`}>
                  <p className="font-semibold text-cu-ink">{task?.design_purpose ?? `Task #${revision.task_id}`}</p>
                  <p className="mt-1 text-xs text-cu-muted">{task?.task_number ?? "-"}</p>
                </div>,
                <StatusBadge key={`revision-type-${revision.id}`} status={revision.revision_type} />,
                revision.notes,
                task?.requester?.name ?? "-",
                assignedDesigner?.name ?? "-",
                <DecisionButtons
                  key={`revision-actions-${revision.id}`}
                  disabled={Boolean(saving)}
                  approveLabel="ACC"
                  rejectLabel="Tolak"
                  onApprove={() => reviewSpecialRevision(revision, "approved")}
                  onReject={() => reviewSpecialRevision(revision, "rejected")}
                />,
              ];
            })}
          />
        </ConfigPanel>
      )}

      {false && effectiveActiveSection === "cancel_requests" && (
        <ConfigPanel title="Review Cancel Request" icon="cancel">
          <p className="mb-4 text-sm text-cu-muted">
            Cancel sebelum task dikerjakan langsung batal. Cancel setelah work dimulai perlu keputusan SPV/Manajer.
          </p>
          <textarea
            value={reviewNote}
            onChange={(event) => setReviewNote(event.target.value)}
            rows={3}
            placeholder="Catatan keputusan"
            className="mb-4 w-full resize-y rounded-lg border border-cu-border px-3 py-2 text-sm outline-none focus:border-cu-info"
          />
          <DataTable
            loading={loading}
            empty="Belum ada cancel request yang menunggu review."
            headers={["Task", "Alasan", "Client", "Designer", "Status", "Aksi"]}
            rows={cancelRequests.map((request) => {
              const task = request.task;
              const assignedDesigner = task?.assigned_designer ?? task?.assignedDesigner;

              return [
                <div key={`cancel-task-${request.id}`}>
                  <p className="font-semibold text-cu-ink">{task?.design_purpose ?? `Task #${request.task_id}`}</p>
                  <p className="mt-1 text-xs text-cu-muted">{task?.task_number ?? "-"}</p>
                </div>,
                request.reason,
                task?.requester?.name ?? "-",
                assignedDesigner?.name ?? "-",
                <StatusBadge key={`cancel-status-${request.id}`} status={request.status} />,
                <DecisionButtons
                  key={`cancel-actions-${request.id}`}
                  disabled={Boolean(saving)}
                  approveLabel="ACC"
                  rejectLabel="Tolak"
                  onApprove={() => reviewCancel(request, "approved")}
                  onReject={() => reviewCancel(request, "rejected")}
                />,
              ];
            })}
          />
        </ConfigPanel>
      )}

      {false && effectiveActiveSection === "skip_requests" && (
        <ConfigPanel title="Review Skip Antrean" icon="skip_next">
          <p className="mb-4 text-sm text-cu-muted">
            Desainer hanya dapat mengajukan skip untuk task prioritas berikutnya. Keputusan berada pada SPV/Manajer.
          </p>
          <textarea
            value={reviewNote}
            onChange={(event) => setReviewNote(event.target.value)}
            rows={3}
            placeholder="Catatan keputusan"
            className="mb-4 w-full resize-y rounded-lg border border-cu-border px-3 py-2 text-sm outline-none focus:border-cu-info"
          />
          <DataTable
            loading={loading}
            empty="Belum ada permintaan skip antrean yang menunggu review."
            headers={["Task", "Alasan", "Designer", "Status", "Aksi"]}
            rows={skipRequests.map((request) => {
              const task = request.task;
              const assignedDesigner = task?.assigned_designer ?? task?.assignedDesigner;

              return [
                <div key={`skip-task-${request.id}`}>
                  <p className="font-semibold text-cu-ink">{task?.design_purpose ?? `Task #${request.task_id}`}</p>
                  <p className="mt-1 text-xs text-cu-muted">{task?.task_number ?? "-"}</p>
                </div>,
                request.reason,
                assignedDesigner?.name ?? "-",
                <StatusBadge key={`skip-status-${request.id}`} status={request.status} />,
                <DecisionButtons
                  key={`skip-actions-${request.id}`}
                  disabled={Boolean(saving)}
                  approveLabel="ACC Skip"
                  rejectLabel="Tolak"
                  onApprove={() => reviewQueueSkip(request, "approved")}
                  onReject={() => reviewQueueSkip(request, "rejected")}
                />,
              ];
            })}
          />
        </ConfigPanel>
      )}

      {effectiveActiveSection === "reports" && (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-5">
            <MetricTile icon="task_alt" label="Output" value={reportSummary?.total_output ?? 0} />
            <MetricTile icon="score" label="Score" value={Math.round(Number(reportSummary?.total_score ?? 0))} />
            <MetricTile icon="history" label="Revisi" value={reportSummary?.revision_count ?? 0} />
            <MetricTile icon="warning" label="Overdue" value={reportSummary?.overdue_count ?? 0} />
            <MetricTile icon="report" label="Quality" value={reportSummary?.quality_issue_count ?? 0} />
          </section>
          <p className="rounded-lg border border-cu-border bg-cu-panel-soft px-4 py-3 text-sm leading-6 text-cu-muted">
            Quality menghitung task yang terkena quality issue, yaitu revisi SPV melewati batas wajar. Angka ini dipakai untuk audit internal,
            evaluasi proses, dan ranking desainer.
          </p>
          {reportSummary?.ai_insight && (
            <ConfigPanel title="Insight Audit" icon="auto_awesome">
              <p className="text-sm leading-6 text-cu-muted">{reportSummary.ai_insight}</p>
            </ConfigPanel>
          )}
          <ConfigPanel title="Daily Report" icon="monitoring">
            <DataTable
              loading={loading}
              empty="Belum ada daily report."
              headers={["Tanggal", "Designer", "Output", "Revisi", "Overdue", "Quality", "Rating", "Score"]}
              rows={dailyReports.map((report) => [
                formatOddsDate(report.report_date),
                report.designer?.name ?? `Designer #${report.designer_id}`,
                report.output_done ? "Ya" : "Tidak",
                String(report.revision_count),
                report.overdue ? "Ya" : "Tidak",
                report.quality_issue_flag ? "Ya" : "Tidak",
                report.rating ? String(report.rating) : "-",
                String(report.score),
              ])}
            />
          </ConfigPanel>
        </div>
      )}

      {effectiveActiveSection === "rankings" && (
        <ConfigPanel title="Ranking Designer" icon="leaderboard">
          <div className="mb-4 flex flex-wrap gap-2">
            {(["daily", "monthly", "yearly"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setRankingPeriod(period)}
                className={`h-9 rounded-lg border px-3 text-sm font-semibold capitalize ${
                  rankingPeriod === period
                    ? "border-cu-info bg-cu-info text-white"
                    : "border-cu-border text-cu-ink hover:bg-cu-panel-soft"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          <DataTable
            loading={loading}
            empty="Belum ada ranking."
            headers={["Designer", "Periode", "Output", "Score", "Rating"]}
            rows={rankings.map((ranking) => [
              ranking.designer?.name ?? `Designer #${ranking.designer_id}`,
              `${formatOddsDate(ranking.period_start)} - ${formatOddsDate(ranking.period_end)}`,
              String(ranking.total_output),
              String(ranking.total_score),
              ranking.average_rating ? String(ranking.average_rating) : "-",
            ])}
          />
        </ConfigPanel>
      )}

      {isDesignerTaskSection && (() => {
        const isControlTaskSection = ["all_tasks", "spv_review", "client_review", "special_revisions", "cancel_requests", "skip_requests"].includes(effectiveActiveSection);
        const isTodayOnly = effectiveActiveSection === "designer_today_tasks";
        const accentColor = theme === "dark" ? "#b0ff5e" : theme === "retro" ? "#ba0dcb" : "#00a4ff";
        
        const specialRevisionTaskIds = new Set(specialRevisionRequests.map((revision) => revision.task?.id ?? revision.task_id).filter(Boolean));
        const cancelRequestTaskIds = new Set(cancelRequests.map((request) => request.task?.id ?? request.task_id).filter(Boolean));
        const skipRequestTaskIds = new Set(skipRequests.map((request) => request.task?.id ?? request.task_id).filter(Boolean));

        const assignedDesignerTasks = isControlTaskSection
          ? tasks
          : tasks.filter(t => String(t.assigned_designer?.id ?? t.assignedDesigner?.id) === String(user?.id));
        const revisionTaskTypes = ["leader_revision", "client_revision", "extra_revision", "urgent_revision"];

        let sortedTasks = assignedDesignerTasks
          .filter((task) => {
            if (effectiveActiveSection === "all_tasks") return true;
            if (effectiveActiveSection === "spv_review") return task.status === "spv_review";
            if (effectiveActiveSection === "client_review") return task.status === "client_review";
            if (effectiveActiveSection === "special_revisions") return specialRevisionTaskIds.has(task.id);
            if (effectiveActiveSection === "cancel_requests") return cancelRequestTaskIds.has(task.id);
            if (effectiveActiveSection === "skip_requests") return skipRequestTaskIds.has(task.id);
            if (effectiveActiveSection === "designer_done") return task.status === "done";
            if (effectiveActiveSection === "designer_review") return ["spv_review", "client_review"].includes(task.status);
            if (effectiveActiveSection === "designer_revisions") {
              return revisionTaskTypes.includes(task.task_type)
                && !["done", "cancelled", "cancelled_by_spv", "revision_rejected_by_spv"].includes(task.status);
            }
            return task.status !== "done";
          })
          .sort((a, b) => {
            if (isControlTaskSection) {
              const aDone = a.status === "done";
              const bDone = b.status === "done";
              if (aDone && !bDone) return 1;
              if (bDone && !aDone) return -1;
            }

            // Level 1: in_progress
            if (a.status === "in_progress" && b.status !== "in_progress") return -1;
            if (b.status === "in_progress" && a.status !== "in_progress") return 1;

            // Level 2: revision task types
            const aRevision = revisionTaskTypes.includes(a.task_type);
            const bRevision = revisionTaskTypes.includes(b.task_type);
            if (aRevision && !bRevision) return -1;
            if (bRevision && !aRevision) return 1;

            // Level 3: others, sort by deadline (ascending)
            const timeA = new Date(a.deadline).getTime();
            const timeB = new Date(b.deadline).getTime();
            if (timeA !== timeB) return timeA - timeB;

            // Sort by priority score (descending)
            return (Number(b.priority_score) || 0) - (Number(a.priority_score) || 0);
          });
          
        if (isTodayOnly) {
          const dailyCapacityMinutes = 480; // Standard daily capacity
          let accumulatedSla = 0;
          sortedTasks = sortedTasks.filter(t => {
            if (t.status === "in_progress" || revisionTaskTypes.includes(t.task_type)) return true;
            const sla = t.category_snapshot?.sla_minutes || 0;
            if (accumulatedSla + sla <= dailyCapacityMinutes) {
              accumulatedSla += sla;
              return true;
            }
            return false;
          });
        }
        
        const myTasks = sortedTasks;
        
        // Find if there is an in-progress task for the active designer
        const activeInProgressTask = assignedDesignerTasks.find(t => t.status === "in_progress");

        const handleStartTask = async (taskId: number) => {
          setError(null);
          setNotice(null);
          try {
            const startedTask = await startOddsTask(taskId);
            setTasks((current) => current.map((task) => task.id === taskId ? { ...task, ...startedTask, status: "in_progress" } : task));
            setNotice("Tugas berhasil dimulai.");
            await loadConfig();
          } catch (err) {
            setError(oddsError(err));
          }
        };

        const handlePauseTask = async (taskId: number) => {
          setError(null);
          setNotice(null);
          try {
            const pausedTask = await pauseOddsTask(taskId);
            setTasks((current) => current.map((task) => task.id === taskId ? { ...task, ...pausedTask } : task));
            setNotice("Pengerjaan task dipause.");
            await loadConfig();
          } catch (err) {
            setError(oddsError(err));
          }
        };

        const handleSubmitOutput = async (taskId: number) => {
          if (outputBusy) return;
          const total = Number(outputTotal);
          if (!Number.isFinite(total) || total <= 0 || (outputFiles.length === 0 && !outputShareLink.trim())) {
            setError("Isi total output dan tambahkan link local file sharing atau upload minimal 1 file output.");
            return;
          }
          setError(null);
          setNotice(null);
          setOutputBusy(true);
          try {
            const uploadedFiles = await Promise.all(outputFiles.map((file) => uploadOddsTaskAttachment(file, taskId)));
            const assets = [
              ...(outputShareLink.trim()
                ? [{ provider: "other" as const, label: "Local File Sharing", url: outputShareLink.trim() }]
                : []),
              ...uploadedFiles.map((file) => ({
                provider: "other" as const,
                label: file.name,
                url: `${window.location.origin}/api/v1/odds/uploads/${file.id}/content`,
              })),
            ];
            await submitOddsResult(taskId, {
              result_notes: `Total Output: ${total}`,
              assets,
            });
            setNotice("Output dikirim ke SPV.");
            setOutputShareLink("");
            setOutputFiles([]);
            setOutputTotal("");
            setActiveOutputTaskId(null);
            await loadConfig();
          } catch (err) {
            setError(oddsError(err));
          } finally {
            setOutputBusy(false);
          }
        };

        const appendOutputFiles = (files: FileList | File[]) => {
          const nextFiles = Array.from(files);
          if (nextFiles.length === 0) return;
          setOutputFiles((current) => {
            const known = new Set(current.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
            return [
              ...current,
              ...nextFiles.filter((file) => !known.has(`${file.name}-${file.size}-${file.lastModified}`)),
            ];
          });
        };

        const closeOutputPanel = () => {
          setActiveOutputTaskId(null);
          setOutputShareLink("");
          setOutputFiles([]);
          setOutputTotal("");
          setOutputDragActive(false);
        };

        // Determine which task is currently selected for the chat box
        const selectedChatTaskId = activeChatTaskId;

        // Mobile search filter
        const mobileFilteredTasks = mobileSearchQuery.trim()
          ? myTasks.filter((t) =>
              t.design_purpose?.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
              t.requester?.name?.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
              ((t as any).assigned_designer?.name ?? (t as any).assignedDesigner?.name ?? "").toLowerCase().includes(mobileSearchQuery.toLowerCase())
            )
          : myTasks;

        return (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
              <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
                  {loading ? (
                  <div className="rounded-lg border border-cu-border bg-cu-panel-soft px-4 py-8 text-center text-sm text-cu-muted">Memuat...</div>
                  ) : myTasks.length === 0 ? (
                  <div className="rounded-lg border border-cu-border bg-cu-panel-soft px-4 py-8 text-center text-sm text-cu-muted">Belum ada riwayat tugas.</div>
                  ) : (
                    <div className="odds-scroll-hidden flex min-h-0 flex-1 flex-col gap-5 overflow-auto pb-1 pr-1">
                      {/* Mobile: use mobileFilteredTasks */}
                      {mobileFilteredTasks.map((task) => {
                        const isClientForTask = Boolean(String(user?.id) === String((task as any).requester_id) || (task.requester?.id && String(user?.id) === String(task.requester.id)));
                        const canCheckThisTask = Boolean((task.status === "spv_review" && canReviewSpv) || (task.status === "client_review" && isClientForTask));
                        const handleControlDelete = async () => {
                          const confirmed = window.confirm(`Hapus task ${task.task_number} dari database?`);
                          if (!confirmed) return;

                          try {
                            await deleteOddsTask(task.id);
                            await loadConfig();
                          } catch (err) {
                            alert(oddsError(err));
                          }
                        };
                        
                        return (
                        <div key={task.id} className="flex flex-col gap-3">
                          {/* ── Mobile Card ── */}
                          <div className="lg:hidden">
                            <OddsMobileTaskCard
                              task={task}
                              theme={theme}
                              nowMs={timerNow}
                              timerSeconds={task.status === "in_progress" ? getTaskDuration(task) : undefined}
                              canCheckRole={canCheckThisTask}
                              chatOpen={selectedChatTaskId === task.id}
                              hideDelete={!isControlTaskSection}
                              showStart={!isControlTaskSection && (task.status === "queued" || task.status === "revision")}
                              showPause={isControlTaskSection ? ["in_progress", "leader_revision_requested", "revision"].includes(task.status) : task.status === "in_progress"}
                              showDone={!isControlTaskSection && task.status === "in_progress"}
                              startDisabled={Boolean(activeInProgressTask)}
                              onAction={(action) => {
                                if (action === "chat") {
                                  setActiveChatTaskId((current) => current === task.id ? null : task.id);
                                  return;
                                }
                                if (action === "pause") {
                                  void handlePauseTask(task.id);
                                  return;
                                }
                                if (action === "start") {
                                  void handleStartTask(task.id);
                                  return;
                                }
                                if (action === "done") {
                                  if (activeOutputTaskId === task.id) {
                                    closeOutputPanel();
                                    return;
                                  }
                                  setOutputFiles([]);
                                  setOutputShareLink("");
                                  setOutputTotal("");
                                  setOutputDragActive(false);
                                  setActiveOutputTaskId(task.id);
                                  return;
                                }
                                if (action === "delete") {
                                  void handleControlDelete();
                                }
                              }}
                            >
                              {(activeTab) => (
                                <>
                                  <DesignerTaskQueueCard
                                    task={task}
                                    theme={theme}
                                    nowMs={timerNow}
                                    controlView={isControlTaskSection}
                                    selected={selectedChatTaskId === task.id}
                                    startDisabled={Boolean(activeInProgressTask)}
                                    timerText={task.status === "in_progress" ? formatTimer(getTaskDuration(task)) : undefined}
                                    onChat={() => setActiveChatTaskId((current) => current === task.id ? null : task.id)}
                                    onStart={() => void handleStartTask(task.id)}
                                    onPause={() => void handlePauseTask(task.id)}
                                    onDone={() => {
                                      if (activeOutputTaskId === task.id) {
                                        closeOutputPanel();
                                        return;
                                      }
                                      setOutputFiles([]);
                                      setOutputShareLink("");
                                      setOutputTotal("");
                                      setOutputDragActive(false);
                                      setActiveOutputTaskId(task.id);
                                    }}
                                    onAcceptBrief={() => runOperationalAction(
                                      `brief-accept-${task.id}`,
                                      () => acceptOddsBrief(task.id),
                                      "Brief diterima dan masuk antrean."
                                    )}
                                    onReturnBrief={(note) => runOperationalAction(
                                      `brief-return-${task.id}`,
                                      () => returnOddsBrief(task.id, note),
                                      "Brief dikembalikan."
                                    )}
                                    externalAction={activeTab ? { type: activeTab as any, nonce: Date.now() } : undefined}
                                    detailOnly
                                  />
                                  {selectedChatTaskId === task.id && (
                                    <div className={`overflow-hidden border-t ${theme === "dark" ? "border-white/10 bg-[#171717]" : theme === "retro" ? "border-[#24252b] bg-[#eceee6]" : "border-[#d9e1e6] bg-white"}`}>
                                      <OddsTaskChat taskId={task.id} userId={user?.id} taskStatus={task.status} compact />
                                    </div>
                                  )}
                                </>
                              )}
                            </OddsMobileTaskCard>
                          </div>

                          {/* ── Desktop Card ── */}
                          <div className="hidden min-w-[900px] flex-col gap-3 lg:flex">
                            <AdminKvRetailTaskCard
                              task={task}
                              theme={theme}
                              nowMs={timerNow}
                              timerText={task.status === "in_progress" ? formatTimer(getTaskDuration(task)) : undefined}
                              timerSeconds={task.status === "in_progress" ? getTaskDuration(task) : undefined}
                              chatOpen={selectedChatTaskId === task.id}
                              canCheckRole={canCheckThisTask}
                              hideDelete={!isControlTaskSection}
                              showStart={!isControlTaskSection && (task.status === "queued" || task.status === "revision")}
                              showPause={isControlTaskSection ? ["in_progress", "leader_revision_requested", "revision"].includes(task.status) : task.status === "in_progress"}
                              showDone={!isControlTaskSection && task.status === "in_progress"}
                              startDisabled={Boolean(activeInProgressTask)}
                              onAction={(action) => {
                                if (action === "chat") {
                                  setActiveChatTaskId((current) => current === task.id ? null : task.id);
                                  return;
                                }
                                if (action === "pause") {
                                  void handlePauseTask(task.id);
                                  return;
                                }
                                if (action === "start") {
                                  void handleStartTask(task.id);
                                  return;
                                }
                                if (action === "done") {
                                  if (activeOutputTaskId === task.id) {
                                    closeOutputPanel();
                                    return;
                                  }
                                  setOutputFiles([]);
                                  setOutputShareLink("");
                                  setOutputTotal("");
                                  setOutputDragActive(false);
                                  setActiveOutputTaskId(task.id);
                                  return;
                                }
                                if (action === "delete") {
                                  void handleControlDelete();
                                  return;
                                }
                                setAdminTaskAction({ taskId: task.id, type: action, nonce: Date.now() });
                              }}
                            >
                              <DesignerTaskQueueCard
                                task={task}
                                theme={theme}
                                nowMs={timerNow}
                                controlView={isControlTaskSection}
                                selected={selectedChatTaskId === task.id}
                                startDisabled={Boolean(activeInProgressTask)}
                                timerText={task.status === "in_progress" ? formatTimer(getTaskDuration(task)) : undefined}
                                onChat={() => setActiveChatTaskId((current) => current === task.id ? null : task.id)}
                                onStart={() => void handleStartTask(task.id)}
                                onPause={() => void handlePauseTask(task.id)}
                                onDone={() => {
                                  if (activeOutputTaskId === task.id) {
                                    closeOutputPanel();
                                    return;
                                  }
                                  setOutputFiles([]);
                                  setOutputShareLink("");
                                  setOutputTotal("");
                                  setOutputDragActive(false);
                                  setActiveOutputTaskId(task.id);
                                }}
                                onAcceptBrief={() => runOperationalAction(
                                  `brief-accept-${task.id}`,
                                  () => acceptOddsBrief(task.id),
                                  "Brief diterima dan masuk antrean."
                                )}
                                onReturnBrief={(note) => runOperationalAction(
                                  `brief-return-${task.id}`,
                                  () => returnOddsBrief(task.id, note),
                                  "Brief dikembalikan."
                                )}
                                externalAction={adminTaskAction?.taskId === task.id ? adminTaskAction : undefined}
                                detailOnly
                              />
                              {selectedChatTaskId === task.id && (
                                <div className={`overflow-hidden rounded-lg border mt-3 ${theme === "dark" ? "border-white/10 bg-[#171717]" : theme === "retro" ? "rounded-none border-2 border-[#24252b] bg-[#eceee6]" : "border-[#d9e1e6] bg-white"} shadow-[0_5px_14px_rgba(44,42,39,0.05)]`}>
                                  <div className="flex items-center justify-between border-b border-cu-border bg-cu-panel-soft px-3 py-2">
                                    <div className="flex min-w-0 items-center gap-2">
                                      <MaterialIcon name="forum" size="auto" className="text-lg" style={{ color: accentColor }} />
                                      <div className="min-w-0">
                                        <p className="max-w-[560px] truncate text-xs font-semibold leading-none text-cu-ink">{task.design_purpose}</p>
                                      </div>
                                    </div>
                                    <button type="button" onClick={() => setActiveChatTaskId(null)} aria-label="Tutup diskusi" className="flex size-7 items-center justify-center rounded-lg border border-cu-border bg-white text-cu-ink transition hover:bg-cu-panel-soft">
                                      <MaterialIcon name="close" size="xs" />
                                    </button>
                                  </div>
                                  <OddsTaskChat
                                    taskId={task.id}
                                    userId={user?.id}
                                    taskStatus={task.status}
                                    compact
                                  />
                                </div>
                              )}
                            </AdminKvRetailTaskCard>
                          </div>
                          {activeOutputTaskId === task.id && (
                          <div className={`overflow-hidden rounded-lg border ${theme === "dark" ? "border-white/10 bg-[#171717]" : theme === "retro" ? "rounded-none border-2 border-[#24252b] bg-[#eceee6]" : "border-[#d9e1e6] bg-white"} shadow-[0_5px_14px_rgba(44,42,39,0.05)]`}>
                            <div className="flex h-10 items-center justify-between border-b border-cu-border bg-cu-panel-soft px-3">
                              <div className="flex min-w-0 items-center gap-2">
                                <MaterialIcon name="task_alt" size="auto" className="text-lg" style={{ color: accentColor }} />
                                <p className="max-w-[560px] truncate text-xs font-semibold leading-none text-cu-ink">Submit Output</p>
                              </div>
                              <button type="button" onClick={closeOutputPanel} aria-label="Tutup output" className="flex size-7 items-center justify-center rounded-lg border border-cu-border bg-white text-cu-ink transition hover:bg-cu-panel-soft">
                                <MaterialIcon name="close" size="xs" />
                              </button>
                            </div>
                            <form
                              onSubmit={(event) => {
                                event.preventDefault();
                                void handleSubmitOutput(task.id);
                              }}
                              className="grid gap-3 bg-white p-3 lg:grid-cols-[minmax(260px,1fr)_minmax(260px,1fr)_minmax(220px,auto)] lg:items-end"
                            >
                              <label className="grid gap-1.5 text-xs font-semibold text-cu-ink">
                                <span>Link Local File Sharing</span>
                                <input
                                  type="text"
                                  value={outputShareLink}
                                  onChange={(event) => setOutputShareLink(event.target.value)}
                                  placeholder={"\\\\Server\\Share\\Example"}
                                  className="h-10 rounded-lg border border-cu-border bg-white px-3 text-sm font-medium outline-none transition placeholder:text-cu-muted/70 focus:border-cu-info focus:ring-2 focus:ring-cu-info/10"
                                />
                              </label>
                              <label
                                onDragOver={(event) => {
                                  event.preventDefault();
                                  setOutputDragActive(true);
                                }}
                                onDragLeave={() => setOutputDragActive(false)}
                                onDrop={(event) => {
                                  event.preventDefault();
                                  setOutputDragActive(false);
                                  appendOutputFiles(event.dataTransfer.files);
                                }}
                                className={`grid h-[62px] cursor-pointer grid-cols-[auto_1fr] items-center gap-x-3 rounded-lg border border-dashed px-3 text-xs transition ${outputDragActive ? "border-cu-info bg-cu-info/10 text-cu-info" : "border-cu-border bg-cu-panel-soft text-cu-muted hover:border-cu-info/60 hover:bg-cu-info/5"}`}
                              >
                                <input
                                  type="file"
                                  multiple
                                  className="sr-only"
                                  onChange={(event) => {
                                    if (event.target.files) appendOutputFiles(event.target.files);
                                    event.currentTarget.value = "";
                                  }}
                                />
                                <span className="row-span-2 flex size-8 items-center justify-center rounded-lg bg-white text-cu-ink shadow-sm">
                                  <MaterialIcon name="upload_file" size="sm" />
                                </span>
                                <span className="self-end truncate font-semibold leading-none text-cu-ink">File Upload</span>
                                {outputFiles.length > 0 && (
                                  <span className="truncate self-start leading-none text-cu-info">
                                    {outputFiles.length} file: {outputFiles.map((file) => file.name).join(", ")}
                                  </span>
                                )}
                                {outputFiles.length === 0 && (
                                  <span className="truncate self-start leading-none">Multi-file, drag and drop.</span>
                                )}
                              </label>
                              <div className="grid gap-1.5">
                                <span className="text-xs font-semibold text-cu-ink">Total Output</span>
                                <div className="grid grid-cols-[minmax(82px,1fr)_112px] gap-2">
                                  <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={outputTotal}
                                    onChange={(event) => setOutputTotal(event.target.value)}
                                    placeholder="0"
                                    className="h-10 min-w-0 rounded-lg border border-cu-border bg-white px-3 text-sm font-medium outline-none transition placeholder:text-cu-muted/70 focus:border-cu-info focus:ring-2 focus:ring-cu-info/10"
                                  />
                                  <button
                                    type="submit"
                                    disabled={outputBusy || !outputTotal || (outputFiles.length === 0 && !outputShareLink.trim())}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cu-info px-4 text-sm font-semibold text-white transition hover:bg-cu-info/90 disabled:opacity-50"
                                  >
                                    <MaterialIcon name="upload" size="sm" />
                                    {outputBusy ? "Kirim..." : "Submit"}
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    ); })}
                  </div>
                  )}
              </section>
            </div>

          </div>
        );
      })()}

      {false && effectiveActiveSection === "designer_done" && (() => {
        const accentColor = theme === "dark" ? "#b0ff5e" : theme === "retro" ? "#ba0dcb" : "#00a4ff";
        
        const formatSubmitTime = (iso?: string) => {
          if (!iso) return "-";
          return new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(iso)) + " WIB";
        };

        const doneTasks = tasks.filter(t => String(t.assigned_designer?.id ?? t.assignedDesigner?.id) === String(user?.id) && t.status === "done");

        return (
          <ConfigPanel title="Selesai" icon="task_alt">
            <DataTable
              loading={loading}
              empty="Belum ada tugas yang selesai."
              headers={["Prioritas", "Hari, Tanggal, Jam Submit Task", "Nama Perequest dan Divisi", "Judul tugas", "link detail brief", "Deadline", "Rating"]}
              rows={doneTasks.map((task) => {
                const priorityWord = (() => {
                  const m = (task.important_matrix || task.category?.important_matrix || "Q4").toUpperCase();
                  if (m === "Q1" || m === "URGENT") return "Q1";
                  if (m === "Q2" || m === "HIGH") return "Q2";
                  if (m === "Q3" || m === "MEDIUM") return "Q3";
                  return "Q4";
                })();
                return [
                  priorityWord,
                  formatSubmitTime(task.created_at),
                  `${task.requester?.name ?? "Perequest"} (${(task.requester?.roles ?? []).join(", ") || "Client"})`,
                  task.design_purpose,
                  <Link key={`brief-link-${task.id}`} href={`/odds/detail?id=${task.id}`} className="text-xs hover:underline font-semibold" style={{ color: accentColor }}>
                    Detail Brief
                  </Link>,
                  formatOddsDate(task.deadline),
                  task.rating ? `${task.rating} ⭐` : "-"
                ];
              })}
            />
          </ConfigPanel>
        );
      })()}

      {effectiveActiveSection === "designer_report" && (() => {
        const reportRows = dailyReports.length > 0
          ? dailyReports.map((report) => [
              formatOddsDate(report.report_date),
              String(report.total_output ?? (report.output_done ? 1 : 0)),
              String(report.revision_count),
              report.overdue ? "Ya" : "Tidak",
              report.quality_issue_flag ? "Ya" : "Tidak",
              String(report.score),
            ])
          : tasks
              .filter((task) => task.status === "done" && String(task.assigned_designer?.id ?? task.assignedDesigner?.id) === String(user?.id))
              .map((task) => [
                formatOddsDate(task.done_at ?? task.updated_at ?? task.created_at),
                String((task.results ?? []).reduce((total, result) => {
                  const match = (result.result_notes ?? "").match(/Total Output:\s*([0-9]+)/i);
                  return total + (match?.[1] ? Number(match[1]) : 0);
                }, 0)),
                String((task.normal_revision_count ?? 0) + (task.leader_revision_count ?? 0)),
                task.overdue ? "Ya" : "Tidak",
                task.quality_issue_flag ? "Ya" : "Tidak",
                String(task.category_snapshot?.score_weight ?? task.category?.score_weight ?? 0),
              ]);

        return (
        <div className="space-y-6">
          <ConfigPanel title="Laporan Kinerja Pribadi" icon="monitoring">
            <DataTable
              loading={loading}
              empty="Belum ada data kinerja."
              headers={["Tanggal", "Output", "Revisi", "Overdue", "Quality", "Score"]}
              rows={reportRows}
            />
          </ConfigPanel>
        </div>
        );
      })()}

      {effectiveActiveSection === "designer_settings" && (
        <ConfigPanel title="Pengaturan & Jadwal" icon="manage_accounts">
          <div className="space-y-4">
             {(() => {
                const myProfile = designerProfiles.find(p => String(p.user_id) === String(user?.id));
                if (!myProfile) return <p className="text-sm text-cu-muted">Profil desainer tidak ditemukan.</p>;
                return (
                  <div className="rounded-lg border border-cu-border p-4">
                    <h3 className="mb-2 text-sm font-semibold text-cu-ink">Status Saat Ini</h3>
                    <StatusBadge status={myProfile.status} />
                    <p className="mt-2 text-xs text-cu-muted">Status otomatis mengikuti jumlah task atau jadwal cuti yang terdaftar.</p>
                    
                    <h3 className="mt-4 mb-2 text-sm font-semibold text-cu-ink">Jadwal Cuti Anda</h3>
                    {myProfile.leave_dates && myProfile.leave_dates.length > 0 ? (
                      <ul className="list-disc pl-5 text-sm text-cu-muted">
                        {myProfile.leave_dates.map((date, i) => <li key={i}>{formatOddsDate(date)}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm text-cu-muted">Tidak ada jadwal cuti terdaftar.</p>
                    )}
                  </div>
                );
             })()}
          </div>
        </ConfigPanel>
      )}

      {["client_all_requests", "client_action_required", "client_in_progress", "client_archive"].includes(effectiveActiveSection) && (() => {
        const clientTasks = tasks.filter((task) => {
          if (effectiveActiveSection === "client_action_required") return task.status === "client_review";
          if (effectiveActiveSection === "client_in_progress") return ["queued", "in_progress", "spv_review"].includes(task.status);
          if (effectiveActiveSection === "client_archive") return ["done", "cancelled", "cancelled_by_spv", "revision_rejected_by_spv"].includes(task.status);
          return true;
        });
        const emptyText = effectiveActiveSection === "client_action_required"
          ? "Tidak ada tugas yang menunggu ACC/Feedback Anda saat ini."
          : effectiveActiveSection === "client_in_progress"
          ? "Tidak ada tugas yang sedang diproses."
          : effectiveActiveSection === "client_archive"
          ? "Belum ada tugas di arsip."
          : "Belum ada riwayat request.";
          
        const accentColor = theme === "dark" ? "#b0ff5e" : theme === "retro" ? "#ba0dcb" : "#00a4ff";
        const selectedChatTaskId = activeChatTaskId;

        return (
          <section className="flex min-h-0 min-w-0 flex-1 flex-col">
            {loading ? (
              <div className="rounded-lg border border-cu-border bg-cu-panel-soft px-4 py-8 text-center text-sm text-cu-muted">Memuat...</div>
            ) : clientTasks.length === 0 ? (
              <div className="rounded-lg border border-cu-border bg-cu-panel-soft px-4 py-8 text-center text-sm text-cu-muted">{emptyText}</div>
            ) : (
              <div className="odds-scroll-hidden flex min-h-0 flex-1 flex-col gap-5 overflow-auto pb-1 pr-1">
                {clientTasks.map((task) => {
                  const canCheckThisTask = task.status === "client_review";
                  const hideClientDelete = task.status === "done";
                  const handleClientDelete = async () => {
                    const confirmed = window.confirm(`Hapus / cancel task ${task.task_number}?`);
                    if (!confirmed) return;

                    try {
                      await deleteOddsTask(task.id);
                      await loadConfig();
                    } catch (err) {
                      alert(oddsError(err));
                    }
                  };
                  return (
                    <div key={task.id} className="flex flex-col gap-3">
                      {/* ── Mobile Card ── */}
                      <div className="lg:hidden">
                        <OddsMobileTaskCard
                          task={task}
                          theme={theme}
                          nowMs={timerNow}
                          timerSeconds={task.status === "in_progress" || getTaskDuration(task) > 0 ? getTaskDuration(task) : undefined}
                          canCheckRole={canCheckThisTask}
                          chatOpen={selectedChatTaskId === task.id}
                          hideDelete={hideClientDelete}
                          onAction={(action) => {
                            if (action === "chat") {
                              setActiveChatTaskId((current) => current === task.id ? null : task.id);
                              return;
                            }
                            if (action === "delete") {
                              void handleClientDelete();
                            }
                          }}
                        >
                          {(activeTab) => (
                            <>
                              <ClientOddsTaskCard
                                task={task}
                                theme={theme}
                                userId={user?.id}
                                nowMs={timerNow}
                                onReviewed={loadConfig}
                                detailOnly
                                externalAction={activeTab ? { type: activeTab as any, nonce: Date.now() } : undefined}
                              />
                              {selectedChatTaskId === task.id && (
                                <div className={`overflow-hidden border-t ${theme === "dark" ? "border-white/10 bg-[#171717]" : theme === "retro" ? "border-[#24252b] bg-[#eceee6]" : "border-[#d9e1e6] bg-white"}`}>
                                  <OddsTaskChat taskId={task.id} userId={user?.id} taskStatus={task.status} compact />
                                </div>
                              )}
                            </>
                          )}
                        </OddsMobileTaskCard>
                      </div>

                      {/* ── Desktop Card ── */}
                      <div className="hidden min-w-[900px] flex-col gap-3 lg:flex">
                        <AdminKvRetailTaskCard
                          task={task}
                          theme={theme}
                          nowMs={timerNow}
                          timerText={task.status === "in_progress" || getTaskDuration(task) > 0 ? formatTimer(getTaskDuration(task)) : undefined}
                          timerSeconds={task.status === "in_progress" || getTaskDuration(task) > 0 ? getTaskDuration(task) : undefined}
                          canCheckRole={canCheckThisTask}
                          hideDelete={hideClientDelete}
                          chatOpen={selectedChatTaskId === task.id}
                          onAction={(action) => {
                            if (action === "chat") {
                              setActiveChatTaskId((current) => current === task.id ? null : task.id);
                              return;
                            }
                            if (action === "delete") {
                              void handleClientDelete();
                              return;
                            }
                            setAdminTaskAction({ taskId: task.id, type: action, nonce: Date.now() });
                          }}
                        >
                          <ClientOddsTaskCard
                            task={task}
                            theme={theme}
                            userId={user?.id}
                            nowMs={timerNow}
                            onReviewed={loadConfig}
                            detailOnly
                            externalAction={adminTaskAction?.taskId === task.id ? adminTaskAction : undefined}
                          />
                          {selectedChatTaskId === task.id && (
                            <div className={`overflow-hidden rounded-lg border mt-3 ${theme === "dark" ? "border-white/10 bg-[#171717]" : theme === "retro" ? "rounded-none border-2 border-[#24252b] bg-[#eceee6]" : "border-[#d9e1e6] bg-white"} shadow-[0_5px_14px_rgba(44,42,39,0.05)]`}>
                              <div className="flex items-center justify-between border-b border-cu-border bg-cu-panel-soft px-3 py-2">
                                <div className="flex min-w-0 items-center gap-2">
                                  <MaterialIcon name="forum" size="auto" className="text-lg" style={{ color: accentColor }} />
                                  <div className="min-w-0">
                                    <p className="max-w-[560px] truncate text-xs font-semibold leading-none text-cu-ink">{task.design_purpose}</p>
                                  </div>
                                </div>
                                <button type="button" onClick={() => setActiveChatTaskId(null)} aria-label="Tutup diskusi" className="flex size-7 items-center justify-center rounded-lg border border-cu-border bg-white text-cu-ink transition hover:bg-cu-panel-soft">
                                  <MaterialIcon name="close" size="xs" />
                                </button>
                              </div>
                              <OddsTaskChat
                                taskId={task.id}
                                userId={user?.id}
                                taskStatus={task.status}
                                compact
                              />
                            </div>
                          )}
                        </AdminKvRetailTaskCard>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })()}

      </div>
    </div>
  );
}

export default function OddsPage() {
  return (
    <Suspense fallback={<div className="flex h-32 items-center justify-center text-sm text-cu-muted">Memuat ODDS...</div>}>
      <OddsPageContent />
    </Suspense>
  );
}

function ConfigPanel({
  title,
  icon,
  children,
  retroHeader = false,
  showHeader = true,
  className = "",
  bodyClassName = "",
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  retroHeader?: boolean;
  showHeader?: boolean;
  className?: string;
  bodyClassName?: string;
}) {
  if (retroHeader) {
    return (
      <OddsGameboyFrame
        label="ODDS Debug Console"
        action={<span className="flex items-center gap-2 text-[8px] tracking-[0.14em]"><span className="size-2 animate-pulse bg-[#ba0dcb]" /> System Ready</span>}
        className="h-full"
      >
        <div className="flex min-h-0 flex-1 flex-col rounded-xl border-[3px] border-[#24252b] bg-[#dfe2d3] p-3 shadow-[inset_0_0_0_3px_#b5b9ad] sm:p-4">
          <div className="mb-4 flex shrink-0 items-center justify-between gap-4 border-b-2 border-[#24252b] pb-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center border-2 border-[#24252b] bg-[#ba0dcb] text-white shadow-[2px_2px_0_#24252b]"><MaterialIcon name={icon} size="sm" /></span>
              <div className="min-w-0">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#666961]">Audit Mode // Live Data</p>
                <h2 className="mt-1 truncate text-lg font-black uppercase tracking-[0.08em] text-[#24252b]">{title}</h2>
              </div>
            </div>
            <span className="hidden border-2 border-[#24252b] bg-[#eceee6] px-3 py-1 text-[8px] font-black uppercase tracking-[0.14em] shadow-[2px_2px_0_#777a72] sm:block">Task Log</span>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </OddsGameboyFrame>
    );
  }

  const panelClassName = className
    ? `flex flex-col rounded-lg border border-cu-border bg-white p-4 ${className}`
    : "rounded-lg border border-cu-border bg-white p-4";

  return (
    <section className={panelClassName}>
      {showHeader && (
        <div className="mb-4 flex items-center gap-2">
          <MaterialIcon name={icon} size="sm" className="text-cu-info" />
          <h2 className="text-base font-semibold text-cu-ink">{title}</h2>
        </div>
      )}
      {bodyClassName ? <div className={bodyClassName}>{children}</div> : children}
    </section>
  );
}

function DesignerLastRequestCard({ tasks }: { tasks: OddsTask[] }) {
  const latestTasks = [...tasks]
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
    .slice(0, 5);

  return (
    <article className="flex h-[211px] min-h-[130px] min-w-[200px] flex-col gap-2 rounded-lg bg-white/90 p-2 shadow-[0_5px_14px_rgba(44,42,39,0.06)] lg:w-[420px] 2xl:w-[620px]">
      <div className="flex w-full shrink-0 items-center justify-between px-2">
        <p className="whitespace-nowrap text-sm font-medium leading-none text-[#3B4446]">Request Terbaru</p>
        <button
          type="button"
          aria-label="Detail Request Terbaru"
          className="flex size-5 items-center justify-center rounded-md text-[#00A4FF] transition hover:bg-[#00A4FF]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A4FF]/40"
        >
          <MaterialIcon name="more_horiz" size="auto" className="text-xl" />
        </button>
      </div>

      <div className="odds-scroll-hidden flex min-h-0 w-full flex-1 flex-col gap-2 overflow-y-auto rounded bg-[#F3FAFF] p-2 pr-1">
        {latestTasks.length > 0 ? (
          latestTasks.map((task) => {
            const assignedDesigner = task.assigned_designer ?? task.assignedDesigner;

            return (
              <Link
                key={task.id}
                href={`/odds/detail?id=${task.id}`}
                className="flex min-h-[72px] w-full shrink-0 items-center justify-between gap-3 rounded-lg bg-white p-4 shadow-[0_5px_7px_rgba(44,42,39,0.06)] transition hover:opacity-80"
              >
                <div className="min-w-0 flex flex-col gap-1 text-sm font-medium leading-[18px]">
                  <p className="truncate text-[#3B4446] leading-[18px]">{task.design_purpose}</p>
                  <p className="truncate text-[#7D7C7C] leading-[18px]">
                    {task.category?.name ?? "Kategori"}
                    <span className="mx-1">•</span>
                    {assignedDesigner?.name ?? "Designer"}
                  </p>
                </div>
                <span className="shrink-0 rounded-lg border border-[#00A4FF] px-4 py-1 text-xs font-normal leading-none tracking-[0.24px] text-[#00A4FF]">
                  {resolveStatusLabel(task.status)}
                </span>
              </Link>
            );
          })
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center rounded-lg bg-white p-3 text-center text-xs text-[#7D7C7C]">
            Belum ada request terbaru.
          </div>
        )}
      </div>
    </article>
  );
}

function resolveStatusLabel(status: string) {
  const labels: Record<string, string> = {
    queued: "Dalam Antrian",
    in_progress: "Proses Pengerjaan",
    submitted: "Submitted",
    spv_review: "Review Leader Creative",
    client_review: "Menunggu Review Client",
    revision: "Revision",
    done: "Done",
    cancelled: "Cancelled",
    cancelled_by_spv: "Cancelled",
  };

  return labels[status] ?? status;
}

function MetricTile({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-cu-border bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-cu-muted">{label}</span>
        <MaterialIcon name={icon} size="sm" className="text-cu-info" />
      </div>
      <p className="mt-3 text-2xl font-semibold text-cu-ink">{value}</p>
    </div>
  );
}

function MiniMetric({ icon, label, value }: { icon: string; label: string; value: number }) {
  const { theme } = useOddsTheme();
  const light = theme !== "dark";
  const retro = theme === "retro";
  
  const iconColor = light ? (retro ? "#ba0dcb" : "#00a4ff") : "#b0ff5e";

  return (
    <article className={`relative flex aspect-square w-full min-w-0 flex-col gap-1 rounded-2xl p-2.5 transition ${
      retro
        ? "border-2 border-[#24252b] bg-[#eceee6] shadow-[inset_0_0_0_2px_#c9ccc0]"
        : light
        ? "border border-white/80 bg-white/90 shadow-[0_5px_14px_rgba(44,42,39,0.06)]"
        : "border border-white/[0.05] bg-[#171717] shadow-[0_5px_14px_rgba(0,0,0,0.24)]"
    }`}>
      <div className="flex items-center justify-between px-1">
        <p className={`text-xs leading-4 font-semibold uppercase tracking-wide ${
          retro ? "text-[#24252b]" : light ? "text-[#6e5264]" : "text-[#f1f1f1]"
        }`}>{label}</p>
      </div>

      <div className={`flex min-h-0 flex-1 items-center justify-between rounded-xl px-3 py-1 ${
        retro ? "border border-[#24252b] bg-[#dfe2d3]" : light ? "bg-[#f3faff]" : "bg-[#0e0e0e]"
      }`}>
        <p className={`text-2xl font-bold leading-none ${light ? "text-[#181818]" : "text-white"}`}>
          {value}
        </p>
        <span className="size-8 flex items-center justify-center" style={{ color: iconColor }}>
          <MaterialIcon name={icon} size="auto" className="text-[24px]" />
        </span>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: string }) {
  const danger = ["cancelled", "cancelled_by_spv", "revision_rejected_by_spv"].includes(status);
  const success = ["done", "client_review"].includes(status);
  const active = ["in_progress", "spv_review", "queued", "submitted"].includes(status);

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
        danger
          ? "border-cu-danger/20 bg-cu-danger/10 text-cu-danger"
          : success
            ? "border-cu-success/20 bg-cu-success/10 text-cu-success"
            : active
              ? "border-cu-info/20 bg-cu-info/10 text-cu-info"
              : "border-cu-border bg-cu-panel-soft text-cu-muted"
      }`}
    >
      {statusLabel(status)}
    </span>
  );
}

// ─── Mobile Task Card (Admin) ────────────────────────────────────────────────
type OddsMobileTaskCardProps = {
  task: OddsTask;
  theme: "light" | "dark" | "retro";
  nowMs: number;
  timerSeconds?: number;
  canCheckRole?: boolean;
  chatOpen?: boolean;
  onAction: (action: "pause" | "chat" | "brief" | "file" | "check" | "delete" | "start" | "done") => void;
  hideDelete?: boolean;
  showStart?: boolean;
  showDone?: boolean;
  showPause?: boolean;
  startDisabled?: boolean;
  children: (activeTab: string | null) => ReactNode;
};

function OddsMobileTaskCard({
  task,
  theme,
  nowMs,
  timerSeconds,
  canCheckRole = false,
  chatOpen = false,
  onAction,
  hideDelete = false,
  showStart = false,
  showDone = false,
  showPause = false,
  startDisabled = false,
  children,
}: OddsMobileTaskCardProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);

  const toggleTab = (tab: "brief" | "file" | "check" | "delete") => {
    if (tab === "brief") {
      setIsBriefModalOpen(true);
      return;
    }
    if (activeTab === tab && expanded) {
      setActiveTab(null);
      setExpanded(false);
    } else {
      setActiveTab(tab);
      setExpanded(true);
    }
  };

  const toggleExpandOnly = () => {
    if (expanded) {
      setActiveTab(null);
      setExpanded(false);
    } else {
      // Inline expand when clicking main card
      setActiveTab(null);
      setExpanded(true);
    }
  };

  const isDone = task.status === "done";
  const isOverdue = task.deadline ? new Date(task.deadline).getTime() < nowMs : false;
  const isReviewState = task.status === "spv_review" || task.status === "client_review";
  const priorityShort = (task.status === "done"
    ? ((task as any).important_matrix || task.category?.important_matrix || "Q4")
    : (task.category?.important_matrix || (task as any).important_matrix || "Q4")
  ).toUpperCase();
  const assignedDesigner = (task as any).assigned_designer ?? (task as any).assignedDesigner;

  const durationSec = timerSeconds ?? 0;
  const hh = String(Math.floor(durationSec / 3600)).padStart(2, "0");
  const mm = String(Math.floor((durationSec % 3600) / 60)).padStart(2, "0");
  const ss = String(durationSec % 60).padStart(2, "0");

  const deadlineDateParsed = task.deadline ? new Date(task.deadline) : null;
  const isDeadlineValid = deadlineDateParsed && !Number.isNaN(deadlineDateParsed.getTime());
  const deadlineStr = isDeadlineValid
    ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short" }).format(deadlineDateParsed)
    : "-";

  // Theme tokens
  const shellClass = theme === "retro"
    ? "border-2 border-[#24252b] bg-[#eceee6] rounded-none shadow-[3px_3px_0_0_#24252b]"
    : theme === "dark"
    ? "border border-white/10 bg-[#171717] rounded-2xl"
    : "border border-slate-200 bg-white rounded-2xl shadow-sm";
  const innerBgClass = theme === "dark" ? "bg-[#171717]" : theme === "retro" ? "bg-[#eceee6]" : "bg-white";
  const primaryText = theme === "dark" ? "text-[#f1f1f1]" : "text-[#181818]";
  const mutedText = theme === "dark" ? "text-slate-400" : theme === "retro" ? "text-[#24252b]/60" : "text-slate-500";
  const divider = theme === "dark" ? "border-white/10" : theme === "retro" ? "border-[#24252b]/20" : "border-slate-100";
  const accentText = theme === "dark" ? "text-[#b0ff5e]" : theme === "retro" ? "text-[#ba0dcb]" : "text-[#00a4ff]";
  const iconCircleClass = theme === "retro" ? "border border-[#24252b] bg-white text-[#24252b]" : theme === "dark" ? "bg-white/5 text-slate-300" : "bg-slate-100 text-slate-600";
  const iconCircleClientClass = theme === "retro" ? "border border-[#24252b] bg-[#00a4ff] text-white" : theme === "dark" ? "bg-[#b0ff5e]/20 text-[#b0ff5e]" : "bg-sky-100 text-[#00a4ff]";

  const getBtnClass = (color: "green" | "amber" | "rose", active = false) => {
    if (theme === "retro") return `border-2 border-[#24252b] rounded-none ${active ? "bg-[#24252b] text-white" : "bg-white text-[#24252b]"}`;
    if (theme === "dark") {
      const map = {
        green: active ? "bg-[#b0ff5e] text-[#181818]" : "bg-[#b0ff5e]/10 text-[#b0ff5e]",
        amber: active ? "bg-amber-500 text-white" : "bg-amber-500/10 text-amber-500",
        rose: active ? "bg-rose-500 text-white" : "bg-rose-500/10 text-rose-400",
      };
      return map[color];
    }
    const map = {
      green: active ? "bg-[#00a4ff] text-white" : "bg-sky-50 text-[#00a4ff]",
      amber: active ? "bg-amber-500 text-white" : "bg-amber-50 text-amber-600",
      rose: active ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-600",
    };
    return map[color];
  };

  const ratingValue = Number(
    ((task as OddsTask & { reviews?: Array<{ review_type: string; rating?: number | null }> }).reviews ?? [])
      .find((r) => r.review_type === "client" && r.rating)?.rating ?? 5
  );

  // Status & Timer minimal tag color
  const statusTimerTextClass = isDone
    ? "text-emerald-500"
    : isOverdue
    ? "text-rose-500"
    : theme === "dark"
    ? "text-[#b0ff5e]"
    : "text-sky-500";

  return (
    <article className={`overflow-hidden transition-all ${shellClass}`}>
      {/* Main card — click to toggle expand */}
      <div 
        onClick={toggleExpandOnly}
        className={`flex flex-col gap-2.5 p-4 cursor-pointer select-none ${innerBgClass}`}
      >
        {/* Row 1: Judul Tugas + Label Quadran Singkat */}
        <div className="flex items-start justify-between gap-3">
          <p className={`line-clamp-2 text-[15px] font-bold leading-snug ${primaryText}`} title={task.design_purpose}>
            {task.design_purpose}
          </p>
          <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-black tracking-wider ${
            isDone ? "bg-emerald-600 text-white" : theme === "dark" ? "bg-[#b0ff5e] text-[#181818]" : "bg-[#0077bf] text-white"
          }`}>
            {priorityShort}
          </span>
        </div>

        {/* Row 2: avatar nama client ( Divisi ) - Salma Maghfira */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-semibold">
          {/* Client Avatar + Name */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold ${iconCircleClientClass}`}>
              C
            </span>
            <span className={`truncate ${mutedText}`}>{task.requester?.name ?? "Client"}</span>
          </div>

          <span className={`text-[10px] ${mutedText}`}>-</span>

          {/* Designer Avatar + Name */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${iconCircleClass}`}>
              <MaterialIcon name="person" size="xs" />
            </span>
            <span className={`truncate ${mutedText}`}>{assignedDesigner?.name ?? "Belum Ada"}</span>
          </div>
        </div>

        {/* Row 3: Status - Timer (if active) & Deadline */}
        <div className={`flex items-center justify-between border-t pt-2 text-[11px] font-bold ${divider} ${statusTimerTextClass}`}>
          <div className="flex items-center gap-1.5">
            <span className="capitalize">
              {isDone ? "Selesai" : isReviewState ? "Review" : "Pengerjaan"}
            </span>
            <span>•</span>
            {isDone ? (
              <span className="flex items-center gap-0.5">
                {ratingValue}/5 ⭐
              </span>
            ) : isReviewState ? (
              <span>Menunggu Review</span>
            ) : (
              <span className="font-mono">{hh}:{mm}:{ss}</span>
            )}
          </div>
          <div className={`text-[10px] uppercase tracking-wider ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
            DL: {deadlineStr}
          </div>
        </div>
      </div>

      {/* Expanded panel with details & actions */}
      {expanded && (
        <div className={`border-t p-3 ${divider} ${innerBgClass}`}>
          {/* Action Buttons Row */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Brief Tab Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleTab("brief");
              }}
              className={`flex h-8 flex-1 min-w-[70px] items-center justify-center gap-1 rounded-lg text-xs font-semibold transition ${getBtnClass("green", activeTab === "brief")}`}
            >
              <MaterialIcon name="description" size="auto" className="text-sm" />
              Brief
            </button>
            {/* File Tab Button */}
            {isDone && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTab("file");
                }}
                className={`flex h-8 flex-1 min-w-[70px] items-center justify-center gap-1 rounded-lg text-xs font-semibold transition ${getBtnClass("green", activeTab === "file")}`}
              >
                <MaterialIcon name="folder" size="auto" className="text-sm" />
                File
              </button>
            )}
            {/* Check Tab Button */}
            {isReviewState && canCheckRole && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTab("check");
                }}
                className={`flex h-8 flex-1 min-w-[75px] items-center justify-center gap-1 rounded-lg text-xs font-semibold transition ${getBtnClass("green", activeTab === "check")}`}
              >
                <MaterialIcon name="arrow_forward" size="auto" className="text-sm" />
                Check
              </button>
            )}
            {showStart && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction("start");
                }}
                disabled={startDisabled}
                className={`flex h-8 w-9 shrink-0 items-center justify-center rounded-lg transition ${getBtnClass("green")} disabled:opacity-50`}
              >
                <MaterialIcon name="play_arrow" size="auto" className="text-sm" />
              </button>
            )}
            {showPause && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction("pause");
                }}
                className={`flex h-8 w-9 shrink-0 items-center justify-center rounded-lg transition ${getBtnClass("amber")}`}
              >
                <MaterialIcon name="pause" size="auto" className="text-sm" />
              </button>
            )}
            {showDone && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction("done");
                }}
                className={`flex h-8 w-9 shrink-0 items-center justify-center rounded-lg transition ${getBtnClass("green")}`}
              >
                <MaterialIcon name="task_alt" size="auto" className="text-sm" />
              </button>
            )}
            {/* Chat Direct Toggle Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAction("chat");
              }}
              className={`flex h-8 w-9 shrink-0 items-center justify-center rounded-lg transition ${getBtnClass("green", chatOpen)}`}
            >
              <MaterialIcon name="chat" size="auto" className="text-sm" />
            </button>
            {/* Detail Link Button */}
            <Link
              href={`/odds/detail?id=${task.id}`}
              onClick={(e) => e.stopPropagation()}
              className={`flex h-8 w-9 shrink-0 items-center justify-center rounded-lg transition ${getBtnClass("green")}`}
            >
              <MaterialIcon name="open_in_new" size="auto" className="text-sm" />
            </Link>
            {/* Delete/Cancel Button */}
            {!isDone && !hideDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction("delete");
                }}
                className={`flex h-8 w-9 shrink-0 items-center justify-center rounded-lg transition ${getBtnClass("rose", activeTab === "delete")}`}
              >
                <MaterialIcon name="delete_forever" size="auto" className="text-sm" />
              </button>
            )}
          </div>

          {/* Children panel render (Brief / File / Check panel details) */}
          <div className="mt-2">
            {children(activeTab)}
          </div>
        </div>
      )}

      {/* Full screen Brief Modal */}
      {isBriefModalOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm p-4 lg:hidden"
        >
          <div className={`flex flex-1 flex-col overflow-hidden rounded-2xl border ${
            theme === "dark"
              ? "border-white/10 bg-[#171717] text-[#f1f1f1]"
              : theme === "retro"
              ? "border-2 border-[#24252b] bg-[#eceee6] text-[#24252b]"
              : "border-slate-200 bg-white text-[#181818]"
          }`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between border-b p-4 ${divider}`}>
              <div className="min-w-0 flex-1">
                <span className={`text-[10px] font-black uppercase tracking-wider ${accentText}`}>Detail Brief</span>
                <h3 className={`truncate text-base font-bold leading-normal ${primaryText}`}>
                  {task.design_purpose}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBriefModalOpen(false)}
                className={`flex size-8 items-center justify-center rounded-lg border transition ${
                  theme === "dark"
                    ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    : theme === "retro"
                    ? "border-2 border-[#24252b] bg-white text-[#24252b]"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <MaterialIcon name="close" size="xs" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4">
              <DesignerTaskQueueCard
                task={task}
                theme={theme}
                nowMs={nowMs}
                controlView
                selected={false}
                startDisabled
                timerText={undefined}
                onChat={() => undefined}
                onStart={() => undefined}
                onPause={() => undefined}
                onDone={() => undefined}
                onAcceptBrief={() => Promise.resolve()}
                onReturnBrief={() => Promise.resolve()}
                externalAction={{ type: "brief", nonce: Date.now() }}
                detailOnly
              />
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

type AdminKvRetailTaskCardProps = {
  task: OddsTask;
  theme: "light" | "dark" | "retro";
  nowMs: number;
  timerText?: string;
  timerSeconds?: number;
  chatOpen?: boolean;
  canCheckRole?: boolean;
  onAction: (action: "pause" | "chat" | "brief" | "file" | "check" | "delete" | "start" | "done") => void;
  hideDelete?: boolean;
  showStart?: boolean;
  showDone?: boolean;
  showPause?: boolean;
  startDisabled?: boolean;
  children?: ReactNode;
};

function AdminKvRetailTaskCard({
  task,
  theme,
  nowMs,
  timerText,
  timerSeconds,
  chatOpen = false,
  canCheckRole = false,
  onAction,
  hideDelete = false,
  showStart = false,
  showDone = false,
  showPause = false,
  startDisabled = false,
  children,
}: AdminKvRetailTaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const toggleTab = (tab: "brief" | "file" | "check" | "delete") => {
    if (activeTab === tab && expanded) {
      setExpanded(false);
      setActiveTab(null);
    } else {
      setExpanded(true);
      setActiveTab(tab);
      onAction(tab);
    }
  };

  const isExpanded = expanded || chatOpen;

  const requesterRole = task.requester?.roles?.[0] ?? "Client";
  const assignedDesigner = task.assigned_designer ?? task.assignedDesigner;
  const priorityRaw = (task.important_matrix || task.category?.important_matrix || "Q4").toUpperCase();
  const priority = priorityRaw.replace(/^Q\s*(\d)$/, "QUADRAN $1");
  const results = task.results ?? [];
  const resultAssets = results.flatMap((result) => result.asset_links ?? ((result as OddsTaskResult & { assetLinks?: OddsTaskResult["asset_links"] }).assetLinks ?? []));
  const isDone = task.status === "done";
  const hasBriefContent = Boolean(stripRichText(task.brief_text));
  const canCheckOutput = task.status === "spv_review";
  const chatEnabled = task.status !== "submitted";
  const fileEnabled = resultAssets.length > 0 || canCheckOutput;
  const isPausable = ["in_progress", "leader_revision_requested", "revision"].includes(task.status);
  const isOverdue = task.deadline ? new Date(task.deadline).getTime() < nowMs && !isDone : false;
  const reviewsList = ((task as OddsTask & { reviews?: Array<{ review_type: string; rating?: number | null }> }).reviews ?? []);
  const ratingValue = Number(reviewsList.find((review) => review.review_type === "client" && review.rating)?.rating ?? 5);

  const parseTimerSecondsLocal = (totalSeconds: number) => {
    const safeSeconds = Math.max(0, Math.floor(totalSeconds));
    const hours = String(Math.floor(safeSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(safeSeconds % 60).padStart(2, "0");
    return { hours, minutes, seconds };
  };
  const parsedCreatedDate = task.created_at ? new Date(task.created_at) : null;
  const isCreatedDateValid = parsedCreatedDate && !Number.isNaN(parsedCreatedDate.getTime());
  const parsedDay = isCreatedDateValid ? new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(parsedCreatedDate) : "-";
  const parsedDate = isCreatedDateValid ? new Intl.DateTimeFormat("id-ID", { day: "2-digit" }).format(parsedCreatedDate) : "-";
  const parsedMonthYear = isCreatedDateValid ? new Intl.DateTimeFormat("id-ID", { month: "short", year: "numeric" }).format(parsedCreatedDate).toUpperCase() : "-";

  const deadlineDateParsed = task.deadline ? new Date(task.deadline) : null;
  const isDeadlineValid = deadlineDateParsed && !Number.isNaN(deadlineDateParsed.getTime());
  const deadlineDay = isDeadlineValid ? new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(deadlineDateParsed) : "-";
  const deadlineDate = isDeadlineValid ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }).format(deadlineDateParsed) : "-";

  const durationSec = timerSeconds ?? 0;
  const timerParts = {
    hours: String(Math.floor(durationSec / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((durationSec % 3600) / 60)).padStart(2, "0"),
    seconds: String(durationSec % 60).padStart(2, "0"),
  };

  const displayStatus = designerTaskStatusLabel(task);

  const groupDividerClass = theme === "dark" ? "border-white/10" : theme === "retro" ? "border-[#24252b]/25" : "border-[#e6edf2]";

  const shellClass = theme === "retro" ? "border-2 border-[#24252b] bg-[#eceee6] rounded-none shadow-[4px_4px_0_0_#24252b]" : theme === "dark" ? "border border-white/10 bg-[#171717] rounded-2xl shadow-sm" : "border border-slate-200/80 bg-white rounded-2xl shadow-sm";
  const innerBgClass = theme === "retro" ? "bg-[#eceee6]" : theme === "dark" ? "bg-[#171717]" : "bg-white";
  const primaryTextClass = theme === "retro" ? "text-[#24252b]" : theme === "dark" ? "text-[#f1f1f1]" : "text-[#181818]";
  const boldTextClass = theme === "retro" ? "text-[#24252b]" : theme === "dark" ? "text-slate-200" : "text-slate-800";
  const mutedTextClass = theme === "retro" ? "text-[#24252b]/80" : theme === "dark" ? "text-slate-400" : "text-slate-500";
  const mutedSmallClass = theme === "retro" ? "text-[#24252b]/60" : theme === "dark" ? "text-slate-500" : "text-slate-400";
  const iconCircleClass = theme === "retro" ? "border-2 border-[#24252b] bg-white text-[#24252b]" : theme === "dark" ? "bg-white/5 text-slate-300" : "bg-slate-100 text-slate-600";
  const iconCircleClientClass = theme === "retro" ? "border-2 border-[#24252b] bg-[#00a4ff] text-white" : theme === "dark" ? "bg-[#b0ff5e]/20 text-[#b0ff5e]" : "bg-sky-100 text-[#00a4ff]";
  const accentTextClass = theme === "dark" ? "text-[#b0ff5e]" : "text-[#00a4ff]";
  const deadlineLabelClass = theme === "dark" ? "text-[#b0ff5e]" : "text-rose-500";

  const getBtnClass = (color: "blue" | "amber" | "emerald" | "rose", active = false) => {
    if (theme === "retro") return `border-2 border-[#24252b] ${active ? "bg-[#24252b] text-white" : "bg-white text-[#24252b] hover:bg-[#eceee6]"}`;
    if (theme === "dark") {
      const colors = {
        blue: active ? "bg-[#b0ff5e] text-[#181818]" : "bg-[#b0ff5e]/10 text-[#b0ff5e] hover:bg-[#b0ff5e]/20",
        amber: active ? "bg-amber-500 text-white" : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
        emerald: active ? "bg-[#b0ff5e] text-[#181818]" : "bg-[#b0ff5e]/10 text-[#b0ff5e] hover:bg-[#b0ff5e]/20",
        rose: active ? "bg-rose-500 text-white" : "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20",
      };
      return colors[color];
    }
    const colors = {
      blue: active ? "bg-[#00a4ff] text-white" : "bg-sky-50 text-[#00a4ff] hover:bg-sky-100",
      amber: active ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-600 hover:bg-amber-100",
      emerald: active ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
      rose: active ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-600 hover:bg-rose-100",
    };
    return colors[color];
  };

  return (
    <article className={`relative overflow-hidden transition-all hover:shadow-md ${shellClass}`}>
      <div className="flex w-full items-stretch min-h-[110px]">
        {/* Priority Q1-Q4 Strip */}
        <div className={`flex w-9 shrink-0 items-center justify-center ${isDone ? "bg-[#15803d] text-white" : theme === "dark" ? "bg-[#b0ff5e] text-[#181818]" : "bg-[#0077bf] text-white"}`}>
          <span className="select-none font-mono text-[11px] font-black uppercase tracking-[0.15em] [writing-mode:vertical-lr] rotate-180">
            {priority}
          </span>
        </div>

        {/* Submit Date Block */}
        <TaskCardDate
          state={isDone ? "Done" : "Default"}
          theme={theme}
          day={parsedDay}
          date={parsedDate}
          monthYear={parsedMonthYear}
          bgColor={isDone ? "bg-[#16a34a] text-white" : theme === "dark" ? "bg-[#b0ff5e] text-[#181818]" : "bg-[#00a4ff] text-white"}
          className="w-[122px] shrink-0"
        />

        {/* Main Content Area */}
        <div className={`flex flex-1 items-stretch justify-start p-4 ${innerBgClass}`}>
          {/* Title & Brief Link */}
          <div className={`w-[315px] shrink-0 border-r ${groupDividerClass} pr-4 flex flex-col justify-center`}>
            <h3 className={`line-clamp-2 text-[20px] font-semibold leading-normal ${primaryTextClass}`} title={task.design_purpose}>
              {task.design_purpose}
            </h3>
            <button
              type="button"
              onClick={() => toggleTab("brief")}
              className={`mt-1 inline-flex items-center text-xs font-bold hover:underline w-max ${accentTextClass}`}
            >
              Lihat Detail Brief
            </button>
          </div>

          {/* Client Info */}
          <div className={`w-[130px] shrink-0 border-r ${groupDividerClass} px-4 flex flex-col justify-center`}>
            <div className="flex items-center gap-2">
              <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${iconCircleClientClass}`}>
                c
              </span>
              <div className="min-w-0">
                <p className={`truncate text-xs font-extrabold ${boldTextClass}`} title={task.requester?.name ?? "Client"}>
                  {task.requester?.name ?? "Client Test"}
                </p>
                <p className={`text-[10px] font-medium ${mutedTextClass}`}>Client</p>
              </div>
            </div>
          </div>

          {/* Designer Info */}
          <div className={`w-[135px] shrink-0 border-r ${groupDividerClass} px-4 flex flex-col justify-center`}>
            <div className="flex items-center gap-2">
              <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${iconCircleClass}`}>
                <MaterialIcon name="person" size="xs" />
              </span>
              <div className="min-w-0">
                <p className={`truncate text-xs font-extrabold ${boldTextClass}`} title={assignedDesigner ? assignedDesigner.name : "Belum Ada"}>
                  {assignedDesigner ? assignedDesigner.name : "Belum Ada"}
                </p>
                <p className={`text-[10px] font-medium ${mutedTextClass}`}>Designer</p>
              </div>
            </div>
          </div>

          {/* Deadline Info */}
          <div className={`w-[120px] shrink-0 border-r ${groupDividerClass} px-4 flex flex-col justify-center`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${deadlineLabelClass}`}>DEADLINE</p>
            <p className={`mt-0.5 text-xs font-bold capitalize ${boldTextClass}`}>{deadlineDay}</p>
            <p className={`text-[11px] font-medium ${mutedSmallClass}`}>{deadlineDate}</p>
          </div>

          {/* Action Buttons Box */}
          <div className="flex items-center gap-2 shrink-0 px-4">
            <button
              type="button"
              title="Brief Task"
              onClick={() => toggleTab("brief")}
              className={`flex size-9 items-center justify-center rounded-xl transition active:scale-95 ${getBtnClass("blue")}`}
            >
              <MaterialIcon name="description" size="sm" />
            </button>
            <button
              type="button"
              title="Chat Task"
              onClick={() => onAction("chat")}
              className={`flex size-9 items-center justify-center rounded-xl transition active:scale-95 ${getBtnClass("blue", chatOpen)}`}
            >
              <MaterialIcon name="chat" size="sm" />
            </button>
            {showStart && (
              <button
                type="button"
                title="Start Task"
                onClick={() => onAction("start")}
                disabled={startDisabled}
                className={`flex size-9 items-center justify-center rounded-xl transition active:scale-95 ${getBtnClass("blue")} disabled:opacity-50`}
              >
                <MaterialIcon name="play_arrow" size="sm" />
              </button>
            )}
            {showPause && (
              <button
                type="button"
                title="Pause Task"
                onClick={() => onAction("pause")}
                className={`flex size-9 items-center justify-center rounded-xl transition active:scale-95 ${getBtnClass("amber")}`}
              >
                <MaterialIcon name="pause" size="sm" />
              </button>
            )}
            {showDone && (
              <button
                type="button"
                title="Done / Submit Output"
                onClick={() => onAction("done")}
                className={`flex size-9 items-center justify-center rounded-xl transition active:scale-95 ${getBtnClass("emerald")}`}
              >
                <MaterialIcon name="task_alt" size="sm" />
              </button>
            )}
            {fileEnabled && (
              <button
                type="button"
                title="File Output"
                onClick={() => toggleTab(canCheckOutput ? "check" : "file")}
                className={`flex size-9 items-center justify-center rounded-xl transition active:scale-95 ${getBtnClass("emerald")}`}
              >
                <MaterialIcon name="folder" size="sm" />
              </button>
            )}
            <Link
              href={`/odds/detail?id=${task.id}`}
              title="Buka Detail Task"
              className={`flex size-9 items-center justify-center rounded-xl transition active:scale-95 ${getBtnClass("blue")}`}
            >
              <MaterialIcon name="open_in_new" size="sm" />
            </Link>
            {!isDone && !hideDelete && (
              <button
                type="button"
                title="Hapus / Cancel Task"
                onClick={() => toggleTab("delete")}
                className={`flex size-9 items-center justify-center rounded-xl transition active:scale-95 ${getBtnClass("rose")}`}
              >
                <MaterialIcon name="delete_forever" size="sm" />
              </button>
            )}
          </div>

          {/* Right Status / Timer Block */}
          {(() => {
            const isReviewState = task.status === "spv_review" || task.status === "client_review";
            // Dark mode, review state, no canCheck -> no bg, red border
            const timerBlockClass = theme === "dark" && isReviewState && !canCheckRole
              ? "ml-auto flex w-[210px] shrink-0 flex-col items-center justify-center rounded-2xl p-3 border border-rose-500/50 text-rose-400"
              : isDone
              ? "ml-auto flex w-[210px] shrink-0 flex-col items-center justify-center rounded-2xl p-3 text-white bg-[#22c55e]"
              : theme === "dark"
              ? "ml-auto flex w-[210px] shrink-0 flex-col items-center justify-center rounded-2xl p-3 text-white bg-[#ef4444]"
              : "ml-auto flex w-[210px] shrink-0 flex-col items-center justify-center rounded-2xl p-3 text-white bg-[#ef4444]";
            return (
          <div className={timerBlockClass}>
            {isDone ? (() => {
              const ratingValue = Number(
                ((task as OddsTask & { reviews?: Array<{ review_type: string; rating?: number | null }> }).reviews ?? []).find(
                  (review) => review.review_type === "client" && review.rating
                )?.rating ?? 5
              );
              return (
                <>
                  <p className="text-xs font-semibold drop-shadow-sm">Selesai</p>
                  <div className="my-1.5 flex h-9 items-center justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const filled = index < (ratingValue || 5);
                      return (
                        <MaterialIcon
                          key={index}
                          name="star"
                          size="auto"
                          className={`text-[22px] ${filled ? "text-[#ffd166]" : "text-white/35"}`}
                        />
                      );
                    })}
                  </div>
                  <p className="text-[10px] font-bold text-white/90">
                    {ratingValue}/5
                  </p>
                </>
              );
            })() : (
              <>
                <p className="text-xs font-semibold drop-shadow-sm">{displayStatus}</p>
                {(task.status === "spv_review" || task.status === "client_review") && canCheckRole ? (
                  <button
                    type="button"
                    onClick={() => toggleTab("check")}
                    className="my-1.5 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-white px-6 text-sm font-bold text-[#ef4444] shadow-sm transition hover:bg-white/90 active:scale-95"
                  >
                    Check
                    <MaterialIcon name="arrow_forward" size="sm" />
                  </button>
                ) : (
                  <div className="my-1.5 flex items-center justify-center gap-1.5">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-white font-mono text-base font-black text-[#ef4444] shadow-sm">
                      {task.status === "spv_review" || task.status === "client_review" ? "-" : timerParts.hours}
                    </div>
                    <span className="font-bold text-white">:</span>
                    <div className="flex size-9 items-center justify-center rounded-lg bg-white font-mono text-base font-black text-[#ef4444] shadow-sm">
                      {task.status === "spv_review" || task.status === "client_review" ? "-" : timerParts.minutes}
                    </div>
                    <span className="font-bold text-white">:</span>
                    <div className="flex size-9 items-center justify-center rounded-lg bg-white font-mono text-base font-black text-[#ef4444] shadow-sm">
                      {task.status === "spv_review" || task.status === "client_review" ? "-" : timerParts.seconds}
                    </div>
                  </div>
                )}
                <p className="text-[10px] font-bold text-white/90">
                  {(task.status === "spv_review" || task.status === "client_review") && canCheckRole
                    ? "Tinjau Output"
                    : (task.status === "spv_review" || task.status === "client_review")
                    ? "Menunggu Review"
                    : isOverdue
                    ? "Melewati deadline"
                    : "Sisa waktu"}
                </p>
              </>
            )}
          </div>
            );
          })()}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-4">
          {children}
        </div>
      )}
    </article>
  );
}

type DesignerTaskQueueCardProps = {
  task: OddsTask;
  theme: "light" | "dark" | "retro";
  nowMs: number;
  controlView?: boolean;
  selected?: boolean;
  startDisabled?: boolean;
  timerText?: string;
  externalAction?: { type: string; nonce: number };
  detailOnly?: boolean;
  onChat: () => void;
  onStart: () => void;
  onPause?: () => void;
  onDone: () => void;
  onAcceptBrief: () => Promise<void>;
  onReturnBrief: (note: string) => Promise<void>;
};

function DesignerTaskQueueCard({ task, theme, nowMs, controlView = false, selected = false, startDisabled = false, timerText, externalAction, detailOnly = false, onChat, onStart, onPause, onDone, onAcceptBrief, onReturnBrief }: DesignerTaskQueueCardProps) {
  const [briefOpen, setBriefOpen] = useState(false);
  const [fileOpen, setFileOpen] = useState(false);
  const [outputCheckOpen, setOutputCheckOpen] = useState(false);
  const [spvRevisionOpen, setSpvRevisionOpen] = useState(false);
  const [spvReviewNote, setSpvReviewNote] = useState("");
  const [spvReviewBusy, setSpvReviewBusy] = useState<"approved" | "revision" | null>(null);
  const [copiedAssetId, setCopiedAssetId] = useState<number | null>(null);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [decisionNote, setDecisionNote] = useState("");
  const [decisionBusy, setDecisionBusy] = useState<"accept" | "return" | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelBusy, setCancelBusy] = useState(false);
  const lastActionNonce = useRef<number | null>(null);

  useEffect(() => {
    if (externalAction && externalAction.nonce !== lastActionNonce.current) {
      lastActionNonce.current = externalAction.nonce;
      
      setBriefOpen(externalAction.type === "brief");
      setFileOpen(externalAction.type === "file");
      setOutputCheckOpen(externalAction.type === "check");
      setCancelOpen(externalAction.type === "delete");
    }
  }, [externalAction]);

  const handleCancelTask = async () => {
    if (!cancelReason.trim()) return;
    setCancelBusy(true);
    try {
      await requestOddsCancel(task.id, cancelReason.trim());
      setCancelOpen(false);
      setCancelReason("");
      window.location.reload();
    } catch (err) {
      alert(oddsError(err));
    } finally {
      setCancelBusy(false);
    }
  };
  const requesterRole = task.requester?.roles?.[0] ?? "Client";
  const assignedDesigner = task.assigned_designer ?? task.assignedDesigner;
  const priority = (task.important_matrix || task.category?.important_matrix || "Q4").toUpperCase();
  const isOverdue = task.deadline ? new Date(task.deadline).getTime() < nowMs : false;
  const accent = isOverdue ? "#ff5e5e" : theme === "dark" ? "#b0ff5e" : theme === "retro" ? "#ba0dcb" : "#00a4ff";
  const detailColor = isOverdue ? "#ff5e5e" : theme === "retro" ? "#ba0dcb" : "#0077bf";
  const headerClass = isOverdue
    ? "bg-[#ff5e5e]"
    : theme === "dark"
    ? "bg-[#b0ff5e] text-[#181818]"
    : theme === "retro"
    ? "border-b-2 border-[#24252b] bg-[#ba0dcb] text-white"
    : "bg-[#00a4ff] text-white";
  const bodyClass =
    theme === "dark"
      ? "bg-[#171717] text-[#f1f1f1]"
      : theme === "retro"
      ? "border-x-2 border-b-2 border-[#24252b] bg-[#eceee6] text-[#24252b]"
      : "bg-white/90 text-[#3b4446]";
  const dividerClass = theme === "retro" ? "border-[#24252b]" : theme === "dark" ? "border-white/10" : "border-[#e6edf2]";
  const primaryTextClass = theme === "dark" ? "text-[#f1f1f1]" : "text-[#3b4446]";
  const statusClass = theme === "dark" ? "text-[#e3e3e3]" : theme === "retro" ? "text-[#24252b]" : "text-[#3b4446]";
  const shellClass = theme === "retro" ? "min-w-[900px] rounded-none border-2 border-[#24252b]" : "min-w-[900px] overflow-hidden rounded-lg";
  const retroTextClass = theme === "retro" ? "font-mono font-black uppercase tracking-[0.08em]" : "";
  const retroSmallTextClass = theme === "retro" ? "font-mono font-black uppercase tracking-[0.1em]" : "";
  const isDone = task.status === "done";
  const canStart = ["queued", "ready_to_start"].includes(task.status);
  const canPause = controlView && task.status === "in_progress";
  const canSubmitDone = !controlView && task.status === "in_progress";
  const canCheckBrief = task.status === "submitted";
  const chatDisabled = task.status === "submitted";
  const displayStatus = designerTaskStatusLabel(task);
  const hasBriefContent = Boolean(stripRichText(task.brief_text));
  const resultAssets = (task.results ?? []).flatMap((result) => result.asset_links ?? ((result as OddsTaskResult & { assetLinks?: OddsTaskResult["asset_links"] }).assetLinks ?? []));
  const sortedResults = [...(task.results ?? [])].sort((left, right) => Number(right.version_number) - Number(left.version_number));
  const activeResult = sortedResults[0] ?? null;
  const canCheckOutput = controlView && task.status === "spv_review";
  const fileEnabled = resultAssets.length > 0 || canCheckOutput;
  const ratingValue = typeof task.rating === "number" ? task.rating : null;
  const getResultAssets = (result: OddsTaskResult) => result.asset_links ?? ((result as OddsTaskResult & { assetLinks?: OddsTaskResult["asset_links"] }).assetLinks ?? []);
  const getTotalOutput = (notes: string | null | undefined) => {
    const match = (notes ?? "").match(/Total Output:\s*([0-9]+)/i);
    return match?.[1] ?? "-";
  };
  const renderAssetValue = (asset: { id: number; label: string; url: string; provider: string }) => {
    const isWebLink = /^https?:\/\//i.test(asset.url);
    const copyValue = async () => {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(asset.url);
        return;
      }

      if (typeof document === "undefined") return;
      const textarea = document.createElement("textarea");
      textarea.value = asset.url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    };
    const handleCopy = async () => {
      await copyValue();
      setCopiedAssetId(asset.id);
      window.setTimeout(() => {
        setCopiedAssetId((current) => current === asset.id ? null : current);
      }, 2000);
    };
    const copied = copiedAssetId === asset.id;

    if (!isWebLink) {
      return (
        <div className={`flex min-w-0 items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm font-semibold transition ${copied ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-cu-border bg-white text-cu-ink"}`} key={asset.id}>
          <span className="min-w-0 truncate">{copied ? "Berhasil menyalin link file sharing" : asset.url}</span>
          <button
            type="button"
            onClick={() => void handleCopy()}
            className={`flex size-7 shrink-0 items-center justify-center rounded-md transition ${copied ? "text-emerald-700 hover:bg-emerald-100" : "text-cu-ink hover:bg-cu-panel-soft"}`}
            aria-label="Salin link local sharing"
            title="Salin"
          >
            <MaterialIcon name={copied ? "check_circle" : "content_copy"} size="xs" />
          </button>
        </div>
      );
    }

    return (
      <a key={asset.id} href={asset.url} target="_blank" rel="noreferrer" className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-cu-border bg-white px-3 py-2 text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft">
        <span className="min-w-0 truncate">{asset.label}</span>
        <MaterialIcon name="open_in_new" size="xs" />
      </a>
    );
  };
  const handleSpvResultReview = async (decision: "approved" | "revision") => {
    const note = spvReviewNote.trim();
    if (decision === "revision" && !stripRichText(note)) return;

    setSpvReviewBusy(decision);
    try {
      await spvReviewOddsTask(task.id, decision, note || undefined);
      setSpvRevisionOpen(false);
      setSpvReviewNote("");
      setOutputCheckOpen(false);
      window.location.reload();
    } catch (err) {
      alert(oddsError(err));
    } finally {
      setSpvReviewBusy(null);
    }
  };

  const formatCardDate = (value?: string) => {
    if (!value) return { day: "-", date: "-", time: "-" };
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return { day: "-", date: "-", time: "-" };
    return {
      day: new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(date),
      date: new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date),
      time: new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date).replace(".", ":"),
    };
  };

  const formatDeadlineDistance = (value?: string) => {
    if (!value) return "-";
    const deadline = new Date(value).getTime();
    if (!Number.isFinite(deadline)) return "-";
    const totalMinutes = Math.max(0, Math.ceil(Math.abs(deadline - nowMs) / 60_000));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    if (days > 0) return `${days} Hari ${hours} Jam`;
    if (totalHours > 0) return `${totalHours} Jam`;
    return `${totalMinutes} Menit`;
  };

  const submit = formatCardDate(task.created_at);
  const deadline = formatCardDate(task.deadline);
  const modalRoot = typeof document !== "undefined" ? document.getElementById("odds-shell-modal-root") : null;
  const handleAcceptBrief = async () => {
    setDecisionBusy("accept");
    try {
      await onAcceptBrief();
      setBriefOpen(false);
    } finally {
      setDecisionBusy(null);
    }
  };
  const handleReturnBrief = async () => {
    const note = decisionNote.trim();
    if (!note) return;
    setDecisionBusy("return");
    try {
      await onReturnBrief(note);
      setDecisionNote("");
      setDeclineOpen(false);
      setBriefOpen(false);
    } finally {
      setDecisionBusy(null);
    }
  };
  const actionButtonBase = "inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50";
  const briefModal = briefOpen && modalRoot ? createPortal(
    <div
      className="absolute inset-0 z-[80] overflow-hidden bg-white text-cu-ink"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`task-brief-${task.id}`}
    >
      <div className="flex h-full w-full flex-col overflow-hidden bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-[#e1e8eb] bg-white/80 px-5 py-4">
          <div className="min-w-0">
            <p id={`task-brief-${task.id}`} className="truncate text-xl font-bold">Detail Task</p>
          </div>
          <button type="button" onClick={() => setBriefOpen(false)} aria-label="Tutup cek brief" className="flex size-10 items-center justify-center rounded-xl border border-[#c9c9c9] bg-white text-[#303431] shadow-sm transition hover:border-[#00a4ff] hover:bg-[#f3fbff]">
            <MaterialIcon name="close" size="auto" className="text-xl" />
          </button>
        </div>
        <div className="grid min-h-0 flex-1 overflow-hidden grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(280px,1fr)]">
          <section className="min-h-0 overflow-hidden bg-white/70 p-5 lg:border-r lg:border-[#e1e8eb]">
            <div className="odds-scroll-hidden h-full overflow-y-auto bg-white pr-2">
              <h2 className="mb-4 text-base font-semibold leading-7 text-[#303431]">{task.design_purpose}</h2>
              {hasBriefContent ? (
                <div
                  className="prose-odds max-w-none whitespace-normal text-sm leading-7 text-[#303431] [&_br]:block [&_br]:h-1 [&_div]:mb-3 [&_p]:mb-3 [&_p:has(br:only-child)]:mb-2 [&_p:has(br:only-child)]:h-2 [&_figure]:my-5 [&_figcaption]:mt-2 [&_figcaption]:text-xs [&_figcaption]:text-[#6b7280] [&_img]:max-h-72 [&_img]:w-auto [&_img]:max-w-full"
                  dangerouslySetInnerHTML={{ __html: task.brief_text }}
                />
              ) : (
                <p className="text-sm leading-7 text-[#6b7280]">Brief belum tersedia.</p>
              )}
            </div>
          </section>
          <aside className="flex min-h-0 flex-col justify-between gap-6 bg-[#f8f9fb]/90 p-5">
            <div className="space-y-4">
              {declineOpen ? (
                <textarea
                  value={decisionNote}
                  onChange={(event) => setDecisionNote(event.target.value)}
                  rows={4}
                  placeholder="Catatan untuk Decline Brief"
                  className="w-full resize-none rounded-xl border border-[#d9e1e6] bg-white px-4 py-3 text-sm text-[#303431] shadow-sm outline-none transition placeholder:text-[#9aa3ad] focus:border-[#00a4ff] focus:ring-2 focus:ring-[#00a4ff]/15"
                />
              ) : (
                <div className="space-y-2 rounded-2xl border border-[#e1e8eb] bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-[#181818]">Ringkasan Task</p>
                  <p className="text-xs text-[#6b7280]">Requester: {task.requester?.name ?? "Perequest"}</p>
                  <p className="text-xs text-[#6b7280]">Deadline: {formatOddsDate(task.deadline, true)}</p>
                </div>
              )}
            </div>
            {canCheckBrief && (
              <div className="grid gap-3">
                {declineOpen ? (
                <>
                <button type="button" disabled={!decisionNote.trim() || !!decisionBusy} onClick={() => void handleReturnBrief()} className={`${actionButtonBase} border-[#ff3b3b] bg-[#ff3b3b] text-white hover:border-[#ec1f1f] hover:bg-[#ec1f1f]`}>
                  {decisionBusy === "return" ? "Memproses..." : "Submit"}
                </button>
                <button type="button" disabled={!!decisionBusy} onClick={() => { setDeclineOpen(false); setDecisionNote(""); }} className={`${actionButtonBase} border-[#ffb4b4] bg-white text-[#ff3b3b] hover:border-[#ff5e5e] hover:bg-[#fff5f5]`}>
                  Cancel
                </button>
                </>
              ) : (
                <>
                <button type="button" disabled={!!decisionBusy} onClick={() => void handleAcceptBrief()} className={`${actionButtonBase} border-[#00a4ff] bg-[#00a4ff] text-white hover:border-[#008bd9] hover:bg-[#008bd9]`}>
                  <MaterialIcon name="check_circle" size="auto" className="text-xl" />
                  {decisionBusy === "accept" ? "Memproses..." : "Approve"}
                </button>
                <button type="button" disabled={!!decisionBusy} onClick={() => setDeclineOpen(true)} className={`${actionButtonBase} border-[#ffb4b4] bg-white text-[#ff3b3b] hover:border-[#ff5e5e] hover:bg-[#fff5f5]`}>
                  <MaterialIcon name="cancel" size="auto" className="text-xl" />
                  Decline
                </button>
                </>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>,
    modalRoot,
  ) : null;

  return (
    <>
      <article className={detailOnly ? "" : `${shellClass} ${theme === "retro" ? "font-mono shadow-[3px_3px_0_#777a72]" : "shadow-[0_5px_14px_rgba(44,42,39,0.06)]"}`}>
        {!detailOnly && (
          <>
            <div className={`flex items-center justify-between gap-4 px-4 py-2 ${headerClass}`}>
              <p className={`truncate leading-none ${theme === "retro" ? "text-[11px] font-black uppercase tracking-[0.12em]" : "text-base"}`}>
                {priority} - {task.design_purpose}
              </p>
              {controlView && <p className="shrink-0 text-sm font-semibold leading-none">{displayStatus}</p>}
            </div>
            <div className={`flex items-center justify-between px-4 py-2 ${bodyClass}`}>
          <div className="flex items-center gap-[22px]">
              <div className={`flex items-center gap-2 ${controlView ? "min-w-[760px]" : "min-w-[600px]"}`}>
              <div className="flex w-24 shrink-0 flex-col items-start gap-0.5 leading-none">
                <p className={`w-full text-sm font-medium ${primaryTextClass} ${retroSmallTextClass}`}>{submit.day}</p>
                <p className={`w-full text-sm font-medium ${primaryTextClass} ${retroSmallTextClass}`}>{submit.date}</p>
                <p className={`w-full text-2xl font-bold leading-none tracking-[-0.24px] ${theme === "retro" ? "font-black tracking-[0.02em]" : ""}`} style={{ color: detailColor }}>{submit.time}</p>
              </div>
              <div className={`flex h-full min-h-[54px] w-[180px] shrink-0 flex-col justify-center border-l px-4 ${dividerClass}`}>
                <p className={`truncate text-lg font-semibold leading-none ${primaryTextClass} ${retroTextClass}`}>{task.requester?.name ?? "Perequest"}</p>
                <p className={`mt-1 text-sm font-medium leading-none ${primaryTextClass} ${retroSmallTextClass}`}>{requesterRole}</p>
              </div>
              {controlView && (
                <div className={`flex h-full min-h-[54px] w-[180px] shrink-0 flex-col justify-center border-l px-4 ${dividerClass}`}>
                  <p className={`truncate text-lg font-semibold leading-none ${primaryTextClass} ${retroTextClass}`}>{assignedDesigner?.name ?? "-"}</p>
                  <p className={`mt-1 text-sm font-medium leading-none ${primaryTextClass} ${retroSmallTextClass}`}>Designer</p>
                </div>
              )}
              <div className={`flex h-full min-h-[54px] shrink-0 items-center border-l px-4 ${dividerClass}`}>
                <button type="button" onClick={() => setBriefOpen(true)} className={`whitespace-nowrap text-sm font-medium leading-none hover:opacity-80 ${retroSmallTextClass}`} style={{ color: detailColor }}>
                  Lihat Detail Brief
                </button>
              </div>
              <div className={`flex h-full min-h-[54px] shrink-0 flex-col justify-center border-l px-4 ${dividerClass}`}>
                <p className={`text-sm font-medium leading-none ${primaryTextClass} ${retroSmallTextClass}`}>{deadline.day}</p>
                <p className={`mt-0.5 text-sm font-medium leading-none ${primaryTextClass} ${retroSmallTextClass}`}>{deadline.date}</p>
                <p className={`mt-1 whitespace-nowrap text-lg font-semibold leading-none ${retroTextClass}`} style={{ color: detailColor }}>{formatDeadlineDistance(task.deadline)}</p>
              </div>
              {isDone && (
                <div className={`flex h-full min-h-[54px] w-[130px] shrink-0 flex-col justify-center border-l px-4 ${dividerClass}`}>
                  <p className={`text-xs font-semibold leading-none text-cu-muted ${retroSmallTextClass}`}>Rating</p>
                  <div className="mt-1 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <MaterialIcon key={value} name="star" size="xs" className={ratingValue && value <= ratingValue ? "text-[#f59e0b]" : "text-cu-muted/50"} />
                    ))}
                  </div>
                  <p className={`mt-1 text-xs font-semibold leading-none ${primaryTextClass}`}>{ratingValue ? `${ratingValue}/5` : "Belum ada"}</p>
                </div>
              )}
            </div>
            <div className="flex h-full items-center gap-2">
              <button
                type="button"
                onClick={onChat}
                title={chatDisabled ? "Chat belum bisa dijalankan pada proses Cek Brief" : "Chat"}
                aria-label="Chat task"
                disabled={chatDisabled}
                className="flex size-6 items-center justify-center transition hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-30"
                style={{ color: selected && !chatDisabled ? accent : "currentColor" }}
              >
                <MaterialIcon name="chat_bubble" size="auto" className="text-2xl" />
              </button>
              <button
                type="button"
                title={canStart ? "Start" : "Belum bisa dimulai"}
                aria-label="Start task"
                disabled={!canStart || startDisabled}
                onClick={onStart}
                className="flex size-6 items-center justify-center transition hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <MaterialIcon name="play_circle" size="auto" className="text-2xl" />
              </button>
              {canCheckBrief && (
                <button type="button" title="Cek Brief" aria-label="Cek brief task" onClick={() => setBriefOpen(true)} className="flex size-6 items-center justify-center transition hover:opacity-75">
                  <MaterialIcon name="fact_check" size="auto" className="text-2xl" />
                </button>
              )}
              {canPause && (
                <button type="button" title="Pause pengerjaan" aria-label="Pause pengerjaan task" onClick={onPause} className="flex size-6 items-center justify-center transition hover:opacity-75">
                  <MaterialIcon name="pause_circle" size="auto" className="text-2xl" />
                </button>
              )}
              {(controlView || isDone) && (
                <button
                  type="button"
                  title={fileEnabled ? "File output" : "Belum ada file output"}
                  aria-label="File output"
                  disabled={!fileEnabled}
                  onClick={() => {
                    setFileOpen((open) => !open);
                    setOutputCheckOpen(false);
                  }}
                  className="flex size-6 items-center justify-center transition hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <MaterialIcon name="folder" size="auto" className="text-2xl" />
                </button>
              )}
              {canSubmitDone && (
                <button type="button" title="Done / Submit Output" aria-label="Submit output task" onClick={onDone} className="flex size-6 items-center justify-center transition hover:opacity-75">
                  <MaterialIcon name="task_alt" size="auto" className="text-2xl" />
                </button>
              )}
              {controlView && (
                <Link
                  href={`/odds/detail?id=${task.id}`}
                  title="Buka Detail Task"
                  aria-label="Buka Detail Task"
                  className="flex size-6 items-center justify-center transition hover:opacity-75"
                >
                  <MaterialIcon name="open_in_new" size="auto" className="text-2xl" />
                </Link>
              )}
              {task.status !== "done" && task.status !== "cancelled" && task.status !== "cancelled_by_spv" && (
                <button
                  type="button"
                  title="Hapus / Cancel Task"
                  aria-label="Hapus / Cancel Task"
                  onClick={() => {
                    setCancelOpen((open) => !open);
                    setBriefOpen(false);
                    setFileOpen(false);
                    setOutputCheckOpen(false);
                  }}
                  className="flex size-6 items-center justify-center text-red-500 transition hover:opacity-75"
                >
                  <MaterialIcon name="delete_forever" size="auto" className="text-2xl" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 p-2.5">
            {timerText && (
              <span className={`min-w-[136px] text-center font-mono text-lg font-semibold leading-none ${theme === "retro" ? "border-2 border-[#24252b] bg-[#dfe2d3] px-3 py-2 text-[#24252b] shadow-[2px_2px_0_#777a72]" : theme === "dark" ? "rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[#b0ff5e]" : "rounded-lg border border-[#d9e1e6] bg-white px-3 py-2 text-[#00a4ff]"}`}>
                {timerText}
              </span>
            )}
            {canCheckOutput && (
              <button
                type="button"
                onClick={() => {
                  setOutputCheckOpen((open) => !open);
                  setFileOpen(false);
                }}
                className={`inline-flex h-9 items-center justify-center gap-2 px-3 text-sm font-semibold transition hover:opacity-80 ${
                  theme === "retro"
                    ? "rounded-none border-2 border-[#24252b] bg-[#dfe2d3] text-[#24252b] shadow-[2px_2px_0_#777a72]"
                    : "rounded-lg border border-[#d9e1e6] bg-white text-[#3b4446] shadow-sm"
                }`}
              >
                <MaterialIcon name="fact_check" size="xs" />
                Check
              </button>
            )}
            {!controlView && !isDone && <p className={`whitespace-nowrap text-sm font-medium leading-none ${statusClass} ${retroSmallTextClass}`}>{displayStatus}</p>}
          </div>
        </div>
      </>
    )}
        {fileOpen && (
          <div className={`grid gap-2 border-t p-3 ${dividerClass} ${bodyClass}`}>
            {resultAssets.length > 0 ? (
              resultAssets.map((asset) => (
                <a key={asset.id} href={asset.url} target="_blank" rel="noreferrer" className={`flex items-center justify-between gap-3 border px-3 py-2 text-sm font-semibold transition hover:opacity-80 ${theme === "retro" ? "rounded-none border-2 border-[#24252b] bg-[#eceee6]" : "rounded-lg border-cu-border bg-white text-cu-ink"}`}>
                  <span className="min-w-0 truncate">{asset.label}</span>
                  <MaterialIcon name="open_in_new" size="xs" />
                </a>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-cu-muted">Belum ada file output yang tercatat.</p>
            )}
          </div>
        )}
        {outputCheckOpen && (
          <div className={`border-t px-3 py-2 ${dividerClass} ${bodyClass}`}>
            {activeResult ? (() => {
              const assets = getResultAssets(activeResult);
              const localShareAssets = assets.filter((asset) => asset.label.toLowerCase().includes("local file sharing"));
              const uploadedAssets = assets.filter((asset) => !asset.label.toLowerCase().includes("local file sharing"));

              return (
                <div className="grid gap-2">
                  <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
                    <p className={`text-sm font-semibold ${primaryTextClass}`}>Total Output {getTotalOutput(activeResult.result_notes)}</p>
                    <div className="flex shrink-0 items-center gap-3 text-xs text-cu-muted">
                      <span>{formatOddsDate(activeResult.submitted_at, true)}</span>
                    </div>
                  </div>

                  <div className={`grid gap-2 border p-2.5 ${theme === "retro" ? "rounded-none border-2 border-[#24252b] bg-[#eceee6]" : "rounded-lg border-cu-border bg-white"}`}>
                    <div className="grid gap-2">
                      <div className="min-w-0">
                        <p className="mb-1 text-[11px] font-semibold text-cu-muted">Link Local File Sharing</p>
                        <div className="grid gap-2">
                          {localShareAssets.length > 0 ? (
                            localShareAssets.map((asset) => renderAssetValue(asset))
                          ) : (
                            <div className="rounded-lg border border-cu-border bg-cu-panel-soft px-3 py-2 text-xs text-cu-muted">Tidak ada link local sharing.</div>
                          )}
                        </div>
                      </div>
                    </div>
                    {uploadedAssets.length > 0 && (
                      <div className="min-w-0">
                        <p className="mb-1 text-[11px] font-semibold text-cu-muted">File Upload</p>
                        <div className="grid gap-2">
                          {uploadedAssets.map((asset) => renderAssetValue(asset))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2 border-t border-cu-border pt-2">
                    {spvRevisionOpen && (
                      <OddsRichTextEditor
                        value={spvReviewNote}
                        onChange={setSpvReviewNote}
                        minHeight={120}
                        placeholder="Catatan revisi untuk designer"
                        onUploadImage={(files) => Promise.all(Array.from(files).map((file) => uploadOddsTaskAttachment(file, task.id)))}
                      />
                    )}
                    <div className="flex justify-end gap-2">
                      {spvRevisionOpen ? (
                        <>
                          <button
                            type="button"
                            disabled={!!spvReviewBusy}
                            onClick={() => {
                              setSpvRevisionOpen(false);
                              setSpvReviewNote("");
                            }}
                            className="inline-flex h-9 items-center justify-center rounded-lg border border-[#ffb4b4] bg-white px-4 text-sm font-semibold text-[#ff3b3b] transition hover:bg-[#fff5f5] disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={!stripRichText(spvReviewNote) || !!spvReviewBusy}
                            onClick={() => void handleSpvResultReview("revision")}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#ff3b3b] bg-[#ff3b3b] px-4 text-sm font-semibold text-white transition hover:bg-[#ec1f1f] disabled:opacity-50"
                          >
                            <MaterialIcon name="edit_note" size="xs" />
                            {spvReviewBusy === "revision" ? "Memproses..." : "Submit Revisi"}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={!!spvReviewBusy}
                            onClick={() => setSpvRevisionOpen(true)}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#ffb4b4] bg-white px-4 text-sm font-semibold text-[#ff3b3b] transition hover:bg-[#fff5f5] disabled:opacity-50"
                          >
                            <MaterialIcon name="edit_note" size="xs" />
                            Revisi
                          </button>
                          <button
                            type="button"
                            disabled={!!spvReviewBusy}
                            onClick={() => void handleSpvResultReview("approved")}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#00a4ff] bg-[#00a4ff] px-4 text-sm font-semibold text-white transition hover:bg-[#008bd9] disabled:opacity-50"
                          >
                            <MaterialIcon name="check_circle" size="xs" />
                            {spvReviewBusy === "approved" ? "Memproses..." : "ACC"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })() : (
                <p className="px-3 py-2 text-sm text-cu-muted">Detail output belum tersedia.</p>
            )}
          </div>
        )}
        {cancelOpen && (
          <div className={`border-t px-3 py-3 ${dividerClass} ${bodyClass}`}>
            <div className="mb-2 flex items-center gap-2">
              <MaterialIcon name="delete_forever" size="sm" className="text-red-500" />
              <p className="text-sm font-semibold leading-none text-red-600">Batalkan / Hapus Task ({task.task_number})</p>
            </div>
            <p className="mb-2 text-xs text-cu-muted">
              {controlView || !["in_progress", "spv_review", "client_review", "revision", "leader_revision_requested"].includes(task.status)
                ? "Task akan langsung dibatalkan/dihapus dari antrean pengerjaan aktif."
                : "Pengajuan pembatalan task yang sedang berjalan akan dikirim ke SPV/Manajer untuk ditinjau."}
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={2}
              placeholder="Isi alasan pembatalan / hapus task (wajib)..."
              className="mb-3 w-full resize-y rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-red-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={cancelBusy}
                onClick={() => {
                  setCancelOpen(false);
                  setCancelReason("");
                }}
                className="inline-flex h-8 items-center justify-center rounded-lg border border-cu-border bg-white px-3 text-xs font-semibold text-cu-ink hover:bg-cu-panel-soft disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!cancelReason.trim() || cancelBusy}
                onClick={() => void handleCancelTask()}
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 text-xs font-bold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
              >
                <MaterialIcon name="delete_forever" size="xs" />
                {cancelBusy ? "Memproses..." : "Konfirmasi Hapus Task"}
              </button>
            </div>
          </div>
        )}
      </article>

      {briefModal}
    </>
  );
}

function RetroStatusBadge({ status }: { status: string }) {
  const danger = ["cancelled", "cancelled_by_spv", "revision_rejected_by_spv"].includes(status);
  const success = ["done", "client_review"].includes(status);
  const active = ["in_progress", "spv_review", "queued", "submitted"].includes(status);

  return (
    <span className={`inline-flex border-2 border-[#24252b] px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-[0.12em] text-[#24252b] shadow-[2px_2px_0_#777a72] ${
      danger
        ? "bg-[#e7a0a0]"
        : success
          ? "bg-[#a9d49b]"
          : active
            ? "bg-[#ba0dcb] text-white"
            : "bg-[#c9ccc0]"
    }`}>
      {statusLabel(status)}
    </span>
  );
}

function taskTypeLabel(taskType: string): string {
  const labels: Record<string, string> = {
    new_task: "Task Baru",
    leader_revision: "Revisi SPV",
    client_revision: "Revisi Client",
    extra_revision: "Extra Revision",
    urgent_revision: "Urgent Final",
  };

  return labels[taskType] ?? statusLabel(taskType);
}

function ClientOddsTaskCard({ task, theme, userId, nowMs, onReviewed, detailOnly, externalAction }: { task: OddsTask; theme: "light" | "dark" | "retro"; userId?: number; nowMs: number; onReviewed?: () => Promise<void>; detailOnly?: boolean; externalAction?: { type: string; nonce: number } }) {
  const [briefOpen, setBriefOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [fileOpen, setFileOpen] = useState(false);
  const [clientRevisionOpen, setClientRevisionOpen] = useState(false);
  const [clientApproveOpen, setClientApproveOpen] = useState(false);
  const [clientApproveStep, setClientApproveStep] = useState<1 | 2>(1);
  const [clientReviewNote, setClientReviewNote] = useState("");
  const [clientFeedback, setClientFeedback] = useState("");
  const [clientRating, setClientRating] = useState(5);
  const [clientReviewBusy, setClientReviewBusy] = useState<"approved" | "revision" | null>(null);
  const [copiedAssetId, setCopiedAssetId] = useState<number | null>(null);
  const lastActionNonce = useRef<number | null>(null);

  useEffect(() => {
    if (externalAction && externalAction.nonce !== lastActionNonce.current) {
      lastActionNonce.current = externalAction.nonce;
      
      setBriefOpen(externalAction.type === "brief");
      setFileOpen(externalAction.type === "file" || externalAction.type === "check");
      setMessageOpen(externalAction.type === "chat");
    }
  }, [externalAction]);

  const created = task.created_at ? new Date(task.created_at) : null;
  const validCreated = created && !Number.isNaN(created.getTime());
  const submitDay = validCreated ? new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(created) : "-";
  const submitDate = validCreated ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }).format(created) : "-";
  const submitTime = validCreated ? new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }).format(created).replace(".", ":") : "-";
  const assignedDesigner = task.assigned_designer ?? task.assignedDesigner;
  const currentQueue = task.current_queue ?? task.currentQueue;
  const deadlineDate = task.deadline ? new Date(task.deadline) : null;
  const validDeadline = deadlineDate && !Number.isNaN(deadlineDate.getTime());
  const deadlineDay = validDeadline ? new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(deadlineDate) : "-";
  const deadlineValue = validDeadline ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }).format(deadlineDate) : "-";
  const accent = theme === "dark" ? "#b0ff5e" : theme === "retro" ? "#ba0dcb" : "#00a4ff";
  const priority = (() => {
    const value = (task.important_matrix || task.category?.important_matrix || "Q4").toUpperCase();
    if (value === "URGENT") return "Q1";
    if (value === "HIGH") return "Q2";
    if (value === "MEDIUM") return "Q3";
    return ["Q1", "Q2", "Q3", "Q4"].includes(value) ? value : "Q4";
  })();
  const headerClass =
    theme === "dark"
      ? "bg-[#b0ff5e] text-[#181818]"
      : theme === "retro"
      ? "border-b-2 border-[#24252b] bg-[#ba0dcb] text-white"
      : "bg-[#00a4ff] text-white";
  const bodyClass =
    theme === "dark"
      ? "bg-[#171717] text-[#f1f1f1]"
      : theme === "retro"
      ? "border-x-2 border-b-2 border-[#24252b] bg-[#eceee6] text-[#24252b]"
      : "bg-white/90 text-[#3b4446]";
  const dividerClass = theme === "retro" ? "border-[#24252b]" : theme === "dark" ? "border-white/10" : "border-[#e6edf2]";
  const shellClass = theme === "retro" ? "min-w-[860px] rounded-none border-2 border-[#24252b] font-mono shadow-[3px_3px_0_#777a72]" : "min-w-[860px] overflow-hidden rounded-lg shadow-[0_5px_14px_rgba(44,42,39,0.06)]";
  const textStrongClass = theme === "dark" ? "text-[#f1f1f1]" : "text-[#3b4446]";
  const formatRunningTimer = () => {
    const timeLogs = task.time_logs ?? task.timeLogs ?? [];
    const runningLog = timeLogs.find((log) => !log.stopped_at && ["work", "revision"].includes(log.log_type));
    const started = runningLog
      ? new Date(runningLog.started_at).getTime()
      : new Date(task.updated_at ?? task.created_at).getTime();
    if (Number.isNaN(started)) return null;
    const totalSeconds = Number.isNaN(started)
      ? runningLog?.duration_seconds ?? 0
      : Math.max(0, Math.floor((nowMs - started) / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
  };
  const runningTimer = task.status === "in_progress" ? formatRunningTimer() : null;
  const statusText = task.status === "submitted"
    ? "Cek Brief"
    : task.status === "in_progress" && runningTimer
    ? `${runningTimer} - ${statusLabel(task.status)}`
    : statusLabel(task.status);
  const sortedResults = [...(task.results ?? [])].sort((left, right) => Number(right.version_number) - Number(left.version_number));
  const activeResult = sortedResults[0] ?? null;
  const getResultAssets = (result: OddsTaskResult) => result.asset_links ?? ((result as OddsTaskResult & { assetLinks?: OddsTaskResult["asset_links"] }).assetLinks ?? []);
  const resultAssets = sortedResults.flatMap((result) => getResultAssets(result));
  const messageEnabled = !["submitted", "brief_revision_requested"].includes(task.status);
  const canClientCheckOutput = task.status === "client_review";
  const fileEnabled = resultAssets.length > 0 || canClientCheckOutput;
  const actionButtonClass = "flex size-6 items-center justify-center text-cu-ink transition hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-30";
  const getTotalOutput = (notes: string | null | undefined) => {
    const match = (notes ?? "").match(/Total Output:\s*([0-9]+)/i);
    return match?.[1] ?? "-";
  };
  const renderAssetValue = (asset: { id: number; label: string; url: string; provider: string }) => {
    const isWebLink = /^https?:\/\//i.test(asset.url);
    const copyValue = async () => {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(asset.url);
        return;
      }

      if (typeof document === "undefined") return;
      const textarea = document.createElement("textarea");
      textarea.value = asset.url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    };
    const handleCopy = async () => {
      await copyValue();
      setCopiedAssetId(asset.id);
      window.setTimeout(() => {
        setCopiedAssetId((current) => current === asset.id ? null : current);
      }, 2000);
    };
    const copied = copiedAssetId === asset.id;

    if (!isWebLink) {
      return (
        <div key={asset.id} className={`flex min-w-0 items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm font-semibold transition ${copied ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-cu-border bg-white text-cu-ink"}`}>
          <span className="min-w-0 truncate">{copied ? "Berhasil menyalin link file sharing" : asset.url}</span>
          <button
            type="button"
            onClick={() => void handleCopy()}
            className={`flex size-7 shrink-0 items-center justify-center rounded-md transition ${copied ? "text-emerald-700 hover:bg-emerald-100" : "text-cu-ink hover:bg-cu-panel-soft"}`}
            aria-label="Salin link local sharing"
            title="Salin"
          >
            <MaterialIcon name={copied ? "check_circle" : "content_copy"} size="xs" />
          </button>
        </div>
      );
    }

    return (
      <a key={asset.id} href={asset.url} target="_blank" rel="noreferrer" className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-cu-border bg-white px-3 py-2 text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft">
        <span className="min-w-0 truncate">{asset.label}</span>
        <MaterialIcon name="open_in_new" size="xs" />
      </a>
    );
  };
  const handleClientResultReview = async (decision: "approved" | "revision") => {
    const note = clientReviewNote.trim();
    if (decision === "revision" && !stripRichText(note)) return;

    setClientReviewBusy(decision);
    try {
      if (decision === "approved") {
        const feedback = clientFeedback.trim();
        await clientReviewOddsTask(task.id, "approved", feedback || undefined);
        await rateOddsTask(task.id, clientRating, feedback || undefined);
      } else {
        await clientReviewOddsTask(task.id, "revision", note || undefined, "normal");
      }
      setClientApproveOpen(false);
      setClientApproveStep(1);
      setClientRevisionOpen(false);
      setClientReviewNote("");
      setClientFeedback("");
      setFileOpen(false);
      await onReviewed?.();
    } catch (err: any) {
      console.error(err);
      alert(oddsError(err));
    } finally {
      setClientReviewBusy(null);
    }
  };
  const formatEstimatedTime = () => {
    const start = currentQueue?.estimated_start_at ? new Date(currentQueue.estimated_start_at).getTime() : NaN;
    const finish = currentQueue?.estimated_finish_at ? new Date(currentQueue.estimated_finish_at).getTime() : NaN;
    const minutes = Number.isFinite(start) && Number.isFinite(finish)
      ? Math.max(0, Math.ceil((finish - start) / 60_000))
      : Number(task.category_snapshot?.sla_minutes ?? 0);
    if (!Number.isFinite(minutes) || minutes <= 0) return "-";
    const totalHours = Math.floor(minutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const remainingMinutes = minutes % 60;
    if (days > 0) return `${days} Hari ${hours} Jam`;
    if (totalHours > 0) return remainingMinutes > 0 ? `${totalHours} Jam ${remainingMinutes} Menit` : `${totalHours} Jam`;
    return `${minutes} Menit`;
  };
  const estimatedTime = formatEstimatedTime();
  const hasBriefContent = Boolean(stripRichText(task.brief_text));
  const modalRoot = typeof document !== "undefined" ? document.getElementById("odds-shell-modal-root") : null;
  const briefModal = briefOpen && modalRoot ? createPortal(
    <div
      className="absolute inset-0 z-[80] overflow-hidden bg-white text-cu-ink"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`client-task-brief-${task.id}`}
    >
      <div className="flex h-full w-full flex-col overflow-hidden bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-[#e1e8eb] bg-white/80 px-5 py-4">
          <p id={`client-task-brief-${task.id}`} className="truncate text-xl font-bold">Detail Task</p>
          <button type="button" onClick={() => setBriefOpen(false)} aria-label="Tutup brief" className="flex size-10 items-center justify-center rounded-xl border border-[#c9c9c9] bg-white text-[#303431] shadow-sm transition hover:border-[#00a4ff] hover:bg-[#f3fbff]">
            <MaterialIcon name="close" size="auto" className="text-xl" />
          </button>
        </div>
        <section className="min-h-0 flex-1 overflow-hidden bg-white/70 p-5">
          <div className="odds-scroll-hidden h-full overflow-y-auto bg-white pr-2">
            <h2 className="mb-4 text-base font-semibold leading-7 text-[#303431]">{task.design_purpose}</h2>
            {hasBriefContent ? (
              <div
                className="prose-odds max-w-none whitespace-normal text-sm leading-7 text-[#303431] [&_br]:block [&_br]:h-1 [&_div]:mb-3 [&_p]:mb-3 [&_p:has(br:only-child)]:mb-2 [&_p:has(br:only-child)]:h-2 [&_figure]:my-5 [&_figcaption]:mt-2 [&_figcaption]:text-xs [&_figcaption]:text-[#6b7280] [&_img]:max-h-72 [&_img]:w-auto [&_img]:max-w-full"
                dangerouslySetInnerHTML={{ __html: task.brief_text }}
              />
            ) : (
              <p className="text-sm leading-7 text-[#6b7280]">Brief belum tersedia.</p>
            )}
          </div>
        </section>
      </div>
    </div>,
    modalRoot,
  ) : null;

  return (
    <>
      <article className={detailOnly ? "" : shellClass}>
        {!detailOnly && (
          <>
        <div className={`flex items-center justify-between gap-4 px-4 py-2 ${headerClass}`}>
          <p className={`truncate leading-none ${theme === "retro" ? "text-[11px] font-black uppercase tracking-[0.12em]" : "text-base"}`}>
            {priority} - {task.design_purpose}
          </p>
          <p className="shrink-0 text-sm font-semibold leading-none">{statusText}</p>
        </div>
        <div className={`grid grid-cols-[118px_minmax(180px,240px)_minmax(120px,150px)_minmax(130px,170px)_minmax(150px,1fr)] items-center px-4 py-2 ${bodyClass}`}>
          <div className="flex flex-col items-start gap-0.5 leading-none">
            <p className={`text-sm font-medium ${textStrongClass}`}>{submitDay}</p>
            <p className={`text-sm font-medium ${textStrongClass}`}>{submitDate}</p>
            <p className="text-2xl font-bold leading-none tracking-[-0.24px]" style={{ color: accent }}>{submitTime}</p>
          </div>
          <div className={`flex min-h-[54px] flex-col justify-center border-l px-4 ${dividerClass}`}>
            <p className={`truncate text-base font-semibold leading-none ${textStrongClass}`}>{assignedDesigner?.name ?? "-"}</p>
            <p className="mt-1 truncate text-sm font-medium text-cu-muted">{task.category?.name ?? task.category_snapshot?.name ?? "Tanpa kategori"}</p>
          </div>
          <div className={`flex min-h-[54px] flex-col justify-center border-l px-4 ${dividerClass}`}>
            <p className="text-sm font-medium leading-none text-cu-muted">Deadline</p>
            <p className={`text-sm font-medium leading-none ${textStrongClass}`}>{deadlineDay}</p>
            <p className={`mt-0.5 text-sm font-medium leading-none ${textStrongClass}`}>{deadlineValue}</p>
          </div>
          <div className={`flex min-h-[54px] flex-col justify-center border-l px-4 ${dividerClass}`}>
            <p className="text-sm font-medium leading-none text-cu-muted">Estimated Time</p>
            <p className="mt-1 text-lg font-semibold leading-none" style={{ color: accent }}>{estimatedTime}</p>
          </div>
          <div className={`flex min-h-[54px] items-center justify-end gap-2 border-l px-4 ${dividerClass}`}>
            <button type="button" onClick={() => setBriefOpen(true)} title="Brief" aria-label="Brief" className={actionButtonClass}>
              <MaterialIcon name="description" size="auto" className="text-2xl" />
            </button>
            <button
              type="button"
              title={messageEnabled ? "Message" : "Message belum aktif"}
              aria-label="Message"
              disabled={!messageEnabled}
              onClick={() => {
                setMessageOpen((open) => !open);
                setFileOpen(false);
              }}
              className={actionButtonClass}
            >
              <MaterialIcon name="chat_bubble" size="auto" className="text-2xl" />
            </button>
            <button
              type="button"
              title={fileEnabled ? "File" : "Belum ada file output"}
              aria-label="File"
              disabled={!fileEnabled}
              onClick={() => {
                setFileOpen((open) => !open);
                setMessageOpen(false);
              }}
              className={actionButtonClass}
            >
              <MaterialIcon name="folder" size="auto" className="text-2xl" />
            </button>
            {canClientCheckOutput && (
              <button
                type="button"
                title="Check"
                aria-label="Check output"
                onClick={() => {
                  setFileOpen((open) => !open);
                  setMessageOpen(false);
                }}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-cu-border bg-white px-3 text-sm font-semibold text-cu-ink shadow-sm transition hover:bg-cu-panel-soft"
              >
                <MaterialIcon name="fact_check" size="xs" />
                Check
              </button>
            )}
          </div>
        </div>
          </>
        )}
        {messageOpen && !detailOnly && (
          <div className="border-t border-cu-border bg-white">
            <OddsTaskChat taskId={task.id} userId={userId} taskStatus={task.status} compact />
          </div>
        )}
        {fileOpen && (
          <div className="border-t border-cu-border bg-white px-4 py-3">
            {activeResult ? (() => {
              const assets = getResultAssets(activeResult);
              const localShareAssets = assets.filter((asset) => asset.label.toLowerCase().includes("local file sharing"));
              const uploadedAssets = assets.filter((asset) => !asset.label.toLowerCase().includes("local file sharing"));

              return (
                <div className="grid gap-3">
                  {clientApproveOpen ? (
                    <div className="grid gap-3 rounded-lg border border-[#cfe8f6] bg-[#f4fbff] p-4">
                      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-[#00a4ff] text-white">
                              <MaterialIcon name={clientApproveStep === 1 ? "star" : "rate_review"} size="xs" />
                            </span>
                            <p className="text-sm font-semibold text-cu-ink">Review Output</p>
                          </div>
                          <p className="mt-0.5 text-xs text-cu-muted">{clientApproveStep === 1 ? "Pilih rating bintang untuk output ini." : "Tambahkan feedback jika diperlukan."}</p>
                        </div>
                        <div className="flex items-center gap-1 rounded-full border border-[#cfe8f6] bg-white p-1">
                          {[1, 2].map((step) => (
                            <span key={step} className={`h-6 rounded-full px-3 text-xs font-semibold leading-6 ${clientApproveStep === step ? "bg-[#00a4ff] text-white" : "text-cu-muted"}`}>
                              {step === 1 ? "Rating" : "Feedback"}
                            </span>
                          ))}
                        </div>
                      </div>
                      {clientApproveStep === 1 ? (
                        <div className="grid gap-3 rounded-lg border border-[#d9e1e6] bg-white px-4 py-5 text-center shadow-sm">
                          <p className="text-xs font-semibold text-cu-muted">Seberapa puas Anda dengan output ini?</p>
                          <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setClientRating(value)}
                                className={`flex size-11 items-center justify-center rounded-lg border transition ${value <= clientRating ? "border-[#f59e0b] bg-[#fff7ed]" : "border-cu-border bg-white hover:bg-cu-panel-soft"}`}
                                aria-label={`Rating ${value}`}
                              >
                                <MaterialIcon name="star" size="auto" className={`text-2xl ${value <= clientRating ? "text-[#f59e0b]" : "text-cu-muted"}`} />
                              </button>
                            ))}
                          </div>
                          <p className="text-xs font-semibold text-[#f59e0b]">{clientRating}/5</p>
                        </div>
                      ) : (
                        <div className="grid gap-2 rounded-lg border border-[#d9e1e6] bg-white p-3 shadow-sm">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold text-cu-muted">Feedback Opsional</p>
                            <span className="text-xs text-cu-muted">Rating {clientRating}/5</span>
                          </div>
                          <textarea
                            value={clientFeedback}
                            onChange={(event) => setClientFeedback(event.target.value)}
                            rows={3}
                            placeholder="Feedback untuk hasil desain (opsional)"
                            className="w-full resize-none rounded-lg border border-cu-border bg-white px-3 py-2 text-sm text-cu-ink outline-none focus:border-[#00a4ff]"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex min-h-10 flex-wrap items-center justify-between gap-3 rounded-lg border border-cu-border bg-cu-panel-soft px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-white text-[#00a4ff]">
                          <MaterialIcon name="inventory_2" size="xs" />
                        </span>
                        <p className={`text-sm font-semibold ${textStrongClass}`}>Total Output {getTotalOutput(activeResult.result_notes)}</p>
                      </div>
                      <span className="text-xs text-cu-muted">{formatOddsDate(activeResult.submitted_at, true)}</span>
                    </div>
                  )}
                  {!clientApproveOpen && (
                    <div className="grid gap-2 rounded-lg border border-cu-border bg-white p-3 shadow-sm">
                      <div className="min-w-0">
                        <p className="mb-1 text-[11px] font-semibold text-cu-muted">Link Local File Sharing</p>
                        <div className="grid gap-2">
                          {localShareAssets.length > 0 ? (
                            localShareAssets.map((asset) => renderAssetValue(asset))
                          ) : (
                            <div className="rounded-lg border border-cu-border bg-cu-panel-soft px-3 py-2 text-xs text-cu-muted">Tidak ada link local sharing.</div>
                          )}
                        </div>
                      </div>
                      {uploadedAssets.length > 0 && (
                        <div className="min-w-0">
                          <p className="mb-1 text-[11px] font-semibold text-cu-muted">File Upload</p>
                          <div className="grid gap-2">
                            {uploadedAssets.map((asset) => renderAssetValue(asset))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {canClientCheckOutput && (
                    <div className="grid gap-3 rounded-lg border border-cu-border bg-cu-panel-soft p-3">
                      {clientRevisionOpen && (
                        <div className="rounded-lg border border-cu-border bg-white p-3">
                          <p className="mb-2 text-sm font-semibold text-cu-ink">Catatan Revisi</p>
                          <OddsRichTextEditor
                            value={clientReviewNote}
                            onChange={setClientReviewNote}
                            minHeight={120}
                            placeholder="Catatan revisi untuk designer"
                            onUploadImage={(files) => Promise.all(Array.from(files).map((file) => uploadOddsTaskAttachment(file, task.id)))}
                          />
                        </div>
                      )}
                      <div className="flex justify-end gap-2 border-t border-cu-border pt-3">
                        {clientRevisionOpen ? (
                          <>
                            <button type="button" disabled={!!clientReviewBusy} onClick={() => { setClientRevisionOpen(false); setClientReviewNote(""); }} className="inline-flex h-9 items-center justify-center rounded-lg border border-[#ffb4b4] bg-white px-4 text-sm font-semibold text-[#ff3b3b] transition hover:bg-[#fff5f5] disabled:opacity-50">
                              Cancel
                            </button>
                            <button type="button" disabled={!stripRichText(clientReviewNote) || !!clientReviewBusy} onClick={() => void handleClientResultReview("revision")} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#ff3b3b] bg-[#ff3b3b] px-4 text-sm font-semibold text-white transition hover:bg-[#ec1f1f] disabled:opacity-50">
                              <MaterialIcon name="edit_note" size="xs" />
                              {clientReviewBusy === "revision" ? "Memproses..." : "Submit Revisi"}
                            </button>
                          </>
                        ) : (
                        <>
                            {clientApproveOpen ? (
                              <>
                              <button type="button" disabled={!!clientReviewBusy} onClick={() => { setClientApproveOpen(false); setClientApproveStep(1); setClientFeedback(""); setClientRating(5); }} className="inline-flex h-9 items-center justify-center rounded-lg border border-cu-border bg-white px-4 text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft disabled:opacity-50">
                                Cancel
                              </button>
                              <button type="button" disabled={!!clientReviewBusy} onClick={() => clientApproveStep === 1 ? setClientApproveStep(2) : void handleClientResultReview("approved")} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#00a4ff] bg-[#00a4ff] px-4 text-sm font-semibold text-white transition hover:bg-[#008bd9] disabled:opacity-50">
                                <MaterialIcon name="arrow_forward" size="xs" />
                                {clientReviewBusy === "approved" ? "Memproses..." : clientApproveStep === 1 ? "Next" : "Submit ACC"}
                              </button>
                              </>
                            ) : (
                              <>
                              <button type="button" disabled={!!clientReviewBusy} onClick={() => { setClientApproveOpen(false); setClientRevisionOpen(true); }} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#ffb4b4] bg-white px-4 text-sm font-semibold text-[#ff3b3b] transition hover:bg-[#fff5f5] disabled:opacity-50">
                                <MaterialIcon name="edit_note" size="xs" />
                                Revisi
                              </button>
                              <button type="button" disabled={!!clientReviewBusy} onClick={() => { setClientRevisionOpen(false); setClientApproveStep(1); setClientApproveOpen(true); }} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#00a4ff] bg-[#00a4ff] px-4 text-sm font-semibold text-white transition hover:bg-[#008bd9] disabled:opacity-50">
                                <MaterialIcon name="check_circle" size="xs" />
                                ACC
                              </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })() : (
              <p className="px-3 py-2 text-sm text-cu-muted">Detail output belum tersedia.</p>
            )}
          </div>
        )}
      </article>
      {briefModal}
    </>
  );
}

function designerTaskStatusLabel(task: Pick<OddsTask, "status" | "task_type">): string {
  if (task.status === "submitted") return "Cek Brief";
  if (task.status === "ready_to_start") return "Proses Terjeda";

  if (task.task_type === "leader_revision") {
    if (task.status === "in_progress") return "Pengerjaan Revisi SPV";
    if (task.status === "queued") return "Revisi SPV";
  }

  if (task.task_type === "client_revision") {
    if (task.status === "in_progress") return "Pengerjaan Revisi Client";
    if (task.status === "queued") return "Revisi Client";
  }

  return statusLabel(task.status);
}

function TaskTypePill({ taskType }: { taskType: string }) {
  if (!taskType || taskType === "new_task") return null;

  const isLeaderRevision = taskType === "leader_revision";
  const isUrgent = taskType === "urgent_revision";

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
        isLeaderRevision
          ? "border-cu-warning/30 bg-cu-warning/10 text-cu-warning"
          : isUrgent
            ? "border-cu-danger/20 bg-cu-danger/10 text-cu-danger"
            : "border-cu-info/20 bg-cu-info/10 text-cu-info"
      }`}
    >
      {taskTypeLabel(taskType)}
    </span>
  );
}

function TextField({
  label,
  value,
  required,
  help,
  onChange,
}: {
  label: string;
  value: string;
  required?: boolean;
  help?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-cu-muted">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="h-10 w-full rounded-lg border border-cu-border px-3 text-sm outline-none focus:border-cu-info"
      />
      {help && <FieldHelp>{help}</FieldHelp>}
    </label>
  );
}

function NumberField({
  label,
  value,
  step = "1",
  help,
  onChange,
}: {
  label: string;
  value: string;
  step?: string;
  help?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-cu-muted">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        min="0"
        step={step}
        type="number"
        className="h-10 w-full rounded-lg border border-cu-border px-3 text-sm outline-none focus:border-cu-info"
      />
      {help && <FieldHelp>{help}</FieldHelp>}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  help,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  help?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-cu-muted">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-cu-border px-3 text-sm outline-none focus:border-cu-info"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {help && <FieldHelp>{help}</FieldHelp>}
    </label>
  );
}

function CheckField({ label, checked, help, onChange }: { label: string; checked: boolean; help?: string; onChange: (checked: boolean) => void }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm text-cu-ink">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="size-4 rounded border-cu-border"
        />
        <span>{label}</span>
      </label>
      {help && <FieldHelp>{help}</FieldHelp>}
    </div>
  );
}

function FieldHelp({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs leading-5 text-cu-muted">{children}</p>;
}

function FormActions({ saving, editing, onCancel }: { saving: boolean; editing: boolean; onCancel: () => void }) {
  return (
    <div className="flex gap-2 pt-1">
      {editing && (
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-cu-border px-3 text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft"
        >
          Batal
        </button>
      )}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-cu-ink px-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        <MaterialIcon name="save" size="sm" />
        {saving ? "Menyimpan..." : editing ? "Update" : "Simpan"}
      </button>
    </div>
  );
}

function RowActions({ disabled, onEdit, onDelete }: { disabled: boolean; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex justify-end gap-1">
      <button
        type="button"
        disabled={disabled}
        onClick={onEdit}
        className="inline-flex size-8 items-center justify-center rounded-lg border border-cu-border text-cu-ink transition hover:bg-cu-panel-soft disabled:opacity-50"
        aria-label="Edit"
      >
        <MaterialIcon name="edit" size="sm" />
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onDelete}
        className="inline-flex size-8 items-center justify-center rounded-lg border border-cu-danger/20 text-cu-danger transition hover:bg-cu-danger/10 disabled:opacity-50"
        aria-label="Hapus"
      >
        <MaterialIcon name="delete" size="sm" />
      </button>
    </div>
  );
}

function DecisionButtons({
  disabled,
  approveLabel,
  rejectLabel,
  onApprove,
  onReject,
}: {
  disabled: boolean;
  approveLabel: string;
  rejectLabel: string;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={onApprove}
        className="inline-flex h-9 items-center gap-1 rounded-lg border border-cu-success/20 bg-cu-success/10 px-3 text-sm font-semibold text-cu-success transition hover:bg-cu-success/15 disabled:opacity-50"
      >
        <MaterialIcon name="check" size="xs" />
        {approveLabel}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onReject}
        className="inline-flex h-9 items-center gap-1 rounded-lg border border-cu-danger/20 bg-cu-danger/10 px-3 text-sm font-semibold text-cu-danger transition hover:bg-cu-danger/15 disabled:opacity-50"
      >
        <MaterialIcon name="close" size="xs" />
        {rejectLabel}
      </button>
    </div>
  );
}

function TaskOperationsTable({ loading, empty, tasks }: { loading: boolean; empty: string; tasks: OddsTask[] }) {
  return (
    <DataTable
      loading={loading}
      empty={empty}
      headers={["Task", "Client", "Designer", "Status", "Deadline", ""]}
      rows={tasks.map((task) => {
        const assignedDesigner = task.assigned_designer ?? task.assignedDesigner;

        return [
          <div key={`task-title-${task.id}`}>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-cu-ink">{task.design_purpose}</p>
              <TaskTypePill taskType={task.task_type} />
            </div>
            <p className="mt-1 text-xs text-cu-muted">{task.task_number}</p>
          </div>,
          task.requester?.name ?? "-",
          assignedDesigner?.name ?? "-",
          <StatusBadge key={`status-${task.id}`} status={task.status} />,
          formatOddsDate(task.deadline, true),
          <Link
            key={`open-${task.id}`}
            href={`/odds/detail?id=${task.id}`}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-cu-border px-3 text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft"
          >
            <MaterialIcon name="open_in_new" size="sm" />
            Detail
          </Link>,
        ];
      })}
    />
  );
}

function AllTasksCards({ loading, empty, tasks }: { loading: boolean; empty: string; tasks: OddsTask[] }) {
  if (loading) {
    return <div className="border-2 border-dashed border-[#777a72] bg-[#eceee6] px-5 py-10 text-center font-mono text-xs font-black uppercase tracking-[0.14em] text-[#666961]">Loading task log...</div>;
  }

  if (tasks.length === 0) {
    return <div className="border-2 border-dashed border-[#777a72] bg-[#eceee6] px-5 py-10 text-center font-mono text-xs font-black uppercase tracking-[0.14em] text-[#666961]">{empty}</div>;
  }

  return (
    <div className="odds-scroll-hidden h-full min-h-0 space-y-8 overflow-y-auto overscroll-contain pr-2">
      <RoleViewPreview label="Manager / SPV View">
        {tasks.map((task) => <ManagerSpvTaskCard key={`manager-${task.id}`} task={task} />)}
      </RoleViewPreview>

      <RoleViewPreview label="Client View">
        {tasks.map((task) => <ClientTaskCard key={`client-${task.id}`} task={task} />)}
      </RoleViewPreview>

      <RoleViewPreview label="Designer View">
        {tasks.map((task) => <DesignerTaskCard key={`designer-${task.id}`} task={task} />)}
      </RoleViewPreview>
    </div>
  );
}

function RoleViewPreview({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3 border-b-2 border-[#24252b] pb-2">
        <span className="size-2 bg-[#ba0dcb] shadow-[0_0_0_2px_#24252b]" />
        <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#24252b]">{label}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function ManagerSpvTaskCard({ task }: { task: OddsTask }) {
  return <RoleTaskExpandableCard task={task} viewRole="manager" />;
}

function ClientTaskCard({ task }: { task: OddsTask }) {
  return <RoleTaskExpandableCard task={task} viewRole="client" />;
}

function DesignerTaskCard({ task }: { task: OddsTask }) {
  return <RoleTaskExpandableCard task={task} viewRole="designer" />;
}

function RoleTaskExpandableCard({ task, viewRole }: { task: OddsTask; viewRole: "manager" | "client" | "designer" }) {
  const [expanded, setExpanded] = useState(false);
  const [designerBriefOpen, setDesignerBriefOpen] = useState(false);
  const assignedDesigner = task.assigned_designer ?? task.assignedDesigner;
  const contentId = `all-task-${viewRole}-${task.id}-content`;
  const createdDate = task.created_at ? new Date(task.created_at) : null;
  const hasValidCreatedDate = createdDate && !Number.isNaN(createdDate.getTime());
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const createdWeekday = hasValidCreatedDate ? dayNames[createdDate.getDay()] : "---";
  const createdDay = hasValidCreatedDate ? createdDate.toLocaleDateString("en-US", { day: "2-digit" }) : "--";
  const createdMonthYear = hasValidCreatedDate ? `${monthNames[createdDate.getMonth()]}-${createdDate.getFullYear()}` : "--- ----";

  return (
    <article className="border-2 border-[#24252b] bg-[#eceee6] font-mono text-[#24252b] shadow-[3px_3px_0_#777a72]">
      {viewRole === "designer" ? (
        <div className="grid w-full grid-cols-[64px_minmax(0,1fr)] items-stretch justify-start text-left sm:grid-cols-[76px_minmax(130px,170px)_220px_140px] lg:grid-cols-[76px_minmax(160px,200px)_260px_150px_210px]">
          <span className="flex flex-col items-center justify-center border-r-2 border-[#24252b] bg-[#c9ccc0] px-2 py-3 text-center uppercase">
            <span className="text-[9px] font-black tracking-[0.12em] text-[#666961]">{createdWeekday}</span>
            <span className="my-0.5 text-2xl font-black leading-none sm:text-3xl">{createdDay}</span>
            <span className="text-[8px] font-black tracking-[0.08em] text-[#666961]">{createdMonthYear}</span>
          </span>
          <span className="flex min-w-0 flex-col justify-center px-4 py-3">
            <span className="line-clamp-2 text-sm font-black uppercase leading-6 tracking-[0.03em] sm:text-base" title={task.design_purpose}>{task.design_purpose}</span>
            <span className="mt-1 flex flex-wrap items-center gap-2">
              <TaskTypePill taskType={task.task_type} />
            </span>
            <button type="button" aria-expanded={designerBriefOpen} aria-controls={`${contentId}-brief`} onClick={() => setDesignerBriefOpen((open) => !open)} className="mt-2 inline-flex w-fit items-center gap-1 text-[9px] font-black uppercase tracking-[0.1em] text-[#666961] underline decoration-dotted underline-offset-4 transition hover:text-[#ba0dcb]">
              {designerBriefOpen ? "Hide Brief" : "View Brief"} <MaterialIcon name={designerBriefOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"} size="xs" />
            </button>
          </span>
          <span className="col-start-2 row-start-2 flex flex-col justify-center gap-1 border-t border-dashed border-[#a9aca2] px-4 py-3 text-[9px] sm:col-start-auto sm:row-start-auto sm:border-l sm:border-t-0">
            <span><strong className="inline-block w-[70px] uppercase text-[#666961]">Client</strong>: {task.requester?.name ?? "-"}</span>
            <span><strong className="inline-block w-[70px] uppercase text-[#666961]">Kategori</strong>: {task.category?.name ?? "-"}</span>
            <span><strong className="inline-block w-[70px] uppercase text-[#666961]">Deadline</strong>: {formatOddsDate(task.deadline, true)}</span>
          </span>
          <span className="col-start-2 row-start-3 flex flex-col items-start justify-center gap-2 border-t border-dashed border-[#a9aca2] px-4 py-3 sm:col-start-auto sm:row-start-auto sm:border-l sm:border-t-0">
            <DeadlineCountdown deadline={task.deadline} />
            <RetroStatusBadge status={task.status} />
          </span>
          <span className="col-start-2 row-start-4 flex items-center border-t border-dashed border-[#a9aca2] px-4 py-3 sm:col-span-3 sm:col-start-2 sm:row-start-2 lg:col-span-1 lg:col-start-auto lg:row-start-auto lg:border-l lg:border-t-0">
            <DesignerActionButtons />
          </span>
        </div>
      ) : (
        <button type="button" aria-expanded={expanded} aria-controls={contentId} onClick={() => setExpanded((current) => !current)} className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4 text-left md:grid-cols-[minmax(15rem,1fr)_auto_auto]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="border border-[#24252b] bg-[#c9ccc0] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.12em]">{task.task_number}</span>
              <TaskTypePill taskType={task.task_type} />
            </div>
            <h3 className="mt-2 truncate text-sm font-black uppercase leading-6 tracking-[0.03em] sm:text-base" title={task.design_purpose}>{task.design_purpose}</h3>
          </div>

          <div className="hidden md:block"><StatusBadge status={task.status} /></div>
          <span className={`flex size-9 items-center justify-center border-2 border-[#24252b] bg-[#dfe2d3] shadow-[2px_2px_0_#777a72] transition-transform ${expanded ? "rotate-180" : ""}`}>
            <MaterialIcon name="keyboard_arrow_down" size="sm" />
          </span>
        </button>
      )}

      {viewRole === "designer" && designerBriefOpen && (
        <div id={`${contentId}-brief`} className="border-t-2 border-[#24252b] bg-[#dfe2d3] px-5 py-4">
          <p className="mb-2 text-[8px] font-black uppercase tracking-[0.14em] text-[#666961]">Brief.txt</p>
          <p className="whitespace-pre-wrap text-xs font-bold leading-6 text-[#24252b]">{stripRichText(task.brief_text) || "No brief provided."}</p>
        </div>
      )}

      {viewRole !== "designer" && expanded && (
        <div id={contentId} className="grid gap-4 border-t-2 border-[#24252b] bg-[#dfe2d3] p-4 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-end">
          <AuditCardField label="Client" value={task.requester?.name ?? "-"} />
          <AuditCardField label="Designer" value={assignedDesigner?.name ?? "-"} />
          <div>
            <p className="mb-1 text-[8px] font-black uppercase tracking-[0.14em] text-[#666961]">Status</p>
            <StatusBadge status={task.status} />
          </div>
          <AuditCardField label="Deadline" value={formatOddsDate(task.deadline, true)} />
          <Link href={`/odds/detail?id=${task.id}`} className="inline-flex h-10 items-center justify-center gap-2 border-2 border-[#24252b] bg-[#ba0dcb] px-4 text-[9px] font-black uppercase tracking-[0.1em] text-white shadow-[2px_2px_0_#24252b] transition hover:-translate-y-0.5 hover:brightness-90 hover:shadow-[3px_3px_0_#24252b] active:translate-y-0.5 active:shadow-none">
            Detail <MaterialIcon name="arrow_forward" size="sm" />
          </Link>
        </div>
      )}
    </article>
  );
}

function DesignerActionButtons() {
  const actions = [
    { icon: "play_arrow", label: "Play", primary: true },
    { icon: "chat", label: "Action 2" },
    { icon: "flag", label: "Action 3" },
    { icon: "visibility", label: "Action 4" },
    { icon: "more_horiz", label: "Action 5" },
  ];

  return (
    <span className="flex flex-nowrap gap-2">
      {actions.map((action) => (
        <button key={action.label} type="button" aria-label={action.label} className={`flex size-8 items-center justify-center border-2 border-[#24252b] shadow-[2px_2px_0_#777a72] transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#24252b] active:translate-y-0.5 active:shadow-none ${action.primary ? "bg-[#ba0dcb] text-white" : "bg-[#c9ccc0] text-[#24252b] hover:bg-white"}`}>
          <MaterialIcon name={action.icon} size="sm" />
        </button>
      ))}
    </span>
  );
}

function DeadlineCountdown({ deadline }: { deadline?: string | null }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const target = deadline ? new Date(deadline).getTime() : Number.NaN;
  const remaining = target - now;
  const valid = Number.isFinite(target);
  const overdue = valid && remaining <= 0;
  const days = valid && !overdue ? Math.floor(remaining / 86_400_000) : 0;
  const hours = valid && !overdue ? Math.floor((remaining % 86_400_000) / 3_600_000) : 0;
  const minutes = valid && !overdue ? Math.floor((remaining % 3_600_000) / 60_000) : 0;
  const urgent = valid && !overdue && remaining <= 86_400_000;

  return (
    <span className="block min-w-0">
      <span className="block text-[8px] font-black uppercase tracking-[0.14em] text-[#666961]">Countdown</span>
      <span className={`mt-1 block whitespace-nowrap text-xs font-black uppercase ${overdue || urgent ? "text-[#ba0dcb]" : "text-[#24252b]"}`}>
        {!valid ? "--" : overdue ? "Overdue" : `${days}D ${String(hours).padStart(2, "0")}H ${String(minutes).padStart(2, "0")}M`}
      </span>
    </span>
  );
}

function AuditCardField({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#666961]">{label}</p>
      <p className="mt-1 truncate text-xs font-bold" title={value}>{value}</p>
    </div>
  );
}

function DataTable({
  loading,
  empty,
  headers,
  rows,
  className = "",
  scrollClassName = "overflow-x-auto",
}: {
  loading: boolean;
  empty: string;
  headers: string[];
  rows: Array<Array<React.ReactNode>>;
  className?: string;
  scrollClassName?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-lg border border-cu-border ${className}`}>
      <div className={scrollClassName}>
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-cu-border bg-cu-panel-soft text-xs uppercase tracking-wide text-cu-muted">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-3 py-3">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cu-border">
            {loading ? (
              <tr>
                <td className="px-3 py-8 text-center text-cu-muted" colSpan={headers.length}>Memuat...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-3 py-8 text-center text-cu-muted" colSpan={headers.length}>{empty}</td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="align-top hover:bg-cu-panel-soft/60">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="max-w-72 px-3 py-3 text-cu-muted">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LIGHT THEME — All Tasks Section
// Clean modern card layout, blue accent
// ─────────────────────────────────────────────

const LIGHT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:         { label: "Pending",       color: "bg-amber-50 text-amber-700 border-amber-200" },
  in_progress:     { label: "In Progress",   color: "bg-blue-50 text-blue-700 border-blue-200" },
  submitted:       { label: "Submitted",     color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  spv_review:      { label: "Review Leader Creative",    color: "bg-violet-50 text-violet-700 border-violet-200" },
  client_review:   { label: "Menunggu Review Client", color: "bg-purple-50 text-purple-700 border-purple-200" },
  revision:        { label: "Revision",      color: "bg-orange-50 text-orange-700 border-orange-200" },
  done:            { label: "Done",          color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled:       { label: "Cancelled",     color: "bg-slate-100 text-slate-500 border-slate-200" },
};

const DARK_STATUS_MAP: Record<string, { label: string; dot: string }> = {
  pending:       { label: "Pending",       dot: "bg-amber-400" },
  in_progress:   { label: "In Progress",   dot: "bg-[#B0FF5E]" },
  submitted:     { label: "Submitted",     dot: "bg-sky-400" },
  spv_review:    { label: "Review Leader Creative",    dot: "bg-violet-400" },
  client_review: { label: "Menunggu Review Client", dot: "bg-purple-400" },
  revision:      { label: "Revision",      dot: "bg-orange-400" },
  done:          { label: "Done",          dot: "bg-emerald-400" },
  cancelled:     { label: "Cancelled",     dot: "bg-white/20" },
};

function LightStatusChip({ status }: { status: string }) {
  const map = LIGHT_STATUS_MAP[status] ?? { label: status, color: "bg-slate-100 text-slate-500 border-slate-200" };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${map.color}`}>
      {map.label}
    </span>
  );
}

function LightTaskRow({ task }: { task: OddsTask }) {
  const [open, setOpen] = useState(false);
  const assignedDesigner = task.assigned_designer ?? task.assignedDesigner;
  const target = task.deadline ? new Date(task.deadline).getTime() : Number.NaN;
  const remaining = target - Date.now();
  const overdue = Number.isFinite(target) && remaining <= 0;
  const daysLeft = !overdue && Number.isFinite(target) ? Math.floor(remaining / 86_400_000) : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <span className="flex-none rounded-xl bg-[#00A4FF]/10 px-2.5 py-1 font-mono text-[10px] font-bold text-[#00A4FF]">
          {task.task_number ?? "#"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800" title={task.design_purpose}>
            {task.design_purpose}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400">{task.category?.name ?? "–"}</span>
            {assignedDesigner && (
              <>
                <span className="text-slate-200">·</span>
                <span className="text-[11px] text-slate-400">{assignedDesigner.name}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-none items-center gap-3">
          <LightStatusChip status={task.status} />
          {daysLeft !== null && (
            <span className={`hidden rounded-full px-2 py-0.5 text-[10px] font-semibold sm:block ${daysLeft <= 1 ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-400"}`}>
              {daysLeft}d left
            </span>
          )}
          {overdue && (
            <span className="hidden rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-500 sm:block">Overdue</span>
          )}
          <span className={`flex size-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}>
            <MaterialIcon name="keyboard_arrow_down" size="sm" />
          </span>
        </div>
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-slate-50 bg-slate-50/60 px-5 py-4 sm:grid-cols-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Client</p>
            <p className="mt-0.5 text-xs font-medium text-slate-700">{task.requester?.name ?? "–"}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Designer</p>
            <p className="mt-0.5 text-xs font-medium text-slate-700">{assignedDesigner?.name ?? "–"}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Deadline</p>
            <p className="mt-0.5 text-xs font-medium text-slate-700">{formatOddsDate(task.deadline, true)}</p>
          </div>
          <div className="flex items-end">
            <Link
              href={`/odds/detail?id=${task.id}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-[#00A4FF] px-3 text-[11px] font-semibold text-white transition hover:bg-[#0090E7]"
            >
              Detail <MaterialIcon name="arrow_forward" size="sm" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function LightAllTasksSection({ loading, tasks }: { loading: boolean; tasks: OddsTask[] }) {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#00A4FF]/10 text-[#00A4FF]">
            <MaterialIcon name="assignment" size="sm" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Live Monitor</p>
            <h2 className="text-base font-extrabold text-slate-900">All Tasks</h2>
          </div>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold text-slate-400 shadow-sm">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="odds-scroll-hidden flex-1 min-h-0 overflow-y-auto px-6 py-5">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <MaterialIcon name="autorenew" size="lg" className="animate-spin" />
              <p className="text-xs font-medium">Memuat data...</p>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16 text-center">
            <MaterialIcon name="assignment" size="lg" className="text-slate-300" />
            <p className="text-sm text-slate-400">Belum ada task ODDS.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => <LightTaskRow key={task.id} task={task} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DARK THEME — All Tasks Section
// Glassmorphism, green accent (#B0FF5E), dense rows
// ─────────────────────────────────────────────

function DarkStatusDot({ status }: { status: string }) {
  const map = DARK_STATUS_MAP[status] ?? { label: status, dot: "bg-white/20" };
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-1.5 rounded-full ${map.dot}`} />
      <span className="text-[10px] font-semibold text-white/50">{map.label}</span>
    </span>
  );
}

function DarkTaskRow({ task }: { task: OddsTask }) {
  const [open, setOpen] = useState(false);
  const assignedDesigner = task.assigned_designer ?? task.assignedDesigner;
  const target = task.deadline ? new Date(task.deadline).getTime() : Number.NaN;
  const remaining = target - Date.now();
  const overdue = Number.isFinite(target) && remaining <= 0;
  const daysLeft = !overdue && Number.isFinite(target) ? Math.floor(remaining / 86_400_000) : null;
  const urgent = daysLeft !== null && daysLeft <= 1;

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition hover:border-white/10 hover:bg-white/[0.05]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-4 py-3.5 text-left"
      >
        <span className="flex-none font-mono text-[10px] font-bold text-white/20">
          {task.task_number ?? "#"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white/80" title={task.design_purpose}>
            {task.design_purpose}
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <DarkStatusDot status={task.status} />
            {task.category && (
              <>
                <span className="text-white/10">·</span>
                <span className="text-[10px] text-white/30">{task.category.name}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-none items-center gap-3">
          {daysLeft !== null && (
            <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${urgent ? "bg-red-500/15 text-red-400" : "bg-white/5 text-white/25"}`}>
              {daysLeft}D
            </span>
          )}
          {overdue && <span className="rounded bg-red-500/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-red-400">OVR</span>}
          <span className={`flex size-7 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-white/30 transition-transform ${open ? "rotate-180" : ""}`}>
            <MaterialIcon name="keyboard_arrow_down" size="sm" />
          </span>
        </div>
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-4 border-t border-white/5 bg-white/[0.02] px-4 py-4 sm:grid-cols-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#B0FF5E]/40">Client</p>
            <p className="mt-1 text-xs font-medium text-white/60">{task.requester?.name ?? "–"}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#B0FF5E]/40">Designer</p>
            <p className="mt-1 text-xs font-medium text-white/60">{assignedDesigner?.name ?? "–"}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#B0FF5E]/40">Deadline</p>
            <p className="mt-1 text-xs font-medium text-white/60">{formatOddsDate(task.deadline, true)}</p>
          </div>
          <div className="flex items-end">
            <Link
              href={`/odds/detail?id=${task.id}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#B0FF5E]/20 bg-[#B0FF5E]/10 px-3 text-[11px] font-semibold text-[#B0FF5E] transition hover:bg-[#B0FF5E]/20"
            >
              Detail <MaterialIcon name="arrow_forward" size="sm" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function DarkAllTasksSection({ loading, tasks }: { loading: boolean; tasks: OddsTask[] }) {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-col">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#B0FF5E]/10 text-[#B0FF5E]">
            <MaterialIcon name="assignment" size="sm" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B0FF5E]/50">Audit Mode · Live</p>
            <h2 className="text-base font-extrabold text-white">All Tasks</h2>
          </div>
        </div>
        <span className="rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1 font-mono text-[10px] font-bold text-white/25">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="odds-scroll-hidden flex-1 min-h-0 overflow-y-auto px-6 py-5">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3 text-white/20">
              <MaterialIcon name="autorenew" size="lg" className="animate-spin" />
              <p className="text-xs font-medium">Syncing data...</p>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/5 py-16 text-center">
            <MaterialIcon name="assignment" size="lg" className="text-white/10" />
            <p className="text-sm text-white/20">Belum ada task ODDS.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => <DarkTaskRow key={task.id} task={task} />)}
          </div>
        )}
      </div>
    </div>
  );
}
