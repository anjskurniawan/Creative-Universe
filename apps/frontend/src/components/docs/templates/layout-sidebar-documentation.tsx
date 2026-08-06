"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";

export function LayoutSidebarDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "retro">("light");
  const [expanded, setExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState("/example/dashboard");
  
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

  const sidebarSourceCode = `"use client";

import { Fragment } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";

export type SidebarItem = {
  label: string;
  icon: string;
  href?: string;
  badge?: number | string;
  group?: string;
  isActive?: boolean;
  isHighlighted?: boolean;
};

export type SidebarProps = {
  theme?: "dark" | "light" | "retro";
  onToggleTheme?: () => void;
  onToggleRetro?: () => void;
  expanded?: boolean;
  onToggleExpanded?: () => void;
  activeHref?: string;
  ariaLabel?: string;
  className?: string;
  primaryItems?: SidebarItem[];
  settingsHref?: string;
};

export default function Sidebar({
  theme = "light",
  expanded = false,
  onToggleExpanded,
  activeHref = "",
  ariaLabel = "Sidebar",
  className = "",
  primaryItems = [],
  settingsHref,
}: SidebarProps) {
  // ... component implementation ...
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Layout</div>
        <h1 className="doc-hero-title">Sidebar</h1>
        <p className="doc-hero-subtitle">
          The desktop-only side navigation menu. Supports responsive width switching, theme styling adaptation, and interactive item highlighting.
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
          <p className="doc-section-desc">Observe sidebar behaviors by expanding/collapsing it or toggling theme properties in one view.</p>
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
                  Theme:
                  <select value={theme} onChange={(e) => setTheme(e.target.value as any)}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="retro">Retro</option>
                  </select>
                </label>
                <label className="cursor-pointer">
                  <input type="checkbox" checked={expanded} onChange={(e) => setExpanded(e.target.checked)} className="size-4 rounded" />
                  Expanded
                </label>
              </div>

              <div className="doc-playground-content">
                <div className="doc-preview-area !p-3 !bg-white border border-slate-200/80 rounded-2xl shadow-xl">
                  <div className="h-[440px] overflow-hidden rounded-xl relative flex bg-slate-50 border border-slate-200/60">
                    <Sidebar 
                      expanded={expanded}
                      primaryItems={[
                        { label: "Dashboard", href: "#", icon: "dashboard" },
                        { label: "Analytics", href: "#", icon: "monitoring" },
                        { label: "Settings", href: "#", icon: "settings" }
                      ].map(item => ({
                        ...item,
                        href: undefined,
                        isActive: activeItem === item.href
                      }))}
                      activeHref={activeItem}
                      onToggleExpanded={() => setExpanded(!expanded)}
                    />
                    <div className="flex-1 w-[380px] flex flex-col items-center justify-center text-cu-muted p-6 text-center">
                      <span className="font-semibold text-sm">Workspace Content Canvas</span>
                      <span className="text-xs opacity-75 mt-1">Highlighted route: {activeItem}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import Sidebar from "@/components/layout/sidebar";

export default function WorkspaceSidebar() {
  return (
    <Sidebar 
      expanded={${expanded}}
      primaryItems={[
        { label: "Dashboard", href: "/dashboard", icon: "dashboard", isActive: true },
      ]}
      onToggleExpanded={() => toggleExpanded()}
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/layout/sidebar.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import Sidebar from "@/components/layout/sidebar";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import Sidebar from "@/components/layout/sidebar";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Interface exports and parameters of the Sidebar component.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/layout/sidebar.tsx</span>
            <button onClick={() => handleCopy(sidebarSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{sidebarSourceCode}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Visual Axis</h2>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Expanded Mode (w-56)</h3>
              <p>Full desktop width displaying icons, text titles, group dividers, and bottom triggers.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Collapsed Mode (w-16)</h3>
              <p>Compact rail displaying icon nodes only to maximize horizontal application space.</p>
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
                <td><code>theme</code></td>
                <td><code className="type">"light" | "dark" | "retro"</code></td>
                <td><code>"light"</code></td>
                <td>Specifies the aesthetic color tone of the sidebar panel.</td>
              </tr>
              <tr>
                <td><code>expanded</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>false</code></td>
                <td>Toggles between standard (full width) or collapsed (icon rail) modes.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
