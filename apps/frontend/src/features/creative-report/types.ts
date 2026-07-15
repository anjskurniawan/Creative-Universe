export type CreativeReportStatus = "draft" | "completed";

export interface CreativeReportUser {
  id: number;
  name: string;
  avatar_path: string | null;
  position: string | null;
  division: string | null;
}

export interface CreativeReportAssessment {
  id: number;
  status: CreativeReportStatus;
  period: string;
  group: { id: number; name: string };
  user: CreativeReportUser;
  creative_scores: number[];
  hrd_review: { leave: number; absence: number; late: number; score: number };
  totals: { score_30: number; score_50: number; final: number };
}

export interface CreativeReportGroup {
  id: number;
  name: string;
  staff_count: number;
  assessments: CreativeReportAssessment[];
}

export interface CreativeReportIndex {
  month: string;
  groups: CreativeReportGroup[];
}

export interface CreativeReportUserDetail extends CreativeReportAssessment {
  available_months: string[];
}

export interface CreativeReportFilters {
  month: string;
  jobdesk?: string;
  search?: string;
}

export interface CreativeReportUpdateInput {
  creative_scores: number[];
  leave_count: number;
  absence_count: number;
  late_count: number;
}
