"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { HeroHeading } from "@/components/typography/hero-heading";

export function HeroHeadingDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [typing, setTyping] = useState(true);
  const [align, setAlign] = useState<"left" | "center">("center");
  const [headingText, setHeadingText] = useState("This is Where Creative Begins");

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

  const heroHeadingSourceCode = `"use client";

import { useEffect, useState } from "react";

export type HeroHeadingProps = {
  children: string;
  align?: "left" | "center";
  typing?: boolean;
  typingSpeed?: number;
  typingDelay?: number;
  className?: string;
};

export function HeroHeading({
  children,
  align = "center",
  typing = false,
  typingSpeed = 80,
  typingDelay = 0,
  className = "",
}: HeroHeadingProps) {
  // ... implementation code ...
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Typography</div>
        <h1 className="doc-hero-title">Hero Heading</h1>
        <p className="doc-hero-subtitle">
          Reusable primary heading for hero sections with an optional typewriter animation effect.
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
          <p className="doc-section-desc">Try out typewriter animations and text alignments in real time.</p>
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
                  <input type="checkbox" checked={typing} onChange={(e) => setTyping(e.target.checked)} className="size-4 rounded" />
                  Typewriter Animation
                </label>
                <label>
                  Alignment:
                  <select value={align} onChange={(e) => setAlign(e.target.value as any)}>
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                  </select>
                </label>
                <label>
                  Text:
                  <input 
                    type="text" 
                    value={headingText} 
                    onChange={(e) => setHeadingText(e.target.value)}
                    className="w-64"
                  />
                </label>
              </div>

              <div className="doc-playground-content">
                <div className="doc-preview-area w-full max-w-[850px]">
                  <HeroHeading key={`${typing}-${align}-${headingText}`} typing={typing} align={align} className="w-full">
                    {headingText}
                  </HeroHeading>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`<HeroHeading 
  typing={${typing}} 
  align="${align}"
>
  ${headingText}
</HeroHeading>`}</code></pre>
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/typography/hero-heading.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import { HeroHeading } from "@/components/typography/hero-heading";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import {'{ HeroHeading }'} from "@/components/typography/hero-heading";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Full implementation source for HeroHeading.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/typography/hero-heading.tsx</span>
            <button onClick={() => handleCopy(heroHeadingSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{heroHeadingSourceCode}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Responsive Scale</h2>
          <p className="doc-section-desc">Automatic font size scaling across viewports.</p>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Mobile (48px)</h3>
              <p>Scales font-size down to 48px on mobile devices for optimal readability.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Desktop (96px)</h3>
              <p>Scales font-size up to 96px bold title presentation on desktop screens.</p>
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
                <td><code>children</code></td>
                <td><code className="type">string</code></td>
                <td>-</td>
                <td>The text content of the heading.</td>
              </tr>
              <tr>
                <td><code>align</code></td>
                <td><code className="type">"left" | "center"</code></td>
                <td><code>"center"</code></td>
                <td>Text alignment for the heading.</td>
              </tr>
              <tr>
                <td><code>typing</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>false</code></td>
                <td>If true, enables the typewriter animation effect.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
