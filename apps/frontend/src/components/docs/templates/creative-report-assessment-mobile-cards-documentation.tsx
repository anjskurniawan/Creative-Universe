"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { AssessmentMobileCards } from "@/components/creative-report/assessment-mobile-cards";
import type { CreativeReportGroup } from "@/features/creative-report/types";

export function CreativeReportAssessmentMobileCardsDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [canEdit, setCanEdit] = useState(true);

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

  const cardsSourceCode = `"use client";

import type { CreativeReportGroup } from "@/features/creative-report/types";

export type AssessmentMobileCardsProps = {
  group: CreativeReportGroup;
  onChanged: () => Promise<void>;
  canEdit: boolean;
};

export function AssessmentMobileCards({
  group,
  onChanged,
  canEdit,
}: AssessmentMobileCardsProps) {
  // ... implementation ...
}`;

  const mockGroup: CreativeReportGroup = {
    id: 1,
    name: "Design & Media Team",
    staff_count: 1,
    assessments: [
      {
        id: 101,
        period: "2026-07",
        group: { id: 1, name: "Design & Media Team" },
        user: { id: 1, name: "Anjas Kurniawan", position: "SPV Designer", division: "Creative", avatar_path: null, card_image_path: null },
        creative_scores: [6, 6, 6, 6, 6, 10, 10, 10, 10, 10],
        hrd_review: { leave: 0, app_permission: 0, absence: 0, late: 0, score: 20, history: {} },
        totals: { score_30: 30, score_50: 50, final: 100 },
        status: "draft"
      }
    ]
  };

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Creative Report</div>
        <h1 className="doc-hero-title">Assessment Mobile Cards</h1>
        <p className="doc-hero-subtitle">
          Touch-screen optimized accordion card views designed specifically for mobile viewports.
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
          <p className="doc-section-desc">Observe the card rendering within a simulated mobile frame.</p>
        </div>
        
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          
          {activeTab === 'preview' ? (
            <div>
              <div className="doc-playground-controls">
                <label className="cursor-pointer">
                  <input type="checkbox" checked={canEdit} onChange={(e) => setCanEdit(e.target.checked)} className="size-4 rounded" />
                  Enable Edit (`canEdit`)
                </label>
              </div>

              <div className="doc-playground-content" style={{ minHeight: '340px' }}>
                <div className="doc-preview-area !p-4 !bg-white border border-slate-200/80 rounded-2xl shadow-xl w-[360px]">
                  <div className="w-full border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-2">
                    <AssessmentMobileCards
                      group={mockGroup}
                      onChanged={async () => {}}
                      canEdit={canEdit}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import { AssessmentMobileCards } from "@/components/creative-report/assessment-mobile-cards";

export default function Page() {
  return (
    <AssessmentMobileCards
      group={groupData}
      onChanged={async () => refetch()}
      canEdit={${canEdit}}
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/creative-report/assessment-mobile-cards.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import { AssessmentMobileCards } from "@/components/creative-report/assessment-mobile-cards";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import {'{ AssessmentMobileCards }'} from "@/components/creative-report/assessment-mobile-cards";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Source code structure for AssessmentMobileCards.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/creative-report/assessment-mobile-cards.tsx</span>
            <button onClick={() => handleCopy(cardsSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{cardsSourceCode}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Mobile Layout</h2>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Touch Expand Header</h3>
              <p>Header row showing avatar, staff name, and accordion toggle icon.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>4-Grid Metric Bar</h3>
              <p>Displays Collab, Perf, HRD, and Final scores in a touch-friendly 4-column row.</p>
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
                <td>Assessments group data object.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
