import { MaterialIcon } from "@/components/ui/material-icon";
import type { OddsCategory, OddsDesignerProfile } from "@/features/odds/api";
import { TableBriefPreview, type TableBriefRow } from "../../brief-details";
import type { OddsRequestForm, RequestBuilderTheme } from "../types";

function formatSla(minutes: number | undefined): string {
  if (!minutes) return "-";
  if (minutes < 60) return `${minutes} Menit`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours} Jam`;
  return `${hours} Jam ${remainingMinutes} Menit`;
}

export function RequestReviewStep({
  form,
  selectedCategory,
  selectedDesigner,
  usesTableBrief,
  tableBriefCategory,
  tableBriefProduct,
  tableBriefPackagingImageId,
  tableBriefPackagingImageName,
  tableBriefRows,
  onEditProperties,
  onEditContent,
  theme,
}: {
  form: OddsRequestForm;
  selectedCategory: OddsCategory | undefined;
  selectedDesigner: OddsDesignerProfile | undefined;
  usesTableBrief: boolean;
  tableBriefCategory: string;
  tableBriefProduct: string;
  tableBriefPackagingImageId: number | null;
  tableBriefPackagingImageName: string;
  tableBriefRows: TableBriefRow[];
  onEditProperties: () => void;
  onEditContent: () => void;
  theme: RequestBuilderTheme;
}) {
  const { textMuted, textTitle } = theme;

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-6">
      <div>
        <h2 className={`text-xl font-bold tracking-tight ${textTitle}`}>Tinjau Request Anda</h2>
        <p className={`text-xs ${textMuted} mt-0.5`}>Pastikan semua informasi sudah lengkap dan benar sebelum mengirim</p>
      </div>

      {/* Obsidian-style Preview Panel */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid gap-8 lg:grid-cols-4 w-full">
          
          {/* Main Obsidian Document Content (3/4 width on left) */}
          <div className="lg:col-span-3 space-y-4 pt-2 font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                # {form.design_purpose || "Request Tanpa Judul"}
              </h1>
              <button
                type="button"
                onClick={onEditContent}
                className="text-slate-400 hover:text-[#00A4FF] transition"
                title="Edit Content"
              >
                <MaterialIcon name="edit" size="auto" className="text-sm" />
              </button>
            </div>

            {usesTableBrief ? (
              <TableBriefPreview
                packagingImageId={tableBriefPackagingImageId}
                packagingImageName={tableBriefPackagingImageName}
                rows={tableBriefRows}
                designerName={selectedDesigner?.user?.name || "-"}
                deadline={form.deadline || "Otomatis"}
                title={form.design_purpose || "Request Tanpa Judul"}
              />
            ) : (
              <div className="prose max-w-none text-sm leading-relaxed text-slate-800">
                <div
                  className="min-h-[160px] overflow-y-visible pr-1 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_a]:font-bold [&_a]:text-[#00A4FF] [&_a]:underline [&_figure]:my-6 [&_img]:max-h-72 [&_img]:w-auto [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-100 [&_img]:shadow-md [&_figcaption]:text-center [&_figcaption]:text-xs [&_figcaption]:text-slate-400 [&_figcaption]:mt-2"
                  dangerouslySetInnerHTML={{ __html: form.brief_text || "Tidak ada rincian brief." }}
                />
              </div>
            )}
          </div>

          {/* Obsidian Properties (1/4 width on right) */}
          <div className="lg:col-span-1 p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3 font-sans h-fit">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <MaterialIcon name="tune" size="auto" className="text-xs" />
                <span>Properties / Frontmatter</span>
              </div>
              <button
                type="button"
                onClick={onEditProperties}
                className="text-slate-400 hover:text-[#00A4FF] transition"
                title="Edit Properties"
              >
                <MaterialIcon name="edit" size="auto" className="text-xs" />
              </button>
            </div>

            <div className="space-y-3.5 text-slate-600">
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">medium</span>
                <span className="font-semibold text-slate-900 break-words">Graphic Design</span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">category</span>
                <span className="font-semibold text-slate-900 break-words">{selectedCategory?.name || "-"}</span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">designer</span>
                <span className="font-semibold text-slate-900 break-words">{selectedDesigner?.user?.name || "-"}</span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">deadline</span>
                <span className="font-semibold text-slate-900 break-words">{form.deadline || "Otomatis"}</span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-slate-400 font-medium text-[10px] uppercase tracking-wider">matrix</span>
                <span className={`font-semibold uppercase break-words ${
                  (selectedCategory?.important_matrix || form.important_matrix) === "Q1" ? "text-red-500 font-bold" :
                  (selectedCategory?.important_matrix || form.important_matrix) === "Q2" ? "text-orange-500 font-bold" :
                  (selectedCategory?.important_matrix || form.important_matrix) === "Q3" ? "text-blue-500 font-bold" :
                  "text-slate-700"
                }`}>{selectedCategory?.important_matrix || form.important_matrix || "Q4"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
