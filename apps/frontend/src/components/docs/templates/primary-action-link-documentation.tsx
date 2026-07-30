"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { PrimaryActionLink } from "@/components/ui/primary-action-link";

export function PrimaryActionLinkDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [labelText, setLabelText] = useState("Continue to Universe");

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

  const primaryActionSourceCode = `"use client";

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";

export type PrimaryActionLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
};

export function PrimaryActionLink({
  children,
  className = "",
  ...props
}: PrimaryActionLinkProps) {
  // ... component implementation ...
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">UI Component</div>
        <h1 className="doc-hero-title">Primary Action Link</h1>
        <p className="doc-hero-subtitle">
          Primary visual action for navigation. Mobile follows Figma node 26:238; desktop scales the same anatomy proportionally.
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
          <p className="doc-section-desc">Try out button action labels in real time.</p>
        </div>
        
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          
          {activeTab === 'preview' ? (
            <div>
              <div className="doc-playground-controls">
                <label>
                  Button Label:
                  <input 
                    type="text" 
                    value={labelText} 
                    onChange={(e) => setLabelText(e.target.value)}
                    className="w-64"
                  />
                </label>
              </div>

              <div className="doc-playground-content">
                <div className="doc-preview-area bg-[#191919] border-[#333]">
                  <PrimaryActionLink href="#primary-action-preview">{labelText}</PrimaryActionLink>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`<PrimaryActionLink href="/next-page">
  ${labelText}
</PrimaryActionLink>`}</code></pre>
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/ui/primary-action-link.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import { PrimaryActionLink } from "@/components/ui/primary-action-link";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import {'{ PrimaryActionLink }'} from "@/components/ui/primary-action-link";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Full implementation source for PrimaryActionLink.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/ui/primary-action-link.tsx</span>
            <button onClick={() => handleCopy(primaryActionSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{primaryActionSourceCode}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Responsive Anatomy</h2>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Mobile Anatomy</h3>
              <p>48px height, 4px outer padding, 36px radius, 40px arrow circle container.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Desktop Anatomy</h3>
              <p>56px height, 18/24 label typography, 48px arrow circle container.</p>
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
                <td><code>href</code></td>
                <td><code className="type">string | UrlObject</code></td>
                <td>-</td>
                <td>Destination URL for the action link.</td>
              </tr>
              <tr>
                <td><code>children</code></td>
                <td><code className="type">ReactNode</code></td>
                <td>-</td>
                <td>Text label displayed inside the pill container.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
