"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/material-icon";
import { OddsDesignerTaskRowCard } from "@/components/odds-designer-task-row-card";
import { useAuth } from "@/providers/auth-provider";
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
  workload_point: string;
  sla_days: string;
  is_active: boolean;
};

type DesignerForm = {
  id: number | null;
  user_id: string;
  status: "available" | "semi_off" | "off";
  specializations: string[];
  daily_capacity_points: string;
  max_active_tasks: string;
  assignment_priority: string;
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
  workload_point: "1",
  sla_days: "3",
  is_active: true,
};

const emptyDesignerForm: DesignerForm = {
  id: null,
  user_id: "",
  status: "available",
  specializations: [],
  daily_capacity_points: "8",
  max_active_tasks: "3",
  assignment_priority: "100",
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
  { value: "semi_off", label: "Semi OFF" },
  { value: "off", label: "OFF" },
] as const;

type ConfigSection =
  | "categories"
  | "designers"
  | "rules"
  | "spv_review"
  | "client_review"
  | "special_revisions"
  | "cancel_requests"
  | "skip_requests"
  | "reports"
  | "rankings"
  | "all_tasks";

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
      if (["categories", "designers", "rules"].includes(section.id)) return canShowConfigSections;
      if (section.id === "spv_review") return canReviewSpv;
      if (section.id === "client_review") return canReviewSpv || canViewAllTasks;
      if (section.id === "special_revisions") return canApproveExtra || canApproveUrgent;
      if (section.id === "cancel_requests") return canManageEscalations;
      if (section.id === "skip_requests") return canReviewQueueSkip;
      if (section.id === "reports") return canViewReports;
      if (section.id === "rankings") return canViewRankings;
      return canViewAllTasks || canReviewSpv;
    });
  }, [canApproveExtra, canApproveUrgent, canManageEscalations, canReviewQueueSkip, canReviewSpv, canShowConfigSections, canViewAllTasks, canViewRankings, canViewReports]);

  const searchParams = useSearchParams();
  const activeSectionParam = searchParams.get("section") as ConfigSection | null;
  const activeSection = useMemo(() => {
    if (activeSectionParam && visibleConfigSections.some((s) => s.id === activeSectionParam)) {
      return activeSectionParam;
    }
    return canShowConfigSections ? "categories" : "spv_review";
  }, [activeSectionParam, canShowConfigSections, visibleConfigSections]);

  const effectiveActiveSection = useMemo(() => {
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
    if (!canUseControl) {
      setLoading(false);
      return;
    }

    if (!silent) setLoading(true);
    setError(null);
    try {
      const taskPagePromise = getOddsTasks();
      const reportPromise = canViewReports ? Promise.all([getOddsDailyReports(), getOddsReportSummary()]) : Promise.resolve<[OddsDailyReport[], OddsReportSummary | null]>([[], null]);
      const rankingPromise = canViewRankings ? getOddsRankings(rankingPeriod) : Promise.resolve<OddsRanking[]>([]);

      if (!canShowConfigSections) {
        const [taskPage, [reportList, summary], rankingList] = await Promise.all([taskPagePromise, reportPromise, rankingPromise]);
        setTasks(taskPage.data);
        setDailyReports(reportList);
        setReportSummary(summary);
        setRankings(rankingList);
        return;
      }

      const [categoryList, profileList, ruleList, userList, taskPage, [reportList, summary], rankingList] = await Promise.all([
        getOddsConfigCategories(),
        getOddsConfigDesignerProfiles(),
        getOddsSystemRules(),
        getOddsAssignableUsers(),
        taskPagePromise,
        reportPromise,
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

  const loadWorkspace = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const taskPage = await getOddsTasks();
      setTasks(taskPage.data);
    } catch (err) {
      setError(oddsError(err));
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (canUseControl) {
        void loadConfig();
      } else {
        void loadWorkspace();
      }
    }, 0);
    const interval = window.setInterval(() => {
      if (canUseControl) {
        void loadConfig(true);
      } else {
        void loadWorkspace(true);
      }
    }, 10000);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, [canUseControl, loadConfig, loadWorkspace]);

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
      workload_point: Number(categoryForm.workload_point),
      sla_days: Number(categoryForm.sla_days),
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
      daily_capacity_points: Number(designerForm.daily_capacity_points),
      max_active_tasks: Number(designerForm.max_active_tasks),
      assignment_priority: Number(designerForm.assignment_priority),
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
      workload_point: String(category.workload_point),
      sla_days: String(category.sla_days),
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
      status: profile.status,
      specializations: visibleSpecializations,
      daily_capacity_points: String(profile.daily_capacity_points),
      max_active_tasks: String(profile.max_active_tasks),
      assignment_priority: String(profile.assignment_priority),
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

  if (!canUseControl) {
    return (
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-cu-border pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {canViewAssignedTasks ? "Workspace Designer" : "Request Saya"}
            </h1>
            <p className="mt-1 text-xs text-slate-500 font-medium">Role aktif: {user?.roles.join(", ") || "-"}</p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => void loadWorkspace()}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#d4d4d8] bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <MaterialIcon name="refresh" size="sm" />
              Refresh
            </button>
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MiniMetric icon="pending_actions" label="Aktif" value={taskMetrics.active} />
          <MiniMetric icon="assignment" label="Submit" value={taskMetrics.submitted} />
          <MiniMetric icon="rate_review" label="Review" value={taskMetrics.review} />
          <MiniMetric icon="task_alt" label="Done" value={taskMetrics.done} />
        </div>

        <section className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {canViewAssignedTasks ? "Tugas Hari Ini" : "Daftar Request"}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 font-medium">
              {canViewAssignedTasks
                ? "Task yang masuk ke assignment designer."
                : "Request ODDS yang pernah kamu buat."}
            </p>
          </div>
          {canViewAssignedTasks ? (
            loading ? (
              <div className="rounded-lg border border-dashed border-cu-border px-4 py-8 text-center text-sm text-cu-muted">
                Memuat task designer...
              </div>
            ) : tasks.length > 0 ? (
              <div className="mt-2 flex flex-col gap-4">
                {tasks.map((task) => (
                  <OddsDesignerTaskRowCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-cu-border px-4 py-8 text-center text-sm text-cu-muted">
                Belum ada task ditugaskan.
              </div>
            )
          ) : (
            <DataTable
              loading={loading}
              empty={canCreateTask ? "Belum ada request. Klik Request Baru di sidebar untuk membuat permintaan." : "Belum ada task ditugaskan."}
              headers={["Task", "Kategori", "Designer", "Status", "Deadline", ""]}
              rows={tasks.map((task) => {
                const assignedDesigner = task.assigned_designer ?? task.assignedDesigner;

                return [
                  <div key={`task-title-${task.id}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-800 text-sm">{task.design_purpose}</p>
                      <TaskTypePill taskType={task.task_type} />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 font-mono font-medium">{task.task_number}</p>
                  </div>,
                  task.category?.name ?? "-",
                  assignedDesigner?.name ?? "-",
                  <StatusBadge key={`status-${task.id}`} status={task.status} />,
                  formatOddsDate(task.deadline, true),
                  <Link
                    key={`open-${task.id}`}
                    href={`/odds/detail?id=${task.id}`}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-[#e4e4e7] bg-white text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
                    aria-label="Buka detail task"
                  >
                    <MaterialIcon name="open_in_new" size="sm" />
                  </Link>,
                ];
              })}
            />
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
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
                label="Workload point"
                value={categoryForm.workload_point}
                help="Estimasi beban kerja task. Angka ini mengurangi daily capacity point desainer."
                onChange={(value) => setCategoryForm((prev) => ({ ...prev, workload_point: value }))}
              />
              <NumberField
                label="SLA hari"
                value={categoryForm.sla_days}
                help="Deadline default dalam hari jika client tidak mengisi deadline khusus."
                onChange={(value) => setCategoryForm((prev) => ({ ...prev, sla_days: value }))}
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
            headers={["Nama", "Bobot", "Revisi", "Workload Point", "SLA", "Status", ""]}
            rows={categories.map((category) => [
              category.name,
              String(category.score_weight),
              String(category.normal_revision_limit),
              String(category.workload_point),
              `${category.sla_days} hari`,
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
              <FieldHelp>Available bisa menerima task, Semi OFF bisa menerima task terbatas, OFF disembunyikan dari pilihan client.</FieldHelp>
            </label>
            <div className="rounded-lg border border-cu-border bg-cu-panel-soft px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-cu-muted">Makna status</p>
              <p className="mt-1 text-sm text-cu-ink">
                Status mengatur ketersediaan harian desainer. Checklist Aktif di bawah mengatur apakah profil ini dipakai sistem assignment.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <NumberField
                label="Daily capacity"
                value={designerForm.daily_capacity_points}
                help="Total workload point yang sanggup dikerjakan desainer per hari."
                onChange={(value) => setDesignerForm((prev) => ({ ...prev, daily_capacity_points: value }))}
              />
              <NumberField
                label="Max active"
                value={designerForm.max_active_tasks}
                help="Batas jumlah task yang boleh berjalan bersamaan untuk desainer ini."
                onChange={(value) => setDesignerForm((prev) => ({ ...prev, max_active_tasks: value }))}
              />
              <NumberField
                label="Priority"
                value={designerForm.assignment_priority}
                help="Urutan preferensi assignment. Angka lebih kecil diprioritaskan."
                onChange={(value) => setDesignerForm((prev) => ({ ...prev, assignment_priority: value }))}
              />
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
                {categories.length === 0 && <p className="px-1 py-2 text-sm text-cu-muted">Kategori belum tersedia.</p>}
              </div>
            </div>
            <CheckField
              label="Profil aktif untuk assignment"
              help="Jika nonaktif, profil tidak dipakai untuk assignment dan pilihan designer client."
              checked={designerForm.is_active}
              onChange={(value) => setDesignerForm((prev) => ({ ...prev, is_active: value }))}
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
            headers={["User", "Status", "Profil Aktif", "Spesialisasi", "Daily Capacity", "Max Active", "Priority", ""]}
            rows={designerProfiles.map((profile) => [
              profile.user?.name ?? `User #${profile.user_id}`,
              profile.status.replace("_", " "),
              profile.is_active ? "Ya" : "Tidak",
              (profile.specializations ?? []).length > 0
                ? (profile.specializations ?? []).map((id) => categoryNameById.get(String(id)) ?? `#${id}`).join(", ")
                : "Semua kategori",
              String(profile.daily_capacity_points),
              String(profile.max_active_tasks),
              String(profile.assignment_priority),
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

      {effectiveActiveSection === "all_tasks" && (
        <ConfigPanel title="Monitoring Semua Task" icon="assignment">
          <p className="mb-4 text-sm text-cu-muted">
            Ringkasan task ODDS aktif dan selesai untuk pengecekan alur.
          </p>
          <TaskOperationsTable
            loading={loading}
            empty="Belum ada task ODDS."
            tasks={tasks}
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

function ConfigPanel({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
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
  return (
    <div className="rounded-lg border border-cu-border bg-cu-panel-soft px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-cu-muted">{label}</span>
        <MaterialIcon name={icon} size="xs" className="text-cu-info" />
      </div>
      <p className="mt-1 text-lg font-semibold text-cu-ink">{value}</p>
    </div>
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
