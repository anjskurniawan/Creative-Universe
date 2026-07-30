"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, FileCode } from "lucide-react";
import { RequestLaunchSequence } from "@/features/odds/components/request-builder/components/request-launch-sequence";

function MockLaunchSequenceWrapper() {
  const [state, setState] = useState<"idle" | "transmitting" | "success">("transmitting");
  
  return (
    <div className="w-full flex flex-col items-center gap-4 min-h-[500px]">
      <div className="flex gap-2">
        <button onClick={() => setState("transmitting")} className={`px-4 py-2 text-xs font-bold rounded-lg border-2 border-[#04044A] ${state === "transmitting" ? 'bg-[#00E5FF] text-[#04044A]' : 'bg-white'}`}>Transmitting</button>
        <button onClick={() => setState("success")} className={`px-4 py-2 text-xs font-bold rounded-lg border-2 border-[#04044A] ${state === "success" ? 'bg-[#00E5FF] text-[#04044A]' : 'bg-white'}`}>Success</button>
      </div>
      <div className="w-full max-w-[850px] bg-slate-100 rounded-3xl overflow-hidden flex flex-col h-[400px] relative border border-slate-300">
        <div className="p-4 text-center text-slate-400">Main content behind the overlay...</div>
        <RequestLaunchSequence launchSequence={state} theme="light" />
      </div>
    </div>
  );
}

export function OddsRequestLaunchSequenceDocumentation() {
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

import { RequestLaunchSequence } from "@/features/odds/components/request-builder/components/request-launch-sequence";

export default function Page() {
  return (
    <div className="relative h-screen w-full">
      {/* Your content */}
      <RequestLaunchSequence launchSequence="transmitting" theme="light" />
    </div>
  );
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Request Builder</div>
        <h1 className="doc-hero-title">RequestLaunchSequence</h1>
        <p className="doc-hero-subtitle">
          The overlay screen shown when transmitting a request and upon success (Screen Akhir).
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
          <p className="doc-section-desc">Live preview of RequestLaunchSequence.</p>
        </div>
        
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          
          {activeTab === 'preview' ? (
            <div className="doc-playground-content bg-slate-50/50 p-4 md:p-8 flex justify-center items-center">
              <MockLaunchSequenceWrapper />
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
          <div className="doc-install-body text-cu-muted"><code>src/features/odds/components/request-builder/components/request-launch-sequence.tsx</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
        </div>
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/request-builder/components/request-launch-sequence.tsx</span>
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
