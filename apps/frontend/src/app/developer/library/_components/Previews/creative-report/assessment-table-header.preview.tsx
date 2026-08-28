import { AssessmentTableHeader } from "@/app/creative-report/performa/_components/AssessmentTable/AssessmentTableHeader/AssessmentTableHeader";
import { DEFAULT_COLLAB_ASPECTS, DEFAULT_PERF_ASPECTS, DEFAULT_ASPECT_GROUP_TITLES } from "@/features/creative-report/settings";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";

const headers = [
  ...DEFAULT_COLLAB_ASPECTS.map((aspect) => ({ name: aspect.name, max: aspect.maxPoints })),
  { name: "Total nilai", max: null },
  ...DEFAULT_PERF_ASPECTS.map((aspect) => ({ name: aspect.name, max: aspect.maxPoints })),
  { name: "Total nilai", max: null },
  { name: "Cuti", max: null },
  { name: "Izin App", max: null },
  { name: "Bolos", max: null },
  { name: "Telat", max: null },
  { name: "Total nilai", max: null },
];

export function AssessmentTableHeaderPreview() {
  return (
    <PreviewWrapper width="full">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full table-fixed border-collapse text-left">
          <AssessmentTableHeader groupTitles={DEFAULT_ASPECT_GROUP_TITLES} headers={headers} />
        </table>
      </div>
    </PreviewWrapper>
  );
}
