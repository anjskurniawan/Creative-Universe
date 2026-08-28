import { AssessmentTableActions } from "@/app/creative-report/performa/_components/AssessmentTable/AssessmentTableActions/AssessmentTableActions";
import type { CreativeReportGroup } from "@/features/creative-report/types";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";

const groupFixture = { assessments: [{ status: "draft" }] } as CreativeReportGroup;

export function AssessmentTableActionsPreview() {
  return (
    <PreviewWrapper width="full">
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full table-fixed border-collapse">
          <AssessmentTableActions group={groupFixture} inputMode saving={false} saveError={null} onBeginInput={() => {}} onSave={() => {}} />
        </table>
      </div>
    </PreviewWrapper>
  );
}
