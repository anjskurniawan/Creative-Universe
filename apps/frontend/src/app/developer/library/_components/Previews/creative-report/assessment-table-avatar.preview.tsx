import { AssessmentTableAvatar } from "@/app/creative-report/performa/_components/AssessmentTable/AssessmentTableAvatar/AssessmentTableAvatar";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";

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
