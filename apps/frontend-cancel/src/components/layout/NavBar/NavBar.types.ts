export type NavBarTheme = "light" | "dark";
export type NavBarMenu =
  | "developer"
  | "notifications"
  | "messages"
  | "apps"
  | "profile";

export type NavBarApplication = {
  key: string;
  display_name: string;
  href: string;
  icon?: string;
};
export type NavBarNotification = {
  id: string;
  title: string;
  content: string;
  time?: string;
  read?: boolean;
  icon?: string;
};
export type NavBarMessage = {
  id: string;
  sender: string;
  preview: string;
  time?: string;
  unread?: boolean;
};
export type NavBarUser = {
  name: string;
  role?: string;
  avatarUrl?: string;
  initials?: string;
  isRoot?: boolean;
};
export type NavBarProps = {
  user?: NavBarUser;
  applications?: NavBarApplication[];
  notifications?: NavBarNotification[];
  messages?: NavBarMessage[];
  viewport?: "Mobile" | "Desktop";
  responsiveNavigation?: boolean;
  sticky?: boolean;
  breadcrumbItems?: string[];
  theme?: NavBarTheme;
  showNavigation?: boolean;
  showApps?: boolean;
  showDeveloper?: boolean;
  showNotifications?: boolean;
  showMessages?: boolean;
  showProfile?: boolean;
  bordered?: boolean;
  className?: string;
  onSignOut?: () => void;
  onMenuClick?: () => void;
  developerApplications?: NavBarApplication[];
  onBack?: () => void;
  onForward?: () => void;
};
