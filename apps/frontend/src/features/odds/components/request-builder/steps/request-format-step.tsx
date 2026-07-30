import { MaterialIcon } from "@/components/ui/material-icon";
import type { RequestBuilderTheme } from "../types";

export function RequestFormatStep({
  theme,
}: {
  theme: RequestBuilderTheme;
}) {
  const { dark, textBody, textTitle, textMuted } = theme;

  return (
    <section className="my-auto flex w-full flex-1 flex-col items-center justify-center space-y-6">
      <header className="text-center">
        <h2 className={`text-4xl font-bold tracking-tight ${textTitle}`}>
          Mau buat project apa hari ini ?
        </h2>
        <p className={`mt-0.5 text-2xl ${textMuted}`}>
          Pilih jenis request visual yang ingin diajukan
        </p>
      </header>

      <div className="grid w-full max-w-3xl justify-center gap-6 p-2 sm:grid-cols-2">
        <button
          type="button"
          className={`group relative flex h-auto flex-col items-start rounded-3xl border-2 p-6 text-left transition-all duration-300 ${
            dark
              ? "border-[#B0FF5E] bg-[#B0FF5E]/5 shadow-[0_8px_32px_rgba(176,255,94,0.08)] hover:bg-[#B0FF5E]/10"
              : "border-[#00A4FF] bg-[#00A4FF]/5 shadow-[0_8px_32px_rgba(0,164,255,0.08)] hover:bg-[#00A4FF]/10"
          }`}
        >
          <span className={`absolute right-4 top-4 flex size-6 items-center justify-center rounded-full text-white shadow-md ${dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF]"}`}>
            <MaterialIcon name="check" size="auto" className="text-xs font-bold" />
          </span>
          <span className={`rounded-2xl p-4 ${dark ? "bg-[#B0FF5E]/15 text-[#B0FF5E]" : "bg-[#00A4FF]/15 text-[#00A4FF]"}`}>
            <MaterialIcon name="brush" size="lg" />
          </span>
          <h3 className={`mt-6 text-lg font-bold ${textTitle}`}>Graphic Design</h3>
          <p className={`mt-2 text-xs leading-relaxed ${textBody}`}>
            Kebutuhan publikasi media sosial, banner promosi toko, brosur, materi marketing, ilustrasi, dll.
          </p>
        </button>

        <button
          type="button"
          disabled
          className="relative flex h-auto cursor-not-allowed flex-col items-start rounded-3xl border border-dashed border-black/10 bg-black/[0.01] p-6 text-left opacity-35 dark:border-white/10 dark:bg-white/[0.01]"
        >
          <span className="rounded-2xl bg-black/5 p-4 text-slate-400 dark:bg-white/5 dark:text-slate-500">
            <MaterialIcon name="videocam" size="lg" />
          </span>
          <h3 className="mt-6 text-lg font-bold text-slate-400 dark:text-slate-500">Video Request</h3>
          <span className="mt-1 rounded-full bg-black/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:bg-white/10 dark:text-slate-500">
            Segera Hadir
          </span>
          <p className="mt-2 text-xs leading-relaxed text-slate-400 dark:text-slate-500">
            Video editing, re-edit short video feed/reels/tiktok, serta basic motion graphic.
          </p>
        </button>
      </div>
    </section>
  );
}
