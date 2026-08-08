"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette, LayoutTemplate } from "lucide-react";
import { ReportHeader } from "@/components/creative-report/report-header";

export function CreativeReportHeaderDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [month, setMonth] = useState("2026-07");
  const [theme, setTheme] = useState<"light" | "dark" | "retro">("light");

  const handleCopy = (text: string, isSource = false) => {
    navigator.clipboard.writeText(text);
    if (isSource) {
      setCopiedSource(true);
      setTimeout(() => setCopiedSource(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const headerSourceCode = `"use client";

import { ReportTitle } from "@/components/creative-report/report-title";
import { MonthPickerButton } from "@/components/creative-report/month-picker-button";
import { ExportPdfButton } from "@/components/creative-report/export-pdf-button";

export type ReportHeaderProps = {
  month: string;
  monthLabel: string;
  theme?: "light" | "dark" | "retro";
  title?: string;
  onMonthChange: (month: string) => void;
  onExportPdf?: () => void;
};

export function ReportHeader({
  month,
  monthLabel,
  theme = "light",
  title = "Creative Report",
  onMonthChange,
  onExportPdf,
}: ReportHeaderProps) {
  // ... implementation ...
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Creative Report</div>
        <h1 className="doc-hero-title">Report Header</h1>
        <p className="doc-hero-subtitle">
          Header bar composed of ReportTitle, MonthPickerButton, and ExportPdfButton sub-components.
        </p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      {/* ── Sub-components Anatomy ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title flex items-center gap-2"><LayoutTemplate size={18} /> Sub-components Anatomy</h2>
          <p className="doc-section-desc">ReportHeader is modularly composed of 3 dedicated sub-components located in <code>src/components/creative-report/</code>.</p>
        </div>

        <div className="doc-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div className="doc-grid-item" style={{ padding: '1rem' }}>
            <h4 className="font-semibold text-sm"><code>ReportTitle</code></h4>
            <p className="text-xs text-cu-muted mt-1">Renders the sub-app page title with theme color adaptation.</p>
          </div>
          <div className="doc-grid-item" style={{ padding: '1rem' }}>
            <h4 className="font-semibold text-sm"><code>MonthPickerButton</code></h4>
            <p className="text-xs text-cu-muted mt-1">Interactive month selector button triggering native OS calendar picker.</p>
          </div>
          <div className="doc-grid-item" style={{ padding: '1rem' }}>
            <h4 className="font-semibold text-sm"><code>ExportPdfButton</code></h4>
            <p className="text-xs text-cu-muted mt-1">Action button triggering window.print() PDF document generation.</p>
          </div>
        </div>
      </section>

      {/* ── Interactive Playground ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Test theme switching and month picker state in real-time.</p>
        </div>
        
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          
          {activeTab === 'preview' ? (
            <div>
              <div className="doc-playground-controls">
                <label>
                  Theme:
                  <select value={theme} onChange={(e) => setTheme(e.target.value as any)}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="retro">Retro</option>
                  </select>
                </label>
                <label>
                  Month:
                  <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-8 px-2 text-xs rounded border border-slate-300" />
                </label>
              </div>

              <div className="doc-playground-content">
                <div className="doc-preview-area !p-4 !bg-white border border-slate-200/80 rounded-2xl shadow-xl w-full max-w-[760px]">
                  <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#111413] border-slate-800' : theme === 'retro' ? 'bg-[#c9ccc0] border-slate-400' : 'bg-slate-50 border-slate-200'}`}>
                    <ReportHeader
                      month={month}
                      monthLabel="Juli 2026"
                      theme={theme}
                      onMonthChange={setMonth}
                      onExportPdf={() => alert("Export PDF Triggered!")}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import { ReportHeader } from "@/components/creative-report/report-header";

export default function Page() {
  return (
    <ReportHeader
      month="${month}"
      monthLabel="Juli 2026"
      theme="${theme}"
      onMonthChange={(m) => setMonth(m)}
      onExportPdf={() => window.print()}
    />
  );
}`}</code></pre>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Installation & Usage ── */}
      <section className="doc-section">
        <h2 className="doc-section-title">Installation & Usage</h2>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header"><span className="flex items-center gap-2"><FileCode size={14} /> File Location</span></div>
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/creative-report/report-header.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import { ReportHeader } from "@/components/creative-report/report-header";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import {'{ ReportHeader }'} from "@/components/creative-report/report-header";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Interface exports of the ReportHeader component.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/creative-report/report-header.tsx</span>
            <button onClick={() => handleCopy(headerSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{headerSourceCode}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Features</h2>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Native Month Picker</h3>
              <p>Triggers native OS month selector popover seamlessly.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>PDF Printing Trigger</h3>
              <p>Provides one-click PDF generation via window.print() action.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── API Reference Table ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><BookOpen size={18} className="inline-icon" /> API Reference</h2>
        </div>
        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>month</code></td>
                <td><code className="type">string</code></td>
                <td><code>"2026-07"</code></td>
                <td>ISO YYYY-MM month parameter string.</td>
              </tr>
              <tr>
                <td><code>monthLabel</code></td>
                <td><code className="type">string</code></td>
                <td><code>"Juli 2026"</code></td>
                <td>Localized month title display string.</td>
              </tr>
              <tr>
                <td><code>theme</code></td>
                <td><code className="type">"light" | "dark" | "retro"</code></td>
                <td><code>"light"</code></td>
                <td>Visual theme mode of the sub-app.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
