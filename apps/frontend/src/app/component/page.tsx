"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { HeaderTitle } from "@/components/typography/header-title";
import { InteractiveComponentPlayground } from "@/components/docs/interactive-component-playground";
import { TaskSummary } from "@/features/odds/components/task-detail/task-summary";
import { TaskDetailBackButton } from "@/features/odds/components/task-detail/task-detail-back-button";
import { TaskHeader } from "@/features/odds/components/task-detail/task-header";
import { TaskTimer } from "@/features/odds/components/task-detail/task-timer";
import { RevisionBrief } from "@/features/odds/components/task-detail/revision-brief";
import { RevisionMessage } from "@/features/odds/components/task-detail/revision-message";
import { Button } from "@/features/odds/components/task-detail/button";
import { ClientTableBriefEditor } from "@/features/odds/components/task-detail/client-table-brief-editor";
import { DesignerRevisionStatusMessage } from "@/features/odds/components/task-detail/designer-revision-status-message";
import { DetailActionButton, DetailInfoRow, DetailShellMessage, DetailSkeleton, DetailTimerTile } from "@/features/odds/components/task-detail/detail-ui";
import { GroupButton } from "@/features/odds/components/task-detail/group-button";
import { OddsTaskActionsPanel } from "@/features/odds/components/task-detail/odds-task-actions-panel";
import { OddsTaskAuditPanel } from "@/features/odds/components/task-detail/odds-task-audit-panel";
import { OddsTaskHistoryPanel } from "@/features/odds/components/task-detail/odds-task-history-panel";
import { ProtectedAssetPreview } from "@/features/odds/components/task-detail/protected-asset-preview";
import { QaComponentBoundary } from "@/features/odds/components/task-detail/qa-component-boundary";
import { RevisionEmptyState, RevisionHistoryItem } from "@/features/odds/components/task-detail/odds-task-revision-panel";
import type { OddsTask, OddsTaskResult } from "@/features/odds/api";
import { TaskDetailTabs, type TaskDetailTab } from "@/features/odds/components/task-detail/task-detail-tabs";
import { InfoTaskDesktop } from "@/features/odds/components/task-detail/info-task-desktop";
import { OddsTaskOutputPanel } from "@/features/odds/components/task-detail/odds-task-output-panel";
import { OutputResultCard } from "@/features/odds/components/task-detail/output-result-card";
import { LeaderReviewForm } from "@/features/odds/components/task-detail/leader-review-form";
import { ActiveRevisionPanel, OddsTaskRevisionPanel, RevisionHistoryPanel } from "@/features/odds/components/task-detail/odds-task-revision-panel";
import type { OddsTaskRevision } from "@/features/odds/api";
import { PerformanceNavbar } from "@/features/kv-retail/components/performance-navbar";
import { PerformanceSidebar } from "@/features/kv-retail/components/performance-sidebar";
import { TaskCard, TaskCardMobile } from "@/components/odds/legacy-taskcard";
import { TaskFormModal } from "@/components/odds/task-form-modal";
import { TaskDesktopPageTransition } from "@/components/ui/task-desktop-page-transition";
import { TaskPageTitle } from "@/features/kv-retail/components/task-page-title";
import { TaskKpiMetrics, type TaskMetricTheme } from "@/features/kv-retail/components/task-kpi-metrics";
import { TaskSearchBar } from "@/features/kv-retail/components/task-search-bar";
import { TaskFilterDropdown, type TaskFilterTheme } from "@/features/kv-retail/components/task-filter-dropdown";

export type MenuItem = {
  id: string;
  label: string;
  children?: MenuItem[];
};

const exampleMenus: MenuItem[] = [
  {
    id: "odds",
    label: "ODDS",
    children: [
      {
        id: "odds-detail-task",
        label: "Task Detail",
        children: [
          { id: "odds-detail-task-header-title", label: "Header Title" },
          { id: "odds-detail-task-back-button", label: "Back Button" },
          { id: "odds-detail-task-header", label: "Task Header" },
          { id: "odds-detail-task-timer", label: "Task Timer" },
          { id: "odds-detail-task-revision-brief", label: "Revision Brief" },
          { id: "odds-detail-task-revision-message", label: "Revision Message" },
          { id: "odds-detail-task-summary", label: "Task Summary" },
          { id: "odds-detail-task-tabs", label: "Task Detail Tabs" },
          { id: "odds-detail-task-info-desktop", label: "Info Task Desktop" },
          {
            id: "odds-detail-task-primitives",
            label: "Primitives",
            children: [
              { id: "odds-detail-task-button", label: "Button" },
              { id: "odds-detail-task-group-button", label: "Group Button" },
              { id: "odds-detail-task-designer-revision-status", label: "Designer Revision Status" },
              { id: "odds-detail-task-detail-shell-message", label: "Detail Shell Message" },
              { id: "odds-detail-task-detail-info-row", label: "Detail Info Row" },
              { id: "odds-detail-task-detail-timer-tile", label: "Detail Timer Tile" },
              { id: "odds-detail-task-detail-action-button", label: "Detail Action Button" },
              { id: "odds-detail-task-detail-skeleton", label: "Detail Skeleton" },
              { id: "odds-detail-task-qa-boundary", label: "QA Component Boundary" },
            ],
          },
          {
            id: "odds-detail-task-surfaces",
            label: "Surfaces",
            children: [
              { id: "odds-detail-task-client-table-editor", label: "Client Table Brief Editor" },
              { id: "odds-detail-task-actions-panel", label: "Actions Panel" },
              { id: "odds-detail-task-audit-panel", label: "Audit Panel" },
              { id: "odds-detail-task-history-panel", label: "History Panel" },
              { id: "odds-detail-task-revision-empty", label: "Revision Empty State" },
              { id: "odds-detail-task-revision-history-item", label: "Revision History Item" },
              { id: "odds-detail-task-protected-asset", label: "Protected Asset Preview" },
            ],
          },
          {
            id: "odds-detail-task-panel",
            label: "Panel",
            children: [
              {
                id: "odds-detail-task-output",
                label: "Task Output",
                children: [
                  { id: "odds-detail-task-output-panel", label: "Panel" },
                  { id: "odds-detail-task-output-result-card", label: "Output Result Card" },
                  { id: "odds-detail-task-output-leader-review", label: "Leader Review Form" },
                ],
              },
              {
                id: "odds-detail-task-revision",
                label: "Revisi",
                children: [
                  { id: "odds-detail-task-revision-panel", label: "Panel" },
                  { id: "odds-detail-task-active", label: "Active Revision Panel" },
                  { id: "odds-detail-task-history", label: "Revision History Panel" },
                ],
              },
            ],
          },
        ],
      },
      { id: "odds-task-card", label: "Task Card" },
      { id: "odds-request-task", label: "Request Task" },
    ],
  },
  {
    id: "kv-retail",
    label: "KV Retail",
    children: [
      { id: "kv-retail-performance-navbar", label: "Performance Navbar" },
      { id: "kv-retail-performance-sidebar", label: "Performance Sidebar" },
      { id: "kv-retail-task-card", label: "Task Card" },
      { id: "kv-retail-task-card-mobile", label: "Task Card Mobile" },
      { id: "kv-retail-task-form-modal", label: "Task Form Modal" },
      { id: "kv-retail-task-desktop-transition", label: "Task Desktop Page Transition" },
      { id: "kv-retail-task-page-title", label: "Task Page Title" },
      { id: "kv-retail-task-kpi-metrics", label: "Task KPI Metrics" },
      { id: "kv-retail-task-search-bar", label: "Search Bar" },
      { id: "kv-retail-task-filter-dropdown", label: "Filter Vendor / Urutkan" },
    ],
  },
];

export function MenuList({ items, activeItem, onSelect, level = 1 }: { items: MenuItem[]; activeItem: string; onSelect: (id: string) => void; level?: number }) {
  const [openItems, setOpenItems] = useState(() => new Set(items.filter((item) => item.children).map((item) => item.id)));

  const toggle = (id: string) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <ul className="flex flex-col gap-1" aria-label={level === 1 ? "Menu contoh" : undefined}>
      {items.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        const isOpen = openItems.has(item.id);

        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => hasChildren ? toggle(item.id) : onSelect(item.id)}
              aria-expanded={hasChildren ? isOpen : undefined}
              className={`flex h-9 w-full items-center gap-2 rounded-lg pr-2 text-left text-xs transition ${
                activeItem === item.id
                  ? "bg-[#e5f7ff] font-semibold text-[#0077bf]"
                  : level === 1
                    ? "font-semibold text-[#3b4446] hover:bg-[#f3fbff]"
                    : "text-[#5f6b73] hover:bg-[#f3fbff]"
              }`}
              style={{ paddingLeft: `${8 + (level - 1) * 16}px` }}
            >
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {hasChildren && (
                <MaterialIcon
                  name="expand_more"
                  size="sm"
                  className={`shrink-0 text-[#7d7c7c] transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {hasChildren && isOpen && <MenuList items={item.children!} activeItem={activeItem} onSelect={onSelect} level={level + 1} />}
          </li>
        );
      })}
    </ul>
  );
}

function HeaderTitlePlayground() {
  const [title, setTitle] = useState("Header Title");

  return (
    <>
      <InteractiveComponentPlayground
        componentName="HeaderTitle"
        componentPath="apps/frontend/src/components/typography/header-title.tsx"
        controls={(
          <label className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-500">Title</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-32 bg-transparent text-xs font-medium text-slate-700 outline-none placeholder:text-slate-400" placeholder="Header Title" />
          </label>
        )}
        code={`import { HeaderTitle } from "@/components/typography/header-title";\n\n<HeaderTitle>${title || "Header Title"}</HeaderTitle>`}
      >
        <HeaderTitle>{title || "Header Title"}</HeaderTitle>
      </InteractiveComponentPlayground>
    </>
  );
}

const taskSummaryPreview = {
  id: 1,
  task_number: "ODDS-COMPONENT-0001",
  request_type: "design",
  design_purpose: "Banner Marketplace Agustus",
  brief_text: "",
  reference_visual: null,
  category_snapshot: { name: "Banner Marketplace", sla_minutes: 360 },
  deadline: "2026-08-02T16:30:00+07:00",
  important_matrix: "Q4",
  status: "spv_review",
  task_type: "new_task",
  priority_score: 85,
  brief_return_count: 1,
  leader_revision_count: 0,
  normal_revision_count: 0,
  created_at: "2026-08-02T10:30:00+07:00",
  category: { id: 1, name: "Banner Marketplace", score_weight: 1, normal_revision_limit: 2, sla_minutes: 360, is_active: true },
  requester: { id: 1, name: "Client QA", username: "client-qa", roles: ["Client"] },
  assigned_designer: { id: 2, name: "Designer Test", username: "designer", roles: ["Designer"] },
} as OddsTask;

function TaskSummaryPlayground() {
  return (
    <InteractiveComponentPlayground
      componentName="TaskSummary"
      componentPath="apps/frontend/src/features/odds/components/task-detail/task-summary.tsx"
      code={`import { TaskSummary } from "@/features/odds/components/task-detail/task-summary";\n\n<TaskSummary task={task} ... />`}
    >
      <TaskSummary
        task={taskSummaryPreview}
        cardClass="border border-[#BDEAFF]/60 bg-white p-4 rounded-[16px]"
        textLabelClass="block text-[9px] font-bold uppercase tracking-wider text-[#04044A]/60"
        textValueClass="mt-1 block font-semibold text-xs text-[#04044A]"
        formatDate={(value) => value ? new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value)) : "-"}
        statusLabel={(value) => value === "spv_review" ? "Review Leader Creative" : value}
      />
    </InteractiveComponentPlayground>
  );
}

function TaskDetailBackButtonPlayground() {
  return (
    <InteractiveComponentPlayground
      componentName="TaskDetailBackButton"
      componentPath="apps/frontend/src/features/odds/components/task-detail/task-detail-back-button.tsx"
      code={`import { TaskDetailBackButton } from "@/features/odds/components/task-detail/task-detail-back-button";\n\n<TaskDetailBackButton />`}
    >
      <div className="flex min-h-24 items-center justify-center rounded-xl bg-[#f3fbff] p-6">
        <TaskDetailBackButton />
      </div>
    </InteractiveComponentPlayground>
  );
}

function TaskHeaderPlayground() {
  return (
    <InteractiveComponentPlayground
      componentName="TaskHeader"
      componentPath="apps/frontend/src/features/odds/components/task-detail/task-header.tsx"
      code={`import { TaskHeader } from "@/features/odds/components/task-detail/task-header";\n\n<TaskHeader title="Banner Marketplace Agustus" />`}
    >
      <TaskHeader title="Banner Marketplace Agustus" />
    </InteractiveComponentPlayground>
  );
}

function TaskTimerPlayground() {
  return (
    <InteractiveComponentPlayground
      componentName="TaskTimer"
      componentPath="apps/frontend/src/features/odds/components/task-detail/task-timer.tsx"
      code={`import { TaskTimer } from "@/features/odds/components/task-detail/task-timer";\n\n<TaskTimer>2j 30m</TaskTimer>`}
    >
      <TaskTimer>2j 30m</TaskTimer>
    </InteractiveComponentPlayground>
  );
}

function RevisionBriefPlayground() {
  return (
    <InteractiveComponentPlayground
      componentName="RevisionBrief"
      componentPath="apps/frontend/src/features/odds/components/task-detail/revision-brief.tsx"
      code={`import { RevisionBrief } from "@/features/odds/components/task-detail/revision-brief";\n\n<RevisionBrief editing={false} onEdit={handleEdit} onSubmit={handleSubmit} />`}
    >
      <RevisionBrief editing={false} onEdit={() => undefined} onSubmit={() => undefined} />
    </InteractiveComponentPlayground>
  );
}

function RevisionMessagePlayground() {
  return (
    <InteractiveComponentPlayground
      componentName="RevisionMessage"
      componentPath="apps/frontend/src/features/odds/components/task-detail/revision-message.tsx"
      code={`import { RevisionMessage } from "@/features/odds/components/task-detail/revision-message";\n\n<RevisionMessage message="Mohon perjelas headline promo." />`}
    >
      <RevisionMessage message="Mohon perjelas headline promo dan tambahkan referensi visual produk." />
    </InteractiveComponentPlayground>
  );
}

function ButtonPlayground() { return <InteractiveComponentPlayground componentName="Button" componentPath="apps/frontend/src/features/odds/components/task-detail/button.tsx" code={`<Button label="Simpan" icon="save" variant="blue" />`}><Button label="Simpan" icon="save" variant="blue" /></InteractiveComponentPlayground>; }
function GroupButtonPlayground() { return <InteractiveComponentPlayground componentName="GroupButton" componentPath="apps/frontend/src/features/odds/components/task-detail/group-button.tsx" code={`<GroupButton primaryLabel="Simpan" secondaryLabel="Kembali" secondaryDisabled={false} />`}><GroupButton primaryLabel="Simpan" secondaryLabel="Kembali" primaryIcon="save" secondaryIcon="arrow_back" secondaryDisabled={false} primaryVariant="blue" /></InteractiveComponentPlayground>; }
function DesignerRevisionStatusPlayground() { return <InteractiveComponentPlayground componentName="DesignerRevisionStatusMessage" componentPath="apps/frontend/src/features/odds/components/task-detail/designer-revision-status-message.tsx" code={`<DesignerRevisionStatusMessage status="Menunggu" message="Menunggu revisi brief dari client." />`}><DesignerRevisionStatusMessage status="Menunggu" message="Menunggu revisi brief dari client." /></InteractiveComponentPlayground>; }
function DetailShellMessagePlayground() { return <InteractiveComponentPlayground componentName="DetailShellMessage" componentPath="apps/frontend/src/features/odds/components/task-detail/detail-ui.tsx" code={`<DetailShellMessage message="Task tidak ditemukan." />`}><DetailShellMessage message="Task tidak ditemukan." /></InteractiveComponentPlayground>; }
function DetailInfoRowPlayground() { return <InteractiveComponentPlayground componentName="DetailInfoRow" componentPath="apps/frontend/src/features/odds/components/task-detail/detail-ui.tsx" code={`<DetailInfoRow label="Status" value="Dikerjakan" />`}><DetailInfoRow label="Status" value="Dikerjakan" /></InteractiveComponentPlayground>; }
function DetailTimerTilePlayground() { return <InteractiveComponentPlayground componentName="DetailTimerTile" componentPath="apps/frontend/src/features/odds/components/task-detail/detail-ui.tsx" code={`<DetailTimerTile label="Waktu Desainer" value="2j 30m" />`}><DetailTimerTile label="Waktu Desainer" value="2j 30m" /></InteractiveComponentPlayground>; }
function DetailActionButtonPlayground() { return <InteractiveComponentPlayground componentName="DetailActionButton" componentPath="apps/frontend/src/features/odds/components/task-detail/detail-ui.tsx" code={`<DetailActionButton icon="send" label="Kirim" onClick={handleClick} />`}><DetailActionButton icon="send" label="Kirim" onClick={() => undefined} /></InteractiveComponentPlayground>; }
function DetailSkeletonPlayground() { return <InteractiveComponentPlayground componentName="DetailSkeleton" componentPath="apps/frontend/src/features/odds/components/task-detail/detail-ui.tsx" code={`<DetailSkeleton />`}><div className="h-[420px]"><DetailSkeleton /></div></InteractiveComponentPlayground>; }
function QaBoundaryPlayground() { return <InteractiveComponentPlayground componentName="QaComponentBoundary" componentPath="apps/frontend/src/features/odds/components/task-detail/qa-component-boundary.tsx" code={`<QaComponentBoundary enabled label="Example"><div>Content</div></QaComponentBoundary>`}><QaComponentBoundary enabled label="Example"><div className="rounded-lg bg-slate-50 p-8 text-sm text-slate-600">Component content</div></QaComponentBoundary></InteractiveComponentPlayground>; }
function ClientTableBriefEditorPlayground() { const [brief, setBrief] = useState("<table><tbody><tr><th>Kategori</th><td>Banner Marketplace</td></tr><tr><th>Produk</th><td>Produk Unggulan</td></tr></tbody></table><table><tbody><tr><td>1</td><td>Headline promo</td><td>Referensi visual</td><td>Tambahkan logo</td></tr></tbody></table>"); return <InteractiveComponentPlayground componentName="ClientTableBriefEditor" componentPath="apps/frontend/src/features/odds/components/task-detail/client-table-brief-editor.tsx" code={`<ClientTableBriefEditor task={task} briefText={briefText} theme="light" ... />`}><div className="h-[460px]"><ClientTableBriefEditor task={taskSummaryPreview} briefText={brief} theme="light" returnNote="Mohon perjelas headline promo." onChange={setBrief} /></div></InteractiveComponentPlayground>; }
function ActionsPanelPlayground() { return <InteractiveComponentPlayground componentName="OddsTaskActionsPanel" componentPath="apps/frontend/src/features/odds/components/task-detail/odds-task-actions-panel.tsx" code={`<OddsTaskActionsPanel>...</OddsTaskActionsPanel>`}><OddsTaskActionsPanel className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm font-semibold text-slate-700">Area action task</p></OddsTaskActionsPanel></InteractiveComponentPlayground>; }
function AuditPanelPlayground() { return <InteractiveComponentPlayground componentName="OddsTaskAuditPanel" componentPath="apps/frontend/src/features/odds/components/task-detail/odds-task-audit-panel.tsx" code={`<OddsTaskAuditPanel task={task} timerTotals={timerTotals} ... />`}><OddsTaskAuditPanel task={taskSummaryPreview} timerTotals={{ work: 5400, revision: 1200, spv_review: 600, client_review: 300 }} isSlaOverdue={false} slaMinutes={360} formatDuration={(seconds) => `${Math.floor(seconds / 3600)}j ${Math.floor((seconds % 3600) / 60)}m`} className="rounded-2xl border border-slate-200 bg-white p-4" /></InteractiveComponentPlayground>; }
function HistoryPanelPlayground() { return <InteractiveComponentPlayground componentName="OddsTaskHistoryPanel" componentPath="apps/frontend/src/features/odds/components/task-detail/odds-task-history-panel.tsx" code={`<OddsTaskHistoryPanel>...</OddsTaskHistoryPanel>`}><OddsTaskHistoryPanel className="min-h-40 rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-600">Riwayat task ditampilkan di sini.</p></OddsTaskHistoryPanel></InteractiveComponentPlayground>; }
function RevisionEmptyPlayground() { return <InteractiveComponentPlayground componentName="RevisionEmptyState" componentPath="apps/frontend/src/features/odds/components/task-detail/odds-task-revision-panel.tsx" code={`<RevisionEmptyState />`}><div className="h-52"><RevisionEmptyState /></div></InteractiveComponentPlayground>; }
function RevisionHistoryItemPlayground() { const revision: OddsTaskRevision = { id: 1, task_id: 1, revision_type: "leader", status: "open", notes: "Sesuaikan headline promo.", is_urgent_final: false, created_at: "2026-08-02T12:24:00+07:00" }; return <InteractiveComponentPlayground componentName="RevisionHistoryItem" componentPath="apps/frontend/src/features/odds/components/task-detail/odds-task-revision-panel.tsx" code={`<RevisionHistoryItem revision={revision} />`}><RevisionHistoryItem revision={revision} /></InteractiveComponentPlayground>; }
function ProtectedAssetPreviewPlayground() { return <InteractiveComponentPlayground componentName="ProtectedAssetPreview" componentPath="apps/frontend/src/features/odds/components/task-detail/protected-asset-preview.tsx" code={`<ProtectedAssetPreview fallbackUrl={imageUrl} alt="Referensi desain" />`}><div className="h-52 overflow-hidden rounded-xl"><ProtectedAssetPreview fallbackUrl="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect width='100%25' height='100%25' fill='%23e5f7ff'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%230077bf' font-family='Arial' font-size='28'%3EReferensi Desain%3C/text%3E%3C/svg%3E" alt="Referensi desain" /></div></InteractiveComponentPlayground>; }

function TaskDetailTabsPlayground() {
  const [activeTab, setActiveTab] = useState<TaskDetailTab>("brief");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <InteractiveComponentPlayground
      componentName="TaskDetailTabs"
      componentPath="apps/frontend/src/features/odds/components/task-detail/task-detail-tabs.tsx"
      code={`import { TaskDetailTabs } from "@/features/odds/components/task-detail/task-detail-tabs";\n\n<TaskDetailTabs activeTab="brief" ... />`}
    >
      <TaskDetailTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        navClass="flex gap-2 overflow-x-auto rounded-2xl border border-[#BDEAFF]/60 bg-white p-1"
        tabButtonClass={(tab) => activeTab === tab ? "text-[#00A4FF]" : "text-[#04044A]/60 hover:text-[#00A4FF]"}
      />
    </InteractiveComponentPlayground>
  );
}

function InfoTaskDesktopPlayground() {
  return (
    <InteractiveComponentPlayground
      componentName="InfoTaskDesktop"
      componentPath="apps/frontend/src/features/odds/components/task-detail/info-task-desktop.tsx"
      code={`import { InfoTaskDesktop } from "@/features/odds/components/task-detail/info-task-desktop";\n\n<InfoTaskDesktop rows={rows} ... />`}
    >
      <InfoTaskDesktop
        cardClass="border border-[#BDEAFF]/60 bg-white p-5 text-[#04044A] rounded-2xl"
        rows={[
          { label: "Jenis task", value: "Tugas Baru" },
          { label: "Batas waktu pengerjaan", value: "6 Jam" },
          { label: "Status antrean", value: "completed" },
          { label: "Estimasi mulai", value: "02 Agu 2026, 10.00" },
          { label: "Revisi client", value: "-" },
          { label: "Revisi Brief", value: "1x" },
          { label: "Revisi dari SPV", value: "-" },
          { label: "Ada masalah kualitas?", value: "Tidak" },
        ]}
      />
    </InteractiveComponentPlayground>
  );
}

function TaskOutputPlayground() {
  type OutputScenario = "empty" | "leader-review" | "leader-revision" | "client-revision";
  const [scenario, setScenario] = useState<OutputScenario>("empty");
  const [scenarioOpen, setScenarioOpen] = useState(false);
  const scenarioLabels: Record<OutputScenario, string> = { empty: "Tidak ada output", "leader-review": "Ada output · Review Leader", "leader-revision": "Ada output · Revisi Leader", "client-revision": "Ada output · Revisi Client" };
  const hasOutput = scenario !== "empty";
  const result: OddsTaskResult | null = hasOutput ? {
    id: 1,
    version_number: 1,
    submitted_by: 2,
    result_notes: "Total Output: 3\nBanner final untuk review.",
    status: "pending_spv",
    submitted_at: "2026-08-02T12:00:00+07:00",
    asset_links: [{ id: 1, label: "Banner-final.png", url: "https://example.com/banner-final.png", provider: "external" }],
  } : null;

  return (
    <InteractiveComponentPlayground
      componentName="OddsTaskOutputPanel"
      componentPath="apps/frontend/src/features/odds/components/task-detail/odds-task-output-panel.tsx"
      code={`import { OddsTaskOutputPanel } from "@/features/odds/components/task-detail/odds-task-output-panel";\n\n<OddsTaskOutputPanel result={result} ... />`}
      controls={(
        <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500">Skenario</span>
          <div className="relative">
            <button type="button" onClick={() => setScenarioOpen((value) => !value)} className="flex min-w-28 items-center justify-between gap-2 text-xs font-medium text-slate-700 outline-none">
              {scenarioLabels[scenario]}<MaterialIcon name="expand_more" size="xs" className={`text-slate-400 transition-transform ${scenarioOpen ? "rotate-180" : ""}`} />
            </button>
            {scenarioOpen && <div className="absolute left-0 top-[calc(100%+6px)] z-30 w-32 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
              {(Object.keys(scenarioLabels) as OutputScenario[]).map((option) => <button key={option} type="button" onClick={() => { setScenario(option); setScenarioOpen(false); }} className={`block w-full rounded-md px-2.5 py-1.5 text-left text-xs transition ${scenario === option ? "bg-blue-50 font-semibold text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}>{scenarioLabels[option]}</button>)}
            </div>}
          </div>
        </div>
        </div>
      )}
    >
      <OddsTaskOutputPanel
        result={result}
        formatDate={(value) => value ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "-"}
        dark={false}
        canReview={scenario === "leader-review"}
        reviewNote=""
        onReviewNoteChange={() => undefined}
        busy={null}
        onReview={() => undefined}
        canSubmit={scenario === "leader-revision" || scenario === "client-revision"}
        resultNotes=""
        assetUrl=""
        onResultNotesChange={() => undefined}
        onAssetUrlChange={() => undefined}
        onSubmit={(event) => event.preventDefault()}
        submitButtonLabel="Submit"
        isLeaderRevisionTask={scenario === "leader-revision"}
        isClientRevisionTask={scenario === "client-revision"}
        className="flex min-h-[300px] flex-col overflow-hidden rounded-2xl border border-[#BDEAFF]/60 bg-white p-4 text-[#04044A] shadow-[0_8px_30px_rgba(0,164,255,0.04)]"
      />
    </InteractiveComponentPlayground>
  );
}

function OutputResultCardPlayground() {
  const [showTotal, setShowTotal] = useState(true);
  const [showNote, setShowNote] = useState(true);
  const [statusOpen, setStatusOpen] = useState(false);
  const [status, setStatus] = useState("pending_spv");
  const result: OddsTaskResult = {
    id: 1,
    version_number: 1,
    submitted_by: 2,
    result_notes: `${showTotal ? "Total Output: 3\n" : ""}${showNote ? "Banner final untuk review." : ""}`,
    status,
    submitted_at: "2026-08-02T12:00:00+07:00",
    asset_links: [],
  };

  return (
    <InteractiveComponentPlayground
      componentName="OutputResultCard"
      componentPath="apps/frontend/src/features/odds/components/task-detail/output-result-card.tsx"
      code={`<OutputResultCard result={result} formatDate={formatDate} />`}
      controls={(
        <div className="flex flex-wrap items-center gap-2.5">
          {[{ label: "Total Output", value: showTotal, set: setShowTotal }, { label: "Catatan", value: showNote, set: setShowNote }].map((control) => <button key={control.label} type="button" aria-pressed={control.value} onClick={() => control.set((value) => !value)} className={`flex h-8 items-center gap-2 rounded-lg border px-2.5 text-xs font-medium shadow-sm transition ${control.value ? "border-blue-200 bg-blue-50 text-blue-600" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}><span className={`relative inline-flex h-4 w-7 shrink-0 rounded-full transition-colors ${control.value ? "bg-blue-500" : "bg-slate-300"}`}><span className={`absolute left-0.5 top-0.5 size-3 rounded-full bg-white shadow-sm transition-transform ${control.value ? "translate-x-3.5" : "translate-x-0"}`} /></span><span className="whitespace-nowrap">{control.label}</span></button>)}
          <div className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 shadow-sm"><span className="text-[11px] font-semibold text-slate-500">Status</span><div className="relative"><button type="button" onClick={() => setStatusOpen((value) => !value)} className="flex min-w-28 items-center justify-between gap-2 text-xs font-medium text-slate-700">{status === "pending_spv" ? "Review Leader" : status}<MaterialIcon name="expand_more" size="xs" /></button>{statusOpen && <div className="absolute left-0 top-[calc(100%+6px)] z-30 w-32 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">{["pending_spv", "approved", "revision"].map((option) => <button key={option} type="button" onClick={() => { setStatus(option); setStatusOpen(false); }} className="block w-full rounded-md px-2.5 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-50">{option === "pending_spv" ? "Review Leader" : option}</button>)}</div>}</div></div>
        </div>
      )}
    >
      <OutputResultCard result={result} formatDate={(value) => value ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "-"} />
    </InteractiveComponentPlayground>
  );
}

function LeaderReviewFormPlayground() {
  const [note, setNote] = useState("");

  return (
    <InteractiveComponentPlayground
      componentName="LeaderReviewForm"
      componentPath="apps/frontend/src/features/odds/components/task-detail/leader-review-form.tsx"
      code={`<LeaderReviewForm reviewNote={reviewNote} onReview={onReview} />`}
    >
      <LeaderReviewForm value={note} onChange={setNote} onReview={() => undefined} />
    </InteractiveComponentPlayground>
  );
}

function RevisionPanelPlayground() {
  const [hasRevisions, setHasRevisions] = useState(false);
  const [selectedRevisionId, setSelectedRevisionId] = useState<number | null>(1);
  const revision: OddsTaskRevision = { id: 1, task_id: 1, revision_type: "leader", status: "open", notes: "Sesuaikan hierarki promo dan perjelas headline utama.", is_urgent_final: false, created_at: "2026-08-02T12:24:00+07:00" };
  const revisions = [revision, { ...revision, id: 2, status: "approved", notes: "Sesuaikan ukuran produk." }];

  return (
    <InteractiveComponentPlayground
      componentName="OddsTaskRevisionPanel"
      componentPath="apps/frontend/src/features/odds/components/task-detail/odds-task-revision-panel.tsx"
      code={`<OddsTaskRevisionPanel hasRevisions={hasRevisions}>...</OddsTaskRevisionPanel>`}
      controls={<button type="button" aria-pressed={hasRevisions} onClick={() => setHasRevisions((value) => !value)} className={`flex h-8 items-center gap-2 rounded-lg border px-2.5 text-xs font-medium shadow-sm transition ${hasRevisions ? "border-blue-200 bg-blue-50 text-blue-600" : "border-slate-200 bg-white text-slate-600"}`}><span className={`relative inline-flex h-4 w-7 shrink-0 rounded-full ${hasRevisions ? "bg-blue-500" : "bg-slate-300"}`}><span className={`absolute left-0.5 top-0.5 size-3 rounded-full bg-white transition-transform ${hasRevisions ? "translate-x-3.5" : "translate-x-0"}`} /></span>{hasRevisions ? "Ada revisi" : "Tidak ada revisi"}</button>}
    >
      <OddsTaskRevisionPanel hasRevisions={hasRevisions} className={hasRevisions ? "grid min-h-[300px] grid-cols-1 gap-2 rounded-xl lg:grid-cols-4" : "flex min-h-[300px] flex-col overflow-hidden rounded-2xl border border-[#BDEAFF]/60 bg-white p-4 shadow-[0_8px_30px_rgba(0,164,255,0.04)]"}>
        <>
          {hasRevisions && <div className="min-h-0 lg:col-span-3"><section className="flex h-full min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-4"><ActiveRevisionPanel revision={revision} leader /></section></div>}
          {hasRevisions && <div className="min-h-0 lg:col-span-1"><RevisionHistoryPanel revisions={revisions} selectedRevisionId={selectedRevisionId} onSelect={setSelectedRevisionId} /></div>}
        </>
      </OddsTaskRevisionPanel>
    </InteractiveComponentPlayground>
  );
}

function ActiveRevisionPlayground() {
  const revision: OddsTaskRevision = { id: 1, task_id: 1, revision_type: "leader", status: "open", notes: "Sesuaikan hierarki promo dan perjelas headline utama.", is_urgent_final: false, created_at: "2026-08-02T12:24:00+07:00" };
  return <InteractiveComponentPlayground componentName="ActiveRevisionPanel" componentPath="apps/frontend/src/features/odds/components/task-detail/odds-task-revision-panel.tsx" code={`<ActiveRevisionPanel revision={revision} leader />`}><section className="rounded-2xl border border-slate-200 bg-white p-4"><ActiveRevisionPanel revision={revision} leader /></section></InteractiveComponentPlayground>;
}

function RevisionHistoryPlayground() {
  const [selectedRevisionId, setSelectedRevisionId] = useState<number | null>(1);
  const revisions: OddsTaskRevision[] = [
    { id: 1, task_id: 1, revision_type: "leader", status: "open", notes: "Sesuaikan hierarki promo.", is_urgent_final: false, created_at: "2026-08-02T12:24:00+07:00" },
    { id: 2, task_id: 1, revision_type: "leader", status: "approved", notes: "Perjelas headline promo.", is_urgent_final: false, created_at: "2026-08-02T11:10:00+07:00" },
  ];
  return <InteractiveComponentPlayground componentName="RevisionHistoryPanel" componentPath="apps/frontend/src/features/odds/components/task-detail/odds-task-revision-panel.tsx" code={`<RevisionHistoryPanel revisions={revisions} onSelect={onSelect} />`}><RevisionHistoryPanel revisions={revisions} selectedRevisionId={selectedRevisionId} onSelect={setSelectedRevisionId} /></InteractiveComponentPlayground>;
}

function KvPerformanceNavbarPlayground() {
  return <InteractiveComponentPlayground componentName="PerformanceNavbar" componentPath="apps/frontend/src/features/kv-retail/components/performance-navbar.tsx" code={`<PerformanceNavbar theme="light" title="Daftar Tugas" />`}><PerformanceNavbar theme="light" title="Daftar Tugas" /></InteractiveComponentPlayground>;
}

function KvPerformanceSidebarPlayground() {
  const [expanded, setExpanded] = useState(true);
  return <InteractiveComponentPlayground componentName="PerformanceSidebar" componentPath="apps/frontend/src/features/kv-retail/components/performance-sidebar.tsx" code={`<PerformanceSidebar theme="light" expanded />`}><div className="h-[560px]"><PerformanceSidebar theme="light" activeHref="/kv-retail" expanded={expanded} onToggleExpanded={() => setExpanded((value) => !value)} onToggleTheme={() => undefined} onToggleRetro={() => undefined} className="!static !m-0 !h-full !min-h-0" /></div></InteractiveComponentPlayground>;
}

function KvTaskCardPlayground() {
  return <InteractiveComponentPlayground componentName="TaskCard" componentPath="apps/frontend/src/components/odds/legacy-taskcard/task-card.tsx" code={`<TaskCard state="Progress Design" title="Display Produk Agustus" ... />`}><TaskCard id={1} state="Progress Design" title="Display Produk Agustus" picVendor="Mireco" givenDate="2026-08-02" deadlineDate="2026-08-05" assignedUsers={[]} supportFileUrl={[null, null, null]} draftFileUrl={[null, null, null]} theme="light" /></InteractiveComponentPlayground>;
}

function KvTaskCardMobilePlayground() {
  return <InteractiveComponentPlayground componentName="TaskCardMobile" componentPath="apps/frontend/src/components/odds/legacy-taskcard/task-card-mobile.tsx" code={`<TaskCardMobile title="Display Produk Agustus" status="Progress Design" ... />`} initialBreakpoint="sm"><TaskCardMobile title="Display Produk Agustus" dateRange="02 Agu - 05 Agu 2026" vendor="Mireco" assignedTo="Designer Test" status="Progress Design" countdownLabel="2 hari lagi" theme="light" /></InteractiveComponentPlayground>;
}

function KvTaskFormModalPlayground() {
  const [open, setOpen] = useState(false);
  return <InteractiveComponentPlayground componentName="TaskFormModal" componentPath="apps/frontend/src/components/odds/task-form-modal.tsx" code={`<TaskFormModal isOpen={open} onClose={() => setOpen(false)} />`} controls={<button type="button" onClick={() => setOpen(true)} className="h-8 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-600 shadow-sm">Buka Modal</button>}><div className="flex min-h-48 items-center justify-center text-sm text-slate-500">Gunakan tombol Buka Modal pada toolbar.<TaskFormModal isOpen={open} onClose={() => setOpen(false)} /></div></InteractiveComponentPlayground>;
}

function KvTaskDesktopTransitionPlayground() {
  return <InteractiveComponentPlayground componentName="TaskDesktopPageTransition" componentPath="apps/frontend/src/components/ui/task-desktop-page-transition.tsx" code={`<TaskDesktopPageTransition>...</TaskDesktopPageTransition>`}><TaskDesktopPageTransition className="rounded-xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-semibold text-slate-800">Daftar Tugas</h2><p className="mt-2 text-sm text-slate-500">Konten halaman desktop berada di dalam transition wrapper.</p></TaskDesktopPageTransition></InteractiveComponentPlayground>;
}

function KvTaskPageTitlePlayground() {
  const [theme, setTheme] = useState<"light" | "dark" | "retro">("light");
  const themeLabels = { light: "Light", dark: "Dark", retro: "Retro" };
  return <InteractiveComponentPlayground componentName="TaskPageTitle" componentPath="apps/frontend/src/features/kv-retail/components/task-page-title.tsx" code={`<TaskPageTitle theme="light">Daftar Tugas</TaskPageTitle>`} controls={<div className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 shadow-sm"><span className="text-[11px] font-semibold text-slate-500">Theme</span>{(Object.keys(themeLabels) as Array<keyof typeof themeLabels>).map((option) => <button key={option} type="button" onClick={() => setTheme(option)} className={`rounded-md px-2 py-1 text-xs ${theme === option ? "bg-blue-50 font-semibold text-blue-600" : "hover:bg-slate-50"}`}>{themeLabels[option]}</button>)}</div>}><div className={`rounded-xl p-6 ${theme === "dark" ? "bg-[#111413]" : theme === "retro" ? "bg-[#dfe2d3]" : "bg-white"}`}><TaskPageTitle theme={theme}>Daftar Tugas</TaskPageTitle></div></InteractiveComponentPlayground>;
}

function KvTaskKpiMetricsPlayground() {
  const [theme, setTheme] = useState<TaskMetricTheme>("light");
  const metrics = [
    { state: "Total" as const, title: "Total Tugas", value: 24, icon: "assignment" },
    { state: "Progress" as const, title: "In Progress", value: 8, icon: "hourglass_bottom" },
    { state: "OnTrack" as const, title: "On Track", value: 12, icon: "track_changes" },
    { state: "Terlambat" as const, title: "Terlambat", value: 2, icon: "warning_amber" },
    { state: "Done" as const, title: "Selesai", value: 14, icon: "check_circle" },
  ];
  return <InteractiveComponentPlayground componentName="TaskKpiMetrics" componentPath="apps/frontend/src/features/kv-retail/components/task-kpi-metrics.tsx" code={`<TaskKpiMetrics metrics={metrics} theme="light" onAddTask={handleAddTask} />`} controls={<div className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 shadow-sm">{(["light", "dark", "retro"] as const).map((option) => <button key={option} type="button" onClick={() => setTheme(option)} className={`rounded-md px-2 py-1 text-xs capitalize ${theme === option ? "bg-blue-50 font-semibold text-blue-600" : "text-slate-500 hover:bg-slate-50"}`}>{option}</button>)}</div>}><TaskKpiMetrics metrics={metrics} theme={theme} onAddTask={() => undefined} /></InteractiveComponentPlayground>;
}

function KvTaskSearchBarPlayground() {
  const [theme, setTheme] = useState<TaskMetricTheme>("light");
  const [value, setValue] = useState("");
  return <InteractiveComponentPlayground componentName="TaskSearchBar" componentPath="apps/frontend/src/features/kv-retail/components/task-search-bar.tsx" code={`<TaskSearchBar value={searchQuery} onChange={setSearchQuery} theme="light" />`} controls={<div className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 shadow-sm">{(["light", "dark", "retro"] as const).map((option) => <button key={option} type="button" onClick={() => setTheme(option)} className={`rounded-md px-2 py-1 text-xs capitalize ${theme === option ? "bg-blue-50 font-semibold text-blue-600" : "text-slate-500 hover:bg-slate-50"}`}>{option}</button>)}</div>}><div className="max-w-3xl"><TaskSearchBar value={value} onChange={setValue} theme={theme} /></div></InteractiveComponentPlayground>;
}

function KvTaskFilterDropdownPlayground() {
  const [theme, setTheme] = useState<TaskFilterTheme>("light");
  const [vendor, setVendor] = useState("Semua Vendor");
  const [sort, setSort] = useState("Terbaru");
  return <InteractiveComponentPlayground componentName="TaskFilterDropdown" componentPath="apps/frontend/src/features/kv-retail/components/task-filter-dropdown.tsx" code={`<TaskFilterDropdown icon="storefront" label="Vendor" options={vendorOptions} value={filterVendor} onChange={setFilterVendor} theme="light" />`} controls={<div className="flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 shadow-sm">{(["light", "dark", "retro"] as const).map((option) => <button key={option} type="button" onClick={() => setTheme(option)} className={`rounded-md px-2 py-1 text-xs capitalize ${theme === option ? "bg-blue-50 font-semibold text-blue-600" : "text-slate-500 hover:bg-slate-50"}`}>{option}</button>)}</div>}><div className="flex items-center gap-2"><TaskFilterDropdown icon="storefront" label="Vendor" options={["Semua Vendor", "Vendor A", "Vendor B"]} value={vendor} onChange={setVendor} theme={theme} compact /><TaskFilterDropdown icon="sort" label="Urutkan" options={["Terbaru", "Terlama", "Deadline"]} value={sort} onChange={setSort} theme={theme} compact /></div></InteractiveComponentPlayground>;
}

export default function ComponentPage() {
  const [activeItem, setActiveItem] = useState("odds-detail-task-header-title");

  return (
    <div className="flex h-screen min-h-0 w-screen overflow-hidden bg-[#f3fbff] p-4">
      <aside className="flex h-full w-72 shrink-0 flex-col rounded-2xl border border-[#ebebeb] bg-white p-3">
        <div className="flex h-10 items-center px-2 text-sm font-semibold text-[#3b4446]">
          List Component
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto">
          <MenuList items={exampleMenus} activeItem={activeItem} onSelect={setActiveItem} />
        </nav>
      </aside>

      <main
        aria-label="Area konten component"
        className="ml-4 min-h-0 min-w-0 flex-1 overflow-auto rounded-2xl border border-[#ebebeb] bg-white p-6"
      >
        {activeItem === "odds-detail-task-header-title" ? (
          <HeaderTitlePlayground />
        ) : activeItem === "odds-detail-task-back-button" ? (
          <TaskDetailBackButtonPlayground />
        ) : activeItem === "odds-detail-task-header" ? (
          <TaskHeaderPlayground />
        ) : activeItem === "odds-detail-task-timer" ? (
          <TaskTimerPlayground />
        ) : activeItem === "odds-detail-task-revision-brief" ? (
          <RevisionBriefPlayground />
        ) : activeItem === "odds-detail-task-revision-message" ? (
          <RevisionMessagePlayground />
        ) : activeItem === "odds-detail-task-summary" ? (
          <TaskSummaryPlayground />
        ) : activeItem === "odds-detail-task-tabs" ? (
          <TaskDetailTabsPlayground />
        ) : activeItem === "odds-detail-task-info-desktop" ? (
          <InfoTaskDesktopPlayground />
        ) : activeItem === "odds-detail-task-button" ? (
          <ButtonPlayground />
        ) : activeItem === "odds-detail-task-group-button" ? (
          <GroupButtonPlayground />
        ) : activeItem === "odds-detail-task-designer-revision-status" ? (
          <DesignerRevisionStatusPlayground />
        ) : activeItem === "odds-detail-task-detail-shell-message" ? (
          <DetailShellMessagePlayground />
        ) : activeItem === "odds-detail-task-detail-info-row" ? (
          <DetailInfoRowPlayground />
        ) : activeItem === "odds-detail-task-detail-timer-tile" ? (
          <DetailTimerTilePlayground />
        ) : activeItem === "odds-detail-task-detail-action-button" ? (
          <DetailActionButtonPlayground />
        ) : activeItem === "odds-detail-task-detail-skeleton" ? (
          <DetailSkeletonPlayground />
        ) : activeItem === "odds-detail-task-qa-boundary" ? (
          <QaBoundaryPlayground />
        ) : activeItem === "odds-detail-task-client-table-editor" ? (
          <ClientTableBriefEditorPlayground />
        ) : activeItem === "odds-detail-task-actions-panel" ? (
          <ActionsPanelPlayground />
        ) : activeItem === "odds-detail-task-audit-panel" ? (
          <AuditPanelPlayground />
        ) : activeItem === "odds-detail-task-history-panel" ? (
          <HistoryPanelPlayground />
        ) : activeItem === "odds-detail-task-revision-empty" ? (
          <RevisionEmptyPlayground />
        ) : activeItem === "odds-detail-task-revision-history-item" ? (
          <RevisionHistoryItemPlayground />
        ) : activeItem === "odds-detail-task-protected-asset" ? (
          <ProtectedAssetPreviewPlayground />
        ) : activeItem === "odds-detail-task-output-panel" ? (
          <TaskOutputPlayground />
        ) : activeItem === "odds-detail-task-output-result-card" ? (
          <OutputResultCardPlayground />
        ) : activeItem === "odds-detail-task-output-leader-review" ? (
          <LeaderReviewFormPlayground />
        ) : activeItem === "odds-detail-task-revision-panel" ? (
          <RevisionPanelPlayground />
        ) : activeItem === "odds-detail-task-active" ? (
          <ActiveRevisionPlayground />
        ) : activeItem === "odds-detail-task-history" ? (
          <RevisionHistoryPlayground />
        ) : activeItem === "kv-retail-performance-navbar" ? (
          <KvPerformanceNavbarPlayground />
        ) : activeItem === "kv-retail-performance-sidebar" ? (
          <KvPerformanceSidebarPlayground />
        ) : activeItem === "kv-retail-task-card" ? (
          <KvTaskCardPlayground />
        ) : activeItem === "kv-retail-task-card-mobile" ? (
          <KvTaskCardMobilePlayground />
        ) : activeItem === "kv-retail-task-form-modal" ? (
          <KvTaskFormModalPlayground />
        ) : activeItem === "kv-retail-task-desktop-transition" ? (
          <KvTaskDesktopTransitionPlayground />
        ) : activeItem === "kv-retail-task-page-title" ? (
          <KvTaskPageTitlePlayground />
        ) : activeItem === "kv-retail-task-kpi-metrics" ? (
          <KvTaskKpiMetricsPlayground />
        ) : activeItem === "kv-retail-task-search-bar" ? (
          <KvTaskSearchBarPlayground />
        ) : activeItem === "kv-retail-task-filter-dropdown" ? (
          <KvTaskFilterDropdownPlayground />
        ) : (
          <h1 className="text-xl font-semibold text-[#3b4446]">Area Konten</h1>
        )}
      </main>
    </div>
  );
}
