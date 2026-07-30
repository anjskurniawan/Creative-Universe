"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, Menu as MenuIcon, FileCode, CheckCircle2, Palette } from "lucide-react";
import Menu from "@/components/layout/menu";

export function LayoutMenuDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("/example/dashboard");
  
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

  const menuSourceCode = `"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";

export type MenuItem = {
  label: string;
  icon?: string;
  href?: string;
  badge?: number | string;
  group?: string;
  isActive?: boolean;
};

export type MenuProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  menuItems?: MenuItem[];
  onItemClick?: (item: MenuItem, index: number) => void;
  activeHref?: string;
};

export default function Menu({
  isOpen,
  onClose,
  title = "Menu Navigasi",
  menuItems = [],
  onItemClick,
  activeHref = "",
}: MenuProps) {
  // ... component implementation ...
}`;

  const sampleMenu = [
    { label: "Dashboard", icon: "dashboard", href: "/example/dashboard", isActive: activeMenu === "/example/dashboard" },
    { label: "Settings", icon: "settings", href: "/example/settings", isActive: activeMenu === "/example/settings" }
  ];

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Layout</div>
        <h1 className="doc-hero-title">Menu (Mobile)</h1>
        <p className="doc-hero-subtitle">
          The sliding bottom-drawer menu designed for touch screens and mobile browsers. Supports smooth overlay transitions, header branding, and touch item triggers.
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
          <p className="doc-section-desc">Observe drawer animations by toggling the drawer state in one view frame.</p>
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
                  Drawer State:
                  <select value={isOpen ? "Open" : "Closed"} onChange={(e) => setIsOpen(e.target.value === "Open")}>
                    <option value="Open">Open (Visible)</option>
                    <option value="Closed">Closed (Hidden)</option>
                  </select>
                </label>
              </div>

              <div className="doc-playground-content">
                <div className="doc-preview-area !p-3 !bg-white border border-slate-200/80 rounded-2xl shadow-xl">
                  <div className="w-[380px] h-[520px] border border-cu-line rounded-[24px] overflow-hidden relative shadow-inner bg-[#f9fafb] flex flex-col justify-center items-center">
                    <span className="text-xs text-cu-muted mb-4 flex items-center gap-1.5"><MenuIcon size={12} /> Mobile Device Canvas</span>
                    <button onClick={() => setIsOpen(true)} className="h-9 px-4 rounded-lg bg-cu-ink text-white font-medium text-sm hover:opacity-90 transition-all">Toggle Drawer</button>
                    <Menu 
                      isOpen={isOpen}
                      onClose={() => setIsOpen(false)}
                      title="Creative App"
                      menuItems={sampleMenu}
                      onItemClick={(item) => {
                        if (item.href) setActiveMenu(item.href);
                        setIsOpen(false);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import Menu from "@/components/layout/menu";

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Menu</button>
      <Menu 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="App Menu"
        menuItems={[
          { label: "Dashboard", href: "/dashboard", icon: "dashboard" }
        ]}
      />
    </>
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/layout/menu.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import Menu from "@/components/layout/menu";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import Menu from "@/components/layout/menu";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Interface signature and parameters for the Menu drawer.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/layout/menu.tsx</span>
            <button onClick={() => handleCopy(menuSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{menuSourceCode}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Drawer States</h2>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Dismissible Overlay Mask</h3>
              <p>Dark semi-transparent backdrop layer that seals the background and dismisses the drawer when tapped.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Header Title & Items</h3>
              <p>Displays application branding at the top alongside full list nodes with Material icons.</p>
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
                <td><code>isOpen</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>false</code></td>
                <td>Triggers the sliding animation of the drawer.</td>
              </tr>
              <tr>
                <td><code>onClose</code></td>
                <td><code className="type">() =&gt; void</code></td>
                <td><code>undefined</code></td>
                <td>Fired when clicking the dark overlay mask to dismiss the menu.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
