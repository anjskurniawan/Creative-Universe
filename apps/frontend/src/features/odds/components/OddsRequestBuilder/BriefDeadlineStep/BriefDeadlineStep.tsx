import type { OddsCategory } from "@/features/odds/api";
import type { OddsRequestForm } from "@/features/odds/types";
import type { RequestBuilderTheme } from "../OddsRequestBuilder.types";

export function BriefDeadlineStep({
  form,
  update,
  selectedCategory,
  todayDate,
  tomorrowDate,
  threeDaysDate,
  theme,
}: {
  form: OddsRequestForm;
  update: (field: keyof OddsRequestForm, value: string) => void;
  selectedCategory: OddsCategory | undefined;
  todayDate: string;
  tomorrowDate: string;
  threeDaysDate: string;
  theme: RequestBuilderTheme;
}) {
  const { dark, textMuted, textTitle } = theme;
  const matrixKey = (selectedCategory?.important_matrix || form.important_matrix || "Q4").toUpperCase();
  const isQ1 = matrixKey === "Q1";
  const isQ2 = matrixKey === "Q2";
  const isQ3orQ4 = matrixKey === "Q3" || matrixKey === "Q4";

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center space-y-5 p-2">
      <div className="text-center sm:text-left">
        <h3 className={`text-lg font-semibold ${textTitle}`}>Tenggat Waktu / Deadline</h3>
        <p className={`text-xs ${textMuted} mt-1`}>Pilih tenggat waktu pengerjaan. Kami akan otomatis menjadwalkan jika dikosongkan.</p>
      </div>

      {isQ1 && (
        <div className="grid gap-3 grid-cols-3">
          <button
            type="button"
            onClick={() => update("deadline", todayDate)}
            className={`p-4 rounded-2xl border text-center transition-all ${
              form.deadline === todayDate
                ? dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
                : dark ? "bg-white/5 hover:bg-white/10" : "bg-[#F3FAFF] hover:bg-[#DFF6FF] border-[#BDEAFF]"
            }`}
          >
            <span className="block text-xs font-bold">Hari ini</span>
            <span className="text-[10px] opacity-75">{todayDate}</span>
          </button>
          <button
            type="button"
            onClick={() => update("deadline", tomorrowDate)}
            className={`p-4 rounded-2xl border text-center transition-all ${
              form.deadline === tomorrowDate
                ? dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
                : dark ? "bg-white/5 hover:bg-white/10" : "bg-[#F3FAFF] hover:bg-[#DFF6FF] border-[#BDEAFF]"
            }`}
          >
            <span className="block text-xs font-bold">Besok</span>
            <span className="text-[10px] opacity-75">{tomorrowDate}</span>
          </button>
          <button
            type="button"
            onClick={() => update("deadline", "")}
            className={`p-4 rounded-2xl border text-center transition-all ${
              form.deadline === ""
                ? dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
                : dark ? "bg-white/5 hover:bg-white/10" : "bg-[#F3FAFF] hover:bg-[#DFF6FF] border-[#BDEAFF]"
            }`}
          >
            <span className="block text-xs font-bold">Otomatis</span>
            <span className="text-[10px] opacity-75">Prioritas Tertinggi</span>
          </button>
        </div>
      )}

      {isQ2 && (
        <div className="grid gap-3 grid-cols-2">
          <button
            type="button"
            onClick={() => update("deadline", tomorrowDate)}
            className={`p-4 rounded-2xl border text-center transition-all ${
              form.deadline === tomorrowDate
                ? dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
                : dark ? "bg-white/5 hover:bg-white/10" : "bg-[#F3FAFF] hover:bg-[#DFF6FF] border-[#BDEAFF]"
            }`}
          >
            <span className="block text-xs font-bold">Besok</span>
            <span className="text-[10px] opacity-75">{tomorrowDate}</span>
          </button>
          <button
            type="button"
            onClick={() => update("deadline", "")}
            className={`p-4 rounded-2xl border text-center transition-all ${
              form.deadline === ""
                ? dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
                : dark ? "bg-white/5 hover:bg-white/10" : "bg-[#F3FAFF] hover:bg-[#DFF6FF] border-[#BDEAFF]"
            }`}
          >
            <span className="block text-xs font-bold">Otomatis</span>
            <span className="text-[10px] opacity-75">Jadwal Terdekat</span>
          </button>
        </div>
      )}

      {isQ3orQ4 && (
        <div className="grid gap-3 grid-cols-2">
          <button
            type="button"
            onClick={() => update("deadline", threeDaysDate)}
            className={`p-4 rounded-2xl border text-center transition-all ${
              form.deadline === threeDaysDate
                ? dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
                : dark ? "bg-white/5 hover:bg-white/10" : "bg-[#F3FAFF] hover:bg-[#DFF6FF] border-[#BDEAFF]"
            }`}
          >
            <span className="block text-xs font-bold">+3 Hari (Rekomendasi)</span>
            <span className="text-[10px] opacity-75">{threeDaysDate}</span>
          </button>
          <button
            type="button"
            onClick={() => update("deadline", "")}
            className={`p-4 rounded-2xl border text-center transition-all ${
              form.deadline === ""
                ? dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
                : dark ? "bg-white/5 hover:bg-white/10" : "bg-[#F3FAFF] hover:bg-[#DFF6FF] border-[#BDEAFF]"
            }`}
          >
            <span className="block text-xs font-bold">Otomatis</span>
            <span className="text-[10px] opacity-75">Dalam Antrean Normal</span>
          </button>
        </div>
      )}

      {!isQ1 && (
        <div className="relative">
          <label htmlFor="custom-deadline" className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-slate-400">Atur Tanggal Kustom</label>
          <input
            id="custom-deadline"
            type="date"
            min={isQ3orQ4 ? threeDaysDate : undefined}
            value={form.deadline}
            onChange={(e) => update("deadline", e.target.value)}
            className={`w-full rounded-3xl border px-6 py-4.5 text-lg focus:outline-none transition ${
              dark
                ? "bg-[#0E0E0E] border-white/10 text-white focus:border-[#B0FF5E]"
                : "bg-white border-[#BDEAFF] text-[#04044A] focus:border-[#00A4FF] focus:bg-[#F3FAFF]/30"
            }`}
          />
          {isQ3orQ4 && (
            <p className="text-[9px] text-red-500 mt-1">* Khusus Q3/Q4, tenggat waktu minimal 3 hari dari sekarang ({threeDaysDate})</p>
          )}
        </div>
      )}

      {form.deadline && (
        <p className={`text-[11px] text-center sm:text-left italic ${textMuted} mt-2`}>
          Tenggat waktu ini tetap tunduk pada antrean prioritas harian designer.
        </p>
      )}
    </div>
  );
}


