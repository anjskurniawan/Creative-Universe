import { MaterialIcon } from "@/components/ui/material-icon";
import type { HrdDateKey, ActiveDateAction } from "./hrd-date-modal";
import type { Draft, AssessmentHeader } from "./assessment-table.types";
import { formatDateShort } from "./assessment-table.utils";

type AssessmentTableCellProps = {
  value: number;
  index: number;
  finalScore: number;
  inputMode: boolean;
  draft: Draft;
  assessmentId: number;
  scoreMaxima: number[];
  headers: AssessmentHeader[];
  updateDraft: (id: number, field: "score", value: string, scoreIndex?: number) => void;
  addDate: (id: number, key: HrdDateKey, dateStr: string) => void;
  setActiveDateAction: (action: ActiveDateAction) => void;
};

export function AssessmentTableCell({ value, index, finalScore, inputMode, draft, assessmentId, scoreMaxima, headers, updateDraft, addDate, setActiveDateAction }: AssessmentTableCellProps) {
  const editableScore = index < 5 || (index >= 6 && index < 11);
  const editableHrd = index >= 12 && index < 16;
  const scoreIndex = index < 5 ? index : index - 1;
  const hrdKey = (["leave", "appPermission", "absence", "late"] as const)[index - 12];
  const history = draft.hrd_review_history ?? {};
  const dateKey = hrdKey === "appPermission" ? "app_permission_dates" : `${hrdKey}_dates` as const;
  const dates = history[dateKey] ?? [];

  return (
    <td className={`border-b px-0.5 py-2 text-center text-[10px] ${finalScore < 75 ? "border-[#f2cbd3] bg-[#ffedf1]" : `border-[#edf1f3] ${index >= 6 && index < 12 ? "bg-[#fffaf4]" : index >= 12 ? "bg-[#f6fcf7]" : ""}`} ${index === 5 || index === 11 || index === 16 ? "border-r border-[#d8e1e5] font-semibold" : ""}`}>
      {inputMode && editableScore ? (
        <input type="number" min={0} max={scoreMaxima[scoreIndex]} title={`Maksimal nilai: ${scoreMaxima[scoreIndex]}`} aria-label={`Nilai ${headers[index]?.name}, maksimal ${scoreMaxima[scoreIndex]}`} value={value} onChange={(event) => updateDraft(assessmentId, "score", event.target.value, scoreIndex)} className="h-7 w-9 [appearance:textfield] rounded-md border border-[#bdb0f5] bg-white text-center text-xs font-semibold outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
      ) : inputMode && editableHrd ? (
        <div className="flex flex-col items-center gap-1.5 py-1">
          <span className="text-xs font-bold text-slate-700">{value}</span>
          {dates.length > 0 && <div className="flex flex-col gap-1 w-full max-w-[70px] max-h-[80px] overflow-y-auto">
            {dates.map((dateStr, dIdx) => <button key={dIdx} type="button" onClick={() => setActiveDateAction({ assessmentId, key: hrdKey, index: dIdx, dateStr })} className="w-full text-[10px] py-0.5 px-1 bg-[#ede9fe] text-[#6d46eb] rounded border border-[#c9bbfc] hover:bg-[#6d46eb] hover:text-white transition font-medium cursor-pointer">{formatDateShort(dateStr)}</button>)}
          </div>}
          <button type="button" onClick={(event) => (event.currentTarget.querySelector('input[type="date"]') as HTMLInputElement | null)?.showPicker()} className="relative size-5 rounded-full border border-dashed border-[#9ed5a7] text-[#248235] hover:bg-[#e8f7ea] transition flex items-center justify-center cursor-pointer">
            <MaterialIcon name="add" size="auto" className="text-xs font-bold" />
            <input type="date" onChange={(event) => addDate(assessmentId, hrdKey, event.target.value)} className="absolute inset-0 z-10 w-full h-full opacity-0 pointer-events-none" tabIndex={-1} />
          </button>
        </div>
      ) : value}
    </td>
  );
}
