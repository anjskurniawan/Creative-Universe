import { AssessmentTableAvatar } from "@/components/creative-report/assessment-table-avatar";
import { PreviewWrapper } from "../preview-wrapper";

export function AssessmentTableAvatarPreview() {
  return (
    <PreviewWrapper width="sm">
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <AssessmentTableAvatar name="Rian Setiawan" imagePath={null} />
        <AssessmentTableAvatar name="Maya Pratama" imagePath={null} />
        <span className="text-xs text-slate-500">Fallback initials</span>
      </div>
    </PreviewWrapper>
  );
}
