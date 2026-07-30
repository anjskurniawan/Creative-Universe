export interface ComponentDocumentationEntry {
  name: string;
  label: string;
  slug: `components/${string}`;
  category: "ui" | "typography" | "navigation" | "feedback" | "odds" | "docs";
  status: "draft" | "review" | "stable";
  application: "core" | "kv-retail" | "creative-report" | "odds" | "generator" | "cai" | "design-assets";
}

export const COMPONENT_DOCUMENTATION = [
  { name: "Navbar", label: "Navbar", slug: "components/navbar", category: "navigation", status: "stable", application: "core" },
  { name: "HeroHeading", label: "Hero Heading", slug: "components/hero-heading", category: "typography", status: "stable", application: "core" },
  { name: "PrimaryActionLink", label: "Primary Action Link", slug: "components/primary-action-link", category: "ui", status: "review", application: "core" },
  { name: "ErrorTetrisGame", label: "Error Tetris Game", slug: "components/error-tetris-game", category: "feedback", status: "review", application: "core" },
  { name: "UniversalErrorView", label: "Universal Error View", slug: "components/universal-error-view", category: "feedback", status: "review", application: "core" },
  { name: "OddsDesignerDashboardCards", label: "Card Component", slug: "components/odds-designer-dashboard-cards", category: "odds", status: "review", application: "odds" },
  { name: "OddsTotalTodayCard", label: "Total Tugas Hari Ini", slug: "components/odds-designer-dashboard-cards-total-tugas-hari-ini", category: "odds", status: "review", application: "odds" },
  { name: "OddsQueuedTotalCard", label: "Total Dalam Antrian", slug: "components/odds-designer-dashboard-cards-total-dalam-antrian", category: "odds", status: "review", application: "odds" },
  { name: "OddsDoneTotalCard", label: "Tugas Selesai", slug: "components/odds-designer-dashboard-cards-tugas-selesai", category: "odds", status: "review", application: "odds" },
  { name: "OddsRevisionQueueCard", label: "Antrian Revisi", slug: "components/odds-designer-dashboard-cards-antrian-revisi", category: "odds", status: "review", application: "odds" },
  { name: "OddsLastRequestCard", label: "Request Terbaru", slug: "components/odds-designer-dashboard-cards-request-terbaru", category: "odds", status: "review", application: "odds" },
  { name: "OddsCalendarCard", label: "Calendar", slug: "components/odds-designer-dashboard-cards-calendar", category: "odds", status: "review", application: "odds" },
  { name: "OddsNeedReviewBriefCard", label: "Need Review Brief", slug: "components/odds-designer-dashboard-cards-need-review-brief", category: "odds", status: "review", application: "odds" },
  { name: "OddsNotificationCard", label: "Notification", slug: "components/odds-designer-dashboard-cards-notification", category: "odds", status: "review", application: "odds" },
  { name: "OddsMessageCard", label: "Message", slug: "components/odds-designer-dashboard-cards-message", category: "odds", status: "review", application: "odds" },
  { name: "OddsScoreCard", label: "Score Kamu", slug: "components/odds-designer-dashboard-cards-score-kamu", category: "odds", status: "review", application: "odds" },
  { name: "OddsPerformanceChartCard", label: "Grafik Performa", slug: "components/odds-designer-dashboard-cards-grafik-performa", category: "odds", status: "review", application: "odds" },
  { name: "OddsQueueJobsCard", label: "Queue Jobs", slug: "components/odds-designer-dashboard-cards-queue-jobs", category: "odds", status: "review", application: "odds" },
  { name: "OddsTaskCard", label: "ODDS Task Card", slug: "components/odds-task-card", category: "odds", status: "review", application: "odds" },
  { name: "OddsTaskCardAdmin", label: "Admin", slug: "components/odds-task-card-admin", category: "odds", status: "review", application: "odds" },
  { name: "OddsTaskCardClient", label: "Client", slug: "components/odds-task-card-client", category: "odds", status: "review", application: "odds" },
  { name: "OddsTaskCardDesigner", label: "Designer", slug: "components/odds-task-card-designer", category: "odds", status: "review", application: "odds" },
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
