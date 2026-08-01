export type CreativeReportStatus = "draft" | "completed";

export interface CreativeReportUser {
  id: number;
  name: string;
  avatar_path: string | null;
  card_image_path: string | null;
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
  hrd_review: {
    leave: number;
    app_permission: number;
    absence: number;
    late: number;
    score: number;
    history?: {
      leave_dates?: string[];
      app_permission_dates?: string[];
      absence_dates?: string[];
      late_dates?: string[];
    };
  };
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
  notice?: string | null;
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
  leave_count?: number;
  app_permission_count?: number;
  absence_count?: number;
  late_count?: number;
  hrd_review_history?: {
    leave_dates?: string[];
    app_permission_dates?: string[];
    absence_dates?: string[];
    late_dates?: string[];
  };
}

export interface CreativeMember {
  id: number;
  user_id?: number | null;
  name: string;
  position_name: "Manajer" | "SPV" | "Designer" | "Videographer" | "Content Creator";
  status: "pending" | "active" | "resigned";
}

export interface CreativeMemberProfile extends CreativeMember {
  email?: string | null;
  whatsapp_number?: string | null;
  roles?: string[];
  joined_at: string | null;
  resigned_at: string | null;
  card_image_path: string | null;
  specialties?: string[];
  profile_metrics: Record<string, number>;
  odds_profile: { id: number; status: "available" | "off"; specializations: Array<number | string> } | null;
  odds_metrics?: { avg_response_minutes: number | null; on_time_rate: number | null; user_rating: number | null; rating_count: number; capacity_percent: number | null; average_score: number | null };
}

export interface HistoricalCreativeMemberInput {
  name: string;
  position_name: "SPV" | "Designer" | "Videographer" | "Content Creator";
  start_month: string;
  end_month: string;
}
