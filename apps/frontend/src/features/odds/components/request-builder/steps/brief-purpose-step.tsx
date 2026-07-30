import type { OddsRequestForm, RequestBuilderTheme } from "../types";

export function BriefPurposeStep({
  form,
  update,
  theme,
}: {
  form: OddsRequestForm;
  update: (field: keyof OddsRequestForm, value: string) => void;
  theme: RequestBuilderTheme;
}) {
  const { dark, textMuted, textTitle } = theme;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center space-y-5 p-2">
      <div className="text-center sm:text-left">
        <h3 className={`text-lg font-semibold ${textTitle}`}>Tujuan / Judul Request</h3>
        <p className={`text-xs ${textMuted} mt-1`}>Beri nama deskriptif untuk request visual Anda (misal: campaign promo, posting rutin)</p>
      </div>
      <div>
        <input
          id="purpose"
          type="text"
          placeholder="Contoh : Feed Instagram JETE"
          value={form.design_purpose}
          onChange={(e) => update("design_purpose", e.target.value)}
          className={`w-full rounded-3xl border px-6 py-4.5 text-lg focus:outline-none transition ${
            dark
              ? "bg-[#0E0E0E] border-white/10 text-white focus:border-[#B0FF5E]"
              : "bg-white border-[#BDEAFF] text-[#04044A] focus:border-[#00A4FF] focus:bg-[#F3FAFF]/30"
          }`}
          autoFocus
          required
        />
      </div>
    </div>
  );
}

