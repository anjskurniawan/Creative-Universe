"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { HrdDateModal } from "@/components/creative-report/hrd-date-modal";

export function CreativeReportHrdDateModalDocumentation() {
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

  const modalSourceCode = `"use client";

import { MaterialIcon } from "@/components/ui/material-icon";

export type HrdDateKey = "leave" | "appPermission" | "absence" | "late";
export type ActiveDateAction = {
  assessmentId: number;
  key: HrdDateKey;
  index: number;
  dateStr: string;
};

export function HrdDateModal({
  activeDateAction,
  formatDateShort,
  onUpdateDate,
  onDeleteDate,
  onClose,
}: HrdDateModalProps) {
  // ... implementation ...
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Creative Report</div>
        <h1 className="doc-hero-title">HRD Date Modal</h1>
        <p className="doc-hero-subtitle">
          Interactive dialog modal for editing, replacing, or removing staff HRD attendance record dates.
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
          <p className="doc-section-desc">Toggle the modal state to view the dialog overlay.</p>
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
                  Modal State:
                  <select value={isOpen ? "Open" : "Closed"} onChange={(e) => setIsOpen(e.target.value === "Open")}>
                    <option value="Open">Open (Visible)</option>
                    <option value="Closed">Closed (Hidden)</option>
                  </select>
                </label>
              </div>

              <div className="doc-playground-content" style={{ minHeight: '340px' }}>
                {isOpen ? (
                  <div className="doc-preview-area !p-6 flex items-center justify-center">
                    <div className="relative min-w-[320px] flex items-center justify-center">
                      <div className="[&>div]:!static [&>div]:!inset-auto">
                        <HrdDateModal
                          activeDateAction={{
                            assessmentId: 101,
                            key: "absence",
                            index: 0,
                            dateStr: "2026-07-15"
                          }}
                          formatDateShort={(d) => "15/07"}
                          onUpdateDate={() => setIsOpen(false)}
                          onDeleteDate={() => setIsOpen(false)}
                          onClose={() => setIsOpen(false)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="doc-preview-area text-center py-6 px-8">
                    <span className="text-xs text-cu-muted font-medium">Modal is currently hidden. Switch <b>Modal State</b> to <b>Open</b> above to display.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import { HrdDateModal } from "@/components/creative-report/hrd-date-modal";

export default function Page() {
  return (
    <HrdDateModal
      activeDateAction={{ assessmentId: 1, key: "absence", index: 0, dateStr: "2026-07-15" }}
      formatDateShort={(d) => "15/07"}
      onUpdateDate={(id, key, idx, date) => updateDate(id, key, idx, date)}
      onDeleteDate={(id, key, idx) => deleteDate(id, key, idx)}
      onClose={() => setModalNull()}
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/creative-report/hrd-date-modal.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import { HrdDateModal } from "@/components/creative-report/hrd-date-modal";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import {'{ HrdDateModal }'} from "@/components/creative-report/hrd-date-modal";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Source code implementation for HrdDateModal.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/creative-report/hrd-date-modal.tsx</span>
            <button onClick={() => handleCopy(modalSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{modalSourceCode}</code></pre>
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
              <h3>Date Picker Integration</h3>
              <p>Allows updating date string via HTML5 date picker input.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Delete Date Action</h3>
              <p>Removes specific date record from staff history and recalculates counts automatically.</p>
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
                <td><code>activeDateAction</code></td>
                <td><code className="type">ActiveDateAction | null</code></td>
                <td><code>null</code></td>
                <td>Data context of the currently selected date record.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
