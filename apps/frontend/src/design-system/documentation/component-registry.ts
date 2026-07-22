export interface ComponentDocumentationEntry {
  name: string;
  label: string;
  slug: `components/${string}`;
  level: "atom" | "molecule" | "organism" | "template";
  status: "draft" | "review" | "stable";
  application: "core" | "kv-retail" | "creative-report" | "odds" | "generator" | "cai" | "design-assets";
}

export const COMPONENT_DOCUMENTATION = [
  { name: "Navbar", label: "Navbar", slug: "components/navbar", level: "organism", status: "stable", application: "core" },
  { name: "HeroHeading", label: "Hero Heading", slug: "components/hero-heading", level: "atom", status: "stable", application: "core" },
  { name: "PrimaryActionLink", label: "Primary Action Link", slug: "components/primary-action-link", level: "atom", status: "review", application: "core" },
  { name: "ErrorTetrisGame", label: "Error Tetris Game", slug: "components/error-tetris-game", level: "organism", status: "review", application: "core" },
  { name: "UniversalErrorView", label: "Universal Error View", slug: "components/universal-error-view", level: "template", status: "review", application: "core" },
  { name: "OddsDesignerDashboardCards", label: "Card Component", slug: "components/odds-designer-dashboard-cards", level: "template", status: "review", application: "odds" },
  { name: "OddsTotalTodayCard", label: "Total Tugas Hari Ini", slug: "components/odds-designer-dashboard-cards-total-tugas-hari-ini", level: "template", status: "review", application: "odds" },
  { name: "OddsQueuedTotalCard", label: "Total Dalam Antrian", slug: "components/odds-designer-dashboard-cards-total-dalam-antrian", level: "template", status: "review", application: "odds" },
  { name: "OddsDoneTotalCard", label: "Tugas Selesai", slug: "components/odds-designer-dashboard-cards-tugas-selesai", level: "template", status: "review", application: "odds" },
  { name: "OddsRevisionQueueCard", label: "Antrian Revisi", slug: "components/odds-designer-dashboard-cards-antrian-revisi", level: "template", status: "review", application: "odds" },
  { name: "OddsLastRequestCard", label: "Request Terbaru", slug: "components/odds-designer-dashboard-cards-request-terbaru", level: "template", status: "review", application: "odds" },
  { name: "OddsCalendarCard", label: "Calendar", slug: "components/odds-designer-dashboard-cards-calendar", level: "template", status: "review", application: "odds" },
  { name: "OddsNeedReviewBriefCard", label: "Need Review Brief", slug: "components/odds-designer-dashboard-cards-need-review-brief", level: "template", status: "review", application: "odds" },
  { name: "OddsNotificationCard", label: "Notification", slug: "components/odds-designer-dashboard-cards-notification", level: "template", status: "review", application: "odds" },
  { name: "OddsMessageCard", label: "Message", slug: "components/odds-designer-dashboard-cards-message", level: "template", status: "review", application: "odds" },
  { name: "OddsScoreCard", label: "Score Kamu", slug: "components/odds-designer-dashboard-cards-score-kamu", level: "template", status: "review", application: "odds" },
  { name: "OddsPerformanceChartCard", label: "Grafik Performa", slug: "components/odds-designer-dashboard-cards-grafik-performa", level: "template", status: "review", application: "odds" },
  { name: "OddsQueueJobsCard", label: "Queue Jobs", slug: "components/odds-designer-dashboard-cards-queue-jobs", level: "template", status: "review", application: "odds" },
  { name: "OddsTaskCard", label: "ODDS Task Card", slug: "components/odds-task-card", level: "template", status: "review", application: "odds" },
  { name: "OddsTaskCardAdmin", label: "Admin", slug: "components/odds-task-card-admin", level: "template", status: "review", application: "odds" },
  { name: "OddsTaskCardClient", label: "Client", slug: "components/odds-task-card-client", level: "template", status: "review", application: "odds" },
  { name: "OddsTaskCardDesigner", label: "Designer", slug: "components/odds-task-card-designer", level: "template", status: "review", application: "odds" },
] as const satisfies readonly ComponentDocumentationEntry[];

const APPLICATION_LABELS: Record<ComponentDocumentationEntry["application"], string> = {
  core: "Core",
  "kv-retail": "KV Retail Task",
  "creative-report": "Creative Report",
  odds: "ODDS",
  generator: "Generator",
  cai: "Creative AI",
  "design-assets": "Design Assets",
};

export const COMPONENT_DOCS_MENU_GROUPS = Object.keys(APPLICATION_LABELS).flatMap((application) => {
  const entries = COMPONENT_DOCUMENTATION.filter((entry) => entry.application === application);
  return entries.length ? [{
    label: APPLICATION_LABELS[application as ComponentDocumentationEntry["application"]],
    children: entries.map(({ label, slug }) => ({ label, slug })),
  }] : [];
});
