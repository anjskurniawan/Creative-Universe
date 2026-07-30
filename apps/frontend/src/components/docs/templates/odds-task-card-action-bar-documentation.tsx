"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, FileCode } from "lucide-react";
import { TaskCardActionBar } from "@/components/odds/TaskCard/task-card-action-bar";

function ActionBarPreview() {
  return (
    <div className="flex flex-col gap-6 p-6 w-full max-w-[500px]">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Default</span>
        <TaskCardActionBar>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">Start</button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">Edit</button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50">Delete</button>
        </TaskCardActionBar>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">mobile = true</span>
        <TaskCardActionBar mobile>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">Start</button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">Edit</button>
        </TaskCardActionBar>
      </div>
    </div>
  );
}

export function OddsTaskCardActionBarDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sourceCode = `import { TaskCardActionBar } from "@/components/odds/TaskCard/task-card-action-bar";

<TaskCardActionBar mobile={false} fillHeight={false}>
  <button>Start</button>
  <button>Edit</button>
  <button>Delete</button>
</TaskCardActionBar>

// Dengan overlay (loading/confirm)
<TaskCardActionBar overlay={<LoadingOverlay />}>
  <button>Start</button>
</TaskCardActionBar>`;

  return (
    <div className="doc-example-container">
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Task Cards</div>
        <h1 className="doc-hero-title">Task Card Action Bar</h1>
        <p className="doc-hero-subtitle">Container wrapper untuk deretan tombol aksi di dalam OddsTaskCard. Mengatur tata letak flex-wrap responsif dan mendukung overlay mutually-exclusive.</p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Live preview dari TaskCardActionBar.</p>
        </div>
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          {activeTab === 'preview' ? (
            <div className="doc-playground-content bg-slate-50/50 p-4 md:p-8 flex justify-center items-center">
              <ActionBarPreview />
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
          <div className="doc-install-body text-cu-muted"><code>src/components/odds/TaskCard/task-card-action-bar.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span>Import Statement</span>
            <button onClick={() => handleCopy('import { TaskCardActionBar } from "@/components/odds/TaskCard/task-card-action-bar";')} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>{"import { TaskCardActionBar } from \"@/components/odds/TaskCard/task-card-action-bar\";"}</code></div>
        </div>
      </section>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Detail</h2>
        </div>
        <div className="doc-table-wrapper mt-4">
          <table className="doc-table">
            <tbody>
              <tr><th style={{width: '25%'}}>Props</th><td><code>children</code> (ReactNode), <code>mobile?</code> (boolean), <code>fillHeight?</code> (boolean), <code>overlay?</code> (ReactNode)</td></tr>
              <tr><th>mobile</th><td>Mode mobile: flex-wrap tanpa justify-center. Default <code>false</code>.</td></tr>
              <tr><th>fillHeight</th><td>Container mengisi tinggi penuh parent. Default <code>false</code>.</td></tr>
              <tr><th>overlay</th><td>Elemen overlay absolut di atas semua tombol (untuk konfirmasi atau loading).</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
