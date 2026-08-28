import { CreativeUniverseLogo } from "@/components/ui/CreativeUniverseLogo/CreativeUniverseLogo";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";

export function CreativeUniverseLogoPreview() {
  return (
    <PreviewWrapper width="sm">
      <div className="flex items-center justify-center gap-8 rounded-2xl border border-slate-200 bg-white p-6">
        <CreativeUniverseLogo className="size-12 text-brand" />
        <CreativeUniverseLogo className="size-16 text-sky-500" />
        <CreativeUniverseLogo className="size-20 text-slate-800" />
      </div>
    </PreviewWrapper>
  );
}
