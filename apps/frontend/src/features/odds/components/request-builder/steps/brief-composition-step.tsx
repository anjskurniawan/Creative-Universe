import { useState } from "react";
import { createPortal } from "react-dom";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { OddsCategory, OddsTaskAttachment } from "@/features/odds/api";
import { StandardBriefDetails, TableBriefDetails, type TableBriefRow } from "../../brief-details";
import { RequestBriefEditor } from "../components/request-brief-editor";
import type { OddsRequestForm, RequestBuilderTheme } from "../types";
import { BriefImportantMatrixStep } from "./brief-important-matrix-step";
import { BriefDeadlineStep } from "./brief-deadline-step";

export function BriefCompositionStep({
  miniStep, form, update, selectedCategory, usesTableBrief,
  todayDate, tomorrowDate, threeDaysDate,
  tableBriefCategory, tableBriefProduct, tableBriefPackagingImageName, tableBriefPackagingImageId, tableBriefRows,
  productCatalog, onProductCategoryCommit, onProductCommit,
  uploadingAttachments, uploadingIllustrationId,
  onTableBriefCategoryChange, onTableBriefProductChange, onPackagingImageUpload, onTableBriefRowChange,
  onIllustrationUpload, onAddTableBriefRow, onRemoveTableBriefRow, onReorderTableBriefRows,
  addAttachmentFiles, theme,
}: {
  miniStep: number;
  form: OddsRequestForm;
  update: (field: keyof OddsRequestForm, value: string) => void;
  selectedCategory: OddsCategory | undefined;
  usesTableBrief: boolean;
  todayDate: string;
  tomorrowDate: string;
  threeDaysDate: string;
  tableBriefCategory: string;
  tableBriefProduct: string;
  tableBriefPackagingImageName: string;
  tableBriefPackagingImageId: number | null;
  tableBriefRows: TableBriefRow[];
  productCatalog: Array<{ id: number; name: string; products: Array<{ id: number; name: string }> }>;
  onProductCategoryCommit?: (name: string) => Promise<void>;
  onProductCommit?: (category: string, name: string) => Promise<void>;
  uploadingAttachments: boolean;
  uploadingIllustrationId: string | null;
  onTableBriefCategoryChange: (value: string) => void;
  onTableBriefProductChange: (value: string) => void;
  onPackagingImageUpload: (files: FileList | null) => void;
  onTableBriefRowChange: (id: string, field: keyof Omit<TableBriefRow, "id">, value: string) => void;
  onIllustrationUpload: (id: string, files: FileList | null) => void;
  onAddTableBriefRow: () => void;
  onRemoveTableBriefRow: (id: string) => void;
  onReorderTableBriefRows: (sourceId: string, targetId: string) => void;
  addAttachmentFiles: (files: FileList | File[] | null) => Promise<OddsTaskAttachment[]>;
  theme: RequestBuilderTheme;
}) {
  const { dark, inputClass, textMuted, textTitle } = theme;
  const [isDefaultFullscreen, setIsDefaultFullscreen] = useState(false);

  return (
    <StandardBriefDetails>
        {!usesTableBrief && <h2 className={`mb-4 text-2xl font-bold tracking-tight sm:text-4xl ${textTitle}`}>Detail Brief</h2>}
        {miniStep === 3 && <BriefImportantMatrixStep form={form} selectedCategory={selectedCategory} theme={theme} />}
        {miniStep === 4 && <BriefDeadlineStep form={form} update={update} selectedCategory={selectedCategory} todayDate={todayDate} tomorrowDate={tomorrowDate} threeDaysDate={threeDaysDate} theme={theme} />}

        {/* Mini Step 2: WYSIWYG Brief Editor */}
        {(!usesTableBrief || miniStep === 2) && (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col space-y-3 overflow-x-hidden p-0">
            {usesTableBrief ? (
              <TableBriefDetails
                category={tableBriefCategory}
                product={tableBriefProduct}
                packagingImageName={tableBriefPackagingImageName}
                packagingImageId={tableBriefPackagingImageId}
                rows={tableBriefRows}
                productCatalog={productCatalog}
                uploadingPackagingImage={uploadingAttachments}
                onCategoryChange={onTableBriefCategoryChange}
                onProductChange={onTableBriefProductChange}
                onPackagingImageUpload={onPackagingImageUpload}
                onRowChange={onTableBriefRowChange}
                onIllustrationUpload={onIllustrationUpload}
                uploadingIllustrationId={uploadingIllustrationId}
                onAddRow={onAddTableBriefRow}
                onRemoveRow={onRemoveTableBriefRow}
                onReorderRows={onReorderTableBriefRows}
                onProductCategoryCommit={onProductCategoryCommit}
                onProductCommit={onProductCommit}
                dark={dark}
                form={form}
                update={update}
                selectedCategory={selectedCategory}
                todayDate={todayDate}
                tomorrowDate={tomorrowDate}
                threeDaysDate={threeDaysDate}
              />
            ) : (
              <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-0 xl:grid xl:gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)]">
                <div className={`${isDefaultFullscreen ? "hidden" : ""} relative order-2 mt-4 flex min-h-0 min-w-0 flex-none flex-col overflow-hidden xl:order-1 xl:mt-0 xl:flex-1 ${dark ? "bg-[#171717]" : "bg-white"}`}>
                  <div className="sm:relative mb-0 flex h-0 shrink-0 items-center justify-center px-0 py-0 sm:mb-4 sm:h-auto sm:justify-between">
                    <button
                      type="button"
                      onClick={() => setIsDefaultFullscreen((current) => !current)}
                      title={isDefaultFullscreen ? "Tutup layar penuh" : "Perluas ke layar penuh"}
                      className={`absolute bottom-2 right-2 top-auto z-20 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition sm:static ${dark ? "text-[#B9B9B9] hover:bg-white/10 hover:text-white" : "text-[#04044A]/60 hover:bg-[#BDEAFF]/40 hover:text-[#04044A]"}`}
                    >
                      <MaterialIcon name={isDefaultFullscreen ? "close_fullscreen" : "open_in_full"} size="sm" />
                      {isDefaultFullscreen ? "Tutup" : "Layar Penuh"}
                    </button>
                  </div>
                  <div className="flex min-h-0 flex-none flex-col overflow-auto px-0 pb-0 xl:flex-1">
                    <RequestBriefEditor
                      value={form.brief_text}
                      onChange={(value) => update("brief_text", value)}
                      onUploadImage={async (files) => {
                        const uploaded = await addAttachmentFiles(files);
                        return uploaded || [];
                      }}
                      dark={dark}
                    />
                  </div>
                </div>
                {isDefaultFullscreen && typeof document !== "undefined" && createPortal(
                  <div className={`fixed inset-0 z-[9999] flex min-h-screen w-screen flex-col overflow-auto p-4 sm:p-8 ${dark ? "bg-[#171717]" : "bg-white"}`}>
                    <div className="mb-4 flex shrink-0 items-center justify-between">
                      <span className={`text-2xl font-bold tracking-tight sm:text-4xl ${dark ? "text-white" : "text-[#04044A]"}`}>Detail Brief</span>
                      <button
                        type="button"
                        onClick={() => setIsDefaultFullscreen(false)}
                        title="Tutup layar penuh"
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition ${dark ? "text-[#B9B9B9] hover:bg-white/10 hover:text-white" : "text-[#04044A]/60 hover:bg-[#BDEAFF]/40 hover:text-[#04044A]"}`}
                      >
                        <MaterialIcon name="close_fullscreen" size="sm" />
                        Tutup
                      </button>
                    </div>
                    <div className="min-h-0 flex-1">
                      <RequestBriefEditor
                        value={form.brief_text}
                        onChange={(value) => update("brief_text", value)}
                        onUploadImage={async (files) => {
                          const uploaded = await addAttachmentFiles(files);
                          return uploaded || [];
                        }}
                        dark={dark}
                        fullHeight
                      />
                    </div>
                  </div>,
                  document.body
                )}
                <aside className="order-1 flex min-w-0 flex-col space-y-4 overflow-y-auto pl-1 pr-1 xl:order-2">
                  <div className="space-y-4">
                    <div>
                      <label className={`mb-1.5 block text-xs font-semibold ${textMuted}`} htmlFor="default-brief-title">Judul Request</label>
                      <input
                        id="default-brief-title"
                        value={form.design_purpose}
                        onChange={(event) => update("design_purpose", event.target.value)}
                        placeholder="Masukkan judul request"
                        className={`box-border h-10 w-full rounded-xl border px-3 text-sm outline-none transition ${inputClass}`}
                      />
                    </div>
                    <div>
                      <span className={`mb-1.5 block text-xs font-semibold ${textMuted}`}>Important Matrix</span>
                      <div className={`flex items-center justify-between rounded-xl border p-2.5 text-xs font-semibold ${form.important_matrix === "Q1" ? "border-red-500/20 bg-red-500/5 text-red-500" : form.important_matrix === "Q2" ? "border-orange-500/20 bg-orange-500/5 text-orange-500" : form.important_matrix === "Q3" ? "border-blue-500/20 bg-blue-500/5 text-blue-500" : "border-slate-500/20 bg-slate-500/5 text-slate-500"}`}>
                        <div className="flex flex-col">
                          <span className="font-bold">Quadran {form.important_matrix === "Q1" ? "I" : form.important_matrix === "Q2" ? "II" : form.important_matrix === "Q3" ? "III" : "IV"} ({form.important_matrix || "Q4"})</span>
                          <span className="text-[10px] font-normal opacity-80">{form.important_matrix === "Q1" ? "Mendesak & Penting" : form.important_matrix === "Q2" ? "Penting" : form.important_matrix === "Q3" ? "Mendesak" : "Normal / Standar"}</span>
                        </div>
                        <MaterialIcon name={form.important_matrix === "Q1" ? "flash_on" : form.important_matrix === "Q2" ? "priority_high" : form.important_matrix === "Q3" ? "schedule" : "assignment"} size="sm" className="opacity-80" />
                      </div>
                    </div>
                    <div>
                      <label className={`mb-1.5 block text-xs font-semibold ${textMuted}`} htmlFor="default-brief-deadline">Tenggat Waktu / Deadline</label>
                      <input
                        id="default-brief-deadline"
                        type="date"
                        min={form.important_matrix === "Q3" || form.important_matrix === "Q4" ? threeDaysDate : undefined}
                        value={form.deadline}
                        onChange={(event) => update("deadline", event.target.value)}
                        className={`h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition focus:ring-1 ${inputClass}`}
                      />
                      <p className={`mt-1 text-[10px] ${dark ? "text-slate-400" : "text-slate-500"}`}>
                        {form.important_matrix === "Q3" || form.important_matrix === "Q4"
                          ? `* Minimal 3 hari dari sekarang (${threeDaysDate})`
                          : "* Kosongkan untuk penjadwalan otomatis"}
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </div>
        )}
    </StandardBriefDetails>
  );
}
