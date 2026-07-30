import { MaterialIcon } from "@/components/material-icon";
import type { OddsCategory, OddsDesignerProfile } from "@/features/odds/api";
import { TableBriefPreview, type TableBriefRow } from "../../brief-details";
import type { OddsRequestForm, RequestBuilderTheme } from "../types";

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
        <div className="w-full max-w-none space-y-6 font-mono text-xs">
          
          {/* Obsidian Document Header / File Name */}
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-400">
            <MaterialIcon name="description" size="auto" className="text-sm" />
            <span>{form.design_purpose ? `${form.design_purpose.toLowerCase().replace(/\s+/g, "-")}.md` : "untitled-request.md"}</span>
          </div>

          {/* Obsidian Properties (YAML Frontmatter Style) */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3 font-sans">
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

            <div className="space-y-2 text-slate-600">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-400 font-medium">medium</span>
                <span className="col-span-2 font-semibold text-slate-900">Graphic Design</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-400 font-medium">category</span>
                <span className="col-span-2 font-semibold text-slate-900">{selectedCategory?.name || "-"}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-400 font-medium">designer</span>
                <span className="col-span-2 font-semibold text-slate-900">{selectedDesigner?.user?.name || "-"}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-400 font-medium">deadline</span>
                <span className="col-span-2 font-semibold text-slate-900">{form.deadline || "Otomatis"}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-400 font-medium">matrix</span>
                <span className={`col-span-2 font-semibold uppercase ${
                  (selectedCategory?.important_matrix || form.important_matrix) === "Q1" ? "text-red-500 font-bold" :
                  (selectedCategory?.important_matrix || form.important_matrix) === "Q2" ? "text-orange-500 font-bold" :
                  (selectedCategory?.important_matrix || form.important_matrix) === "Q3" ? "text-blue-500 font-bold" :
                  "text-slate-700"
                }`}>{selectedCategory?.important_matrix || form.important_matrix || "Q4"}</span>
              </div>
            </div>
          </div>

          {/* Main Obsidian Document Content */}
          <div className="space-y-4 pt-2 font-sans">
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
                category={tableBriefCategory}
                product={tableBriefProduct}
                packagingImageId={tableBriefPackagingImageId}
                packagingImageName={tableBriefPackagingImageName}
                rows={tableBriefRows}
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

        </div>
      </div>
    </div>
  );
}
