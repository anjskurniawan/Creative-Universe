import type { FormEvent } from "react";
import type {
  OddsCategory,
  OddsDesignerProfile,
  OddsTaskAttachment,
} from "@/features/odds/api";
import type { TableBriefRow } from "../brief-details";

export type OddsRequestBuilderDraft = {
  currentStep: number;
  briefEntryStep: number;
  selectedRequestType: "design" | null;
  tableBrief: {
    category: string;
    product: string;
    packagingImageName: string;
    packagingImageId: number | null;
    rows: TableBriefRow[];
  };
};

export type OddsRequestForm = {
  request_type: "design";
  category_id: string;
  preferred_designer_id: string;
  design_purpose: string;
  brief_text: string;
  reference_visual: string;
  deadline: string;
  important_matrix: string;
  attachment_notes: string;
};

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
