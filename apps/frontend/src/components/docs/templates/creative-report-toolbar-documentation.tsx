"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { CreativeReportToolbar } from "@/components/creative-report/report-toolbar";

export function CreativeReportToolbarDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [search, setSearch] = useState("");
  const [jobdesk, setJobdesk] = useState("Semua jobdesk");

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

  const toolbarSourceCode = `"use client";

import { MaterialIcon } from "@/components/ui/material-icon";

export type ReportMetric = {
  label: string;
  value: string;
  icon: string;
  tone: string;
  accent: string;
};

export type CreativeReportToolbarProps = {
  search: string;
  onSearchChange: (search: string) => void;
  jobdesk: string;
  onJobdeskChange: (jobdesk: string) => void;
  jobdesks: string[];
  metrics: ReportMetric[];
  showMetrics?: boolean;
};

export function CreativeReportToolbar({
  search,
  onSearchChange,
  jobdesk,
  onJobdeskChange,
  jobdesks,
  metrics,
  showMetrics = false,
}: CreativeReportToolbarProps) {
  // ... implementation ...
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Creative Report</div>
        <h1 className="doc-hero-title">Report Toolbar</h1>
        <p className="doc-hero-subtitle">
          Interactive toolbar providing staff name searching, jobdesk filter selection, and summary performance metrics cards.
        </p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      {/* ── Interactive Playground ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Try typing in the search box or changing jobdesk filters.</p>
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
                  Filter Jobdesk:
                  <select value={jobdesk} onChange={(e) => setJobdesk(e.target.value)}>
                    <option value="Semua jobdesk">Semua jobdesk</option>
                    <option value="SPV">SPV</option>
                    <option value="Videographer">Videographer</option>
                    <option value="Designer">Designer</option>
                  </select>
                </label>
              </div>

              <div className="doc-playground-content">
                <div className="doc-preview-area !p-4 !bg-white border border-slate-200/80 rounded-2xl shadow-xl w-full max-w-[800px]">
                  <CreativeReportToolbar
                    search={search}
                    onSearchChange={setSearch}
                    jobdesk={jobdesk}
                    onJobdeskChange={setJobdesk}
                    jobdesks={["Semua jobdesk", "SPV", "Videographer", "Designer"]}
                    metrics={[
                      { label: "10 peringkat terbaik", value: "94,2", icon: "emoji_events", tone: "bg-[#fff5e8] text-[#f18728]", accent: "bg-[#f18728]" },
                      { label: "Rata-rata skor", value: "86,5", icon: "monitoring", tone: "bg-[#f0efff] text-[#6d46eb]", accent: "bg-[#6d46eb]" }
                    ]}
                    showMetrics={false}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import { CreativeReportToolbar } from "@/components/creative-report/report-toolbar";

export default function Page() {
  return (
    <CreativeReportToolbar
      search="${search}"
      onSearchChange={(s) => setSearch(s)}
      jobdesk="${jobdesk}"
      onJobdeskChange={(j) => setJobdesk(j)}
      jobdesks={["Semua jobdesk", "SPV", "Videographer", "Designer"]}
      metrics={[]}
      showMetrics={false}
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/creative-report/report-toolbar.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import { CreativeReportToolbar } from "@/components/creative-report/report-toolbar";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import {'{ CreativeReportToolbar }'} from "@/components/creative-report/report-toolbar";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Interface exports of the CreativeReportToolbar component.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/creative-report/report-toolbar.tsx</span>
            <button onClick={() => handleCopy(toolbarSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{toolbarSourceCode}</code></pre>
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
              <h3>Live Search Input</h3>
              <p>Debounced input field filtering team member names instantly.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Jobdesk Dropdown</h3>
              <p>Filters staff lists by specific job role partitions.</p>
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
                <td><code>search</code></td>
                <td><code className="type">string</code></td>
                <td><code>""</code></td>
                <td>Active search query string parameter.</td>
              </tr>
              <tr>
                <td><code>jobdesk</code></td>
                <td><code className="type">string</code></td>
                <td><code>"Semua jobdesk"</code></td>
                <td>Selected jobdesk filter item.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
