"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { CategorySelectionStep } from "@/features/odds/components/request-builder/steps/category-selection-step";
import { createRequestBuilderTheme } from "@/features/odds/components/request-builder/theme";
import type { OddsCategory } from "@/features/odds/api";

const mockCategories: OddsCategory[] = [
  { id: 1, name: "UI/UX Design", score_weight: 10, normal_revision_limit: 3, sla_minutes: 120, is_active: true },
  { id: 2, name: "Social Media", score_weight: 5, normal_revision_limit: 2, sla_minutes: 60, is_active: true },
  { id: 3, name: "Illustration", score_weight: 15, normal_revision_limit: 5, sla_minutes: 180, is_active: true },
];

function MockCategorySelectionWrapper() {
  const theme = createRequestBuilderTheme("light");
  const [selected, setSelected] = useState("");
  
  return (
    <div className="w-full max-w-[1000px] bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col p-8 min-h-[400px]">
      <CategorySelectionStep 
        theme={theme} 
        categories={mockCategories} 
        selectedCategoryId={selected} 
        update={(field, val) => setSelected(val)} 
      />
    </div>
  );
}

export function OddsCategorySelectionStepDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);

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

  const sourceCode = `"use client";

import { CategorySelectionStep } from "@/features/odds/components/request-builder/steps/category-selection-step";
import { createRequestBuilderTheme } from "@/features/odds/components/request-builder/theme";

export default function Page() {
  const theme = createRequestBuilderTheme("light");
  return (
    <CategorySelectionStep theme={theme} categories={[]} selectedCategoryId={""} update={() => {}} />
  );
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Features</div>
        <h1 className="doc-hero-title">CategorySelectionStep</h1>
        <p className="doc-hero-subtitle">
          Interactive documentation for the ODDS CategorySelectionStep component.
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
          <p className="doc-section-desc">Live preview of CategorySelectionStep.</p>
        </div>
        
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          
          {activeTab === 'preview' ? (
            <div className="doc-playground-content bg-slate-50/50 p-4 md:p-8 flex justify-center items-center">
              <MockCategorySelectionWrapper />
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{sourceCode}</code></pre>
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
          <div className="doc-install-body text-cu-muted"><code>src/features/odds/components/request-builder/steps/category-selection-step.tsx</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
        </div>
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">features/odds/components/request-builder/steps/category-selection-step.tsx</span>
            <button onClick={() => handleCopy(sourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{sourceCode}</code></pre>
          </div>
        </div>
      </section>
    </div>
  );
}
