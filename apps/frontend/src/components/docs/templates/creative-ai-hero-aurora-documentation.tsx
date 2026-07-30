"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { CreativeAiHeroAurora } from "@/components/creative-ai/hero-aurora";

export function CreativeAiHeroAuroraDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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

  const canvasSourceCode = `"use client";

export type CreativeAiHeroAuroraProps = {
  isFocused: boolean;
  hasMessages: boolean;
  colorEnd?: string;
  className?: string;
};

export function CreativeAiHeroAurora({
  isFocused,
  hasMessages,
  colorEnd = "#000000",
  className = "",
}: CreativeAiHeroAuroraProps) {
  // ... implementation ...
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Creative AI</div>
        <h1 className="doc-hero-title">Hero Aurora Canvas</h1>
        <p className="doc-hero-subtitle">
          Animated HTML5 canvas component producing floating particle blobs and radial gradient overlays for Creative AI.
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
          <p className="doc-section-desc">Toggle focus state to observe dark mode radial overlay transitions.</p>
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
                  <input type="checkbox" checked={isFocused} onChange={(e) => setIsFocused(e.target.checked)} className="size-4 rounded" />
                  Toggle Focus Overlay (`isFocused`)
                </label>
              </div>

              <div className="doc-playground-content">
                <div className="doc-preview-area relative overflow-hidden h-[240px] w-full rounded-xl bg-black border border-slate-800">
                  <CreativeAiHeroAurora isFocused={isFocused} hasMessages={false} />
                  <div className="relative z-20 flex items-center justify-center h-full text-white text-xs font-medium">
                    Canvas Floating Blobs Rendered Above
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import { CreativeAiHeroAurora } from "@/components/creative-ai/hero-aurora";

export default function Page() {
  return (
    <CreativeAiHeroAurora isFocused={${isFocused}} hasMessages={false} />
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/creative-ai/hero-aurora.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import { CreativeAiHeroAurora } from "@/components/creative-ai/hero-aurora";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import {'{ CreativeAiHeroAurora }'} from "@/components/creative-ai/hero-aurora";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Source code implementation of CreativeAiHeroAurora.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/creative-ai/hero-aurora.tsx</span>
            <button onClick={() => handleCopy(canvasSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{canvasSourceCode}</code></pre>
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
              <h3>GSAP Blob Ticker</h3>
              <p>Animates smooth floating Sine-wave radial gradient blobs at 60 FPS.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Radial Dark Transition</h3>
              <p>Fades in dark vignette overlay when chat or prompt input becomes focused.</p>
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
                <td><code>isFocused</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>required</code></td>
                <td>Toggles dark mode focus overlay.</td>
              </tr>
              <tr>
                <td><code>hasMessages</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>required</code></td>
                <td>Maintains dark mode when active chat history exists.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
