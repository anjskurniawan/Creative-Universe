import type { ProjectItem } from "../Project.types";

export interface FolderRowProps {
  item: ProjectItem;
  isExpanded: boolean;
  isFolderOpen: boolean;
  isItemActive: boolean;
  onToggleFolder: () => void;
  activeHref?: string;
}
