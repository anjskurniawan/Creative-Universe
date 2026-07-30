"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, FileCode } from "lucide-react";
import { BriefImportantMatrixStep } from "@/features/odds/components/request-builder/steps/brief-important-matrix-step";
import { createRequestBuilderTheme } from "@/features/odds/components/request-builder/theme";
import type { OddsRequestForm } from "@/features/odds/components/request-builder/types";

function MockBriefImportantMatrixWrapper() {
  const theme = createRequestBuilderTheme("light");
  const [form, setForm] = useState<OddsRequestForm>({
    request_type: "design", category_id: "1", preferred_designer_id: "1", design_purpose: "Promo Campaign",
    brief_text: "", reference_visual: "", deadline: "", important_matrix: "Q2", attachment_notes: "",
  });

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button onClick={() => setForm(prev => ({...prev, important_matrix: "Q1"}))} className={`px-4 py-2 text-xs font-bold rounded-lg border-2 border-[#04044A] ${form.important_matrix === "Q1" ? 'bg-[#00E5FF] text-[#04044A]' : 'bg-white'}`}>Q1</button>
        <button onClick={() => setForm(prev => ({...prev, important_matrix: "Q2"}))} className={`px-4 py-2 text-xs font-bold rounded-lg border-2 border-[#04044A] ${form.important_matrix === "Q2" ? 'bg-[#00E5FF] text-[#04044A]' : 'bg-white'}`}>Q2</button>
        <button onClick={() => setForm(prev => ({...prev, important_matrix: "Q3"}))} className={`px-4 py-2 text-xs font-bold rounded-lg border-2 border-[#04044A] ${form.important_matrix === "Q3" ? 'bg-[#00E5FF] text-[#04044A]' : 'bg-white'}`}>Q3</button>
        <button onClick={() => setForm(prev => ({...prev, important_matrix: "Q4"}))} className={`px-4 py-2 text-xs font-bold rounded-lg border-2 border-[#04044A] ${form.important_matrix === "Q4" ? 'bg-[#00E5FF] text-[#04044A]' : 'bg-white'}`}>Q4</button>
      </div>
      <div className="w-full max-w-[850px] bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col p-8 min-h-[300px]">
        <BriefImportantMatrixStep 
          form={form} 
          selectedCategory={{ id: 1, name: "UI/UX Design", important_matrix: form.important_matrix, score_weight: 10, normal_revision_limit: 3, sla_minutes: 120, is_active: true }} 
          theme={theme} 
        />
      </div>
    </div>
  );
}

export function OddsBriefImportantMatrixDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);

  const handleCopy = (text: string, isSource = false) => {
    navigator.clipboard.writeText(text);
    if (isSource) { setCopiedSource(true); setTimeout(() => setCopiedSource(false), 2000); } 
    else { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const sourceCode = `"use client";
import { BriefImportantMatrixStep } from "@/features/odds/components/request-builder/steps/brief-important-matrix-step";
export default function Page() { return <BriefImportantMatrixStep {...props} />; }`;

  return (
    <div className="doc-example-container">
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Request Builder</div>
        <h1 className="doc-hero-title">BriefImportantMatrixStep</h1>
        <p className="doc-hero-subtitle">Interactive documentation for the Request Important Matrix step.</p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Live preview of BriefImportantMatrixStep.</p>
        </div>
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          {activeTab === 'preview' ? (
            <div className="doc-playground-content bg-slate-50/50 p-4 md:p-8 flex justify-center items-center">
              <MockBriefImportantMatrixWrapper />
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
          <div className="doc-install-body text-cu-muted"><code>src/features/odds/components/request-builder/steps/brief-important-matrix-step.tsx</code></div>
        </div>
      </section>
    </div>
  );
}
