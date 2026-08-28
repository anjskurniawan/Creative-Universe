import { type FormEvent } from "react";
import type {
  OddsCategory,
  OddsDesignerProfile,
  OddsTaskAttachment,
} from "@/features/odds/api";
import type { OddsRequestBuilderDraft, OddsRequestForm } from "@/features/odds/types";

export type OddsRequestBuilderProps = {
  theme: "light" | "dark" | "retro";
  currentStep: number;
  setCurrentStep: (step: number) => void;
  form: OddsRequestForm;
  update: (field: keyof OddsRequestForm, value: string) => void;
  categories: OddsCategory[];
  selectedCategory: OddsCategory | undefined;
  selectableDesigners: OddsDesignerProfile[];
  todayCapacity: number;
  selectedDesigner: OddsDesignerProfile | undefined;
  productCatalog: Array<{ id: number; name: string; products: Array<{ id: number; name: string }> }>;
  onProductCategoryCommit?: (name: string) => Promise<void>;
  onProductCommit?: (category: string, name: string) => Promise<void>;
  recommendedDesignerId?: string | null;
  uploadedAttachments: OddsTaskAttachment[];
  uploadingAttachments: boolean;
  addAttachmentFiles: (files: FileList | File[] | null) => Promise<OddsTaskAttachment[]>;
  onRemoveAttachment: (id: number) => void;
  loading: boolean;
  savingDraft?: boolean;
  initialDraftState?: OddsRequestBuilderDraft | null;
  onSaveDraft?: (state: OddsRequestBuilderDraft) => void;
  initializing: boolean;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export type RequestBuilderTheme = {
  dark: boolean;
  containerClass: string;
  innerSurfaceClass: string;
  emptySurfaceClass: string;
  textTitle: string;
  textBody: string;
  textMuted: string;
  inputClass: string;
  primaryButtonClass: string;
  secondaryButtonClass: string;
};
