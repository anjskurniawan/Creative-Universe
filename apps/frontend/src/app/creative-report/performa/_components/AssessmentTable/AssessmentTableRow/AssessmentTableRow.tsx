import Link from "next/link";
import type React from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import PopupPerson from "./PopupPerson/PopupPerson";
import type { HrdDateKey, ActiveDateAction } from "../../HrdDateModal/HrdDateModal";
import type { Draft, AssessmentHeader } from "../AssessmentTable.types";
import { calculateHrdScore } from "../AssessmentTable.utils";
import { AssessmentTableAvatar } from "../AssessmentTableAvatar/AssessmentTableAvatar";
import { AssessmentTableCell } from "../AssessmentTableCell/AssessmentTableCell";

type Assessment = { id: number; creative_scores: number[]; status: string; user: { id: number; name: string; avatar_path?: string | null; position?: string | null; division?: string | null; card_image_path?: string | null }; hrd_review: { leave: number; app_permission: number; absence: number; late: number } };

export function AssessmentTableRow({ item, rowIndex, month, draft, inputMode, scoreMaxima, headers, hovered, onHover, updateDraft, addDate, setActiveDateAction, draggable, onDragStart, onDragOver, onDrop }: { item: Assessment; rowIndex: number; month: string; draft: Draft; inputMode: boolean; scoreMaxima: number[]; headers: AssessmentHeader[]; hovered: boolean; onHover: (id: number | null) => void; updateDraft: (id: number, field: "score", value: string, scoreIndex?: number) => void; addDate: (id: number, key: HrdDateKey, dateStr: string) => void; setActiveDateAction: (action: ActiveDateAction) => void; draggable?: boolean; onDragStart?: () => void; onDragOver?: (event: React.DragEvent<HTMLTableRowElement>) => void; onDrop?: () => void }) {
  const score30 = draft.creative_scores.slice(0, 5).reduce((a, b) => a + b, 0);
  const score50 = draft.creative_scores.slice(5, 10).reduce((a, b) => a + b, 0);
  const hrd = calculateHrdScore(draft.absence, draft.late);
  const finalScore = score30 + score50 + hrd;
  const cells = [...draft.creative_scores.slice(0, 5), score30, ...draft.creative_scores.slice(5), score50, draft.leave, draft.appPermission, draft.absence, draft.late, hrd];
  return (
    <tr draggable={draggable} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} className={finalScore < 75 ? "cursor-grab bg-[#ffedf1] hover:bg-[#fff0f3]" : "cursor-grab bg-white hover:bg-[#fbfcfd]"}>
      <td className="border-r border-[#e5edf0] px-0.5 py-2 text-center text-[10px] text-[#7b868a]">{rowIndex + 1}</td>
      <td className="border-r border-[#e5edf0] px-1 py-2">
        <div className="relative" onMouseEnter={() => onHover(item.id)} onMouseLeave={() => onHover(null)}>
          <Link href={`/creative-report/summary?user=${item.user.id}&month=${month}`} className="flex min-w-0 items-center gap-1 rounded-md outline-none hover:text-[#6d46eb] focus-visible:ring-2 focus-visible:ring-[#6d46eb]">
            {draggable && <MaterialIcon name="drag_indicator" size="sm" className="shrink-0 text-[#a7afb2]" title="Geser untuk mengubah urutan" />}
            <AssessmentTableAvatar name={item.user.name} imagePath={item.user.avatar_path} /><span className="truncate font-semibold">{item.user.name}</span>
          </Link>
          {hovered && <div className="absolute bottom-full left-0 z-50 mb-2 hidden w-[300px] lg:block"><PopupPerson name={item.user.name} role={item.user.position ?? "Creative"} division={item.user.division} cardImagePath={item.user.card_image_path} /></div>}
        </div>
      </td>
      {cells.map((value, index) => <AssessmentTableCell key={index} value={value} index={index} finalScore={finalScore} inputMode={inputMode} draft={draft} assessmentId={item.id} scoreMaxima={scoreMaxima} headers={headers} updateDraft={updateDraft} addDate={addDate} setActiveDateAction={setActiveDateAction} />)}
      <td className={`border-b px-0.5 py-2 text-center text-[10px] font-bold ${finalScore < 75 ? "border-[#f2cbd3] bg-[#fbd5dc] text-[#b4234d]" : "border-[#edf1f3] bg-[#f4f1ff] text-[#5d35d9]"}`}>{finalScore}</td>
    </tr>
  );
}
