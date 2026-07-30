import { MaterialIcon } from "@/components/ui/material-icon";
import type { OddsCategory } from "@/features/odds/api";
import type { OddsRequestForm, RequestBuilderTheme } from "../types";

export function BriefImportantMatrixStep({
  form,
  selectedCategory,
  theme,
}: {
  form: OddsRequestForm;
  selectedCategory: OddsCategory | undefined;
  theme: RequestBuilderTheme;
}) {
  const { textMuted, textTitle } = theme;

  const matrixKey = (selectedCategory?.important_matrix || form.important_matrix || "Q4").toUpperCase();
  const quadranInfo = 
    matrixKey === "Q1" ? { code: "Q1", label: "Quadran I", desc: "Mendesak & Penting (Priority Utama Tim)", color: "text-red-500 border-red-500/40 bg-red-500/10", icon: "flash_on" } :
    matrixKey === "Q2" ? { code: "Q2", label: "Quadran II", desc: "Penting (Dikerjakan Lebih Awal)", color: "text-orange-500 border-orange-500/40 bg-orange-500/10", icon: "priority_high" } :
    matrixKey === "Q3" ? { code: "Q3", label: "Quadran III", desc: "Mendesak (Tugas Rutin Harian)", color: "text-blue-500 border-blue-500/40 bg-blue-500/10", icon: "schedule" } :
    { code: "Q4", label: "Quadran IV", desc: "Normal / Standar (Tugas Opsional)", color: "text-slate-400 border-slate-500/40 bg-slate-500/10", icon: "assignment" };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center space-y-5 p-2">
      <div className="text-center sm:text-left">
        <h3 className={`text-lg font-semibold ${textTitle}`}>Important Matrix Kategori</h3>
        <p className={`text-xs ${textMuted} mt-1`}>
          Berdasarkan Important Matrix Kategori, tugas <b className="font-bold text-[#00A4FF]">{selectedCategory?.name || "yang dipilih"}</b> berada pada:
        </p>
      </div>
      
      <div className={`p-6 rounded-2xl border-2 flex items-center justify-between ${quadranInfo.color}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black">{quadranInfo.label} ({quadranInfo.code})</span>
          </div>
          <p className="text-xs opacity-90 font-medium">{quadranInfo.desc}</p>
        </div>
        <MaterialIcon name={quadranInfo.icon} size="auto" className="text-3xl shrink-0 opacity-80" />
      </div>
      
      <p className={`text-[11px] text-center sm:text-left italic ${textMuted}`}>
        * Anda tidak perlu memilih skala prioritas secara manual. Klik tombol "Lanjutkan" untuk melanjutkan ke tenggat waktu.
      </p>
    </div>
  );
}

