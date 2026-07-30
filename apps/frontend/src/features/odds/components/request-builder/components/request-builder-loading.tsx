import { MaterialIcon } from "@/components/material-icon";
import type { RequestBuilderTheme } from "../types";

export function RequestBuilderLoading({ theme }: { theme: RequestBuilderTheme }) {
  const { containerClass, dark, textMuted, textTitle } = theme;

  return (
    <div className={`relative flex min-h-[500px] flex-1 flex-col items-center justify-center overflow-hidden p-8 text-center ${containerClass}`}>
      <span className={`absolute inset-x-0 top-0 h-1.5 ${dark ? "bg-[#B0FF5E]" : "bg-[#00A4FF]"}`} />
      <span className="pointer-events-none absolute inset-0 opacity-[0.03] [background:repeating-linear-gradient(0deg,transparent_0,transparent_3px,#000_4px)] dark:opacity-[0.05] dark:[background:repeating-linear-gradient(0deg,transparent_0,transparent_3px,#fff_4px)]" />

      <div className="relative z-10 flex max-w-sm flex-col items-center">
        <div className={`mb-6 animate-bounce rounded-3xl p-4 ${dark ? "bg-[#B0FF5E]/10 text-[#B0FF5E]" : "bg-[#00A4FF]/10 text-[#00A4FF]"}`}>
          <MaterialIcon name="satellite_alt" size="lg" className="animate-spin text-4xl" />
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-[0.25em] ${textMuted}`}>Mengunduh Data ODDS</span>
        <h2 className={`mt-3 text-2xl font-extrabold tracking-tight ${textTitle}`}>Menghubungkan Ke Core...</h2>
        <div className="mt-8 flex h-2 w-48 gap-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
          <div className={`h-full w-full animate-pulse rounded-full ${dark ? "bg-[#B0FF5E]" : "bg-[#00A4FF]"}`} style={{ animationDuration: "1.5s" }} />
        </div>
        <p className={`mt-5 animate-pulse text-[10px] font-medium ${textMuted}`}>Mohon tunggu sebentar...</p>
      </div>
    </div>
  );
}
