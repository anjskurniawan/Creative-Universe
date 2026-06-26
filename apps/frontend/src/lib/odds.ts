import { ApiError, ValidationError, apiFetch } from "./api";

export interface OddsPagination<T> {
  data: T[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

export interface OddsUser {
  id: number;
  name: string;
  email?: string;
  username?: string;
}

export interface OddsCategory {
  id: number;
  name: string;
  score_weight: string | number;
  normal_revision_limit: number;
  workload_point: number;
  sla_days: number;
  is_active: boolean;
}

export interface OddsDesignerProfile {
  id: number;
  user_id: number;
  status: "available" | "semi_off" | "off";
  specializations: Array<number | string> | null;
  daily_capacity_points: number;
  max_active_tasks: number;
  assignment_priority: number;
  is_active: boolean;
  user?: OddsUser;
}

export interface OddsSystemRule {
  id: number;
  key: string;
  value: Record<string, unknown>;
  description: string | null;
  is_active: boolean;
}

export interface OddsAssignableUser extends OddsUser {
  roles: string[];
}

export interface OddsQueueEntry {
  id: number;
  task_id: number;
  designer_id: number;
  queue_status: string;
  task_type: string;
  priority_score: string | number;
  estimated_start_at: string | null;
  estimated_finish_at: string | null;
  task?: OddsTask;
  designer?: OddsUser;
}

export interface OddsTaskBrief {
  id: number;
  content: string;
  reference_visual: string | null;
  last_return_note: string | null;
  ai_summary: string | null;
}

export interface OddsTaskResult {
  id: number;
  version_number: number;
  submitted_by: number;
  result_notes: string | null;
  status: string;
  submitted_at: string;
  asset_links?: Array<{ id: number; label: string; url: string; provider: string }>;
}

export interface OddsTaskRevision {
  id: number;
  task_id: number;
  result_id?: number | null;
  requested_by?: number;
  assigned_to?: number | null;
  revision_type: "normal" | "extra" | "urgent_final" | "leader";
  notes: string;
  status: string;
  is_urgent_final: boolean;
  approved_by?: number | null;
  approved_at?: string | null;
  task?: OddsTask;
}

export interface OddsTaskCancelRequest {
  id: number;
  task_id: number;
  requested_by: number;
  reason: string;
  status: string;
  reviewed_by: number | null;
  reviewed_at: string | null;
  review_note: string | null;
  task?: OddsTask;
}

export interface OddsTaskTimeLog {
  id: number;
  task_id: number;
  designer_id: number | null;
  log_type: "work" | "revision" | string;
  started_at: string;
  stopped_at: string | null;
  duration_seconds: number;
  notes: string | null;
}

export interface OddsTask {
  id: number;
  task_number: string;
  request_type: "design" | "video";
  design_purpose: string;
  brief_text: string;
  reference_visual: string | null;
  deadline: string;
  important_matrix: string;
  status: string;
  task_type: string;
  workload_point: number;
  priority_score: string | number;
  brief_return_count: number;
  leader_revision_count: number;
  quality_issue_flag?: boolean;
  quality_issue_note?: string | null;
  extra_revision_used_at?: string | null;
  urgent_revision_used_at?: string | null;
  normal_revision_count: number;
  created_at: string;
  category?: OddsCategory;
  requester?: OddsUser;
  preferred_designer?: OddsUser;
  preferredDesigner?: OddsUser;
  assigned_designer?: OddsUser;
  assignedDesigner?: OddsUser;
  current_queue?: OddsQueueEntry;
  currentQueue?: OddsQueueEntry;
  brief?: OddsTaskBrief;
  results?: OddsTaskResult[];
  revisions?: OddsTaskRevision[];
  cancel_requests?: OddsTaskCancelRequest[];
  cancelRequests?: OddsTaskCancelRequest[];
  time_logs?: OddsTaskTimeLog[];
  timeLogs?: OddsTaskTimeLog[];
}

export interface OddsDailyReport {
  id: number;
  report_date: string;
  designer_id: number;
  output_done: boolean;
  revision_count: number;
  overdue: boolean;
  quality_issue_flag?: boolean;
  rating: number | null;
  final_status: string;
  score: string | number;
  designer?: OddsUser;
}

export interface OddsReportSummary {
  from: string;
  to: string;
  total_output: number;
  total_score: number;
  overdue_count: number;
  quality_issue_count?: number;
  average_rating: number;
  revision_count: number;
  ai_insight: string;
}

export interface OddsRanking {
  id: number;
  period_type: string;
  period_start: string;
  period_end: string;
  designer_id: number;
  total_output: number;
  total_score: string | number;
  average_rating: string | number | null;
  designer?: OddsUser;
}

export interface CreateOddsTaskInput {
  request_type: "design" | "video";
  category_id: number;
  preferred_designer_id: number;
  design_purpose: string;
  brief_text: string;
  reference_visual?: string;
  deadline?: string;
  important_matrix?: string;
  attachment_notes?: string;
}

export interface SubmitResultInput {
  result_notes?: string;
  assets?: Array<{
    provider?: "google_drive" | "dropbox" | "onedrive" | "youtube" | "other";
    label: string;
    url: string;
  }>;
}

function normalizePage<T>(payload: OddsPagination<T> | T[]): OddsPagination<T> {
  return Array.isArray(payload) ? { data: payload } : payload;
}

export function oddsError(error: unknown): string {
  if (error instanceof ValidationError) {
    return Object.values(error.errors).flat()[0] || "Data ODDS belum valid.";
  }

  return error instanceof ApiError
    ? error.message
    : "Terjadi kesalahan saat memproses ODDS.";
}

export function formatOddsDate(value: string | null | undefined, includeTime = false): string {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(value));
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, " ");
}

export async function getOddsCategories(): Promise<OddsCategory[]> {
  const page = await apiFetch<OddsPagination<OddsCategory>>("/odds/categories?active=1&per_page=100");
  return normalizePage(page).data;
}

export async function getOddsConfigCategories(): Promise<OddsCategory[]> {
  const page = await apiFetch<OddsPagination<OddsCategory>>("/odds/categories?per_page=100");
  return normalizePage(page).data;
}

export async function getOddsDesignerProfiles(): Promise<OddsDesignerProfile[]> {
  const page = await apiFetch<OddsPagination<OddsDesignerProfile>>("/odds/designer-profiles?active=1&per_page=100");
  return normalizePage(page).data;
}

export async function getOddsConfigDesignerProfiles(): Promise<OddsDesignerProfile[]> {
  const page = await apiFetch<OddsPagination<OddsDesignerProfile>>("/odds/designer-profiles?per_page=100");
  return normalizePage(page).data;
}

export async function getOddsSystemRules(): Promise<OddsSystemRule[]> {
  const page = await apiFetch<OddsPagination<OddsSystemRule>>("/odds/system-rules?per_page=100");
  return normalizePage(page).data;
}

export async function getOddsAssignableUsers(): Promise<OddsAssignableUser[]> {
  const [designers, videographers] = await Promise.all([
    apiFetch<OddsPagination<OddsAssignableUser>>("/users?role=Designer&per_page=50"),
    apiFetch<OddsPagination<OddsAssignableUser>>("/users?role=Videographer&per_page=50"),
  ]);

  const users = [...normalizePage(designers).data, ...normalizePage(videographers).data];
  return Array.from(new Map(users.map((user) => [user.id, user])).values());
}

export async function createOddsCategory(input: {
  name: string;
  score_weight: number;
  normal_revision_limit: number;
  workload_point: number;
  sla_days: number;
}): Promise<OddsCategory> {
  return apiFetch<OddsCategory>("/odds/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateOddsCategory(
  id: string | number,
  input: Partial<{
    name: string;
    score_weight: number;
    normal_revision_limit: number;
    workload_point: number;
    sla_days: number;
    is_active: boolean;
  }>
): Promise<OddsCategory> {
  return apiFetch<OddsCategory>(`/odds/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteOddsCategory(id: string | number): Promise<void> {
  await apiFetch<null>(`/odds/categories/${id}`, { method: "DELETE" });
}

export async function createOddsDesignerProfile(input: {
  user_id: number;
  status: "available" | "semi_off" | "off";
  specializations?: Array<number | string>;
  daily_capacity_points: number;
  max_active_tasks: number;
  assignment_priority?: number;
  is_active?: boolean;
}): Promise<OddsDesignerProfile> {
  return apiFetch<OddsDesignerProfile>("/odds/designer-profiles", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateOddsDesignerProfile(
  id: string | number,
  input: Partial<{
    user_id: number;
    status: "available" | "semi_off" | "off";
    specializations: Array<number | string>;
    daily_capacity_points: number;
    max_active_tasks: number;
    assignment_priority: number;
    is_active: boolean;
  }>
): Promise<OddsDesignerProfile> {
  return apiFetch<OddsDesignerProfile>(`/odds/designer-profiles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteOddsDesignerProfile(id: string | number): Promise<void> {
  await apiFetch<null>(`/odds/designer-profiles/${id}`, { method: "DELETE" });
}

export async function createOddsSystemRule(input: {
  key: string;
  value: Record<string, unknown>;
  description?: string;
  is_active?: boolean;
}): Promise<OddsSystemRule> {
  return apiFetch<OddsSystemRule>("/odds/system-rules", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateOddsSystemRule(
  id: string | number,
  input: Partial<{
    key: string;
    value: Record<string, unknown>;
    description: string;
    is_active: boolean;
  }>
): Promise<OddsSystemRule> {
  return apiFetch<OddsSystemRule>(`/odds/system-rules/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteOddsSystemRule(id: string | number): Promise<void> {
  await apiFetch<null>(`/odds/system-rules/${id}`, { method: "DELETE" });
}

export async function getOddsTasks(): Promise<OddsPagination<OddsTask>> {
  return normalizePage(await apiFetch<OddsPagination<OddsTask>>("/odds/tasks?per_page=50"));
}

export async function getOddsTask(id: string | number): Promise<OddsTask> {
  return apiFetch<OddsTask>(`/odds/tasks/${id}`);
}

export async function createOddsTask(input: CreateOddsTaskInput): Promise<OddsTask> {
  return apiFetch<OddsTask>("/odds/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateOddsBrief(id: string | number, brief_text: string): Promise<OddsTask> {
  return apiFetch<OddsTask>(`/odds/tasks/${id}/brief`, {
    method: "PATCH",
    body: JSON.stringify({ brief_text }),
  });
}

export async function returnOddsBrief(id: string | number, note: string): Promise<OddsTask> {
  return apiFetch<OddsTask>(`/odds/tasks/${id}/brief/return`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });
}

export async function acceptOddsBrief(id: string | number): Promise<OddsTask> {
  return apiFetch<OddsTask>(`/odds/tasks/${id}/brief/accept`, {
    method: "POST",
  });
}

export async function forceContinueOddsTask(id: string | number): Promise<OddsTask> {
  return apiFetch<OddsTask>(`/odds/tasks/${id}/brief/force-continue`, {
    method: "POST",
  });
}

export async function cancelOddsBrief(id: string | number, reason: string): Promise<OddsTask> {
  return apiFetch<OddsTask>(`/odds/tasks/${id}/brief/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function getOddsQueue(): Promise<OddsQueueEntry[]> {
  const page = await apiFetch<OddsPagination<OddsQueueEntry>>("/odds/queue?per_page=50");
  return normalizePage(page).data;
}

export async function getOddsNextQueue(): Promise<OddsQueueEntry | null> {
  return apiFetch<OddsQueueEntry | null>("/odds/queue/next");
}

export async function startOddsTask(id: string | number): Promise<OddsTask> {
  return apiFetch<OddsTask>(`/odds/tasks/${id}/start`, { method: "POST" });
}

export async function submitOddsResult(id: string | number, input: SubmitResultInput): Promise<OddsTaskResult> {
  return apiFetch<OddsTaskResult>(`/odds/tasks/${id}/results`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function spvReviewOddsTask(
  id: string | number,
  decision: "approved" | "revision",
  notes?: string
): Promise<OddsTask> {
  return apiFetch<OddsTask>(`/odds/tasks/${id}/spv-review`, {
    method: "POST",
    body: JSON.stringify({ decision, notes }),
  });
}

export async function clientReviewOddsTask(
  id: string | number,
  decision: "approved" | "revision",
  notes?: string,
  revision_type?: "normal" | "extra" | "urgent_final"
): Promise<OddsTask> {
  return apiFetch<OddsTask>(`/odds/tasks/${id}/client-review`, {
    method: "POST",
    body: JSON.stringify({ decision, notes, revision_type }),
  });
}

export async function rateOddsTask(id: string | number, rating: number, feedback?: string): Promise<OddsTask> {
  return apiFetch<OddsTask>(`/odds/tasks/${id}/rating`, {
    method: "POST",
    body: JSON.stringify({ rating, feedback }),
  });
}

export async function requestOddsRevision(
  id: string | number,
  notes: string,
  revision_type?: "normal" | "extra" | "urgent_final" | "leader"
): Promise<OddsTaskRevision> {
  return apiFetch<OddsTaskRevision>(`/odds/tasks/${id}/revisions`, {
    method: "POST",
    body: JSON.stringify({ notes, revision_type }),
  });
}

export async function requestOddsCancel(id: string | number, reason: string): Promise<unknown> {
  return apiFetch<unknown>(`/odds/tasks/${id}/cancel-requests`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function reviewOddsExtraRevision(
  id: string | number,
  decision: "approved" | "rejected",
  note?: string
): Promise<OddsTaskRevision> {
  return apiFetch<OddsTaskRevision>(`/odds/revisions/${id}/extra-review`, {
    method: "POST",
    body: JSON.stringify({ decision, note }),
  });
}

export async function reviewOddsUrgentRevision(
  id: string | number,
  decision: "approved" | "rejected",
  note?: string
): Promise<OddsTaskRevision> {
  return apiFetch<OddsTaskRevision>(`/odds/revisions/${id}/urgent-review`, {
    method: "POST",
    body: JSON.stringify({ decision, note }),
  });
}

export async function reviewOddsCancelRequest(
  id: string | number,
  decision: "approved" | "rejected",
  note?: string
): Promise<OddsTaskCancelRequest> {
  return apiFetch<OddsTaskCancelRequest>(`/odds/cancel-requests/${id}/review`, {
    method: "POST",
    body: JSON.stringify({ decision, note }),
  });
}

export async function getOddsDailyReports(): Promise<OddsDailyReport[]> {
  const page = await apiFetch<OddsPagination<OddsDailyReport>>("/odds/reports/daily?per_page=20");
  return normalizePage(page).data;
}

export async function getOddsReportSummary(): Promise<OddsReportSummary> {
  return apiFetch<OddsReportSummary>("/odds/reports/summary");
}

export async function getOddsRankings(periodType: "daily" | "monthly" | "yearly" = "daily"): Promise<OddsRanking[]> {
  const page = await apiFetch<OddsPagination<OddsRanking>>(`/odds/rankings?period_type=${periodType}&per_page=10`);
  return normalizePage(page).data;
}
