"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, FileCode } from "lucide-react";
import { BriefPurposeStep } from "@/features/odds/components/request-builder/steps/brief-purpose-step";
import { createRequestBuilderTheme } from "@/features/odds/components/request-builder/theme";
import type { OddsRequestForm } from "@/features/odds/components/request-builder/types";

function MockBriefPurposeWrapper() {
  const theme = createRequestBuilderTheme("light");
  const [form, setForm] = useState<OddsRequestForm>({
    request_type: "design", category_id: "1", preferred_designer_id: "1", design_purpose: "Promo Campaign",
    brief_text: "", reference_visual: "", deadline: "", important_matrix: "", attachment_notes: "",
  });

  return (
    <div className="w-full max-w-[850px] bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col p-8 min-h-[300px]">
      <BriefPurposeStep form={form} update={(field, value) => setForm(prev => ({...prev, [field]: value}))} theme={theme} />
    </div>
  );
}

export function OddsBriefPurposeDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);

  const handleCopy = (text: string, isSource = false) => {
    navigator.clipboard.writeText(text);
    if (isSource) { setCopiedSource(true); setTimeout(() => setCopiedSource(false), 2000); } 
    else { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const sourceCode = `"use client";
import { BriefPurposeStep } from "@/features/odds/components/request-builder/steps/brief-purpose-step";
export default function Page() { return <BriefPurposeStep {...props} />; }`;

  return (
    <div className="doc-example-container">
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Request Builder</div>
        <h1 className="doc-hero-title">BriefPurposeStep</h1>
        <p className="doc-hero-subtitle">Interactive documentation for the Request Tujuan/Purpose step.</p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Live preview of BriefPurposeStep.</p>
        </div>
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          {activeTab === 'preview' ? (
            <div className="doc-playground-content bg-slate-50/50 p-4 md:p-8 flex justify-center items-center">
              <MockBriefPurposeWrapper />
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
          <div className="doc-install-body text-cu-muted"><code>src/features/odds/components/request-builder/steps/brief-purpose-step.tsx</code></div>
        </div>
      </section>
    </div>
  );
}
