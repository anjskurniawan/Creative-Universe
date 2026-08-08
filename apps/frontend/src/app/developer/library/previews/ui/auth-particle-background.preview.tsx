import { AuthParticleBackground } from "@/components/ui/auth-particle-background";
import { PreviewWrapper } from "../preview-wrapper";

export function AuthParticleBackgroundPreview() {
  return (
    <PreviewWrapper width="full">
      <div className="relative min-h-[280px] w-full overflow-hidden rounded-2xl bg-[#04044a]">
        <AuthParticleBackground />
        <div className="relative z-10 flex min-h-[280px] items-center justify-center text-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-200/70">Creative Universe</p>
            <p className="mt-2 text-xl font-bold text-white">Animated particle background</p>
          </div>
        </div>
      </div>
    </PreviewWrapper>
  );
}
