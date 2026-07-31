"use client";

import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { stripRichText } from "@/components/odds-rich-text-editor";
import { type TableBriefRow } from "../brief-details";
import { BriefCompositionStep } from "./steps/brief-composition-step";
import { CategorySelectionStep } from "./steps/category-selection-step";
import { DesignerSelectionStep } from "./steps/designer-selection-step";
import { RequestFormatStep } from "./steps/request-format-step";
import { RequestReviewStep } from "./steps/request-review-step";
import { RequestBuilderFooter } from "./components/request-builder-footer";
import { RequestBuilderLoading } from "./components/request-builder-loading";
import { createRequestBuilderTheme } from "./theme";
import { RequestBuilderShell } from "./components/request-builder-shell";
import { uploadOddsTaskAttachment } from "../../api";
import type { OddsRequestBuilderProps } from "./types";

const dateFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-CA");
};

const escapeBriefTableCell = (value: string) => value.replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;",
})[character] ?? character);

export function OddsRequestBuilder({
  theme,
  currentStep,
  setCurrentStep,
  form,
  update,
  categories,
  selectedCategory,
  selectableDesigners,
  todayCapacity,
  selectedDesigner,
  recommendedDesignerId,
  productCatalog,
  onProductCategoryCommit,
  onProductCommit,
  uploadingAttachments,
  addAttachmentFiles,
  loading,
  savingDraft = false,
  initialDraftState,
  onSaveDraft,
  initializing,
  submit,
}: OddsRequestBuilderProps) {
  const builderTheme = createRequestBuilderTheme(theme);
  const { dark } = builderTheme;

  // Mini-step tracking for Step 4
  const [miniStep, setMiniStep] = useState(1);
  const [tableBriefCategory, setTableBriefCategory] = useState("");
  const [tableBriefProduct, setTableBriefProduct] = useState("");
  const [tableBriefPackagingImageName, setTableBriefPackagingImageName] = useState("");
  const [tableBriefPackagingImageId, setTableBriefPackagingImageId] = useState<number | null>(null);
  const [tableBriefRows, setTableBriefRows] = useState<TableBriefRow[]>([
    { id: "image-1", image_order: "1", image_description: "", image_illustration: "", image_illustration_id: null, additional_notes: "" },
  ]);
  const [uploadingPackaging, setUploadingPackaging] = useState(false);
  const tableBriefRowCounter = useRef(2);
  const [uploadingIllustrationId, setUploadingIllustrationId] = useState<string | null>(null);
  const hasAppliedDraft = useRef(false);
  const briefFormat = String(selectedCategory?.brief_format ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  const usesTableBrief = ["table", "deskripsi_produk", "product_description"].includes(briefFormat)
    || /<table\b/i.test(form.brief_text ?? "");

  useEffect(() => {
    if (!initialDraftState || hasAppliedDraft.current) return;
    hasAppliedDraft.current = true;
    setCurrentStep(Math.min(5, Math.max(1, initialDraftState.currentStep || 1)));
    setMiniStep(Math.min(4, Math.max(1, initialDraftState.briefEntryStep || 1)));
    setTableBriefCategory(initialDraftState.tableBrief?.category ?? "");
    setTableBriefProduct(initialDraftState.tableBrief?.product ?? "");
    setTableBriefPackagingImageName(initialDraftState.tableBrief?.packagingImageName ?? "");
    setTableBriefPackagingImageId(initialDraftState.tableBrief?.packagingImageId ?? null);
    setTableBriefRows(initialDraftState.tableBrief?.rows?.length ? initialDraftState.tableBrief.rows : [{ id: "image-1", image_order: "1", image_description: "", image_illustration: "", image_illustration_id: null, additional_notes: "" }]);
  }, [initialDraftState, setCurrentStep]);

  const saveDraft = () => onSaveDraft?.({
    currentStep,
    briefEntryStep: miniStep,
    selectedRequestType: "design",
    tableBrief: {
      category: tableBriefCategory,
      product: tableBriefProduct,
      packagingImageName: tableBriefPackagingImageName,
      packagingImageId: tableBriefPackagingImageId,
      rows: tableBriefRows,
    },
  });


  const canGoNext = useMemo(() => {
    if (currentStep === 1) return true;
    if (currentStep === 2) return !!form.category_id;
    if (currentStep === 3) return !!form.preferred_designer_id;
    if (currentStep === 4) {
      if (miniStep === 1) return !!form.design_purpose.trim();
      if (miniStep === 2) return usesTableBrief
        ? Boolean(tableBriefProduct.trim()) || tableBriefRows.some((row) => [row.image_description, row.image_illustration, row.additional_notes].some((value) => value.trim()))
        : !!stripRichText(form.brief_text).trim();
      if (miniStep === 3 || miniStep === 4) return true;
    }
    return true;
  }, [currentStep, miniStep, form, tableBriefProduct, tableBriefRows, usesTableBrief]);

  const buildTableBriefMarkup = useCallback((category: string, product: string, packagingImageName: string, packagingImageId: number | null, rows: TableBriefRow[]) => `<table><tbody><tr><th>Gambar Packaging</th><td>${packagingImageId ? `<a href="/api/v1/odds/uploads/${packagingImageId}/content" target="_blank" rel="noopener noreferrer">Buka Gambar</a>` : escapeBriefTableCell(packagingImageName) || "-"}</td></tr></tbody></table><table><thead><tr><th>No</th><th>Deskripsi</th><th>Referensi</th><th>Keterangan</th></tr></thead><tbody>${rows.map((row, index) => `<tr><td>${index + 1}</td><td>${row.image_description || "-"}</td><td>${row.image_illustration_id ? `<a href="/api/v1/odds/uploads/${row.image_illustration_id}/content" target="_blank" rel="noopener noreferrer">Buka Gambar</a>` : escapeBriefTableCell(row.image_illustration) || "-"}</td><td>${row.additional_notes || "-"}</td></tr>`).join("")}</tbody></table>`, []);

  const syncTableBrief = useCallback((category: string, product: string, packagingImageName: string, packagingImageId: number | null, rows: TableBriefRow[]) => {
    update("brief_text", buildTableBriefMarkup(category, product, packagingImageName, packagingImageId, rows));
  }, [buildTableBriefMarkup, update]);

  useEffect(() => {
    if (!usesTableBrief) return;
    syncTableBrief(tableBriefCategory, tableBriefProduct, tableBriefPackagingImageName, tableBriefPackagingImageId, tableBriefRows);
  }, [usesTableBrief, tableBriefCategory, tableBriefProduct, tableBriefPackagingImageName, tableBriefPackagingImageId, tableBriefRows, syncTableBrief]);

  const updateTableBriefRow = (id: string, field: keyof Omit<TableBriefRow, "id">, value: string) => {
    setTableBriefRows((currentRows) => {
      return currentRows.map((row) => row.id === id ? { ...row, [field]: value } : row);
    });
  };

  const updateTableBriefCategory = (value: string) => {
    setTableBriefCategory(value);
    update("design_purpose", [value.trim(), tableBriefProduct.trim()].filter(Boolean).join(" - "));
  };

  const updateTableBriefProduct = (value: string) => {
    setTableBriefProduct(value);
    update("design_purpose", [tableBriefCategory.trim(), value.trim()].filter(Boolean).join(" - "));
  };

  const uploadTableBriefPackagingImage = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploadingPackaging(true);
    try {
      const uploaded = await uploadOddsTaskAttachment(file);
      setTableBriefPackagingImageName(uploaded.name);
      setTableBriefPackagingImageId(uploaded.id);
    } catch (err) {
      // Ignore or handle upload error silently/transparently
    } finally {
      setUploadingPackaging(false);
    }
  };

  const uploadTableBriefIllustration = async (id: string, files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploadingIllustrationId(id);
    try {
      const uploaded = await uploadOddsTaskAttachment(file);
      setTableBriefRows((currentRows) => {
        return currentRows.map((row) => row.id === id ? { ...row, image_illustration: uploaded.name, image_illustration_id: uploaded.id } : row);
      });
    } catch (err) {
      // Ignore or handle upload error silently/transparently
    } finally {
      setUploadingIllustrationId(null);
    }
  };

  const addTableBriefRow = () => {
    setTableBriefRows((currentRows) => {
      return [...currentRows, { id: `image-${tableBriefRowCounter.current++}`, image_order: "", image_description: "", image_illustration: "", image_illustration_id: null, additional_notes: "" }];
    });
  };

  const removeTableBriefRow = (id: string) => {
    setTableBriefRows((currentRows) => {
      if (currentRows.length === 1) return currentRows;
      return currentRows.filter((row) => row.id !== id);
    });
  };

  const reorderTableBriefRows = (sourceId: string, targetId: string) => {
    setTableBriefRows((currentRows) => {
      const sourceIndex = currentRows.findIndex((row) => row.id === sourceId);
      const targetIndex = currentRows.findIndex((row) => row.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return currentRows;

      const nextRows = [...currentRows];
      const [movedRow] = nextRows.splice(sourceIndex, 1);
      const insertionIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
      nextRows.splice(insertionIndex, 0, movedRow);
      return nextRows;
    });
  };

  const handleNextStep = () => {
    if (!canGoNext) return;
    if (currentStep === 2 && !form.preferred_designer_id && recommendedDesignerId) {
      update("preferred_designer_id", recommendedDesignerId);
    }
    if (currentStep === 4) {
      if (usesTableBrief) {
        setCurrentStep(5);
      } else if (miniStep < 4) {
        setMiniStep(miniStep + 1);
      } else {
        setCurrentStep(5);
      }
    } else {
      if (currentStep === 3 && usesTableBrief) setMiniStep(2);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 5 && usesTableBrief) {
      setMiniStep(2);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (usesTableBrief && miniStep === 2) {
        setCurrentStep(3);
      } else if (miniStep > 1) {
        setMiniStep(miniStep - 1);
      } else {
        setCurrentStep(3);
      }
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const todayDate = useMemo(() => dateFromNow(0), []);
  const tomorrowDate = useMemo(() => dateFromNow(1), []);
  const threeDaysDate = useMemo(() => dateFromNow(3), []);

  if (initializing) return <RequestBuilderLoading theme={builderTheme} />;

  return (
    <RequestBuilderShell
      theme={builderTheme}
      onSubmit={(e) => {
        e.preventDefault();
        if (currentStep === 5) {
          void submit(e);
        }
      }}
      footer={
        <RequestBuilderFooter
          currentStep={currentStep}
          canContinue={canGoNext}
          loading={loading}
          initializing={initializing}
          uploadingAttachments={uploadingAttachments}
          savingDraft={savingDraft}
          canSaveDraft={Boolean(onSaveDraft)}
          onPrevious={handlePrevStep}
          onNext={handleNextStep}
          onSaveDraft={saveDraft}
          theme={builderTheme}
        />
      }
    >
      {currentStep === 1 && <RequestFormatStep theme={builderTheme} />}

      {currentStep === 2 && (
        <CategorySelectionStep
          categories={categories}
          selectedCategoryId={form.category_id}
          update={update}
          theme={builderTheme}
        />
      )}

      {currentStep === 3 && (
        <DesignerSelectionStep
          categories={categories}
          designers={selectableDesigners}
          selectedDesignerId={form.preferred_designer_id}
          recommendedDesignerId={recommendedDesignerId}
          todayCapacity={todayCapacity}
          onSelect={(designerId) => update("preferred_designer_id", designerId)}
          theme={builderTheme}
        />
      )}

      {currentStep === 4 && (
        <BriefCompositionStep
          miniStep={miniStep}
          form={form}
          update={update}
          selectedCategory={selectedCategory}
          usesTableBrief={usesTableBrief}
          todayDate={todayDate}
          tomorrowDate={tomorrowDate}
          threeDaysDate={threeDaysDate}
          tableBriefCategory={tableBriefCategory}
          tableBriefProduct={tableBriefProduct}
          tableBriefPackagingImageName={tableBriefPackagingImageName}
          tableBriefPackagingImageId={tableBriefPackagingImageId}
          tableBriefRows={tableBriefRows}
          productCatalog={productCatalog}
          onProductCategoryCommit={onProductCategoryCommit}
          onProductCommit={onProductCommit}
          uploadingAttachments={uploadingAttachments || uploadingPackaging}
          uploadingIllustrationId={uploadingIllustrationId}
          onTableBriefCategoryChange={updateTableBriefCategory}
          onTableBriefProductChange={updateTableBriefProduct}
          onPackagingImageUpload={(files) => void uploadTableBriefPackagingImage(files)}
          onTableBriefRowChange={updateTableBriefRow}
          onIllustrationUpload={(id, files) => void uploadTableBriefIllustration(id, files)}
          onAddTableBriefRow={addTableBriefRow}
          onRemoveTableBriefRow={removeTableBriefRow}
          onReorderTableBriefRows={reorderTableBriefRows}
          addAttachmentFiles={addAttachmentFiles}
          theme={builderTheme}
        />
      )}

      {currentStep === 5 && (
        <RequestReviewStep
          form={form}
          selectedCategory={selectedCategory}
          selectedDesigner={selectedDesigner}
          usesTableBrief={usesTableBrief}
          tableBriefCategory={tableBriefCategory}
          tableBriefProduct={tableBriefProduct}
          tableBriefPackagingImageId={tableBriefPackagingImageId}
          tableBriefPackagingImageName={tableBriefPackagingImageName}
          tableBriefRows={tableBriefRows}
          onEditProperties={() => setCurrentStep(2)}
          onEditContent={() => { setMiniStep(2); setCurrentStep(4); }}
          theme={builderTheme}
        />
      )}
    </RequestBuilderShell>
  );
}
