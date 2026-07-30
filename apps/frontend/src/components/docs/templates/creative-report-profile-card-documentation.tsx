"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import ProfileCard from "@/components/layout/profile/card";

export function CreativeReportProfileCardDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [isActive, setIsActive] = useState(true);

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

  const cardSourceCode = `"use client";

import ProfileCard from "@/components/layout/profile/card";

export default function Page() {
  return (
    <ProfileCard
      name="Anjas Kurniawan"
      role="SPV Creative"
      departments={["Branding", "UI/UX"]}
      capacity={75}
      responseTime="15 min"
      rating="4.9/5"
      score="94"
      active={true}
      onClick={() => selectMember(index)}
    />
  );
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Creative Report / Creative Agent</div>
        <h1 className="doc-hero-title">Creative Agent Profile Card</h1>
        <p className="doc-hero-subtitle">
          Interactive member profile card used in Creative Agent grid view with marquee department scroll and selection border.
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
          <p className="doc-section-desc">Toggle active state to view highlighted selection styling.</p>
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
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="size-4 rounded" />
                  Toggle Active Selection (`active`)
                </label>
              </div>

              <div className="doc-playground-content">
                <div className="doc-preview-area !p-6 !bg-white border border-slate-200/80 rounded-2xl shadow-xl w-full max-w-[420px]">
                  <ProfileCard
                    name="Anjas Kurniawan"
                    role="SPV Creative"
                    departments={["Branding", "UI/UX", "3D Design"]}
                    capacity={75}
                    responseTime="15 min"
                    rating="4.9/5"
                    score="94"
                    active={isActive}
                    onClick={() => setIsActive(!isActive)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{cardSourceCode}</code></pre>
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/layout/profile/card.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import ProfileCard from "@/components/layout/profile/card";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import ProfileCard from "@/components/layout/profile/card";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Source code implementation of ProfileCard.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/layout/profile/card.tsx</span>
            <button onClick={() => handleCopy(cardSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{cardSourceCode}</code></pre>
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
                <td><code>name</code></td>
                <td><code className="type">string</code></td>
                <td><code>required</code></td>
                <td>Staff member full name.</td>
              </tr>
              <tr>
                <td><code>capacity</code></td>
                <td><code className="type">number</code></td>
                <td><code>0</code></td>
                <td>Workload capacity percentage (0-100).</td>
              </tr>
              <tr>
                <td><code>active</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>false</code></td>
                <td>Highlights card border on selection.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
