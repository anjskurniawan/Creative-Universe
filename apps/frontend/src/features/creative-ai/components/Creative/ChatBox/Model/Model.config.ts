import type { ModelItem } from "./Model.types";

export const DEFAULT_MODELS_LIST: ModelItem[] = [
  {
    id: "creative-fast",
    name: "Creative Fast",
    description: "Respons cepat untuk brainstorming & chat harian",
  },
  {
    id: "creative-pro",
    name: "Creative Pro",
    description: "Kemampuan penalaran tinggi & pemrosesan multimodal",
  },
  {
    id: "creative-vision",
    name: "Creative Vision",
    description: "Analisis visual, gambar, dan desain grafis",
  },
];

export const DEFAULT_MODEL_CONFIG = {
  defaultModel: "Creative Fast",
  ariaLabel: "Pilih Model AI",
  iconName: "ChevronDown" as const,
  models: DEFAULT_MODELS_LIST,
} as const;
