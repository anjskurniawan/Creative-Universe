"use client";

import { useState } from "react";
import { HrdDateModal, type ActiveDateAction } from "@/components/creative-report/hrd-date-modal";
import { formatDateShort } from "@/components/creative-report/assessment-table.utils";
import { PreviewWrapper } from "../preview-wrapper";

const ASSESSMENT_ID = 1;
const HRD_KEY = "late" as const;
const INITIAL_DATES = ["2026-08-04", "2026-08-12", "2026-08-21"];

export function HrdDateModalPreview() {
  const [dates, setDates] = useState<string[]>(INITIAL_DATES);
  const [activeDateAction, setActiveDateAction] = useState<ActiveDateAction | null>(null);

  return (
    <PreviewWrapper width="md">
      <div className="w-full rounded-xl border border-slate-100 bg-white p-5">
        <p className="mb-1 text-[11px] font-bold text-slate-600">Riwayat Telat</p>
        <p className="mb-3 text-[11px] text-slate-400">Klik tanggal untuk membuka modal.</p>

        {dates.length > 0 ? (
          <div className="space-y-1">
            {dates.map((dateStr, index) => (
              <button
                key={dateStr}
                type="button"
                onClick={() =>
                  setActiveDateAction({ assessmentId: ASSESSMENT_ID, key: HRD_KEY, index, dateStr })
                }
                className="w-full rounded border border-[#c9bbfc] bg-[#ede9fe] px-1 py-0.5 text-[10px] font-medium text-[#6d46eb] transition hover:bg-[#6d46eb] hover:text-white cursor-pointer"
              >
                {formatDateShort(dateStr)}
              </button>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setDates(INITIAL_DATES)}
            className="w-full rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-200 cursor-pointer"
          >
            Pulihkan tanggal fixture
          </button>
        )}

        <HrdDateModal
          activeDateAction={activeDateAction}
          formatDateShort={formatDateShort}
          onUpdateDate={(_assessmentId, _key, index, newDateStr) =>
            setDates((prev) => prev.map((dateStr, i) => (i === index ? newDateStr : dateStr)))
          }
          onDeleteDate={(_assessmentId, _key, index) =>
            setDates((prev) => prev.filter((_, i) => i !== index))
          }
          onClose={() => setActiveDateAction(null)}
        />
      </div>
    </PreviewWrapper>
  );
}
