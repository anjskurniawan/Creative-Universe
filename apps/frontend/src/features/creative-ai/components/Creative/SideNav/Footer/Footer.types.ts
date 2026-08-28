export interface SideNavUser {
  name?: string;
  avatar_url?: string | null;
  roles?: string[];
}

export interface FooterProps {
  isExpanded: boolean;
  user?: SideNavUser | null;
  onExpand?: () => void;
  className?: string;
}
