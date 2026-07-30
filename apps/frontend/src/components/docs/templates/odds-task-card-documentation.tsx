"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, ZoomIn, ZoomOut, ChevronDown, Palette } from "lucide-react";
import { OddsTaskCard } from "@/components/odds/TaskCard/odds-task-card";
import { TaskCardCompactDate, TaskCardWideDate } from "@/components/odds/TaskCard/task-card-date";
import { TaskCardPerson, TaskCardPeople } from "@/components/odds/TaskCard/task-card-people";
import { TaskCardStatusBlock } from "@/components/odds/TaskCard/task-card-status-panel";
import type { OddsTask } from "@/features/odds/api";
import type { OddsTaskCardAction } from "@/components/odds/TaskCard";

// ==========================================
// 1. SUB-COMPONENTS FOR DOCUMENTATION SECTIONS
// ==========================================

function DocHeroSection() {
  return (
    <header className="doc-hero">
      <div className="doc-hero-badge">ODDS / TaskCard</div>
      <h1 className="doc-hero-title">ODDS Task Card & Composables</h1>
      <p className="doc-hero-subtitle">
        Kumpulan komponen kecil (*composables*) penyusun Task Card, serta kartu interaktif utuh (*OddsTaskCard*) untuk menampilkan rincian tugas.
      </p>
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <a href="#" className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
          <MonitorPlay size={16} /> Figma Design
        </a>
        <a href="#source-code" className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
          <FileCode size={16} /> Source Code
        </a>
      </div>
    </header>
  );
}

function DocInstallationSection({ copied, onCopyImport }: { copied: boolean; onCopyImport: () => void }) {
  return (
    <section className="doc-section">
      <h2 className="doc-section-title">Installation & Usage</h2>
      <div className="doc-install-card mt-4">
        <div className="doc-install-header">
          <span>File Location</span>
        </div>
        <div className="doc-install-body text-cu-muted">
          <code>apps/frontend/src/components/odds/TaskCard/</code>
        </div>
      </div>
      <div className="doc-install-card mt-4">
        <div className="doc-install-header flex-between">
          <span>Import Statement</span>
          <button onClick={onCopyImport} className="copy-btn">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <div className="doc-install-body">
          <code>import {'{ OddsTaskCard }'} from "@/components/odds/TaskCard/odds-task-card";</code>
        </div>
      </div>
    </section>
  );
}

function DocSourceCodeSection({ copied, onCopySource, sourceCode }: { copied: boolean; onCopySource: () => void; sourceCode: string }) {
  return (
    <section id="source-code" className="doc-section">
      <div className="doc-section-header">
        <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
        <p className="doc-section-desc">Salin dan tempel kode ini untuk menggunakan komponen di proyek Anda.</p>
      </div>
      
      <div className="doc-code-block-container">
        <div className="doc-code-block-header">
          <span className="doc-code-filename">components/odds/TaskCard/odds-task-card.tsx</span>
          <button onClick={onCopySource} className="copy-btn">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <div className="doc-code-area full-source">
          <pre>
            <code>{sourceCode}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

function DocAnatomySection({ palette }: { palette: any }) {
  return (
    <section className="doc-section">
      <div className="doc-section-header">
        <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Anatomy & Composables</h2>
        <p className="doc-section-desc">Visual grid komponen-komponen kecil (composables) pembangun task card.</p>
      </div>
      <div className="doc-grid mt-4">
        
        <div id="date-displays" className="doc-grid-item doc-preview-area overflow-x-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm scroll-mt-20">
          <h3 className="text-sm font-semibold mb-4 text-slate-700">Date Displays</h3>
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-8">
              <div>
                <p className="text-xs text-slate-400 mb-2 font-medium">Compact Date</p>
                <TaskCardCompactDate 
                  quadrant="QUADRAN 1" date="25" day="Sabtu" monthYear="JUL 2026" time="15:00" isDone={false}
                  accentClass="text-rose-500" primaryClass="text-rose-500" secondaryClass="text-rose-400" 
                />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-2 font-medium">Wide Date</p>
                <div className="flex rounded-lg overflow-hidden border border-slate-200 shadow-sm h-[70px]">
                  <TaskCardWideDate 
                    quadrant="QUADRAN 1" date="25" day="Sabtu" monthYear="JUL 2026" time="15:00" isDone={false} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="people-avatars" className="doc-grid-item doc-preview-area overflow-x-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm scroll-mt-20">
          <h3 className="text-sm font-semibold mb-4 text-slate-700">People / Avatars</h3>
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs text-slate-400 mb-2 font-medium">Single Person</p>
              <TaskCardPerson name="Rohmat Emha" role="Client" accent={true} />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2 font-medium">People Group (Compact)</p>
              <TaskCardPeople requesterName="Rohmat Emha" requesterRole="Client" designerName="Desainer A" compact={true} />
            </div>
          </div>
        </div>

        <div id="status-block" className="doc-grid-item doc-preview-area overflow-x-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 scroll-mt-20">
          <h3 className="text-sm font-semibold mb-4 text-slate-700">Status Block</h3>
          <div className="flex items-center gap-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 min-w-[250px]">
              <TaskCardStatusBlock 
                compact={false}
                isDone={false}
                isOverdue={false}
                isReview={false}
                palette={palette}
                status="Sedang Dikerjakan"
                statusDescription="Tersisa 1 Hari 5 Jam"
              />
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 min-w-[250px]">
              <TaskCardStatusBlock 
                compact={false}
                isDone={true}
                isOverdue={false}
                isReview={false}
                palette={palette}
                status="Selesai"
                statusDescription="Selesai pada 24 Jul 2026"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function DocApiSection() {
  return (
    <section className="doc-section">
      <div className="doc-section-header">
        <h2 className="doc-section-title"><BookOpen size={18} className="inline-icon" /> API Reference</h2>
        <p className="doc-section-desc">Daftar properti (props) lengkap yang diterima oleh komponen utama OddsTaskCard.</p>
      </div>
      <div className="doc-table-wrapper mt-4">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>task</code></td>
              <td><code>OddsTask</code></td>
              <td><span className="text-rose-500 font-mono text-xs">required</span></td>
              <td>Data task ODDS yang berisi status, judul, pengguna, timeline, dll.</td>
            </tr>
            <tr>
              <td><code>theme</code></td>
              <td><code>"light" | "dark" | "retro"</code></td>
              <td><span className="text-rose-500 font-mono text-xs">required</span></td>
              <td>Tema visual kartu.</td>
            </tr>
            <tr>
              <td><code>viewerRole</code></td>
              <td><code>"client" | "designer" | "leader"</code></td>
              <td><code>undefined</code></td>
              <td>Peran pengguna yang sedang melihat kartu.</td>
            </tr>
            <tr>
              <td><code>nowMs</code></td>
              <td><code>number</code></td>
              <td><span className="text-rose-500 font-mono text-xs">required</span></td>
              <td>Waktu acuan (timestamp milliseconds) untuk menghitung durasi tenggat waktu.</td>
            </tr>
            <tr>
              <td><code>onAction</code></td>
              <td><code>(action: OddsTaskCardAction) ={'>'} void</code></td>
              <td><span className="text-rose-500 font-mono text-xs">required</span></td>
              <td>Fungsi yang dipanggil saat tombol aksi ditekan.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PlaygroundSelect({ label, value, options, onChange }: { label: string; value: string; options: {value: string, label: string}[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || value;
  
  return (
    <div className="flex items-center gap-2 relative">
      <span className="text-sm font-medium text-slate-700 select-none">{label}</span>
      <div className="relative">
        <button 
          type="button"
          onClick={() => setOpen(!open)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="flex items-center justify-between min-w-[120px] h-8 px-3 text-sm bg-white border border-slate-200 rounded-md shadow-sm hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        >
          <span className="truncate text-slate-700 font-medium">{selectedLabel}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden z-20 origin-top animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map(opt => (
              <div 
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${value === opt.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const PALETTE = {
  primary: "text-[#3b4446]",
  secondary: "text-[#7d7c7c]",
  accent: "text-[#00a4ff]",
  soft: "bg-[#e5f5ff]",
};

// Stages data mirroring the odds-task-card-preview setup
const STAGES = [
  {
    value: "submitted",
    label: "1. Brief",
    taskDetails: {
      id: 1651201,
      task_number: "ODDS-QA-001",
      design_purpose: "Key Visual Campaign Juli",
      status: "submitted" as const,
      request_type: "design" as const,
      brief_text: "Preview visual untuk siklus TaskCard ODDS. Tidak terhubung ke API maupun aksi backend.",
      reference_visual: null,
      deadline: "2026-07-30T10:00:00+07:00",
      important_matrix: "Q1",
      task_type: "new_task",
      priority_score: 100,
      brief_return_count: 0,
      leader_revision_count: 0,
      normal_revision_count: 0,
      created_at: "2026-07-23T10:31:00+07:00",
      category: { id: 1, name: "Creative Design", score_weight: 1, normal_revision_limit: 2, sla_minutes: 1440, important_matrix: "Q1", is_active: true },
      requester: { id: 1, name: "Client Test", roles: ["Client"] } as any,
      assigned_designer: { id: 2, name: "Designer Test", roles: ["Designer"] } as any,
    }
  },
  {
    value: "queued",
    label: "2. Antrean",
    taskDetails: {
      id: 1651202,
      task_number: "ODDS-QA-002",
      design_purpose: "Banner Tokopedia & Shopee",
      status: "queued" as const,
      request_type: "design" as const,
      brief_text: "Preview visual untuk siklus TaskCard ODDS. Tidak terhubung ke API maupun aksi backend.",
      reference_visual: null,
      deadline: "2026-07-30T10:00:00+07:00",
      important_matrix: "Q1",
      task_type: "new_task",
      priority_score: 100,
      brief_return_count: 0,
      leader_revision_count: 0,
      normal_revision_count: 0,
      created_at: "2026-07-23T10:31:00+07:00",
      category: { id: 1, name: "Creative Design", score_weight: 1, normal_revision_limit: 2, sla_minutes: 1440, important_matrix: "Q1", is_active: true },
      requester: { id: 1, name: "Client Test", roles: ["Client"] } as any,
      assigned_designer: { id: 2, name: "Designer Test", roles: ["Designer"] } as any,
    }
  },
  {
    value: "in_progress",
    label: "3. Pengerjaan",
    taskDetails: {
      id: 1651203,
      task_number: "ODDS-QA-003",
      design_purpose: "Thumbnail YouTube Produk",
      status: "in_progress" as const,
      request_type: "design" as const,
      brief_text: "Preview visual untuk siklus TaskCard ODDS. Tidak terhubung ke API maupun aksi backend.",
      reference_visual: null,
      deadline: "2026-07-30T10:00:00+07:00",
      important_matrix: "Q1",
      task_type: "new_task",
      priority_score: 100,
      brief_return_count: 0,
      leader_revision_count: 0,
      normal_revision_count: 0,
      created_at: "2026-07-23T10:31:00+07:00",
      category: { id: 1, name: "Creative Design", score_weight: 1, normal_revision_limit: 2, sla_minutes: 1440, important_matrix: "Q1", is_active: true },
      requester: { id: 1, name: "Client Test", roles: ["Client"] } as any,
      assigned_designer: { id: 2, name: "Designer Test", roles: ["Designer"] } as any,
    }
  },
  {
    value: "spv_review",
    label: "4. Review SPV",
    taskDetails: {
      id: 1651204,
      task_number: "ODDS-QA-004",
      design_purpose: "KV Promo Payday",
      status: "spv_review" as const,
      request_type: "design" as const,
      brief_text: "Preview visual untuk siklus TaskCard ODDS. Tidak terhubung ke API maupun aksi backend.",
      reference_visual: null,
      deadline: "2026-07-30T10:00:00+07:00",
      important_matrix: "Q1",
      task_type: "new_task",
      priority_score: 100,
      brief_return_count: 0,
      leader_revision_count: 0,
      normal_revision_count: 0,
      created_at: "2026-07-23T10:31:00+07:00",
      category: { id: 1, name: "Creative Design", score_weight: 1, normal_revision_limit: 2, sla_minutes: 1440, important_matrix: "Q1", is_active: true },
      requester: { id: 1, name: "Client Test", roles: ["Client"] } as any,
      assigned_designer: { id: 2, name: "Designer Test", roles: ["Designer"] } as any,
      results: [{ id: 1, version_number: 1, status: "pending_spv", submitted_by: 2, result_notes: "Output QA", submitted_at: "2026-07-24T10:00:00+07:00", asset_links: [] }] as any,
    }
  },
  {
    value: "client_review",
    label: "5. Review Client",
    taskDetails: {
      id: 1651205,
      task_number: "ODDS-QA-005",
      design_purpose: "Desain Feed Instagram JETE RUN",
      status: "client_review" as const,
      request_type: "design" as const,
      brief_text: "Preview visual untuk siklus TaskCard ODDS. Tidak terhubung ke API maupun aksi backend.",
      reference_visual: null,
      deadline: "2026-07-30T10:00:00+07:00",
      important_matrix: "Q1",
      task_type: "new_task",
      priority_score: 100,
      brief_return_count: 0,
      leader_revision_count: 0,
      normal_revision_count: 0,
      created_at: "2026-07-23T10:31:00+07:00",
      category: { id: 1, name: "Creative Design", score_weight: 1, normal_revision_limit: 2, sla_minutes: 1440, important_matrix: "Q1", is_active: true },
      requester: { id: 1, name: "Client Test", roles: ["Client"] } as any,
      assigned_designer: { id: 2, name: "Designer Test", roles: ["Designer"] } as any,
      results: [{ id: 2, version_number: 1, status: "pending_client", submitted_by: 2, result_notes: "Output QA", submitted_at: "2026-07-24T10:00:00+07:00", asset_links: [] }] as any,
    }
  },
  {
    value: "done",
    label: "6. Selesai",
    taskDetails: {
      id: 1651206,
      task_number: "ODDS-QA-006",
      design_purpose: "Product Ads Headset Bluetooth",
      status: "done" as const,
      request_type: "design" as const,
      brief_text: "Preview visual untuk siklus TaskCard ODDS. Tidak terhubung ke API maupun aksi backend.",
      reference_visual: null,
      deadline: "2026-07-30T10:00:00+07:00",
      important_matrix: "Q1",
      task_type: "new_task",
      priority_score: 100,
      brief_return_count: 0,
      leader_revision_count: 0,
      normal_revision_count: 0,
      created_at: "2026-07-23T10:31:00+07:00",
      category: { id: 1, name: "Creative Design", score_weight: 1, normal_revision_limit: 2, sla_minutes: 1440, important_matrix: "Q1", is_active: true },
      requester: { id: 1, name: "Client Test", roles: ["Client"] } as any,
      assigned_designer: { id: 2, name: "Designer Test", roles: ["Designer"] } as any,
    }
  }
];

const sourceCode = `import { OddsTaskCard } from "@/components/odds/TaskCard/odds-task-card";

export default function MyComponent() {
  return (
    <OddsTaskCard 
      task={taskData}
      theme="light"
      viewerRole="designer"
      nowMs={Date.now()}
      onAction={(action) => console.log(action)}
    />
  );
}`;

function disabledActionsFor(status: string, pointOfView: "designer" | "client" | "leader"): OddsTaskCardAction[] {
  const disabled = new Set<OddsTaskCardAction>(["start", "pause", "done", "file", "check", "delete", "chat"]);
  const enable = (...actions: OddsTaskCardAction[]) => actions.forEach((action) => disabled.delete(action));

  if (status !== "submitted") enable("chat");
  if (status !== "done" && pointOfView !== "designer") enable("delete");

  if (pointOfView === "designer") {
    if (status === "queued") enable("start");
    if (status === "in_progress") enable("pause", "done");
    if (status === "spv_review" || status === "client_review") enable("file");
    if (status === "done") enable("file");
  }

  if (pointOfView === "leader") {
    if (status === "in_progress") enable("pause");
    if (status === "spv_review") enable("check");
    if (status === "client_review") enable("file");
    if (status === "done") enable("file");
  }

  if (pointOfView === "client") {
    if (status === "client_review") enable("check");
    if (status === "done") enable("file");
  }

  return [...disabled];
}

export function OddsTaskCardDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [importCopied, setImportCopied] = useState(false);

  const handleCopyImport = () => {
    navigator.clipboard.writeText('import { OddsTaskCard } from "@/components/odds/TaskCard/odds-task-card";');
    setImportCopied(true);
    setTimeout(() => setImportCopied(false), 2000);
  };
  
  // Responsive Playground State
  const [breakpoint, setBreakpoint] = useState<"responsive" | "sm" | "md" | "lg" | "xl" | "2xl">("responsive");
  const [zoom, setZoom] = useState(100);

  // Component Props State (Menggunakan custom styled dropdowns)
  const [theme, setTheme] = useState<"light" | "dark" | "retro">("light");
  const [viewerRole, setViewerRole] = useState<"client" | "designer" | "leader">("designer");
  const [cardCondition, setCardCondition] = useState<"normal" | "deadline">("normal");
  const [selectedStageValue, setSelectedStageValue] = useState<OddsTask["status"]>("submitted");

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBreakpointWidth = () => {
    switch(breakpoint) {
      case "sm": return "370px";
      case "md": return "508px";
      case "lg": return "764px";
      case "xl": return "1020px";
      case "2xl": return "1276px";
      default: return "100%";
    }
  };

  const getBreakpointLabel = () => {
    if (breakpoint === "responsive") return "Responsive (100%)";
    const widthPx = parseInt(getBreakpointWidth());
    const paddingPx = breakpoint === "sm" ? 16 : 32;
    return `${breakpoint.toUpperCase()} - Total: ${widthPx}px (Workspace: ${widthPx - paddingPx}px)`;
  };

  // Helper class untuk memaksa breakpoint di dalam playground
  const getPlaygroundBreakpointClass = () => {
    if (breakpoint === "responsive") return "";
    if (breakpoint === "sm" || breakpoint === "md") return "force-mobile-layout";
    if (breakpoint === "lg" || breakpoint === "xl") return "force-compact-layout";
    if (breakpoint === "2xl") return "force-wide-layout";
    return "";
  };

  // Ambil task stage yang sedang aktif
  const currentStage = STAGES.find(s => s.value === selectedStageValue) ?? STAGES[0];
  const baseTaskDetails = currentStage.taskDetails;
  
  // Set waktu acuan sesuai status kondisi deadline / normal
  const playgroundNowMs = cardCondition === "deadline"
    ? new Date("2026-07-30T10:00:00+07:00").getTime() + 60_000
    : 1785207600000;

  const currentTask: OddsTask = {
    ...baseTaskDetails,
    status: selectedStageValue
  };

  // Logika rekomendasi aksi dan parameter role sesuai realita di layout-preview
  const wideRecommendationLabel = viewerRole === "leader" && selectedStageValue === "spv_review"
    ? "Review"
    : viewerRole === "client" && selectedStageValue === "client_review"
    ? "Review"
    : viewerRole === "designer"
    ? selectedStageValue === "submitted"
      ? "Check"
      : selectedStageValue === "queued"
        ? "Proses"
        : selectedStageValue === "in_progress" && cardCondition === "normal"
          ? "Done"
        : undefined
    : undefined;

  const wideRating = selectedStageValue === "done" ? 4.5 : undefined;
  const isReviewStage = selectedStageValue === "spv_review" || selectedStageValue === "client_review";
  const canCheckVariant = (viewerRole === "leader" && isReviewStage) || (viewerRole === "client" && selectedStageValue === "client_review");
  const variantDisabledActions = disabledActionsFor(selectedStageValue, viewerRole);
  const variantTimerSeconds = selectedStageValue === "done" || cardCondition === "deadline" ? 0 : 3725;

  return (
    <div className="doc-example-container">
      {/* CSS untuk memaksakan media query breakpoint pada playground saja */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Reset default layouts under simulation */
        .force-mobile-layout article > div,
        .force-compact-layout article > div,
        .force-wide-layout article > div {
          display: none !important;
        }

        /* Show only targeted layout based on DOM order */
        .force-mobile-layout article > div:nth-child(1) {
          display: block !important;
        }
        .force-compact-layout article > div:nth-child(2) {
          display: flex !important;
        }
        .force-wide-layout article > div:nth-child(3) {
          display: flex !important;
        }
      `}} />

      {/* 1. Hero Section */}
      <DocHeroSection />

      {/* 2. Interactive Playground */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Uji coba komponen kartu tugas utama ODDS di berbagai breakpoint, peran, tema, dan status tugas.</p>
        </div>
        <div className="doc-playground rounded-xl border border-slate-200 overflow-hidden bg-white">
          <div className="doc-playground-tabs flex border-b border-slate-200">
            <button 
              className={`px-4 py-2.5 text-sm font-medium ${activeTab === 'preview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
            <button 
              className={`px-4 py-2.5 text-sm font-medium ${activeTab === 'code' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('code')}
            >
              Code
            </button>
          </div>
          
          {activeTab === 'preview' && (
            <div className="doc-playground-toolbar flex flex-wrap items-center justify-between gap-4 p-3 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Dynamic Dropdowns Toolbar */}
                <PlaygroundSelect 
                  label="Siklus:"
                  value={selectedStageValue}
                  onChange={(v) => setSelectedStageValue(v as any)}
                  options={STAGES.map(s => ({ value: s.value, label: s.label }))}
                />
                
                <PlaygroundSelect 
                  label="Point of View:"
                  value={viewerRole}
                  onChange={(v) => setViewerRole(v as any)}
                  options={[
                    { value: "designer", label: "Designer" },
                    { value: "client", label: "Client" },
                    { value: "leader", label: "Leader" },
                  ]}
                />

                <PlaygroundSelect 
                  label="Kondisi:"
                  value={cardCondition}
                  onChange={(v) => setCardCondition(v as any)}
                  options={[
                    { value: "normal", label: "Normal" },
                    { value: "deadline", label: "Deadline" },
                  ]}
                />

                <PlaygroundSelect 
                  label="Theme:"
                  value={theme}
                  onChange={(v) => setTheme(v as any)}
                  options={[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                    { value: "retro", label: "Retro" },
                  ]}
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Breakpoints Selector */}
                <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                  {(["responsive", "sm", "md", "lg", "xl", "2xl"] as const).map(bp => (
                    <button
                      key={bp}
                      onClick={() => setBreakpoint(bp)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-all duration-200 uppercase tracking-wide ${
                        breakpoint === bp 
                          ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' 
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 border border-transparent'
                      }`}
                    >
                      {bp === "responsive" ? (
                        <span className="flex items-center gap-1.5 capitalize tracking-normal"><MonitorPlay size={12} /> Responsive</span>
                      ) : (
                        bp
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Zoom Controls */}
                <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                  <button 
                    onClick={() => setZoom(z => Math.max(25, z - 25))} 
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded border border-transparent transition-colors" 
                    title="Zoom Out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <button 
                    onClick={() => setZoom(100)}
                    className="px-2 text-xs font-mono font-medium text-slate-600 hover:text-blue-600 min-w-[3.5rem] text-center select-none cursor-pointer transition-colors"
                    title="Reset Zoom"
                  >
                    {zoom}%
                  </button>
                  <button 
                    onClick={() => setZoom(z => Math.min(200, z + 25))} 
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded border border-transparent transition-colors" 
                    title="Zoom In"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="doc-playground-content bg-slate-50 overflow-auto flex justify-center items-start min-h-[500px] relative">
            {activeTab === 'preview' ? (
              <div className="w-full flex justify-center p-8 min-h-full" style={{ 
                  backgroundImage: "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)", 
                  backgroundSize: "20px 20px" 
              }}>
                <div 
                  className={`transition-all duration-300 ease-in-out border border-slate-200 bg-white shadow-xl rounded-xl flex flex-col overflow-hidden ${getPlaygroundBreakpointClass()}`}
                  style={{
                    width: getBreakpointWidth(),
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "top center",
                    marginBottom: `${Math.max(0, (zoom - 100) * 2)}px`
                  }}
                >
                  <div className="w-full h-8 bg-slate-50 border-b border-slate-100 flex items-center justify-center text-[10px] font-mono text-slate-400">
                     {getBreakpointLabel()}
                  </div>
                  <div className={`${breakpoint === "sm" ? "p-2" : "p-4"} w-full bg-[#f8fafc]`}>
                    <div className="w-full">
                      <OddsTaskCard 
                        task={currentTask} 
                        theme={theme} 
                        viewerRole={viewerRole} 
                        nowMs={playgroundNowMs} 
                        timerSeconds={variantTimerSeconds}
                        onAction={() => {}} 
                        showAllActions
                        canCheckRole={canCheckVariant}
                        showStart={selectedStageValue === "queued"}
                        showPause={selectedStageValue === "in_progress" && viewerRole !== "designer"}
                        showDone={selectedStageValue === "in_progress"}
                        disabledActions={variantDisabledActions}
                        wideHighlightLabel={wideRecommendationLabel}
                        wideRating={wideRating}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="doc-code-area w-full p-6 bg-[#0f172a] text-slate-50 overflow-x-auto text-sm">
                <pre>
                  <code>
{`<OddsTaskCard 
  task={taskData}
  theme="${theme}"
  viewerRole="${viewerRole}"
  nowMs={Date.now()}
  onAction={(action) => console.log(action)}
/>`}
                  </code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Installation & Usage */}
      <DocInstallationSection copied={importCopied} onCopyImport={handleCopyImport} />

      {/* 4. Component Source Code */}
      <DocSourceCodeSection copied={copied} onCopySource={handleCopyCode} sourceCode={sourceCode} />

      {/* 5. Variants Gallery (Composables) */}
      <DocAnatomySection palette={PALETTE} />

      {/* 6. API Reference Table */}
      <DocApiSection />
    </div>
  );
}
