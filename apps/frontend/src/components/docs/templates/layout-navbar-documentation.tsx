"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, Compass, FileCode, CheckCircle2, LayoutTemplate } from "lucide-react";
import GlobalLayoutNavbar from "@/components/layout/navbar";

export function LayoutNavbarDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [viewport, setViewport] = useState<"Desktop" | "Mobile">("Desktop");
  const [theme, setTheme] = useState<"light" | "dark" | "retro">("light");
  
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

  const navbarSourceCode = `"use client";

import Breadcrumb from "./navbar/breadcrumb";
import ButtonMenu from "./navbar/button-menu";

export type GlobalLayoutNavbarProps = {
  viewport?: "Mobile" | "Desktop";
  theme?: "light" | "dark" | "retro";
  onMenuClick?: () => void;
  breadcrumbItems?: string[];
};

export default function GlobalLayoutNavbar({
  viewport = "Mobile",
  theme = "light",
  onMenuClick,
  breadcrumbItems = ["Sub App", "Menu"],
}: GlobalLayoutNavbarProps) {
  // ... component implementation ...
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Layout</div>
        <h1 className="doc-hero-title">Navbar</h1>
        <p className="doc-hero-subtitle">
          The top navigation bar specifically built for Workspace layouts. It displays modular sub-app titles, breadcrumbs, and renders mobile hamburger menu hooks when needed.
        </p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      {/* ── Anatomy / Sub-components ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title flex items-center gap-2"><LayoutTemplate size={18} /> Sub-components Anatomy</h2>
          <p className="doc-section-desc">The Navbar is composed of smaller modular components located in <code>src/components/layout/navbar/</code> to maximize reusability.</p>
        </div>

        <div className="doc-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div className="doc-grid-item" style={{ padding: '1rem' }}>
            <h4 className="font-semibold text-sm"><code>Breadcrumb</code></h4>
            <p className="text-xs text-cu-muted mt-1">Renders hierarchical location pathways (e.g. <code>App Name / Page Title</code>).</p>
          </div>
          <div className="doc-grid-item" style={{ padding: '1rem' }}>
            <h4 className="font-semibold text-sm"><code>AppsDropdown</code></h4>
            <p className="text-xs text-cu-muted mt-1">Handles sub-app switching (KV Retail, ODDS, CAI) based on user authorization.</p>
          </div>
          <div className="doc-grid-item" style={{ padding: '1rem' }}>
            <h4 className="font-semibold text-sm"><code>NotificationDropdown</code></h4>
            <p className="text-xs text-cu-muted mt-1">Renders list of user alerts, updates, and activities.</p>
          </div>
          <div className="doc-grid-item" style={{ padding: '1rem' }}>
            <h4 className="font-semibold text-sm"><code>MessageDropdown</code></h4>
            <p className="text-xs text-cu-muted mt-1">Shows active team chats, communications, and message summaries.</p>
          </div>
          <div className="doc-grid-item" style={{ padding: '1rem' }}>
            <h4 className="font-semibold text-sm"><code>ProfileDropdown</code></h4>
            <p className="text-xs text-cu-muted mt-1">Manages active user profile views and account sign-out actions.</p>
          </div>
          <div className="doc-grid-item" style={{ padding: '1rem' }}>
            <h4 className="font-semibold text-sm"><code>ButtonMenu</code></h4>
            <p className="text-xs text-cu-muted mt-1">Hamburger menu button rendered only in Mobile viewports.</p>
          </div>
        </div>
      </section>

      {/* ── Interactive Playground ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Observe the rendering differences of breadcrumbs and hamburgers between Viewports in one view frame.</p>
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
                  Viewport:
                  <select value={viewport} onChange={(e) => setViewport(e.target.value as any)}>
                    <option value="Desktop">Desktop</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </label>
                <label>
                  Theme:
                  <select value={theme} onChange={(e) => setTheme(e.target.value as any)}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="retro">Retro</option>
                  </select>
                </label>
              </div>

              <div className="doc-playground-content">
                <div className="doc-preview-area !p-3 !bg-white border border-slate-200/80 rounded-2xl shadow-xl">
                  <div className={`transition-[width] border border-cu-line overflow-hidden rounded-[12px] relative flex flex-col bg-gray-50/50 shadow-inner ${viewport === "Mobile" ? "w-[390px] h-[260px]" : "w-full max-w-[850px] h-[220px]"}`}>
                    <GlobalLayoutNavbar 
                      viewport={viewport}
                      theme={theme}
                      breadcrumbItems={["Creative Report", "Dashboard"]}
                      onMenuClick={() => alert("Mobile drawer menu activated!")}
                    />
                    <div className="flex-1 w-full flex flex-col items-center justify-center text-cu-muted p-4 text-center">
                      <span className="text-xs font-semibold flex items-center gap-1"><Compass size={14} /> Workspace Page Surface</span>
                      {viewport === "Mobile" && <span className="text-[10px] opacity-75 mt-1">Tap the hamburger menu in the top right.</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import GlobalLayoutNavbar from "@/components/layout/navbar";

export default function TopHeader() {
  return (
    <GlobalLayoutNavbar 
      viewport="${viewport}"
      theme="${theme}"
      breadcrumbItems={["Creative Report", "Dashboard"]}
      onMenuClick={() => openMobileDrawer()}
    />
  );
}`}</code></pre>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Specs & Installation ── */}
      <section className="doc-section">
        <h2 className="doc-section-title">Installation & Usage</h2>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header"><span className="flex items-center gap-2"><FileCode size={14} /> File Location</span></div>
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/layout/navbar.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import GlobalLayoutNavbar from "@/components/layout/navbar";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import GlobalLayoutNavbar from "@/components/layout/navbar";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Interface exports of the GlobalLayoutNavbar component.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/layout/navbar.tsx</span>
            <button onClick={() => handleCopy(navbarSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{navbarSourceCode}</code></pre>
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
                <td><code>viewport</code></td>
                <td><code className="type">"Desktop" | "Mobile"</code></td>
                <td><code>"Mobile"</code></td>
                <td>Adjusts padding and decides whether to display hamburger trigger.</td>
              </tr>
              <tr>
                <td><code>theme</code></td>
                <td><code className="type">"light" | "dark" | "retro"</code></td>
                <td><code>"light"</code></td>
                <td>Aesthetic background tone matching the sidebar styling.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
