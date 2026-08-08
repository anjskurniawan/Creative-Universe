import { Background } from "@/components/ui/background";
import { PreviewWrapper } from "../preview-wrapper";

export function BackgroundPreview() {
  return (
    <PreviewWrapper width="full">
      <div className="relative min-h-[280px] w-full overflow-hidden rounded-2xl bg-slate-950">
        <Background />
        <div className="relative z-10 flex min-h-[280px] items-center justify-center bg-slate-950/20 text-center">
          <div className="rounded-xl border border-white/20 bg-black/20 px-6 py-4 backdrop-blur-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">Creative Universe</p>
            <p className="mt-2 text-xl font-bold text-white">Parallax background</p>
          </div>
        </div>
      </div>
    </PreviewWrapper>
  );
}
