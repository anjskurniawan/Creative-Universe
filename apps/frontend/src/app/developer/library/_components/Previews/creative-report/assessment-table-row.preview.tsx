"use client";

import { useState } from "react";
import { AssessmentTableRow } from "@/app/creative-report/performa/_components/AssessmentTable/AssessmentTableRow/AssessmentTableRow";
import { DEFAULT_COLLAB_ASPECTS, DEFAULT_PERF_ASPECTS } from "@/features/creative-report/settings";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";

const scoreMaxima = [
  ...DEFAULT_COLLAB_ASPECTS.map((aspect) => aspect.maxPoints),
  ...DEFAULT_PERF_ASPECTS.map((aspect) => aspect.maxPoints),
];

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

const rows = [
  {
    item: {
      id: 101,
      creative_scores: [5, 6, 5, 6, 5, 9, 8, 9, 10, 9],
      status: "draft",
      user: { id: 1, name: "Rian Setiawan", avatar_path: null, position: "Frontend Engineer", division: "Creative Tech", card_image_path: null },
      hrd_review: { leave: 0, app_permission: 1, absence: 0, late: 1 },
    },
    draft: { creative_scores: [5, 6, 5, 6, 5, 9, 8, 9, 10, 9], leave: 0, appPermission: 1, absence: 0, late: 1 },
  },
  {
    item: {
      id: 102,
      creative_scores: [3, 4, 4, 3, 4, 7, 6, 7, 6, 7],
      status: "completed",
      user: { id: 2, name: "Maya Pratama", avatar_path: null, position: "Product Designer", division: "Creative Tech", card_image_path: null },
      hrd_review: { leave: 1, app_permission: 0, absence: 1, late: 2 },
    },
    draft: { creative_scores: [3, 4, 4, 3, 4, 7, 6, 7, 6, 7], leave: 1, appPermission: 0, absence: 1, late: 2 },
  },
];

export function AssessmentTableRowPreview() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <PreviewWrapper width="full">
      <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full table-fixed border-collapse text-left">
          <tbody>
            {rows.map((row, rowIndex) => (
              <AssessmentTableRow
                key={row.item.id}
                item={row.item}
                rowIndex={rowIndex}
                month="2026-08"
                draft={row.draft}
                inputMode={false}
                scoreMaxima={scoreMaxima}
                headers={headers}
                hovered={hoveredId === row.item.id}
                onHover={setHoveredId}
                updateDraft={() => {}}
                addDate={() => {}}
                setActiveDateAction={() => {}}
              />
            ))}
          </tbody>
        </table>
      </div>
    </PreviewWrapper>
  );
}
