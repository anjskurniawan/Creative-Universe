"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, Type, BookOpen } from "lucide-react";
import { HeroHeading } from "@/components/typography/hero-heading";

export function HeroHeadingDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  // Playground state
  const [typing, setTyping] = useState(true);
  const [align, setAlign] = useState<"left" | "center">("center");

  const handleCopy = () => {
    navigator.clipboard.writeText(`import { HeroHeading } from "@/components/typography/hero-heading";`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
        </div>
      </header>

      {/* ── Quick Playground ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Try out the component in real-time before using it.</p>
        </div>
        
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button 
              className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
            <button 
              className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              Code
            </button>
          </div>
          
          <div className="doc-playground-content" style={{ padding: '0', background: 'transparent' }}>
            {activeTab === 'preview' ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1rem', background: 'hsl(var(--secondary))', borderBottom: '1px solid hsl(var(--border))', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <label className="flex items-center gap-2 text-xs font-semibold text-cu-muted">
                    <input type="checkbox" checked={typing} onChange={(e) => setTyping(e.target.checked)} className="rounded border-cu-line" />
                    Typing Animation
                  </label>
                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-cu-muted">
                    Alignment
                    <select 
                      value={align} 
                      onChange={(e) => setAlign(e.target.value as typeof align)} 
                      className="h-9 rounded-lg border border-cu-line bg-white px-3 text-sm font-medium text-cu-ink outline-none"
                    >
                      <option value="center">Center</option>
                      <option value="left">Left</option>
                    </select>
                  </label>
                </div>
                <div style={{ padding: '3rem', flex: 1, background: 'hsl(var(--card))', minHeight: '360px', display: 'flex', alignItems: 'center' }}>
                  <HeroHeading key={`${typing}-${align}`} typing={typing} align={align} className="w-full">
                    This is Where Creative Begins
                  </HeroHeading>
                </div>
              </div>
            ) : (
              <div className="doc-code-area" style={{ margin: '2rem', width: 'auto' }}>
                <pre>
                  <code>
{`<HeroHeading 
  typing={${typing}} 
  align="${align}"
>
  This is Where Creative Begins
</HeroHeading>`}
                  </code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Installation ── */}
      <section className="doc-section">
        <h2 className="doc-section-title">Installation & Usage</h2>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header">
            <span>File Location</span>
          </div>
          <div className="doc-install-body text-cu-muted">
            <code>apps/frontend/src/components/typography/hero-heading.tsx</code>
          </div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span>Import Statement</span>
            <button onClick={handleCopy} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body">
            <code>import {'{ HeroHeading }'} from "@/components/typography/hero-heading";</code>
          </div>
        </div>
      </section>

      {/* ── Props API ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><BookOpen size={18} className="inline-icon" /> API Reference</h2>
          <p className="doc-section-desc">Complete list of props and their expected types.</p>
        </div>
        
        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>children</code></td>
                <td><code className="type">ReactNode</code></td>
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
              <tr>
                <td><code>typingSpeed</code></td>
                <td><code className="type">number</code></td>
                <td><code>80</code></td>
                <td>Speed of the typing animation in milliseconds per character.</td>
              </tr>
              <tr>
                <td><code>typingDelay</code></td>
                <td><code className="type">number</code></td>
                <td><code>0</code></td>
                <td>Initial delay before the typing animation starts.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-cu-muted">
          Responsive scale: 48px mobile, 72px tablet, 96px desktop. The typing cursor uses absolute positioning so it does not affect text wrapping or width.
        </p>
      </section>

    </div>
  );
}
