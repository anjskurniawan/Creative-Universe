"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import ButtonMenu from "@/components/layout/navbar/button-menu";

export function NavbarButtonMenuDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [state, setState] = useState<"Default" | "Hover" | "Focus" | "Disable">("Default");
  const [dark, setDark] = useState(false);
  
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

  const buttonMenuSourceCode = `"use client";

import { MaterialIcon } from "@/components/ui/material-icon";

export type ButtonMenuProps = {
  className?: string;
  icon: string;
  state?: "Hover" | "Focus" | "Disable" | "Default";
  dark?: boolean;
};

export default function ButtonMenu({
  className = "",
  icon,
  state = "Default",
  dark = false,
}: ButtonMenuProps) {
  // ... component implementation ...
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Navbar Sub-component</div>
        <h1 className="doc-hero-title">Navbar: Button Menu (Mobile)</h1>
        <p className="doc-hero-subtitle">
          Compact action utility button designed for workspace header controls (typically menu toggles).
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
          <p className="doc-section-desc">Try button states and dark mode options in real time.</p>
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
                  Button State:
                  <select value={state} onChange={(e) => setState(e.target.value as any)}>
                    <option value="Default">Default</option>
                    <option value="Hover">Hover</option>
                    <option value="Focus">Focus</option>
                    <option value="Disable">Disable</option>
                  </select>
                </label>
                <label className="cursor-pointer">
                  <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} className="size-4 rounded" />
                  Dark Theme
                </label>
              </div>

              <div className="doc-playground-content">
                <div className={`doc-preview-area transition-colors duration-200 ${dark ? 'bg-[#111413] border-[#222]' : 'bg-white'}`}>
                  <ButtonMenu 
                    icon="menu"
                    state={state}
                    dark={dark}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import ButtonMenu from "@/components/layout/navbar/button-menu";

export default function MobileHeader() {
  return (
    <ButtonMenu 
      icon="menu"
      state="${state}"
      dark={${dark}}
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/layout/navbar/button-menu.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import ButtonMenu from "@/components/layout/navbar/button-menu";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import ButtonMenu from "@/components/layout/navbar/button-menu";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Source code implementation for ButtonMenu.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/layout/navbar/button-menu.tsx</span>
            <button onClick={() => handleCopy(buttonMenuSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{buttonMenuSourceCode}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Button States</h2>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Focus Ring State</h3>
              <p>Adds subtle border lines around button bounds when focused via keyboard navigation.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Disabled Opacity</h3>
              <p>Reduces opacity to 35% and disables hover pointer feedback.</p>
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
                <td><code>icon</code></td>
                <td><code className="type">string</code></td>
                <td><code>required</code></td>
                <td>Google Material icon name identifier to render.</td>
              </tr>
              <tr>
                <td><code>state</code></td>
                <td><code className="type">"Default" | "Hover" | "Focus" | "Disable"</code></td>
                <td><code>"Default"</code></td>
                <td>Physical button states adjusting background shades.</td>
              </tr>
              <tr>
                <td><code>dark</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>false</code></td>
                <td>Switches icon color styles to fit dark mode panels.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
