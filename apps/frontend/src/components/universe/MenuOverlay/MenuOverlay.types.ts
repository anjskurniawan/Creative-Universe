export type MenuOverlayItem = {
  label: string;
  href?: string;
  icon?: string;
  badge?: number | string;
  group?: string;
  isActive?: boolean;
  isHighlighted?: boolean;
};

export type MenuOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuOverlayItem[];
  onItemClick?: (item: MenuOverlayItem, index: number) => void;
  title?: string;
  activeHref?: string;
};
