import type { NavBarApplication } from "./NavBar.types";

export const DEFAULT_NAVBAR_USER = { name: "Creative Universe", role: "User" } as const;

export const DEFAULT_NAVBAR_APPLICATIONS: NavBarApplication[] = [
  { key: "kv-retail", display_name: "KV Retail Task", href: "/kv-retail", icon: "assignment" },
  { key: "creative-report", display_name: "Creative Report", href: "/creative-report", icon: "bar_chart" },
  { key: "odds", display_name: "One Dashboard Design System", href: "/odds", icon: "design_services" },
  { key: "generator", display_name: "Generator", href: "/generator/pricetag", icon: "auto_awesome" },
  { key: "creative-ai", display_name: "Creative AI", href: "/creative-ai", icon: "smart_toy" },
  { key: "design-assets", display_name: "Design Assets", href: "/design-assets", icon: "brush" },
];

export const DEFAULT_DEVELOPER_APPLICATIONS: NavBarApplication[] = [
  { key: "maintenance", display_name: "Maintenance", href: "/maintenance", icon: "build" },
];
