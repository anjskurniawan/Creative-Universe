"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { HrdRulesFooter } from "@/components/creative-report/hrd-rules-footer";

export function CreativeReportHrdRulesFooterDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
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

  const footerSourceCode = `"use client";

export function HrdRulesFooter({ theme }: { theme?: "light" | "dark" | "retro" }) {
  // ... implementation ...
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Creative Report</div>
        <h1 className="doc-hero-title">HRD Rules Footer</h1>
        <p className="doc-hero-subtitle">
          Informational footer section outlining HRD Review score calculation rules, absence/late penalties, and baseline scores.
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
          <p className="doc-section-desc">Observe footer styling adaptations across sub-app themes.</p>
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
              </div>

              <div className="doc-playground-content">
                <div className="doc-preview-area !p-4 !bg-white border border-slate-200/80 rounded-2xl shadow-xl w-full max-w-[760px]">
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#111413] text-white' : theme === 'retro' ? 'bg-[#c9ccc0]' : 'bg-[#f3fbff]'}`}>
                    <HrdRulesFooter theme={theme} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import { HrdRulesFooter } from "@/app/creative-report/components/hrd-rules-footer";

export default function Page() {
  return (
    <HrdRulesFooter theme="${theme}" />
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/app/creative-report/components/hrd-rules-footer.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import { HrdRulesFooter } from "@/app/creative-report/components/hrd-rules-footer";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import {'{ HrdRulesFooter }'} from "@/app/creative-report/components/hrd-rules-footer";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Source code structure for HrdRulesFooter.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">app/creative-report/components/hrd-rules-footer.tsx</span>
            <button onClick={() => handleCopy(footerSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{footerSourceCode}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Content Sections</h2>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Baseline Score (20 Poin)</h3>
              <p>Explains default starting score allocated for HRD review evaluation.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Absence & Late Penalties</h3>
              <p>Outlines exact penalty deductions per day for absence and late check-ins.</p>
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
                <td><code>theme</code></td>
                <td><code className="type">"light" | "dark" | "retro"</code></td>
                <td><code>"light"</code></td>
                <td>Aesthetic tone for typography and borders.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
