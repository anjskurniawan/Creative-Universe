import type { CreativeReportGroup } from "@/features/creative-report/types";


export function AssessmentTableActions({ group, inputMode, saving, saveError, onBeginInput, onSave }: { group: CreativeReportGroup; inputMode: boolean; saving: boolean; saveError: string | null; onBeginInput: () => void; onSave: (complete: boolean) => void }) {
  return (
    <tfoot>
      <tr className="bg-[#fbfcfd]">
        <td colSpan={20} className="border-t border-[#dbe4e8] px-4 py-3">
          <div className="flex items-center justify-end gap-2">
            {inputMode ? (
              <>
                <button type="button" disabled={saving} onClick={() => onSave(false)} className="h-9 rounded-lg border border-[#dbe4e8] bg-white px-3 text-xs font-semibold text-[#525e61] disabled:opacity-50 cursor-pointer hover:bg-slate-50 transition">Simpan draft</button>
                <button type="button" disabled={saving} onClick={() => onSave(true)} className="h-9 rounded-lg bg-[#6d46eb] px-3 text-xs font-semibold text-white disabled:opacity-50 cursor-pointer hover:bg-[#5b37d6] transition">Selesaikan penilaian</button>
              </>
            ) : (
              <button type="button" onClick={onBeginInput} className="h-9 rounded-lg bg-[#6d46eb] px-3 text-xs font-semibold text-white cursor-pointer hover:bg-[#5b37d6] transition">
                {group.assessments.every((item) => item.status === "completed") ? "Edit penilaian" : "Input nilai"}
              </button>
            )}
          </div>
        </td>
      </tr>
      {saveError && <tr><td colSpan={20} className="bg-[#ffedf1] px-4 py-3 text-right text-xs text-[#b4234d]">{saveError}</td></tr>}
    </tfoot>
  );
}
