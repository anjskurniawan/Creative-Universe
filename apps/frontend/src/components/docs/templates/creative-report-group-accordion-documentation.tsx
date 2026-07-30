"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { GroupAccordion } from "@/components/creative-report/group-accordion";

export function CreativeReportGroupAccordionDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

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

  const accordionSourceCode = `"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import type { CreativeReportGroup } from "@/features/creative-report/types";

export type GroupAccordionProps = {
  group: CreativeReportGroup;
  index: number;
  isOpen: boolean;
  onToggle: (id: number) => void;
  children?: React.ReactNode;
};

export function GroupAccordion({
  group,
  index,
  isOpen,
  onToggle,
  children,
}: GroupAccordionProps) {
  // ... implementation ...
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Creative Report</div>
        <h1 className="doc-hero-title">Group Accordion</h1>
        <p className="doc-hero-subtitle">
          Collapsible header accordion container displaying team division names, staff counts, and expand/collapse triggers.
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
          <p className="doc-section-desc">Toggle the accordion state to observe expansion and collapse transitions.</p>
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
                  Accordion State:
                  <select value={isOpen ? "Expanded" : "Collapsed"} onChange={(e) => setIsOpen(e.target.value === "Expanded")}>
                    <option value="Expanded">Expanded</option>
                    <option value="Collapsed">Collapsed</option>
                  </select>
                </label>
              </div>

              <div className="doc-playground-content">
                <div className="doc-preview-area !p-4 !bg-white border border-slate-200/80 rounded-2xl shadow-xl w-full max-w-[700px]">
                  <GroupAccordion
                    group={{
                      id: 1,
                      name: "Design & Media Team",
                      staff_count: 5,
                      assessments: []
                    }}
                    index={0}
                    isOpen={isOpen}
                    onToggle={() => setIsOpen(!isOpen)}
                  >
                    <div className="p-4 bg-slate-50 border border-t-0 border-[#c9bbfc] rounded-b-xl text-xs text-slate-600 text-center">
                      (Assessment Table Content Surface)
                    </div>
                  </GroupAccordion>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import { GroupAccordion } from "@/components/creative-report/group-accordion";

export default function Page() {
  const [isOpen, setIsOpen] = useState(${isOpen});

  return (
    <GroupAccordion
      group={{ id: 1, name: "Design Team", staff_count: 5, assessments: [] }}
      index={0}
      isOpen={isOpen}
      onToggle={(id) => setIsOpen(!isOpen)}
    >
      {/* Assessment Table Content */}
    </GroupAccordion>
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/creative-report/group-accordion.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import { GroupAccordion } from "@/components/creative-report/group-accordion";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import {'{ GroupAccordion }'} from "@/components/creative-report/group-accordion";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Source implementation of GroupAccordion.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/creative-report/group-accordion.tsx</span>
            <button onClick={() => handleCopy(accordionSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{accordionSourceCode}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> States</h2>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Expanded State</h3>
              <p>Highlights header in soft purple tint (<code>bg-[#f7f5ff]</code>) with rounded top corners.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Collapsed State</h3>
              <p>Displays clean white background with rounded corners on all sides.</p>
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
                <td><code>group</code></td>
                <td><code className="type">CreativeReportGroup</code></td>
                <td><code>required</code></td>
                <td>Group metadata object (name, staff_count, id).</td>
              </tr>
              <tr>
                <td><code>isOpen</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>false</code></td>
                <td>Toggles expanded or collapsed state.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
