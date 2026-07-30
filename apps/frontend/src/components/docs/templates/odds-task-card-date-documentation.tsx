"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, FileCode } from "lucide-react";
import { TaskCardMobileDate, TaskCardCompactDate, TaskCardWideDate } from "@/components/odds/TaskCard/task-card-date";

function DatePreviewAll() {
  return (
    <div className="flex flex-wrap items-end gap-8 p-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mobile</span>
        <TaskCardMobileDate quadrant="Q3" date="28" monthYear="JUL 2025" isDone={false} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mobile (Done)</span>
        <TaskCardMobileDate quadrant="Q3" date="28" monthYear="JUL 2025" isDone={true} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Compact</span>
        <TaskCardCompactDate quadrant="Q3" date="28" day="Senin" monthYear="JUL 2025" time="17:00" isDone={false} accentClass="text-[#0077bf]" primaryClass="text-[#1a2024]" secondaryClass="text-[#7d7c7c]" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Wide</span>
        <div className="flex" style={{height: 120}}>
          <TaskCardWideDate quadrant="Q3" date="28" day="Senin" monthYear="JUL 2025" time="17:00" isDone={false} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Wide (Done)</span>
        <div className="flex" style={{height: 120}}>
          <TaskCardWideDate quadrant="Q3" date="28" day="Senin" monthYear="JUL 2025" time="17:00" isDone={true} />
        </div>
      </div>
    </div>
  );
}

export function OddsTaskCardDateDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sourceCode = `import {
  TaskCardMobileDate,
  TaskCardCompactDate,
  TaskCardWideDate,
} from "@/components/odds/TaskCard/task-card-date";

// Mobile (< lg)
<TaskCardMobileDate quadrant="Q3" date="28" monthYear="JUL 2025" isDone={false} />

// Compact (lg – 2xl)
<TaskCardCompactDate
  quadrant="Q3" date="28" day="Senin" monthYear="JUL 2025"
  time="17:00" isDone={false}
  accentClass="text-[#0077bf]" primaryClass="text-[#1a2024]"
  secondaryClass="text-[#7d7c7c]"
/>

// Wide (>= 2xl)
<TaskCardWideDate
  quadrant="Q3" date="28" day="Senin" monthYear="JUL 2025"
  time="17:00" isDone={false}
/>`;

  return (
    <div className="doc-example-container">
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Task Cards</div>
        <h1 className="doc-hero-title">Task Card Date</h1>
        <p className="doc-hero-subtitle">Tiga varian blok tanggal responsif yang digunakan di dalam OddsTaskCard: Mobile, Compact, dan Wide. Menampilkan kuartal, tanggal, bulan/tahun, dan deadline sesuai breakpoint.</p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Live preview dari semua varian TaskCardDate.</p>
        </div>
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          {activeTab === 'preview' ? (
            <div className="doc-playground-content bg-slate-50/50 p-4 md:p-8 flex justify-center items-center">
              <DatePreviewAll />
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
          <div className="doc-install-body text-cu-muted"><code>src/components/odds/TaskCard/task-card-date.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span>Import Statement</span>
            <button onClick={() => handleCopy('import { TaskCardMobileDate, TaskCardCompactDate, TaskCardWideDate } from "@/components/odds/TaskCard/task-card-date";')} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>{"import { TaskCardMobileDate, TaskCardCompactDate, TaskCardWideDate } from \"@/components/odds/TaskCard/task-card-date\";"}</code></div>
        </div>
      </section>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Detail</h2>
        </div>
        <div className="doc-table-wrapper mt-4">
          <table className="doc-table">
            <tbody>
              <tr><th style={{width: '25%'}}>Variants</th><td><code>TaskCardMobileDate</code>, <code>TaskCardCompactDate</code>, <code>TaskCardWideDate</code></td></tr>
              <tr><th>Breakpoints</th><td>Mobile {"<"} lg · Compact lg–2xl · Wide ≥ 2xl</td></tr>
              <tr><th>Key Props</th><td><code>quadrant</code>, <code>date</code>, <code>monthYear</code>, <code>isDone</code> (common) + <code>day</code>, <code>time</code> (compact/wide) + CSS class props (compact only)</td></tr>
              <tr><th>States</th><td>Aktif (biru) → Selesai (hijau) via <code>isDone</code></td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
