"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, FileCode } from "lucide-react";
import { RequestBuilderShell } from "@/features/odds/components/request-builder/components/request-builder-shell";
import { createRequestBuilderTheme } from "@/features/odds/components/request-builder/theme";

function MockRequestBuilderShellWrapper() {
  const theme = createRequestBuilderTheme("light");

  return (
    <div className="w-full max-w-[850px] bg-slate-100 p-8 rounded-3xl min-h-[400px]">
      <RequestBuilderShell 
        theme={theme}
        onSubmit={(e) => e.preventDefault()}
        footer={
          <div className="w-full p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs font-bold text-slate-500 rounded-b-3xl">
            <span>[Footer Slot Placeholder]</span>
            <button className="px-4 py-2 bg-[#00A4FF] text-white rounded-xl">Next Step</button>
          </div>
        }
      >
        <div className="flex-1 flex flex-col justify-center items-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
          <p className="font-bold text-slate-600">[Children Step Slot]</p>
          <p className="text-xs mt-1">This main area renders the active wizard step component dynamically.</p>
        </div>
      </RequestBuilderShell>
    </div>
  );
}

export function OddsRequestBuilderShellDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);

  const handleCopy = (text: string, isSource = false) => {
    navigator.clipboard.writeText(text);
    if (isSource) { setCopiedSource(true); setTimeout(() => setCopiedSource(false), 2000); } 
    else { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const sourceCode = `"use client";
import { RequestBuilderShell } from "@/features/odds/components/request-builder/components/request-builder-shell";
export default function Page() { 
  return (
    <RequestBuilderShell theme={theme} onSubmit={submit} footer={<Footer />}>
      <StepContent />
    </RequestBuilderShell>
  ); 
}`;

  return (
    <div className="doc-example-container">
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Request Builder</div>
        <h1 className="doc-hero-title">RequestBuilderShell</h1>
        <p className="doc-hero-subtitle">Interactive documentation for the main layout/wrapper frame container of the Modern Request Builder.</p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Live preview of RequestBuilderShell showing its responsive frame structure.</p>
        </div>
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          {activeTab === 'preview' ? (
            <div className="doc-playground-content bg-slate-50/50 p-4 md:p-8 flex justify-center items-center">
              <MockRequestBuilderShellWrapper />
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
          <div className="doc-install-body text-cu-muted"><code>src/features/odds/components/request-builder/components/request-builder-shell.tsx</code></div>
        </div>
      </section>
    </div>
  );
}
