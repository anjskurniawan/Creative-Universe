import type { Key } from "react";

export interface ModelItem {
  id: string;
  name: string;
  description?: string;
  badge?: string;
}

export interface ModelProps {
  selectedModel?: string;
  onSelectModel?: (modelId: string) => void;
  models?: ModelItem[];
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}
