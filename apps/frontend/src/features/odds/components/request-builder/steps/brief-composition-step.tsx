import { MaterialIcon } from "@/components/material-icon";
import type { OddsCategory, OddsTaskAttachment } from "@/features/odds/api";
import { StandardBriefDetails, TableBriefDetails, type TableBriefRow } from "../../brief-details";
import { RequestBriefEditor } from "../components/request-brief-editor";
import type { OddsRequestForm, RequestBuilderTheme } from "../types";

export function BriefCompositionStep({
  miniStep, form, update, selectedCategory, usesTableBrief,
  todayDate, tomorrowDate, threeDaysDate,
  tableBriefCategory, tableBriefProduct, tableBriefPackagingImageName, tableBriefPackagingImageId, tableBriefRows,
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

  return (
    <StandardBriefDetails>
        {/* Mini Step 1: Purpose (Tujuan) */}
        {miniStep === 1 && (
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center space-y-5 p-2">
            <div className="text-center sm:text-left">
              <h3 className={`text-lg font-semibold ${textTitle}`}>Tujuan / Judul Request</h3>
              <p className={`text-xs ${textMuted} mt-1`}>Beri nama deskriptif untuk request visual Anda (misal: campaign promo, posting rutin)</p>
            </div>
            <div>
              <input
                id="purpose"
                type="text"
                placeholder="Contoh : Feed Instagram JETE"
                value={form.design_purpose}
                onChange={(e) => update("design_purpose", e.target.value)}
                className={`w-full rounded-3xl border px-6 py-4.5 text-lg focus:outline-none transition ${
                  dark
                    ? "bg-[#0E0E0E] border-white/10 text-white focus:border-[#B0FF5E]"
                    : "bg-white border-[#BDEAFF] text-[#04044A] focus:border-[#00A4FF] focus:bg-[#F3FAFF]/30"
                }`}
                autoFocus
                required
              />
            </div>
          </div>
        )}

        {/* Mini Step 2: Priority (Otomatis berdasarkan Kategori) */}
        {miniStep === 2 && (() => {
          const matrixKey = (selectedCategory?.important_matrix || form.important_matrix || "Q4").toUpperCase();
          const quadranInfo = 
            matrixKey === "Q1" ? { code: "Q1", label: "Quadran I", desc: "Mendesak & Penting (Priority Utama Tim)", color: "text-red-500 border-red-500/40 bg-red-500/10", icon: "flash_on" } :
            matrixKey === "Q2" ? { code: "Q2", label: "Quadran II", desc: "Penting (Dikerjakan Lebih Awal)", color: "text-orange-500 border-orange-500/40 bg-orange-500/10", icon: "priority_high" } :
            matrixKey === "Q3" ? { code: "Q3", label: "Quadran III", desc: "Mendesak (Tugas Rutin Harian)", color: "text-blue-500 border-blue-500/40 bg-blue-500/10", icon: "schedule" } :
            { code: "Q4", label: "Quadran IV", desc: "Normal / Standar (Tugas Opsional)", color: "text-slate-400 border-slate-500/40 bg-slate-500/10", icon: "assignment" };

          return (
            <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center space-y-5 p-2">
              <div className="text-center sm:text-left">
                <h3 className={`text-lg font-semibold ${textTitle}`}>Important Matrix Kategori</h3>
                <p className={`text-xs ${textMuted} mt-1`}>
                  Berdasarkan Important Matrix Kategori, tugas <b className="font-bold text-[#00A4FF]">{selectedCategory?.name || "yang dipilih"}</b> berada pada:
                </p>
              </div>
              
              <div className={`p-6 rounded-2xl border-2 flex items-center justify-between ${quadranInfo.color}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black">{quadranInfo.label} ({quadranInfo.code})</span>
                  </div>
                  <p className="text-xs opacity-90 font-medium">{quadranInfo.desc}</p>
                </div>
                <MaterialIcon name={quadranInfo.icon} size="auto" className="text-3xl shrink-0 opacity-80" />
              </div>
              
              <p className={`text-[11px] text-center sm:text-left italic ${textMuted}`}>
                * Anda tidak perlu memilih skala prioritas secara manual. Klik tombol &quot;Lanjutkan&quot; untuk melanjutkan ke tenggat waktu.
              </p>
            </div>
          );
        })()}

        {/* Mini Step 3: Deadline */}
        {miniStep === 3 && (() => {
          const matrixKey = (selectedCategory?.important_matrix || form.important_matrix || "Q4").toUpperCase();
          const isQ1 = matrixKey === "Q1";
          const isQ2 = matrixKey === "Q2";
          const isQ3orQ4 = matrixKey === "Q3" || matrixKey === "Q4";

          return (
            <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center space-y-5 p-2">
              <div className="text-center sm:text-left">
                <h3 className={`text-lg font-semibold ${textTitle}`}>Tenggat Waktu / Deadline</h3>
                <p className={`text-xs ${textMuted} mt-1`}>Pilih tenggat waktu pengerjaan. Kami akan otomatis menjadwalkan jika dikosongkan.</p>
              </div>

              {/* Buttons for Q1 */}
              {isQ1 && (
                <div className="grid gap-3 grid-cols-3">
                  <button
                    type="button"
                    onClick={() => update("deadline", todayDate)}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      form.deadline === todayDate
                        ? dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
                        : dark ? "bg-white/5 hover:bg-white/10" : "bg-[#F3FAFF] hover:bg-[#DFF6FF] border-[#BDEAFF]"
                    }`}
                  >
                    <span className="block text-xs font-bold">Hari ini</span>
                    <span className="text-[10px] opacity-75">{todayDate}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => update("deadline", tomorrowDate)}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      form.deadline === tomorrowDate
                        ? dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
                        : dark ? "bg-white/5 hover:bg-white/10" : "bg-[#F3FAFF] hover:bg-[#DFF6FF] border-[#BDEAFF]"
                    }`}
                  >
                    <span className="block text-xs font-bold">Besok</span>
                    <span className="text-[10px] opacity-75">{tomorrowDate}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => update("deadline", threeDaysDate)}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      form.deadline === threeDaysDate
                        ? dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
                        : dark ? "bg-white/5 hover:bg-white/10" : "bg-[#F3FAFF] hover:bg-[#DFF6FF] border-[#BDEAFF]"
                    }`}
                  >
                    <span className="block text-xs font-bold">+3 Hari</span>
                    <span className="text-[10px] opacity-75">{threeDaysDate}</span>
                  </button>
                </div>
              )}

              {/* Buttons for Q2 */}
              {isQ2 && (
                <div className="grid gap-3 grid-cols-2">
                  <button
                    type="button"
                    onClick={() => update("deadline", tomorrowDate)}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      form.deadline === tomorrowDate
                        ? dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
                        : dark ? "bg-white/5 hover:bg-white/10" : "bg-[#F3FAFF] hover:bg-[#DFF6FF] border-[#BDEAFF]"
                    }`}
                  >
                    <span className="block text-xs font-bold">Besok</span>
                    <span className="text-[10px] opacity-75">{tomorrowDate}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => update("deadline", threeDaysDate)}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      form.deadline === threeDaysDate
                        ? dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
                        : dark ? "bg-white/5 hover:bg-white/10" : "bg-[#F3FAFF] hover:bg-[#DFF6FF] border-[#BDEAFF]"
                    }`}
                  >
                    <span className="block text-xs font-bold">+3 Hari</span>
                    <span className="text-[10px] opacity-75">{threeDaysDate}</span>
                  </button>
                </div>
              )}

              {/* Custom Date picker: Show for Q2, Q3, Q4. For Q3 and Q4, min must be 3 days from now. */}
              {!isQ1 && (
                <div className="relative">
                  <label htmlFor="custom-deadline" className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-slate-400">Atur Tanggal Kustom</label>
                  <input
                    id="custom-deadline"
                    type="date"
                    min={isQ3orQ4 ? threeDaysDate : undefined}
                    value={form.deadline}
                    onChange={(e) => update("deadline", e.target.value)}
                    className={inputClass}
                  />
                  {isQ3orQ4 && (
                    <p className="text-[9px] text-red-500 mt-1">* Khusus Q3/Q4, tenggat waktu minimal 3 hari dari sekarang ({threeDaysDate})</p>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* Mini Step 4: WYSIWYG Brief Editor */}
        {miniStep === 4 && (
          <div className="flex min-h-0 flex-1 flex-col space-y-3 p-2">
            <label className="block text-xs font-bold mb-1">
              {usesTableBrief ? "Detail Brief" : "Deskripsi Ide / Brief Detail"}
            </label>
            {usesTableBrief ? (
              <TableBriefDetails
                category={tableBriefCategory}
                product={tableBriefProduct}
                packagingImageName={tableBriefPackagingImageName}
                packagingImageId={tableBriefPackagingImageId}
                rows={tableBriefRows}
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
                dark={dark}
              />
            ) : (
              <RequestBriefEditor
                value={form.brief_text}
                onChange={(value) => update("brief_text", value)}
                onUploadImage={async (files) => {
                  const uploaded = await addAttachmentFiles(files);
                  return uploaded || [];
                }}
                dark={dark}
              />
            )}
          </div>
        )}
    </StandardBriefDetails>
  );
}
