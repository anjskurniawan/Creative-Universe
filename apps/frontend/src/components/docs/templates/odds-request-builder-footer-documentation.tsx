"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, FileCode } from "lucide-react";
import { RequestBuilderFooter } from "@/features/odds/components/request-builder/components/request-builder-footer";
import { createRequestBuilderTheme } from "@/features/odds/components/request-builder/theme";

function MockRequestBuilderFooterWrapper() {
  const theme = createRequestBuilderTheme("light");
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-w-[1000px] bg-slate-100 flex flex-col p-8 min-h-[300px] justify-end">
      <p className="text-center text-slate-400 mb-8">Main Request Builder Content Above</p>
      <RequestBuilderFooter 
        currentStep={3} canContinue={true} loading={false} initializing={false} uploadingAttachments={false} savingDraft={loading} canSaveDraft={true} onPrevious={() => alert("Back")} onNext={() => alert("Next")} onSaveDraft={() => { setLoading(true); setTimeout(() => setLoading(false), 1000); }}         theme={theme}
      />
    </div>
  );
}

export function OddsRequestBuilderFooterDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);

  const handleCopy = (text: string, isSource = false) => {
    navigator.clipboard.writeText(text);
    if (isSource) { setCopiedSource(true); setTimeout(() => setCopiedSource(false), 2000); } 
    else { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const sourceCode = `"use client";
import { RequestBuilderFooter } from "@/features/odds/components/request-builder/components/request-builder-footer";
export default function Page() { return <RequestBuilderFooter {...props} />; }`;

  return (
    <div className="doc-example-container">
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Request Builder</div>
        <h1 className="doc-hero-title">RequestBuilderFooter</h1>
        <p className="doc-hero-subtitle">Interactive documentation for the Request Builder bottom bar (Simpan Draft, Lanjutkan).</p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Live preview of RequestBuilderFooter.</p>
        </div>
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          {activeTab === 'preview' ? (
            <div className="doc-playground-content bg-slate-50/50 p-4 md:p-8 flex justify-center items-center">
              <MockRequestBuilderFooterWrapper />
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
          <div className="doc-install-body text-cu-muted"><code>src/features/odds/components/request-builder/components/request-builder-footer.tsx</code></div>
        </div>
      </section>
    </div>
  );
}


