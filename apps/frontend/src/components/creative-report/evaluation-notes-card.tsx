import React from "react";

export interface EvaluationNotesCardProps {
  monthLabel: string;
}

export function EvaluationNotesCard({ monthLabel }: EvaluationNotesCardProps) {
  return (
    <article className="rounded-2xl border border-[#e8edf0] bg-white p-5">
      <h2 className="font-semibold text-[#6d46eb]">Catatan Evaluasi</h2>
      <p className="mt-4 text-sm leading-6 text-[#525e61]">
        Report individual ini merangkum collaborative review, performance review, dan HRD
        review pada periode {monthLabel}.
      </p>
    </article>
  );
}
