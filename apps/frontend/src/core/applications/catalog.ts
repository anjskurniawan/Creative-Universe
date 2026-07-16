import type { AccessibleApplication, ApplicationKey } from "./types";

export const APPLICATION_ICONS: Record<ApplicationKey, string> = {
  core: "dashboard", "kv-retail": "task", "creative-report": "assessment",
  odds: "architecture", generator: "auto_awesome", cai: "smart_toy", "design-assets": "brush",
};

const PATH_APPLICATIONS: Array<[string, ApplicationKey]> = [
  ["/kv-retail", "kv-retail"], ["/creative-report", "creative-report"],
  ["/odds", "odds"], ["/generator", "generator"], ["/creative-ai", "cai"],
  ["/design-assets", "design-assets"],
];

export function applicationForPath(pathname: string): ApplicationKey {
  return PATH_APPLICATIONS.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`))?.[1] ?? "core";
}

export function canAccessApplication(applications: AccessibleApplication[], key: ApplicationKey): boolean {
  return key === "core" || applications.some((application) => application.key === key);
}

/**
 * Canonical app-launcher entries shared by navbar and application sidebars.
 */
export function visibleSubApplications(applications: AccessibleApplication[]): AccessibleApplication[] {
  return applications
    .filter((application) => application.type === "sub_app" && application.frontend_path)
    .sort((left, right) => left.sort_order - right.sort_order);
}
