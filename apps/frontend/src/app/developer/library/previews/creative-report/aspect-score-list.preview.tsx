import { AspectScoreList } from "@/components/creative-report/aspect-score-list";
import { PreviewWrapper } from "../preview-wrapper";

export function AspectScoreListPreview() {
  return (
    <PreviewWrapper width="lg">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-label">Detail Nilai Kolaborasi</h3>
          <span className="text-xs text-slate-400">30%</span>
        </div>
        <AspectScoreList labels={["Komunikasi Aktif", "Dapat Diandalkan", "Inisiatif Tim", "Pemahaman Brief", "Skill & Powerful"]} scores={[5, 6, 4, 5, 6]} maxima={[6, 6, 6, 6, 6]} />
      </div>
    </PreviewWrapper>
  );
}
