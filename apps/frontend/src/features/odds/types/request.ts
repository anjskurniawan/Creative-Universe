import type { TableBriefRow } from "./brief";

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
