"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import AppsDropdown, { type ApplicationItem } from "@/components/layout/navbar/apps-dropdown";

export function NavbarAppsDropdownDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  
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

  const appsDropdownSourceCode = `"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";

export type ApplicationItem = {
  key: string;
  display_name: string;
  href: string;
  icon: string;
};

export default function AppsDropdown({
  isOpen,
  onClose,
  applications = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  applications?: ApplicationItem[];
}) {
  // ... component implementation ...
}`;

  const sampleApps: ApplicationItem[] = [
    { key: "kv-retail", display_name: "KV Retail Task", href: "#", icon: "storefront" },
    { key: "odds", display_name: "ODDS Project System", href: "#", icon: "dashboard" },
    { key: "cai", display_name: "Creative AI Assistant", href: "#", icon: "psychology" }
  ];

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Navbar Sub-component</div>
        <h1 className="doc-hero-title">Navbar: Apps Dropdown</h1>
        <p className="doc-hero-subtitle">
          Modular switcher overlay presenting user authorized sub-applications within the workspace header.
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
          <p className="doc-section-desc">Toggle the dropdown state to view the standalone popover overlay.</p>
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
                  Dropdown State:
                  <select value={isOpen ? "Open" : "Closed"} onChange={(e) => setIsOpen(e.target.value === "Open")}>
                    <option value="Open">Open (Visible)</option>
                    <option value="Closed">Closed (Hidden)</option>
                  </select>
                </label>
              </div>

              <div className="doc-playground-content" style={{ minHeight: '280px' }}>
                {isOpen ? (
                  <div className="doc-preview-area !p-6 flex items-center justify-center">
                    <div className="relative min-w-[260px] flex items-center justify-center">
                      <div className="[&>div]:!static [&>div]:!top-0 [&>div]:!right-0 [&>div]:!left-0">
                        <AppsDropdown 
                          isOpen={true}
                          onClose={() => setIsOpen(false)}
                          applications={sampleApps}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="doc-preview-area text-center py-6 px-8">
                    <span className="text-xs text-cu-muted font-medium">Dropdown is currently hidden. Switch <b>Dropdown State</b> to <b>Open</b> above to display.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import AppsDropdown from "@/components/layout/navbar/apps-dropdown";

export default function WorkspaceNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <AppsDropdown 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        applications={[
          { key: "odds", display_name: "ODDS", href: "/odds", icon: "dashboard" }
        ]}
      />
    </div>
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/layout/navbar/apps-dropdown.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import AppsDropdown from "@/components/layout/navbar/apps-dropdown";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import AppsDropdown from "@/components/layout/navbar/apps-dropdown";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Source code structure for AppsDropdown.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/layout/navbar/apps-dropdown.tsx</span>
            <button onClick={() => handleCopy(appsDropdownSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{appsDropdownSourceCode}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Features</h2>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Glassmorphic Overlay</h3>
              <p>Features backdrop blur and subtle border glow for modern design consistency.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Click-Outside Listener</h3>
              <p>Automatically dismisses the overlay when tapping anywhere else on the document window.</p>
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
                <td>Shows or hides the dropdown panel.</td>
              </tr>
              <tr>
                <td><code>onClose</code></td>
                <td><code className="type">() =&gt; void</code></td>
                <td><code>undefined</code></td>
                <td>Triggers when clicking outside the panel area to dismiss it.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
