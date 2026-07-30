"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { CreativeAiTypewriterTitle } from "@/components/creative-ai/typewriter-title";

export function CreativeAiTypewriterTitleDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [userName, setUserName] = useState("Sobat CU");

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

  const titleSourceCode = `"use client";

export type CreativeAiTypewriterTitleProps = {
  userName?: string;
  isFocused?: boolean;
  hasMessages?: boolean;
  className?: string;
};

export function CreativeAiTypewriterTitle({
  userName = "Sobat CU",
  isFocused = false,
  hasMessages = false,
  className = "",
}: CreativeAiTypewriterTitleProps) {
  // ... implementation ...
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Creative AI</div>
        <h1 className="doc-hero-title">Typewriter Title</h1>
        <p className="doc-hero-subtitle">
          Interactive animated heading component with GSAP typewriter character effect and glowing cursor.
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
          <p className="doc-section-desc">Toggle focus mode to trigger typewriter text change.</p>
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
                  Toggle Focused State (`isFocused`)
                </label>
                <label>
                  User Name:
                  <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="h-8 px-2 text-xs rounded border border-slate-300 w-32" />
                </label>
              </div>

              <div className="doc-playground-content">
                <div className={`doc-preview-area !p-8 rounded-xl border flex items-center justify-center ${isFocused ? 'bg-[#09090b]' : 'bg-white'}`}>
                  <CreativeAiTypewriterTitle
                    userName={userName}
                    isFocused={isFocused}
                    hasMessages={false}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import { CreativeAiTypewriterTitle } from "@/components/creative-ai/typewriter-title";

export default function Page() {
  return (
    <CreativeAiTypewriterTitle
      userName="${userName}"
      isFocused={${isFocused}}
      hasMessages={false}
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/creative-ai/typewriter-title.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import { CreativeAiTypewriterTitle } from "@/components/creative-ai/typewriter-title";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import {'{ CreativeAiTypewriterTitle }'} from "@/components/creative-ai/typewriter-title";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Source code implementation of CreativeAiTypewriterTitle.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/creative-ai/typewriter-title.tsx</span>
            <button onClick={() => handleCopy(titleSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{titleSourceCode}</code></pre>
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
                <td><code>userName</code></td>
                <td><code className="type">string</code></td>
                <td><code>"Sobat CU"</code></td>
                <td>Active user display name inserted into prompt title.</td>
              </tr>
              <tr>
                <td><code>isFocused</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>false</code></td>
                <td>Triggers typewriter text transition and gradient styling.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
