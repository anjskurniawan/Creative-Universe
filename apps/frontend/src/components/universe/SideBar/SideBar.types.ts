export type SideBarItem = {
  label: string;
  icon: string;
  href?: string;
  badge?: number | string;
  group?: string;
  isActive?: boolean;
  isHighlighted?: boolean;
};
export type SideBarProps = {
  expanded?: boolean;
  onToggleExpanded?: () => void;
  activeHref?: string;
  ariaLabel?: string;
  className?: string;
  primaryItems?: SideBarItem[];
  settingsHref?: string;
};
