"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import Workspace from "@/components/layout/workspace";

export function LayoutWorkspaceDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "retro">("light");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [viewport, setViewport] = useState<"Desktop" | "Mobile">("Desktop");
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

  const workspaceSourceCode = `"use client";

import { useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import GlobalLayoutNavbar from "./navbar";
import Sidebar, { type SidebarItem } from "./sidebar";
import Content, { type ContentProps } from "./content";
import Menu, { type MenuItem } from "./menu";

export type WorkspaceProps = {
  className?: string;
  viewport?: "Mobile" | "Desktop";
  contentProps?: ContentProps;
  menuTitle?: string;
  menuItems?: MenuItem[];
  activeMenuHref?: string;
  onMenuItemClick?: (item: MenuItem, index: number) => void;
  children?: ReactNode;
  sidebarTheme?: "light" | "dark" | "retro";
  sidebarExpanded?: boolean;
  onToggleSidebarTheme?: () => void;
  onToggleSidebarRetro?: () => void;
  onToggleSidebarExpanded?: () => void;
};

export default function Workspace({
  className,
  viewport = "Mobile",
  contentProps,
  menuTitle,
  menuItems = [],
  activeMenuHref = "",
  onMenuItemClick,
  children,
  sidebarTheme = "light",
  sidebarExpanded = true,
  onToggleSidebarTheme,
  onToggleSidebarRetro,
  onToggleSidebarExpanded,
}: WorkspaceProps) {
  // ... implementation code ...
}`;

  const sampleMenu = [
    { label: "Dashboard", icon: "monitoring", href: "/example/dashboard", group: "Main" },
    { label: "Performance", icon: "group", href: "/example/performance", group: "Main" },
    { label: "Settings", icon: "settings", href: "/example/settings", group: "System" },
  ];

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Layout</div>
        <h1 className="doc-hero-title">Workspace</h1>
        <p className="doc-hero-subtitle">
          The inner flexbox layout shell that glues the Sidebar, Navbar, and Content areas together. It manages responsive routing, sidebar states, and active navigation nodes.
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
          <p className="doc-section-desc">Try out the workspace container in real-time within one single view frame.</p>
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
                  Sidebar Theme:
                  <select value={theme} onChange={(e) => setTheme(e.target.value as any)}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="retro">Retro</option>
                  </select>
                </label>
                <label className="cursor-pointer">
                  <input type="checkbox" checked={sidebarExpanded} onChange={(e) => setSidebarExpanded(e.target.checked)} className="size-4 rounded" />
                  Expanded
                </label>
              </div>

              <div className="doc-playground-content">
                <div className="doc-preview-area !p-3 !bg-white border border-slate-200/80 rounded-2xl shadow-xl">
                  <div className={`transition-all duration-300 border border-cu-line rounded-[16px] overflow-hidden relative ${viewport === "Mobile" ? "w-[390px] h-[520px]" : "w-full max-w-[850px] h-[460px]"}`}>
                    <Workspace 
                      viewport={viewport}
                      sidebarTheme={theme}
                      sidebarExpanded={sidebarExpanded}
                      menuTitle="Creative App"
                      menuItems={sampleMenu}
                      activeMenuHref={activeMenu}
                      onToggleSidebarExpanded={() => setSidebarExpanded(!sidebarExpanded)}
                      onToggleSidebarTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      onToggleSidebarRetro={() => setTheme(theme === 'retro' ? 'light' : 'retro')}
                      onMenuItemClick={(item) => {
                        if (item.href) setActiveMenu(item.href);
                      }}
                      className={`w-full h-full flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-[#111413] text-white' : theme === 'retro' ? 'bg-[#c9ccc0]' : 'bg-[#f3fbff]'}`}
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-bold">Workspace View Canvas</h3>
                        <p className="text-sm opacity-70 mt-2">Active Route: <code className="bg-black/10 px-1.5 py-0.5 rounded">{activeMenu}</code></p>
                      </div>
                    </Workspace>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import Workspace from "@/components/layout/workspace";

const menuItems = [
  { label: "Dashboard", icon: "monitoring", href: "/example/dashboard", group: "Main" },
  { label: "Settings", icon: "settings", href: "/example/settings", group: "System" },
];

export default function AppWorkspace() {
  return (
    <Workspace 
      viewport="${viewport}"
      sidebarTheme="${theme}"
      sidebarExpanded={${sidebarExpanded}}
      menuTitle="Creative App"
      menuItems={menuItems}
      activeMenuHref="${activeMenu}"
    >
      <div className="p-6">
        {/* Page Content */}
      </div>
    </Workspace>
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/layout/workspace.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import Workspace from "@/components/layout/workspace";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import Workspace from "@/components/layout/workspace";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Component interface export and signature structure.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/layout/workspace.tsx</span>
            <button onClick={() => handleCopy(workspaceSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{workspaceSourceCode}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Visual Theme Axis</h2>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Light Theme</h3>
              <p>Clean sky-blue tinted surface (<code>bg-[#f3fbff]</code>) with dark typography for default operational dashboards.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Dark Theme</h3>
              <p>Deep dark surface (<code>bg-[#111413]</code>) with crisp white text for low-light developer workflows.</p>
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
                <td><code>viewport</code></td>
                <td><code className="type">"Desktop" | "Mobile"</code></td>
                <td><code>"Mobile"</code></td>
                <td>Handles layout responsiveness (renders Sidebar or mobile Menu drawer).</td>
              </tr>
              <tr>
                <td><code>sidebarTheme</code></td>
                <td><code className="type">"light" | "dark" | "retro"</code></td>
                <td><code>"light"</code></td>
                <td>Visual aesthetic tone passed to the sidebar navigation rail.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
