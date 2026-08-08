import { AssessmentTable } from "@/components/creative-report/assessment-table";
import { DEFAULT_SETTINGS } from "@/app/creative-report/settings";
import type { CreativeReportGroup } from "@/features/creative-report/types";
import { PreviewWrapper } from "../preview-wrapper";

const groupFixture: CreativeReportGroup = {
  id: 1,
  name: "Creative Technology",
  staff_count: 2,
  assessments: [
    { id: 101, status: "draft", period: "2026-08", group: { id: 1, name: "Creative Technology" }, user: { id: 1, name: "Rian Setiawan", avatar_path: null, card_image_path: null, position: "Frontend Engineer", division: "Creative Tech" }, creative_scores: [5, 6, 5, 6, 5, 9, 8, 9, 10, 9], hrd_review: { leave: 0, app_permission: 1, absence: 0, late: 1, score: 18, history: { app_permission_dates: ["2026-08-04"] } }, totals: { score_30: 27, score_50: 45, final: 90 } },
    { id: 102, status: "completed", period: "2026-08", group: { id: 1, name: "Creative Technology" }, user: { id: 2, name: "Maya Pratama", avatar_path: null, card_image_path: null, position: "Product Designer", division: "Creative Tech" }, creative_scores: [3, 4, 4, 3, 4, 7, 6, 7, 6, 7], hrd_review: { leave: 1, app_permission: 0, absence: 1, late: 2, score: 15 }, totals: { score_30: 18, score_50: 33, final: 66 } },
  ],
};

export function AssessmentTablePreview() {
  return (
    <PreviewWrapper width="full">
      <AssessmentTable group={groupFixture} canEdit={false} month="2026-08" onChanged={async () => {}} settingsOverride={DEFAULT_SETTINGS} />
    </PreviewWrapper>
  );
}
