"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { SideMenu, type SideMenuVariant, type SideMenuItem } from "@/components/navigation/side-menu";

export function SideMenuDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [variant, setVariant] = useState<SideMenuVariant>("Expand");

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

  const sideMenuSourceCode = `"use client";

import {
  SideMenuAvatar,
  SideMenuCollaps,
  SideMenuExpand,
} from "@/components/navigation/sidemenu";

export type SideMenuVariant = "Collaps" | "Expand";
export type SideMenuItem = {
  label: string;
  icon: string;
  href?: string;
  badge?: number | string;
  isActive?: boolean;
};

export function SideMenu({
  variant = "Expand",
  primaryItems,
  onVariantChange,
}: {
  variant?: SideMenuVariant;
  primaryItems: SideMenuItem[];
  onVariantChange?: (variant: SideMenuVariant) => void;
}) {
  // ... implementation code ...
}`;

  const sampleItems: SideMenuItem[] = [
    { label: "Dashboard", icon: "dashboard", href: "#", isActive: true },
    { label: "Tasks", icon: "task", href: "#", badge: 3 },
    { label: "Calendar", icon: "calendar_today", href: "#" },
    { label: "Members", icon: "group", href: "#" },
    { label: "Settings", icon: "settings", href: "#" },
  ];

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Navigation</div>
        <h1 className="doc-hero-title">Side Menu (Legacy)</h1>
        <p className="doc-hero-subtitle">
          The standalone vertical navigation rail component. Note: For full-page layouts, prefer using the Global Layout Shell's Sidebar component instead.
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
          <p className="doc-section-desc">Try out the Side Menu in collapsed and expanded states in one view frame.</p>
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
                  Variant Mode:
                  <select value={variant} onChange={(e) => setVariant(e.target.value as any)}>
                    <option value="Expand">Expand</option>
                    <option value="Collaps">Collaps</option>
                  </select>
                </label>
              </div>
              
              <div className="doc-playground-content">
                <div className="doc-preview-area !p-3 !bg-white border border-slate-200/80 rounded-2xl shadow-xl">
                  <div className="h-[460px] overflow-hidden rounded-xl relative bg-[#f9fafb] border border-slate-200/60 flex items-stretch">
                    <SideMenu 
                      variant={variant} 
                      primaryItems={sampleItems} 
                      onVariantChange={setVariant} 
                    />
                    <div className="flex-1 p-6 text-cu-muted flex items-center justify-center min-w-[280px]">
                      Page Content Area
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`<SideMenu 
  variant="${variant}"
  primaryItems={[
    { label: "Dashboard", icon: "dashboard", href: "#", isActive: true },
    { label: "Tasks", icon: "task", href: "#", badge: 3 },
  ]}
  onVariantChange={(v) => setVariant(v)}
/>`}</code></pre>
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/navigation/side-menu.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import { SideMenu } from "@/components/navigation/side-menu";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import {'{ SideMenu }'} from "@/components/navigation/side-menu";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Source code implementation for SideMenu.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/navigation/side-menu.tsx</span>
            <button onClick={() => handleCopy(sideMenuSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{sideMenuSourceCode}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Structural Variants</h2>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Expand Variant</h3>
              <p>Full width sidebar showing icons and text labels alongside secondary actions.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Collaps Variant</h3>
              <p>Minimized sidebar showing only icons to optimize viewport width.</p>
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
                <td><code>variant</code></td>
                <td><code className="type">"Expand" | "Collaps"</code></td>
                <td><code>"Expand"</code></td>
                <td>The current display state of the sidebar.</td>
              </tr>
              <tr>
                <td><code>primaryItems</code></td>
                <td><code className="type">SideMenuItem[]</code></td>
                <td><code>[]</code></td>
                <td>Array of navigation items to render.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
