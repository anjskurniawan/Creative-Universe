import type { RequestBuilderTheme } from "./OddsRequestBuilder.types";

export function createRequestBuilderTheme(
  theme: "light" | "dark" | "retro",
): RequestBuilderTheme {
  const dark = theme === "dark";

  return {
    dark,
    containerClass: dark
      ? "bg-[#111413]/90 border border-white/10 shadow-2xl backdrop-blur-md rounded-3xl"
      : "bg-white/90 border border-[#BDEAFF] shadow-[0_16px_48px_rgba(4,4,74,0.08)] backdrop-blur-md rounded-3xl",
    innerSurfaceClass: dark
      ? "bg-[#0E0E0E] rounded-2xl p-4 border border-white/5"
      : "bg-white rounded-2xl p-4 border border-[#BDEAFF]/60 shadow-sm",
    emptySurfaceClass: dark
      ? "border border-dashed border-white/10 bg-transparent rounded-2xl p-4 opacity-40"
      : "border border-dashed border-[#BDEAFF] bg-transparent rounded-2xl p-4 opacity-50",
    textTitle: dark ? "text-[#F1F1F1]" : "text-[#04044A]",
    textBody: dark ? "text-[#B9B9B9]" : "text-[#04044A]/80",
    textMuted: dark ? "text-[#B9B9B9]/60" : "text-[#04044A]/50",
    inputClass: `w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none transition ${
      dark
        ? "bg-[#0E0E0E] border-white/10 text-white focus:border-[#B0FF5E] focus:ring-1 focus:ring-[#B0FF5E]"
        : "bg-white border-[#BDEAFF] text-[#04044A] focus:border-[#00A4FF] focus:ring-1 focus:ring-[#00A4FF]"
    }`,
    primaryButtonClass: `inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
      dark
        ? "bg-[#B0FF5E] text-[#181818] hover:bg-[#9ee54f] shadow-[0_4px_20px_rgba(176,255,94,0.25)]"
        : "bg-[#00A4FF] text-white hover:bg-[#008be5] shadow-[0_4px_20px_rgba(0,164,255,0.25)]"
    }`,
    secondaryButtonClass: `inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition ${
      dark
        ? "bg-white/10 text-white hover:bg-white/20 border border-white/5"
        : "bg-[#F3FAFF] text-[#00A4FF] hover:bg-[#DFF6FF] border border-[#BDEAFF]"
    }`,
  };
}
