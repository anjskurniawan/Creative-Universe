import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { OddsCategory, OddsTaskAttachment } from "@/features/odds/api";
import { StandardBriefDetails, TableBriefDetails, type TableBriefRow } from "../../brief-details";
import { RequestBriefEditor } from "../components/request-brief-editor";
import type { OddsRequestForm, RequestBuilderTheme } from "../types";
import { BriefPurposeStep } from "./brief-purpose-step";
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

  return (
    <StandardBriefDetails>
        {!usesTableBrief && miniStep === 1 && <BriefPurposeStep form={form} update={update} theme={theme} />}
        {miniStep === 3 && <BriefImportantMatrixStep form={form} selectedCategory={selectedCategory} theme={theme} />}
        {miniStep === 4 && <BriefDeadlineStep form={form} update={update} selectedCategory={selectedCategory} todayDate={todayDate} tomorrowDate={tomorrowDate} threeDaysDate={threeDaysDate} theme={theme} />}

        {/* Mini Step 2: WYSIWYG Brief Editor */}
        {miniStep === 2 && (
          <div className="flex min-h-0 flex-1 flex-col space-y-3 p-0">
            {!usesTableBrief && (
              <label className="block text-xs font-bold mb-1">
                Deskripsi Ide / Brief Detail
              </label>
            )}
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


