"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, FileCode } from "lucide-react";
import { TaskCardStatusBlock, TaskCardWideStatusPanel } from "@/components/odds/TaskCard/task-card-status-panel";

const PALETTE_ACTIVE = { primary: "text-[#0077bf]", secondary: "text-[#7d7c7c]", accent: "text-[#0077bf]", soft: "bg-sky-50" };
const PALETTE_OVERDUE = { primary: "text-rose-600", secondary: "text-[#7d7c7c]", accent: "text-rose-500", soft: "bg-rose-50" };

function StatusPreviewAll() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-end gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Aktif</span>
          <TaskCardStatusBlock isDone={false} isOverdue={false} isReview={false} palette={PALETTE_ACTIVE} status="Sedang Dikerjakan" statusDescription="Dikerjakan oleh Rina" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Terlambat</span>
          <TaskCardStatusBlock isDone={false} isOverdue={true} isReview={false} palette={PALETTE_OVERDUE} status="Terlambat" statusDescription="Deadline lewat" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Selesai</span>
          <TaskCardStatusBlock isDone={true} isOverdue={false} isReview={false} palette={PALETTE_ACTIVE} status="Selesai" statusDescription="Tugas diselesaikan" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Wide Status Panel</span>
        <div className="flex overflow-hidden rounded-lg" style={{height: 130, width: 205}}>
          <TaskCardWideStatusPanel isDone={false} isReview={false} status="Dikerjakan" statusDescription="Oleh Rina Dewi" timerText="02:45" onRecommendation={() => {}} />
        </div>
      </div>
    </div>
  );
}

export function OddsTaskCardStatusPanelDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sourceCode = `import {
  TaskCardStatusBlock,
  TaskCardWideStatusPanel,
} from "@/components/odds/TaskCard/task-card-status-panel";

// Inline status (Mobile/Compact)
<TaskCardStatusBlock
  isDone={false} isOverdue={false} isReview={false}
  palette={{ primary: "...", secondary: "...", accent: "...", soft: "..." }}
  status="Sedang Dikerjakan"
  statusDescription="Dikerjakan oleh Rina"
/>

// Wide layout status panel
<TaskCardWideStatusPanel
  isDone={false} isReview={false}
  status="Sedang Dikerjakan"
  statusDescription="Dikerjakan oleh Rina"
  timerText="02:45"
  onRecommendation={() => {}}
/>`;

  return (
    <div className="doc-example-container">
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Task Cards</div>
        <h1 className="doc-hero-title">Task Card Status Panel</h1>
        <p className="doc-hero-subtitle">Dua komponen penampil status tugas: TaskCardStatusBlock (inline, untuk Mobile & Compact) dan TaskCardWideStatusPanel (panel samping penuh, untuk Wide layout ≥2xl). Mendukung state aktif, terlambat, review, dan selesai.</p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Live preview dari TaskCardStatusBlock dan TaskCardWideStatusPanel.</p>
        </div>
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          {activeTab === 'preview' ? (
            <div className="doc-playground-content bg-slate-50/50 p-4 md:p-8 flex justify-center items-center">
              <StatusPreviewAll />
            </div>
          ) : (
            <div className="p-6 bg-[#111]"><div className="doc-code-area"><pre><code>{sourceCode}</code></pre></div></div>
          )}
        </div>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Installation & Usage</h2>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header"><span className="flex items-center gap-2"><FileCode size={14} /> File Location</span></div>
          <div className="doc-install-body text-cu-muted"><code>src/components/odds/TaskCard/task-card-status-panel.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span>Import Statement</span>
            <button onClick={() => handleCopy('import { TaskCardStatusBlock, TaskCardWideStatusPanel } from "@/components/odds/TaskCard/task-card-status-panel";')} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>{"import { TaskCardStatusBlock, TaskCardWideStatusPanel } from \"@/components/odds/TaskCard/task-card-status-panel\";"}</code></div>
        </div>
      </section>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Detail</h2>
        </div>
        <div className="doc-table-wrapper mt-4">
          <table className="doc-table">
            <tbody>
              <tr><th style={{width: '25%'}}>Exports</th><td><code>TaskCardStatusBlock</code>, <code>TaskCardWideStatusPanel</code></td></tr>
              <tr><th>StatusBlock</th><td>Inline status dengan ikon bulat + 2 baris teks. Warna via prop <code>palette</code>. Opsional: <code>compact</code>, <code>feedbackHref</code>.</td></tr>
              <tr><th>WideStatusPanel</th><td>Panel 205px lebar di sisi kanan. Menampilkan timer/highlight, rating bintang, atau tombol rekomendasi, plus blok status ringkas.</td></tr>
              <tr><th>States</th><td>Aktif (biru) · Terlambat (merah) · Review (hourglass) · Selesai (hijau)</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
