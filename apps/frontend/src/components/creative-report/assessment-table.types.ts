import type { CreativeReportGroup } from "@/features/creative-report/types";

export type Draft = {
  creative_scores: number[];
  leave: number;
  appPermission: number;
  absence: number;
  late: number;
  hrd_review_history?: {
    leave_dates?: string[];
    app_permission_dates?: string[];
    absence_dates?: string[];
    late_dates?: string[];
  };
};

export type AssessmentTableProps = {
  group: CreativeReportGroup;
  onChanged: () => Promise<void>;
  canEdit: boolean;
  month: string;
};

export type AssessmentHeader = { name: string; max: number | null };
