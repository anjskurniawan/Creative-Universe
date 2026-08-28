export type SidebarItem = { label: string; icon?: string; href?: string; badge?: number | string; group?: string; isActive?: boolean; isHighlighted?: boolean };
export type SidebarProps = { items?: SidebarItem[]; expanded?: boolean; onToggleExpanded?: () => void; activeHref?: string; ariaLabel?: string; className?: string; primaryItems?: SidebarItem[]; settingsHref?: string };
