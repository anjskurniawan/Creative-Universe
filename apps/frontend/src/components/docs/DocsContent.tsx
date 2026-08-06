"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import { HeroHeadingDocumentation } from "@/components/docs/templates/hero-heading-documentation";
import { PrimaryActionLinkDocumentation } from "@/components/docs/templates/primary-action-link-documentation";
import { ErrorTetrisGameDocumentation } from "@/components/docs/templates/error-tetris-game-documentation";
import { UniversalErrorViewDocumentation } from "@/components/docs/templates/universal-error-view-documentation";
import { OddsDesignerDashboardCardsDocumentation } from "@/components/docs/templates/odds-designer-dashboard-cards-documentation";
import type { OddsDesignerDashboardCardId } from "@/components/docs/templates/odds-designer-dashboard-cards-documentation";
import { OddsTaskCardDocumentation } from "@/components/docs/templates/odds-task-card-documentation";
import { LayoutContainerDocumentation } from "@/components/docs/templates/layout-container-documentation";
import { LayoutWorkspaceDocumentation } from "@/components/docs/templates/layout-workspace-documentation";
import { LayoutSidebarDocumentation } from "@/components/docs/templates/layout-sidebar-documentation";
import { LayoutMenuDocumentation } from "@/components/docs/templates/layout-menu-documentation";
import { LayoutNavbarDocumentation } from "@/components/docs/templates/layout-navbar-documentation";
import { NavbarBreadcrumbDocumentation } from "@/components/docs/templates/navbar-breadcrumb-documentation";
import { NavbarAppsDropdownDocumentation } from "@/components/docs/templates/navbar-apps-dropdown-documentation";
import { NavbarNotificationDropdownDocumentation } from "@/components/docs/templates/navbar-notification-dropdown-documentation";
import { NavbarMessageDropdownDocumentation } from "@/components/docs/templates/navbar-message-dropdown-documentation";
import { NavbarProfileDropdownDocumentation } from "@/components/docs/templates/navbar-profile-dropdown-documentation";
import { NavbarButtonMenuDocumentation } from "@/components/docs/templates/navbar-button-menu-documentation";
import { SideMenuDocumentation } from "@/components/docs/templates/side-menu-documentation";
import { ExampleComponentDocumentation } from "@/components/docs/templates/example-component-documentation";
import { LandingRouteDocumentation } from "@/components/docs/templates/landing-route-documentation";
import { CreativeReportHeaderDocumentation } from "@/components/docs/templates/creative-report-header-documentation";
import { CreativeReportTitleDocumentation } from "@/components/docs/templates/creative-report-title-documentation";
import { CreativeReportMonthPickerButtonDocumentation } from "@/components/docs/templates/creative-report-month-picker-button-documentation";
import { CreativeReportExportPdfButtonDocumentation } from "@/components/docs/templates/creative-report-export-pdf-button-documentation";
import { CreativeReportToolbarDocumentation } from "@/components/docs/templates/creative-report-toolbar-documentation";
import { CreativeReportGroupAccordionDocumentation } from "@/components/docs/templates/creative-report-group-accordion-documentation";
import { CreativeReportAssessmentTableDocumentation } from "@/components/docs/templates/creative-report-assessment-table-documentation";
import { CreativeReportAssessmentMobileCardsDocumentation } from "@/components/docs/templates/creative-report-assessment-mobile-cards-documentation";
import { CreativeReportHrdDateModalDocumentation } from "@/components/docs/templates/creative-report-hrd-date-modal-documentation";
import { CreativeReportHrdRulesFooterDocumentation } from "@/components/docs/templates/creative-report-hrd-rules-footer-documentation";
import { CreativeReportDetailCardDocumentation } from "@/components/docs/templates/creative-report-detail-card-documentation";
import { CreativeReportProfileCardDocumentation } from "@/components/docs/templates/creative-report-profile-card-documentation";
import { CreativeAiHeroAuroraDocumentation } from "@/components/docs/templates/creative-ai-hero-aurora-documentation";
import { CreativeAiTypewriterTitleDocumentation } from "@/components/docs/templates/creative-ai-typewriter-title-documentation";
import { CreativeAiChatMessagesDocumentation } from "@/components/docs/templates/creative-ai-chat-messages-documentation";
import { CreativeAiChatInputDocumentation } from "@/components/docs/templates/creative-ai-chat-input-documentation";
import { OddsWelcomeScreenDocumentation } from "@/components/docs/templates/odds-welcome-screen-documentation";
import { OddsRequestTypeSelectStageDocumentation } from "@/components/docs/templates/odds-request-type-select-stage-documentation";
import { OddsCategoryInventoryStageDocumentation } from "@/components/docs/templates/odds-category-inventory-stage-documentation";
import { OddsDesignerCharacterSelectStageDocumentation } from "@/components/docs/templates/odds-designer-character-select-stage-documentation";
import { OddsMissionBriefStageDocumentation } from "@/components/docs/templates/odds-mission-brief-stage-documentation";
import { OddsMissionScrollReviewDocumentation } from "@/components/docs/templates/odds-mission-scroll-review-documentation";
import { OddsRetroHudRouteDocumentation } from "@/components/docs/templates/odds-retro-hud-route-documentation";
import { OddsLoadoutRowDocumentation } from "@/components/docs/templates/odds-loadout-row-documentation";
import { OddsPanelDocumentation } from "@/components/docs/templates/odds-panel-documentation";
import { OddsStepActionsDocumentation } from "@/components/docs/templates/odds-step-actions-documentation";
import { OddsRequestBuilderDocumentation } from "@/components/docs/templates/odds-request-builder-documentation";
import { OddsGameboyFrameDocumentation } from "@/components/docs/templates/odds-gameboy-frame-documentation";
import { OddsRequestFormatStepDocumentation } from "@/components/docs/templates/odds-request-format-step-documentation";
import { OddsCategorySelectionStepDocumentation } from "@/components/docs/templates/odds-category-selection-step-documentation";
import { OddsDesignerSelectionStepDocumentation } from "@/components/docs/templates/odds-designer-selection-step-documentation";
import { OddsBriefCompositionStepDocumentation } from "@/components/docs/templates/odds-brief-composition-step-documentation";
import { OddsRequestReviewStepDocumentation } from "@/components/docs/templates/odds-request-review-step-documentation";
import { OddsRequestBuilderFooterDocumentation } from "@/components/docs/templates/odds-request-builder-footer-documentation";
import { OddsRequestLaunchSequenceDocumentation } from "@/components/docs/templates/odds-request-launch-sequence-documentation";
import { OddsBriefPurposeDocumentation } from "@/components/docs/templates/odds-brief-purpose-documentation";
import { OddsRequestBriefEditorDocumentation } from "@/components/docs/templates/odds-request-brief-editor-documentation";
import { OddsBriefImportantMatrixDocumentation } from "@/components/docs/templates/odds-brief-important-matrix-documentation";
import { OddsBriefDeadlineDocumentation } from "@/components/docs/templates/odds-brief-deadline-documentation";
import { OddsRequestBuilderShellDocumentation } from "@/components/docs/templates/odds-request-builder-shell-documentation";
import { OddsTableBriefDetailsDocumentation } from "@/components/docs/templates/odds-table-brief-details-documentation";
import { OddsTableBriefPreviewDocumentation } from "@/components/docs/templates/odds-table-brief-preview-documentation";
import { OddsTaskCardDateDocumentation } from "@/components/docs/templates/odds-task-card-date-documentation";
import { OddsTaskCardPeopleDocumentation } from "@/components/docs/templates/odds-task-card-people-documentation";
import { OddsTaskCardStatusPanelDocumentation } from "@/components/docs/templates/odds-task-card-status-panel-documentation";
import { OddsTaskCardLayoutsDocumentation } from "@/components/docs/templates/odds-task-card-layouts-documentation";
import { OddsTaskCardActionBarDocumentation } from "@/components/docs/templates/odds-task-card-action-bar-documentation";
import { OddsTaskCardRecommendationButtonDocumentation } from "@/components/docs/templates/odds-task-card-recommendation-button-documentation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DocsContentProps {
  /** Slug from URL param, e.g. "core/application-catalog" */
  slug: string;
}

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; content: string }
  | { status: "error"; message: string };

// ─── Custom renderers (Notion / Linear aesthetic) ─────────────────────────────

const mdComponents: Components = {
  // Headings
  h1: ({ children }) => (
    <h1 className="docs-md-h1">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="docs-md-h2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="docs-md-h3">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="docs-md-h4">{children}</h4>
  ),

  // Paragraph
  p: ({ children }) => <p className="docs-md-p">{children}</p>,

  // Strong / Em
  strong: ({ children }) => (
    <strong className="docs-md-strong">{children}</strong>
  ),
  em: ({ children }) => <em className="docs-md-em">{children}</em>,

  // Inline code
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  code: ({ node, className, children, ref, ...props }) => {
    const isBlock = className?.startsWith("language-");
    if (isBlock) {
      return (
        <code className={`${className ?? ""} docs-md-code-block-inner`} {...props}>
          {children}
        </code>
      );
    }
    return <code className="docs-md-inline-code" {...props}>{children}</code>;
  },

  // Code block wrapper
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pre: ({ node, children, ref, ...props }) => (
    <pre className="docs-md-pre" {...props}>
      {children}
    </pre>
  ),

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="docs-md-blockquote">{children}</blockquote>
  ),

  // Lists
  ul: ({ children }) => <ul className="docs-md-ul">{children}</ul>,
  ol: ({ children }) => <ol className="docs-md-ol">{children}</ol>,
  li: ({ children }) => <li className="docs-md-li">{children}</li>,

  // Table (GFM)
  table: ({ children }) => (
    <div className="docs-md-table-wrapper">
      <table className="docs-md-table">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="docs-md-thead">{children}</thead>,
  tr: ({ children }) => <tr className="docs-md-tr">{children}</tr>,
  th: ({ children }) => <th className="docs-md-th">{children}</th>,
  td: ({ children }) => <td className="docs-md-td">{children}</td>,

  // HR
  hr: () => <hr className="docs-md-hr" />,

  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      className="docs-md-link"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
};

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="docs-content-empty">
      <span
        className="cu-material-icon docs-content-empty-icon"
        aria-hidden="true"
      >
        menu_book
      </span>
      <p className="docs-content-empty-title">Pilih topik dari menu</p>
      <p className="docs-content-empty-sub">
        Klik salah satu item di menu samping untuk mulai membaca dokumentasi.
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DocsContent({ slug }: DocsContentProps) {
  const [state, setState] = useState<FetchState>({ status: "idle" });

  useEffect(() => {
    if (!slug) {
      const timeout = window.setTimeout(() => setState({ status: "idle" }), 0);
      return () => window.clearTimeout(timeout);
    }

    let cancelled = false;
    const url = `/docs/${slug}.md`;
    const timeout = window.setTimeout(() => {
      if (cancelled) return;

      setState({ status: "loading" });

      fetch(url)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(
              `Dokumen tidak ditemukan (${res.status}): ${url}`
            );
          }
          return res.text();
        })
        .then((text) => {
          if (!cancelled) setState({ status: "success", content: text });
        })
        .catch((err: unknown) => {
          if (!cancelled)
            setState({
              status: "error",
              message: err instanceof Error ? err.message : String(err),
            });
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [slug]);

  if (slug === "components/hero-heading") return <HeroHeadingDocumentation />;
  if (slug === "components/primary-action-link") return <PrimaryActionLinkDocumentation />;
  if (slug === "components/error-tetris-game") return <ErrorTetrisGameDocumentation />;
  if (slug === "components/universal-error-view") return <UniversalErrorViewDocumentation />;
  if (slug === "components/odds-designer-dashboard-cards") return <OddsDesignerDashboardCardsDocumentation />;
  if (slug.startsWith("components/odds-designer-dashboard-cards-")) {
    return (
      <OddsDesignerDashboardCardsDocumentation
        cardId={slug.replace("components/odds-designer-dashboard-cards-", "") as OddsDesignerDashboardCardId}
      />
    );
  }
  if (slug === "components/odds-task-card") return <OddsTaskCardDocumentation />;
  if (slug === "components/odds-task-card-date") return <OddsTaskCardDateDocumentation />;
  if (slug === "components/odds-task-card-people") return <OddsTaskCardPeopleDocumentation />;
  if (slug === "components/odds-task-card-status-panel") return <OddsTaskCardStatusPanelDocumentation />;
  if (slug === "components/odds-task-card-layouts") return <OddsTaskCardLayoutsDocumentation />;
  if (slug === "components/odds-task-card-action-bar") return <OddsTaskCardActionBarDocumentation />;
  if (slug === "components/odds-task-card-recommendation-button") return <OddsTaskCardRecommendationButtonDocumentation />;
  if (slug === "components/side-menu") return <SideMenuDocumentation />;
  if (slug === "components/layout-container") return <LayoutContainerDocumentation />;
  if (slug === "components/layout-workspace") return <LayoutWorkspaceDocumentation />;
  if (slug === "components/layout-sidebar") return <LayoutSidebarDocumentation />;
  if (slug === "components/layout-menu") return <LayoutMenuDocumentation />;
  if (slug === "components/layout-navbar") return <LayoutNavbarDocumentation />;
  if (slug === "components/navbar-breadcrumb") return <NavbarBreadcrumbDocumentation />;
  if (slug === "components/navbar-apps-dropdown") return <NavbarAppsDropdownDocumentation />;
  if (slug === "components/navbar-notification-dropdown") return <NavbarNotificationDropdownDocumentation />;
  if (slug === "components/navbar-message-dropdown") return <NavbarMessageDropdownDocumentation />;
  if (slug === "components/navbar-profile-dropdown") return <NavbarProfileDropdownDocumentation />;
  if (slug === "components/navbar-button-menu") return <NavbarButtonMenuDocumentation />;
  if (slug === "components/creative-report-header") return <CreativeReportHeaderDocumentation />;
  if (slug === "components/creative-report-title") return <CreativeReportTitleDocumentation />;
  if (slug === "components/creative-report-month-picker-button") return <CreativeReportMonthPickerButtonDocumentation />;
  if (slug === "components/creative-report-export-pdf-button") return <CreativeReportExportPdfButtonDocumentation />;
  if (slug === "components/creative-report-toolbar") return <CreativeReportToolbarDocumentation />;
  if (slug === "components/creative-report-group-accordion") return <CreativeReportGroupAccordionDocumentation />;
  if (slug === "components/creative-report-assessment-table") return <CreativeReportAssessmentTableDocumentation />;
  if (slug === "components/creative-report-assessment-mobile-cards") return <CreativeReportAssessmentMobileCardsDocumentation />;
  if (slug === "components/creative-report-hrd-date-modal") return <CreativeReportHrdDateModalDocumentation />;
  if (slug === "components/creative-report-hrd-rules-footer") return <CreativeReportHrdRulesFooterDocumentation />;
  if (slug === "components/creative-report-detail-card") return <CreativeReportDetailCardDocumentation />;
  if (slug === "components/creative-report-profile-card") return <CreativeReportProfileCardDocumentation />;
  if (slug === "components/creative-ai-hero-aurora") return <CreativeAiHeroAuroraDocumentation />;
  if (slug === "components/creative-ai-typewriter-title") return <CreativeAiTypewriterTitleDocumentation />;
  if (slug === "components/creative-ai-chat-messages") return <CreativeAiChatMessagesDocumentation />;
  if (slug === "components/creative-ai-chat-input") return <CreativeAiChatInputDocumentation />;
  if (slug === "components/odds-welcome-screen") return <OddsWelcomeScreenDocumentation />;
  if (slug === "components/odds-request-type-select-stage") return <OddsRequestTypeSelectStageDocumentation />;
  if (slug === "components/odds-category-inventory-stage") return <OddsCategoryInventoryStageDocumentation />;
  if (slug === "components/odds-designer-character-select-stage") return <OddsDesignerCharacterSelectStageDocumentation />;
  if (slug === "components/odds-mission-brief-stage") return <OddsMissionBriefStageDocumentation />;
  if (slug === "components/odds-mission-scroll-review") return <OddsMissionScrollReviewDocumentation />;
  if (slug === "components/odds-retro-hud-route") return <OddsRetroHudRouteDocumentation />;
  if (slug === "components/odds-loadout-row") return <OddsLoadoutRowDocumentation />;
  if (slug === "components/odds-panel") return <OddsPanelDocumentation />;
  if (slug === "components/odds-step-actions") return <OddsStepActionsDocumentation />;
  if (slug === "components/odds-request-builder") return <OddsRequestBuilderDocumentation />;
  if (slug === "components/odds-request-builder-shell") return <OddsRequestBuilderShellDocumentation />;
  if (slug === "components/odds-request-format-step") return <OddsRequestFormatStepDocumentation />;
  if (slug === "components/odds-category-selection-step") return <OddsCategorySelectionStepDocumentation />;
  if (slug === "components/odds-designer-selection-step") return <OddsDesignerSelectionStepDocumentation />;
  if (slug === "components/odds-brief-composition-step") return <OddsBriefCompositionStepDocumentation />;
  if (slug === "components/odds-request-review-step") return <OddsRequestReviewStepDocumentation />;
  if (slug === "components/odds-request-builder-footer") return <OddsRequestBuilderFooterDocumentation />;
  if (slug === "components/odds-request-launch-sequence") return <OddsRequestLaunchSequenceDocumentation />;
  if (slug === "components/odds-brief-purpose") return <OddsBriefPurposeDocumentation />;
  if (slug === "components/odds-request-brief-editor") return <OddsRequestBriefEditorDocumentation />;
  if (slug === "components/odds-table-brief-details") return <OddsTableBriefDetailsDocumentation />;
  if (slug === "components/odds-table-brief-preview") return <OddsTableBriefPreviewDocumentation />;
  if (slug === "components/odds-brief-important-matrix") return <OddsBriefImportantMatrixDocumentation />;
  if (slug === "components/odds-brief-deadline") return <OddsBriefDeadlineDocumentation />;
  if (slug === "components/odds-gameboy-frame") return <OddsGameboyFrameDocumentation />;
  if (slug === "example") return <ExampleComponentDocumentation />;
  if (slug === "routes/landing") return <LandingRouteDocumentation />;

  // ── Render states ──
  if (state.status === "idle") return <EmptyState />;

  if (state.status === "loading") {
    return (
      <div className="docs-content-loading" aria-live="polite">
        <span className="docs-content-skeleton docs-content-skeleton-title" />
        <span className="docs-content-skeleton docs-content-skeleton-line" />
        <span className="docs-content-skeleton docs-content-skeleton-line short" />
        <span className="docs-content-skeleton docs-content-skeleton-line" />
        <span className="docs-content-skeleton docs-content-skeleton-line short" />
        <span className="docs-content-skeleton docs-content-skeleton-line" />
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="docs-content-error" role="alert">
        <span
          className="cu-material-icon docs-content-error-icon"
          aria-hidden="true"
        >
          error_outline
        </span>
        <p className="docs-content-error-title">Gagal memuat dokumen</p>
        <p className="docs-content-error-msg">{state.message}</p>
        <button
          type="button"
          className="btn btn-secondary docs-content-retry-btn"
          onClick={() => setState({ status: "idle" })}
        >
          Coba lagi
        </button>
      </div>
    );
  }

  // ── Success ──
  return (
    <article className="docs-md-article">
      {/* Inject highlight.js theme */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"
        media="(prefers-color-scheme: light), (not (prefers-color-scheme: dark))"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
        media="(prefers-color-scheme: dark)"
      />

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={mdComponents}
      >
        {state.content}
      </ReactMarkdown>

      {/* Scoped styles */}
      <style>{`
        /* ── Article wrapper ── */
        .docs-md-article {
          width: 100%;
          max-width: none;
          padding-bottom: 5rem;
        }

        /* ── Headings ── */
        .docs-md-h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin: 0 0 0.5rem;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .docs-md-h2 {
          font-size: 1.375rem;
          font-weight: 650;
          color: hsl(var(--foreground));
          margin: 2.5rem 0 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid hsl(var(--border));
          letter-spacing: -0.01em;
        }

        .docs-md-h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin: 2rem 0 0.5rem;
        }

        .docs-md-h4 {
          font-size: 1rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin: 1.5rem 0 0.375rem;
        }

        /* ── Paragraph ── */
        .docs-md-p {
          font-size: 0.9375rem;
          color: hsl(var(--muted-foreground));
          line-height: 1.8;
          margin: 0 0 1rem;
        }

        /* ── Strong / Em ── */
        .docs-md-strong {
          font-weight: 650;
          color: hsl(var(--foreground));
        }

        .docs-md-em {
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }

        /* ── Inline code ── */
        .docs-md-inline-code {
          font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
          font-size: 0.8125em;
          font-weight: 500;
          background-color: hsl(var(--secondary));
          color: hsl(var(--primary));
          border: 1px solid hsl(var(--border));
          border-radius: 4px;
          padding: 0.1em 0.4em;
        }

        /* ── Code block ── */
        .docs-md-pre {
          background-color: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius);
          padding: 1.25rem 1.5rem;
          overflow-x: auto;
          margin: 1.25rem 0;
          font-size: 0.84rem;
          line-height: 1.65;
          /* override hljs background */
          background: hsl(var(--card)) !important;
          box-shadow: var(--shadow-sm);
        }

        .docs-md-pre code.hljs {
          background: transparent !important;
          padding: 0 !important;
          font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
          font-size: inherit;
        }

        /* ── Blockquote ── */
        .docs-md-blockquote {
          border-left: 3px solid hsl(var(--primary));
          background-color: hsl(var(--accent));
          border-radius: 0 var(--radius) var(--radius) 0;
          padding: 0.875rem 1.25rem;
          margin: 1.25rem 0;
          color: hsl(var(--accent-foreground));
        }

        .docs-md-blockquote .docs-md-p {
          margin: 0;
          color: inherit;
          font-size: 0.9rem;
        }

        /* ── Lists ── */
        .docs-md-ul,
        .docs-md-ol {
          padding-left: 1.5rem;
          margin: 0.75rem 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .docs-md-ul { list-style-type: disc; }
        .docs-md-ol { list-style-type: decimal; }

        .docs-md-li {
          font-size: 0.9375rem;
          color: hsl(var(--muted-foreground));
          line-height: 1.7;
          padding-left: 0.25rem;
        }

        /* ── Table ── */
        .docs-md-table-wrapper {
          overflow-x: auto;
          margin: 1.25rem 0;
          border-radius: var(--radius);
          border: 1px solid hsl(var(--border));
          box-shadow: var(--shadow-sm);
        }

        .docs-md-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .docs-md-thead {
          background-color: hsl(var(--secondary));
        }

        .docs-md-th {
          text-align: left;
          font-weight: 600;
          font-size: 0.8125rem;
          color: hsl(var(--foreground));
          padding: 0.625rem 1rem;
          white-space: nowrap;
        }

        .docs-md-tr:not(:last-child) {
          border-bottom: 1px solid hsl(var(--border));
        }

        .docs-md-tr:hover {
          background-color: hsl(var(--secondary) / 0.5);
        }

        .docs-md-td {
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
          vertical-align: top;
        }

        /* ── HR ── */
        .docs-md-hr {
          border: none;
          border-top: 1px solid hsl(var(--border));
          margin: 2rem 0;
        }

        /* ── Links ── */
        .docs-md-link {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 2px;
          text-decoration-color: hsl(var(--primary) / 0.35);
          transition: text-decoration-color 0.15s ease;
        }

        .docs-md-link:hover {
          text-decoration-color: hsl(var(--primary));
        }

        /* ── Empty state ── */
        .docs-content-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 0.75rem;
          text-align: center;
          padding: 2rem;
        }

        .docs-content-empty-icon {
          font-size: 3rem;
          opacity: 0.2;
          color: hsl(var(--foreground));
        }

        .docs-content-empty-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin: 0;
        }

        .docs-content-empty-sub {
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
          max-width: 320px;
          margin: 0;
          line-height: 1.6;
        }

        /* ── Loading skeletons ── */
        .docs-content-loading {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          padding-top: 0.5rem;
          max-width: 640px;
        }

        .docs-content-skeleton {
          display: block;
          border-radius: var(--radius);
          background-color: hsl(var(--secondary));
          animation: pulse 1.5s infinite ease-in-out;
          height: 1rem;
        }

        .docs-content-skeleton-title {
          height: 2rem;
          width: 55%;
          margin-bottom: 0.5rem;
        }

        .docs-content-skeleton-line {
          width: 100%;
        }

        .docs-content-skeleton-line.short {
          width: 72%;
        }

        /* ── Error state ── */
        .docs-content-error {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.625rem;
          padding: 2rem;
          border: 1px solid hsl(var(--danger) / 0.3);
          border-radius: var(--radius);
          background-color: hsl(var(--danger-soft));
          max-width: 480px;
        }

        .docs-content-error-icon {
          font-size: 1.75rem;
          color: hsl(var(--danger));
        }

        .docs-content-error-title {
          font-size: 1rem;
          font-weight: 600;
          color: hsl(var(--danger));
          margin: 0;
        }

        .docs-content-error-msg {
          font-size: 0.8125rem;
          color: hsl(var(--danger));
          opacity: 0.8;
          margin: 0;
          font-family: ui-monospace, monospace;
          word-break: break-all;
        }

        .docs-content-retry-btn {
          margin-top: 0.5rem;
        }
      `}</style>
    </article>
  );
}
