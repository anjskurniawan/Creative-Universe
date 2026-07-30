"use client";

import React, { useState } from "react";
import { Code2, MonitorPlay, Accessibility, FileCode } from "lucide-react";

export function OddsTaskCardLayoutsDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  const sourceCode = `import {
  TaskCardMobileLayout,
  TaskCardCompactLayout,
  TaskCardWideLayout,
} from "@/components/odds/TaskCard/task-card-layouts";

// Mobile layout (< lg) — collapsible actions
<TaskCardMobileLayout
  surfaceClass="bg-white"
  lineClass="border-slate-200"
  isOpen={expanded}
  onToggle={() => setExpanded(!expanded)}
  dateBlock={<TaskCardMobileDate ... />}
  heading={<h3>Judul Tugas</h3>}
  people={<TaskCardPeople ... />}
  meta={<TaskCardStatusBlock ... />}
  actions={<TaskCardActionBar>...</TaskCardActionBar>}
/>

// Compact layout (lg – 2xl)
<TaskCardCompactLayout
  surfaceClass="bg-white" lineClass="border-slate-200"
  dateBlock={...} taskInfo={...}
  people={...} actions={...} sidePanel={...}
/>

// Wide layout (>= 2xl)
<TaskCardWideLayout
  surfaceClass="bg-white"
  dateBlock={...} taskInfo={...}
  people={...} deadline={...}
  actions={...} status={...}
/>`;

  return (
    <div className="doc-example-container">
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Task Cards</div>
        <h1 className="doc-hero-title">Task Card Layouts</h1>
        <p className="doc-hero-subtitle">Tiga komponen shell layout yang mengatur tata letak responsif OddsTaskCard. Setiap layout menerima blok konten sebagai ReactNode props dan disesuaikan untuk breakpoint tertentu.</p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Contoh penggunaan kode (layout ini membutuhkan sub-komponen TaskCard lengkap untuk preview visual).</p>
        </div>
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          {activeTab === 'preview' ? (
            <div className="doc-playground-content bg-slate-50/50 p-6 md:p-8 flex flex-col gap-6 items-center justify-center">
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 w-full max-w-[600px] text-center">
                <p className="text-sm text-slate-500 mb-2">Layout containers bersifat structural — mereka mengatur posisi sub-komponen.</p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">📱 MobileLayout {"<"} lg</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">🖥️ CompactLayout lg–2xl</span>
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">🖥️ WideLayout ≥ 2xl</span>
                </div>
              </div>
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
          <div className="doc-install-body text-cu-muted"><code>src/components/odds/TaskCard/task-card-layouts.tsx</code></div>
        </div>
      </section>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Detail</h2>
        </div>
        <div className="doc-table-wrapper mt-4">
          <table className="doc-table">
            <tbody>
              <tr><th style={{width: '25%'}}>Exports</th><td><code>TaskCardMobileLayout</code>, <code>TaskCardCompactLayout</code>, <code>TaskCardWideLayout</code></td></tr>
              <tr><th>MobileLayout</th><td>Breakpoint {"<"} lg. Collapsible: area atas (dateBlock, heading, people, meta) selalu visible; area bawah (actions) toggle via <code>isOpen</code>/<code>onToggle</code>.</td></tr>
              <tr><th>CompactLayout</th><td>Breakpoint lg–2xl. Min-height 146px. dateBlock di kiri, konten (taskInfo, people, actions) + sidePanel di kanan.</td></tr>
              <tr><th>WideLayout</th><td>Breakpoint ≥ 2xl. Min-height 120px. Semua slot (dateBlock, taskInfo, people, deadline, actions, status) tersusun horizontal.</td></tr>
              <tr><th>Pattern</th><td>Semua props berupa <code>ReactNode</code> — layout hanya mengatur posisi, bukan isi.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
