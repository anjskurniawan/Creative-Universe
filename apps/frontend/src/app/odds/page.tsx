"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/material-icon";
import { ScheduleConfig } from "@/features/odds/components/schedule-config";
import { OddsGameboyFrame } from "@/components/odds/odds-gameboy-frame";
import { stripRichText } from "@/components/odds-rich-text-editor";
import { OddsDesignerTaskRowCard } from "@/components/odds-designer-task-row-card";
import { useAuth } from "@/providers/auth-provider";
import { useOddsTheme } from "./odds-theme-context";
import {
  OddsAssignableUser,
  OddsCategory,
  OddsDailyReport,
  OddsDesignerProfile,
  OddsRanking,
  OddsReportSummary,
  OddsTask,
  OddsTaskCancelRequest,
  OddsTaskSkipRequest,
  OddsTaskRevision,
  OddsSystemRule,
  createOddsCategory,
  createOddsDesignerProfile,
  createOddsSystemRule,
  deleteOddsCategory,
  deleteOddsDesignerProfile,
  deleteOddsSystemRule,
  getOddsAssignableUsers,
  getOddsConfigCategories,
  getOddsConfigDesignerProfiles,
  getOddsDailyReports,
  getOddsRankings,
  getOddsReportSummary,
  getOddsSystemRules,
  getOddsTasks,
  formatOddsDate,
  oddsError,
  reviewOddsCancelRequest,
  reviewOddsQueueSkip,
  reviewOddsExtraRevision,
  reviewOddsUrgentRevision,
  statusLabel,
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
  | "designer_all_tasks"
  | "designer_review"
  | "designer_revisions"
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
    label: "Review SPV",
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
      if (["designer_all_tasks", "designer_review", "designer_revisions", "designer_report", "designer_settings"].includes(section.id)) return canViewAssignedTasks && !canUseControl;
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
      spv_review: "dalam review SPV",
      client_review: "menunggu ACC Anda",
      revision: "dalam revisi",
      submitted: "telah di-submit",
      done: "telah selesai",
      cancelled: "dibatalkan",
      cancelled_by_spv: "dibatalkan oleh SPV",
    };

    return (
      <div className="flex flex-col gap-5 p-4">
        {/* Header */}
        <header>
          <h1 className={`text-4xl font-medium leading-none tracking-[-0.72px] ${theme === "dark" ? "text-[#f1f1f1]" : theme === "retro" ? "text-[#24252b]" : "text-[#181818]"}`}>
            Dashboard
          </h1>
        </header>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Main layout: left = metrics + categories, right = 5 last requests */}
        {!canViewAssignedTasks ? (
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
        ) : (
          /* Designer: plain 4 metrics */
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <MiniMetric icon="pending_actions" label="Aktif" value={taskMetrics.active} />
            <MiniMetric icon="assignment" label="Submit" value={taskMetrics.submitted} />
            <MiniMetric icon="rate_review" label="Review" value={taskMetrics.review} />
            <MiniMetric icon="task_alt" label="Done" value={taskMetrics.done} />
          </div>
        )}

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
    );
  }

  if (effectiveActiveSection === "all_tasks") {
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

  return (
    <div className="flex flex-col gap-6 p-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-cu-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {canShowConfigSections ? "Konfigurasi ODDS" : "Review ODDS"}
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">Role aktif: {user?.roles.join(", ") || "-"}</p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => void loadConfig()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#d4d4d8] bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <MaterialIcon name="refresh" size="sm" />
            Refresh
          </button>
        </div>
      </header>

      {(error || notice) && (
        <div
          className={`rounded-xl border px-4 py-3 text-xs font-medium ${
            error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || notice}
        </div>
      )}

      <div className="min-w-0">
          <div className="mb-4 rounded-lg border border-cu-border bg-white px-4 py-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-cu-muted">Area aktif</p>
                <h2 className="mt-1 text-lg font-semibold text-cu-ink">{activeSectionMeta?.label ?? "ODDS"}</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-cu-muted">
                {activeSectionMeta && <MaterialIcon name={activeSectionMeta.icon} size="sm" className="text-cu-info" />}
                <span>{activeSectionMeta?.description ?? "Monitoring ODDS."}</span>
              </div>
            </div>
          </div>
      {effectiveActiveSection === "categories" && (
      <section className="grid gap-6 xl:grid-cols-[minmax(18rem,22rem)_minmax(0,1fr)]">
        <ConfigPanel title={categoryForm.id ? "Edit Kategori" : "Tambah Kategori"} icon="category">
          <form onSubmit={submitCategory} className="space-y-3">
            <TextField
              label="Nama kategori"
              value={categoryForm.name}
              required
              help="Nama jenis pekerjaan yang akan dipilih client saat membuat request."
              onChange={(value) => setCategoryForm((prev) => ({ ...prev, name: value }))}
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

        <ConfigPanel title="Kategori ODDS" icon="view_list">
          <DataTable
            loading={loading}
            empty="Belum ada kategori."
            headers={["Nama", "Bobot", "Revisi", "SLA", "Status", ""]}
            rows={categories.map((category) => [
              category.name,
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
            ])}
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
              <div className="grid max-h-40 gap-2 overflow-auto rounded-lg border border-cu-border p-2">
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

      {effectiveActiveSection === "spv_review" && (
        <ConfigPanel title="Menunggu Review SPV" icon="rate_review">
          <p className="mb-4 text-sm text-cu-muted">
            Output yang sudah dikirim desainer. Buka detail untuk ACC ke client atau minta revisi leader.
          </p>
          <TaskOperationsTable
            loading={loading}
            empty="Belum ada output yang menunggu review SPV."
            tasks={spvReviewTasks}
          />
        </ConfigPanel>
      )}

      {effectiveActiveSection === "client_review" && (
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

      {effectiveActiveSection === "special_revisions" && (
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

      {effectiveActiveSection === "cancel_requests" && (
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

      {effectiveActiveSection === "skip_requests" && (
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

      {effectiveActiveSection === "designer_all_tasks" && (
        <ConfigPanel title="Semua Tugas" icon="assignment">
          <DataTable
            loading={loading}
            empty="Belum ada riwayat tugas."
            headers={["No", "Task", "Kategori", "Deadline", "Status"]}
            rows={tasks.filter(t => String(t.assigned_designer?.id ?? t.assignedDesigner?.id) === String(user?.id)).map((task) => [
              task.task_number ?? "-",
              task.design_purpose,
              task.category_snapshot?.name ?? "-",
              formatOddsDate(task.deadline),
              <StatusBadge key={`badge-${task.id}`} status={task.status} />
            ])}
          />
        </ConfigPanel>
      )}

      {effectiveActiveSection === "designer_review" && (
        <ConfigPanel title="Menunggu Review" icon="pending_actions">
          <DataTable
            loading={loading}
            empty="Tidak ada tugas dalam review."
            headers={["No", "Task", "Status"]}
            rows={tasks.filter(t => String(t.assigned_designer?.id ?? t.assignedDesigner?.id) === String(user?.id) && ["spv_review", "client_review"].includes(t.status)).map((task) => [
              task.task_number ?? "-",
              task.design_purpose,
              <StatusBadge key={`badge-${task.id}`} status={task.status} />
            ])}
          />
        </ConfigPanel>
      )}

      {effectiveActiveSection === "designer_revisions" && (
        <ConfigPanel title="Revisi" icon="error">
          <DataTable
            loading={loading}
            empty="Tidak ada revisi aktif."
            headers={["No", "Task", "Tipe Revisi", "Status"]}
            rows={tasks.filter(t => String(t.assigned_designer?.id ?? t.assignedDesigner?.id) === String(user?.id) && t.status === "revision").map((task) => [
              task.task_number ?? "-",
              task.design_purpose,
              "Revisi",
              <StatusBadge key={`badge-${task.id}`} status={task.status} />
            ])}
          />
        </ConfigPanel>
      )}

      {effectiveActiveSection === "designer_report" && (
        <div className="space-y-6">
          <ConfigPanel title="Laporan Kinerja Pribadi" icon="monitoring">
            <DataTable
              loading={loading}
              empty="Belum ada data kinerja."
              headers={["Tanggal", "Output", "Revisi", "Overdue", "Quality", "Score"]}
              rows={dailyReports.filter(r => String(r.designer?.id ?? r.designer_id) === String(user?.id)).map((report) => [
                formatOddsDate(report.report_date),
                report.output_done ? "Ya" : "Tidak",
                String(report.revision_count),
                report.overdue ? "Ya" : "Tidak",
                report.quality_issue_flag ? "Ya" : "Tidak",
                String(report.score),
              ])}
            />
          </ConfigPanel>
        </div>
      )}

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

      {effectiveActiveSection === "client_all_requests" && (
        <ConfigPanel title="Semua Request" icon="assignment">
          <DataTable
            loading={loading}
            empty="Belum ada riwayat request."
            headers={["No", "Task", "Kategori", "Deadline", "Status"]}
            rows={tasks.map((task) => [
              task.task_number ?? "-",
              task.design_purpose,
              task.category_snapshot?.name ?? "-",
              formatOddsDate(task.deadline),
              <StatusBadge key={`badge-${task.id}`} status={task.status} />
            ])}
          />
        </ConfigPanel>
      )}

      {effectiveActiveSection === "client_action_required" && (
        <ConfigPanel title="Perlu Review Klien" icon="pending_actions">
          <DataTable
            loading={loading}
            empty="Tidak ada tugas yang menunggu ACC/Feedback Anda saat ini."
            headers={["No", "Task", "Status"]}
            rows={tasks.filter(t => t.status === "client_review").map((task) => [
              task.task_number ?? "-",
              task.design_purpose,
              <StatusBadge key={`badge-${task.id}`} status={task.status} />
            ])}
          />
        </ConfigPanel>
      )}

      {effectiveActiveSection === "client_in_progress" && (
        <ConfigPanel title="Sedang Diproses" icon="autorenew">
          <DataTable
            loading={loading}
            empty="Tidak ada tugas yang sedang diproses."
            headers={["No", "Task", "Status", "Designer"]}
            rows={tasks.filter(t => ["queued", "in_progress", "spv_review", "revision"].includes(t.status)).map((task) => [
              task.task_number ?? "-",
              task.design_purpose,
              <StatusBadge key={`badge-${task.id}`} status={task.status} />,
              task.assigned_designer?.name ?? task.assignedDesigner?.name ?? "-"
            ])}
          />
        </ConfigPanel>
      )}

      {effectiveActiveSection === "client_archive" && (
        <ConfigPanel title="Arsip (Selesai/Batal)" icon="archive">
          <DataTable
            loading={loading}
            empty="Belum ada tugas di arsip."
            headers={["No", "Task", "Status", "Desainer"]}
            rows={tasks.filter(t => ["done", "cancelled", "cancelled_by_spv", "revision_rejected_by_spv"].includes(t.status)).map((task) => [
              task.task_number ?? "-",
              task.design_purpose,
              <StatusBadge key={`badge-${task.id}`} status={task.status} />,
              task.assigned_designer?.name ?? task.assignedDesigner?.name ?? "-"
            ])}
          />
        </ConfigPanel>
      )}

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

function ConfigPanel({ title, icon, children, retroHeader = false }: { title: string; icon: string; children: React.ReactNode; retroHeader?: boolean }) {
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

  return (
    <section className="rounded-lg border border-cu-border bg-white p-4">
      <div className="mb-4 flex items-center gap-2">
        <MaterialIcon name={icon} size="sm" className="text-cu-info" />
        <h2 className="text-base font-semibold text-cu-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
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
    <div className="retro-scrollbar h-full min-h-0 space-y-8 overflow-y-auto overscroll-contain pr-2">
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
}: {
  loading: boolean;
  empty: string;
  headers: string[];
  rows: Array<Array<React.ReactNode>>;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-cu-border">
      <div className="overflow-x-auto">
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
  spv_review:      { label: "SPV Review",    color: "bg-violet-50 text-violet-700 border-violet-200" },
  client_review:   { label: "Client Review", color: "bg-purple-50 text-purple-700 border-purple-200" },
  revision:        { label: "Revision",      color: "bg-orange-50 text-orange-700 border-orange-200" },
  done:            { label: "Done",          color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled:       { label: "Cancelled",     color: "bg-slate-100 text-slate-500 border-slate-200" },
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
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#e2e8f0_transparent] px-6 py-5">
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

const DARK_STATUS_MAP: Record<string, { label: string; dot: string }> = {
  pending:       { label: "Pending",       dot: "bg-amber-400" },
  in_progress:   { label: "In Progress",   dot: "bg-[#B0FF5E]" },
  submitted:     { label: "Submitted",     dot: "bg-sky-400" },
  spv_review:    { label: "SPV Review",    dot: "bg-violet-400" },
  client_review: { label: "Client Review", dot: "bg-purple-400" },
  revision:      { label: "Revision",      dot: "bg-orange-400" },
  done:          { label: "Done",          dot: "bg-emerald-400" },
  cancelled:     { label: "Cancelled",     dot: "bg-white/20" },
};

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
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.08)_transparent] px-6 py-5">
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
