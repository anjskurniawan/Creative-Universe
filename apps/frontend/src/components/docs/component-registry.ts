export interface ComponentDocumentationEntry {
  name: string;
  label: string;
  slug: `components/${string}`;
  category: "ui" | "typography" | "navigation" | "feedback" | "odds" | "layout" | "docs";
  status: "draft" | "review" | "stable";
  application: "core" | "kv-retail" | "creative-report" | "odds" | "generator" | "cai" | "design-assets";
  subGroup?: string;
  isParent?: boolean;
  isNested?: boolean;
}

export const COMPONENT_DOCUMENTATION = [
  { name: "Navbar", label: "Navbar (Legacy)", slug: "components/navbar", category: "navigation", status: "stable", application: "core" },
  { name: "SideMenu", label: "Side Menu (Legacy)", slug: "components/side-menu", category: "navigation", status: "review", application: "core" },
  { name: "LayoutContainer", label: "Container", slug: "components/layout-container", category: "layout", status: "stable", application: "core" },
  { name: "LayoutWorkspace", label: "Workspace", slug: "components/layout-workspace", category: "layout", status: "stable", application: "core" },
  { name: "LayoutSidebar", label: "Sidebar", slug: "components/layout-sidebar", category: "layout", status: "stable", application: "core" },
  { name: "LayoutMenu", label: "Menu (Mobile)", slug: "components/layout-menu", category: "layout", status: "stable", application: "core" },
  { name: "LayoutNavbar", label: "Navbar", slug: "components/layout-navbar", category: "layout", status: "stable", application: "core" },
  { name: "NavbarBreadcrumb", label: "Navbar: Breadcrumb", slug: "components/navbar-breadcrumb", category: "layout", status: "stable", application: "core" },
  { name: "NavbarAppsDropdown", label: "Navbar: Apps Dropdown", slug: "components/navbar-apps-dropdown", category: "layout", status: "stable", application: "core" },
  { name: "NavbarNotificationDropdown", label: "Navbar: Notification Dropdown", slug: "components/navbar-notification-dropdown", category: "layout", status: "stable", application: "core" },
  { name: "NavbarMessageDropdown", label: "Navbar: Message Dropdown", slug: "components/navbar-message-dropdown", category: "layout", status: "stable", application: "core" },
  { name: "NavbarProfileDropdown", label: "Navbar: Profile Dropdown", slug: "components/navbar-profile-dropdown", category: "layout", status: "stable", application: "core" },
  { name: "NavbarButtonMenu", label: "Navbar: Button Menu (Mobile)", slug: "components/navbar-button-menu", category: "layout", status: "stable", application: "core" },
  { name: "HeroHeading", label: "Hero Heading", slug: "components/hero-heading", category: "typography", status: "stable", application: "core" },
  { name: "PrimaryActionLink", label: "Primary Action Link", slug: "components/primary-action-link", category: "ui", status: "review", application: "core" },
  { name: "ErrorTetrisGame", label: "Error Tetris Game", slug: "components/error-tetris-game", category: "feedback", status: "review", application: "core" },
  { name: "UniversalErrorView", label: "Universal Error View", slug: "components/universal-error-view", category: "feedback", status: "review", application: "core" },
  { name: "OddsDesignerDashboardCards", label: "Card Component", slug: "components/odds-designer-dashboard-cards", category: "odds", status: "review", application: "odds", subGroup: "Dashboard", isParent: true },
  { name: "OddsTotalTodayCard", label: "Total Tugas Hari Ini", slug: "components/odds-designer-dashboard-cards-total-tugas-hari-ini", category: "odds", status: "review", application: "odds", subGroup: "Dashboard" },
  { name: "OddsQueuedTotalCard", label: "Total Dalam Antrian", slug: "components/odds-designer-dashboard-cards-total-dalam-antrian", category: "odds", status: "review", application: "odds", subGroup: "Dashboard" },
  { name: "OddsDoneTotalCard", label: "Tugas Selesai", slug: "components/odds-designer-dashboard-cards-tugas-selesai", category: "odds", status: "review", application: "odds", subGroup: "Dashboard" },
  { name: "OddsRevisionQueueCard", label: "Antrian Revisi", slug: "components/odds-designer-dashboard-cards-antrian-revisi", category: "odds", status: "review", application: "odds", subGroup: "Dashboard" },
  { name: "OddsLastRequestCard", label: "Request Terbaru", slug: "components/odds-designer-dashboard-cards-request-terbaru", category: "odds", status: "review", application: "odds", subGroup: "Dashboard" },
  { name: "OddsCalendarCard", label: "Calendar", slug: "components/odds-designer-dashboard-cards-calendar", category: "odds", status: "review", application: "odds", subGroup: "Dashboard" },
  { name: "OddsNeedReviewBriefCard", label: "Need Review Brief", slug: "components/odds-designer-dashboard-cards-need-review-brief", category: "odds", status: "review", application: "odds", subGroup: "Dashboard" },
  { name: "OddsNotificationCard", label: "Notification", slug: "components/odds-designer-dashboard-cards-notification", category: "odds", status: "review", application: "odds", subGroup: "Dashboard" },
  { name: "OddsMessageCard", label: "Message", slug: "components/odds-designer-dashboard-cards-message", category: "odds", status: "review", application: "odds", subGroup: "Dashboard" },
  { name: "OddsScoreCard", label: "Score Kamu", slug: "components/odds-designer-dashboard-cards-score-kamu", category: "odds", status: "review", application: "odds", subGroup: "Dashboard" },
  { name: "OddsPerformanceChartCard", label: "Grafik Performa", slug: "components/odds-designer-dashboard-cards-grafik-performa", category: "odds", status: "review", application: "odds", subGroup: "Dashboard" },
  { name: "OddsQueueJobsCard", label: "Queue Jobs", slug: "components/odds-designer-dashboard-cards-queue-jobs", category: "odds", status: "review", application: "odds", subGroup: "Dashboard" },
  { name: "OddsTaskCard", label: "ODDS Task Card", slug: "components/odds-task-card", category: "odds", status: "review", application: "odds", subGroup: "Task Cards", isParent: true },
  { name: "TaskCardDate", label: "Task Card Date", slug: "components/odds-task-card-date", category: "odds", status: "review", application: "odds", subGroup: "Task Cards" },
  { name: "TaskCardPeople", label: "Task Card People", slug: "components/odds-task-card-people", category: "odds", status: "review", application: "odds", subGroup: "Task Cards" },
  { name: "TaskCardStatusPanel", label: "Task Card Status Panel", slug: "components/odds-task-card-status-panel", category: "odds", status: "review", application: "odds", subGroup: "Task Cards" },
  { name: "TaskCardLayouts", label: "Task Card Layouts", slug: "components/odds-task-card-layouts", category: "odds", status: "review", application: "odds", subGroup: "Task Cards" },
  { name: "TaskCardActionBar", label: "Task Card Action Bar", slug: "components/odds-task-card-action-bar", category: "odds", status: "review", application: "odds", subGroup: "Task Cards" },
  { name: "RecommendationButton", label: "Recommendation Button", slug: "components/odds-task-card-recommendation-button", category: "odds", status: "review", application: "odds", subGroup: "Task Cards" },
  { name: "CreativeReportHeader", label: "Report Header", slug: "components/creative-report-header", category: "ui", status: "stable", application: "creative-report" },
  { name: "CreativeReportTitle", label: "Report Title", slug: "components/creative-report-title", category: "ui", status: "stable", application: "creative-report" },
  { name: "CreativeReportMonthPickerButton", label: "Month Picker Button", slug: "components/creative-report-month-picker-button", category: "ui", status: "stable", application: "creative-report" },
  { name: "CreativeReportExportPdfButton", label: "Export PDF Button", slug: "components/creative-report-export-pdf-button", category: "ui", status: "stable", application: "creative-report" },
  { name: "CreativeReportToolbar", label: "Report Toolbar", slug: "components/creative-report-toolbar", category: "ui", status: "stable", application: "creative-report" },
  { name: "CreativeReportGroupAccordion", label: "Group Accordion", slug: "components/creative-report-group-accordion", category: "ui", status: "stable", application: "creative-report" },
  { name: "CreativeReportAssessmentTable", label: "Assessment Table", slug: "components/creative-report-assessment-table", category: "ui", status: "stable", application: "creative-report" },
  { name: "CreativeReportAssessmentMobileCards", label: "Assessment Mobile Cards", slug: "components/creative-report-assessment-mobile-cards", category: "ui", status: "stable", application: "creative-report" },
  { name: "CreativeReportHrdDateModal", label: "HRD Date Modal", slug: "components/creative-report-hrd-date-modal", category: "ui", status: "stable", application: "creative-report" },
  { name: "CreativeReportHrdRulesFooter", label: "HRD Rules Footer", slug: "components/creative-report-hrd-rules-footer", category: "ui", status: "stable", application: "creative-report" },
  { name: "CreativeReportDetailCard", label: "Agent Detail Card", slug: "components/creative-report-detail-card", category: "ui", status: "stable", application: "creative-report" },
  { name: "CreativeReportProfileCard", label: "Agent Profile Card", slug: "components/creative-report-profile-card", category: "ui", status: "stable", application: "creative-report" },
  { name: "CreativeAiHeroAurora", label: "Hero Aurora Canvas", slug: "components/creative-ai-hero-aurora", category: "ui", status: "stable", application: "cai" },
  { name: "CreativeAiTypewriterTitle", label: "Typewriter Title", slug: "components/creative-ai-typewriter-title", category: "ui", status: "stable", application: "cai" },
  { name: "CreativeAiChatMessages", label: "Chat Messages", slug: "components/creative-ai-chat-messages", category: "ui", status: "stable", application: "cai" },
  { name: "CreativeAiChatInput", label: "Chat Input & Suggestions", slug: "components/creative-ai-chat-input", category: "ui", status: "stable", application: "cai" },
  { name: "OddsWelcomeScreen", label: "Welcome Screen", slug: "components/odds-welcome-screen", category: "odds", status: "stable", application: "odds", subGroup: "Retro Gameboy" },
  { name: "OddsRequestTypeSelectStage", label: "Request Type Select", slug: "components/odds-request-type-select-stage", category: "odds", status: "stable", application: "odds", subGroup: "Retro Gameboy" },
  { name: "OddsCategoryInventoryStage", label: "Category Inventory", slug: "components/odds-category-inventory-stage", category: "odds", status: "stable", application: "odds", subGroup: "Retro Gameboy" },
  { name: "OddsDesignerCharacterSelectStage", label: "Designer Select", slug: "components/odds-designer-character-select-stage", category: "odds", status: "stable", application: "odds", subGroup: "Retro Gameboy" },
  { name: "OddsMissionBriefStage", label: "Mission Brief", slug: "components/odds-mission-brief-stage", category: "odds", status: "stable", application: "odds", subGroup: "Retro Gameboy" },
  { name: "OddsMissionScrollReview", label: "Mission Review", slug: "components/odds-mission-scroll-review", category: "odds", status: "stable", application: "odds", subGroup: "Retro Gameboy" },
  { name: "OddsRetroHudRoute", label: "HUD Route", slug: "components/odds-retro-hud-route", category: "odds", status: "stable", application: "odds", subGroup: "Retro Gameboy" },
  { name: "OddsLoadoutRow", label: "Loadout Row", slug: "components/odds-loadout-row", category: "odds", status: "stable", application: "odds", subGroup: "Retro Gameboy" },
  { name: "OddsPanel", label: "Panel", slug: "components/odds-panel", category: "odds", status: "stable", application: "odds", subGroup: "Retro Gameboy" },
  { name: "OddsStepActions", label: "Step Actions", slug: "components/odds-step-actions", category: "odds", status: "stable", application: "odds", subGroup: "Retro Gameboy" },
  { name: "OddsGameboyFrame", label: "Retro Gameboy", slug: "components/odds-gameboy-frame", category: "odds", status: "stable", application: "odds", subGroup: "Retro Gameboy", isParent: true },
  { name: "OddsRequestBuilder", label: "Request Builder (Modern)", slug: "components/odds-request-builder", category: "odds", status: "stable", application: "odds", subGroup: "Request Builder (Modern)", isParent: true },
  { name: "OddsRequestBuilderShell", label: "Shell Container", slug: "components/odds-request-builder-shell", category: "odds", status: "stable", application: "odds", subGroup: "Request Builder (Modern)" },
  { name: "OddsRequestBuilderFooter", label: "Footer Controls", slug: "components/odds-request-builder-footer", category: "odds", status: "stable", application: "odds", subGroup: "Request Builder (Modern)" },
  { name: "OddsRequestLaunchSequence", label: "Launch Sequence", slug: "components/odds-request-launch-sequence", category: "odds", status: "stable", application: "odds", subGroup: "Request Builder (Modern)" },
  { name: "OddsRequestFormatStep", label: "Request Format Step", slug: "components/odds-request-format-step", category: "odds", status: "stable", application: "odds", subGroup: "Request Builder (Modern)" },
  { name: "OddsCategorySelectionStep", label: "Category Selection Step", slug: "components/odds-category-selection-step", category: "odds", status: "stable", application: "odds", subGroup: "Request Builder (Modern)" },
  { name: "OddsDesignerSelectionStep", label: "Designer Selection Step", slug: "components/odds-designer-selection-step", category: "odds", status: "stable", application: "odds", subGroup: "Request Builder (Modern)" },
  { name: "OddsBriefCompositionStep", label: "Brief Composition (Composite)", slug: "components/odds-brief-composition-step", category: "odds", status: "stable", application: "odds", subGroup: "Request Builder (Modern)" },
  { name: "OddsBriefPurpose", label: "Brief - Purpose", slug: "components/odds-brief-purpose", category: "odds", status: "stable", application: "odds", subGroup: "Request Builder (Modern)" },
  { name: "OddsRequestBriefEditor", label: "Brief - Detail Editor", slug: "components/odds-request-brief-editor", category: "odds", status: "stable", application: "odds", subGroup: "Request Builder (Modern)" },
  { name: "OddsTableBriefDetails", label: "Brief - Table Editor (Product)", slug: "components/odds-table-brief-details", category: "odds", status: "stable", application: "odds", subGroup: "Request Builder (Modern)" },
  { name: "OddsTableBriefPreview", label: "Brief - Table Preview (Product)", slug: "components/odds-table-brief-preview", category: "odds", status: "stable", application: "odds", subGroup: "Request Builder (Modern)" },
  { name: "OddsBriefImportantMatrix", label: "Brief - Important Matrix", slug: "components/odds-brief-important-matrix", category: "odds", status: "stable", application: "odds", subGroup: "Request Builder (Modern)" },
  { name: "OddsBriefDeadline", label: "Brief - Deadline", slug: "components/odds-brief-deadline", category: "odds", status: "stable", application: "odds", subGroup: "Request Builder (Modern)" },
  { name: "OddsRequestReviewStep", label: "Request Review Step", slug: "components/odds-request-review-step", category: "odds", status: "stable", application: "odds", subGroup: "Request Builder (Modern)" },
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
  const entries = COMPONENT_DOCUMENTATION.filter((entry) => entry.application === application) as ComponentDocumentationEntry[];
  
  if (!entries.length) return [];

  // Group items by subGroup
  const groups: Record<string, ComponentDocumentationEntry[]> = {};
  const flatItems: ComponentDocumentationEntry[] = [];

  entries.forEach(entry => {
    if (entry.subGroup) {
      if (!groups[entry.subGroup]) groups[entry.subGroup] = [];
      groups[entry.subGroup].push(entry);
    } else {
      flatItems.push(entry);
    }
  });

  const children: any[] = [...flatItems.map(e => ({ label: e.label, slug: e.slug }))];

  for (const [groupName, groupEntries] of Object.entries(groups)) {
    const parentEntry = groupEntries.find(e => e.isParent);
    const childEntries = groupEntries.filter(e => !e.isParent);
    
    children.push({
      label: parentEntry ? parentEntry.label : groupName,
      slug: parentEntry ? parentEntry.slug : undefined,
      children: childEntries.map(e => ({ label: e.label, slug: e.slug }))
    });
  }

  return [{
    label: APPLICATION_LABELS[application as ComponentDocumentationEntry["application"]],
    children,
  }];
});
