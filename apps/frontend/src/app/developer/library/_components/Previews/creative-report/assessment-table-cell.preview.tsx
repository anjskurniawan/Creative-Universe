import { AssessmentTableCell } from "@/app/creative-report/performa/_components/AssessmentTable/AssessmentTableCell/AssessmentTableCell";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";

const draft = {
  creative_scores: [5, 6, 5, 6, 5, 9, 8, 9, 10, 9],
  leave: 1,
  appPermission: 0,
  absence: 0,
  late: 1,
  hrd_review_history: { leave_dates: ["2026-08-04"] },
};

const headers = [{ name: "Komunikasi Aktif", max: 6 }, ...Array.from({ length: 16 }, (_, index) => ({ name: `Kolom ${index + 2}`, max: null }))];

export function AssessmentTableCellPreview() {
  return (
    <PreviewWrapper width="sm">
      <table className="w-full table-fixed border-collapse rounded-xl border border-slate-200 bg-white">
        <tbody>
          <tr>
            <AssessmentTableCell value={5} index={0} finalScore={90} inputMode draft={draft} assessmentId={101} scoreMaxima={[6, 6, 6, 6, 6, 10, 10, 10, 10, 10]} headers={headers} updateDraft={() => {}} addDate={() => {}} setActiveDateAction={() => {}} />
            <AssessmentTableCell value={1} index={12} finalScore={90} inputMode draft={draft} assessmentId={101} scoreMaxima={[6, 6, 6, 6, 6, 10, 10, 10, 10, 10]} headers={headers} updateDraft={() => {}} addDate={() => {}} setActiveDateAction={() => {}} />
          </tr>
        </tbody>
      </table>
    </PreviewWrapper>
  );
}
