"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import Container from "@/components/layout/container";

export function LayoutContainerDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [viewport, setViewport] = useState<"Desktop" | "Mobile">("Desktop");
  
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

  const containerSourceCode = `"use client";

import type { ReactNode } from "react";
import Workspace, { type WorkspaceProps } from "./workspace";
import type { MenuItem } from "./menu";

export type ContainerProps = {
  className?: string;
  viewport?: "Mobile" | "Desktop";
  contentProps?: WorkspaceProps;
  menuItems?: MenuItem[];
  activeMenuHref?: string;
  menuTitle?: string;
  children?: ReactNode;
};

export default function Container({
  className,
  viewport,
  contentProps,
  menuItems,
  activeMenuHref,
  menuTitle,
  children,
}: ContainerProps) {
  const resolvedViewport = viewport ?? contentProps?.viewport ?? "Mobile";
  const desktop = resolvedViewport === "Desktop";
  return (
    <div
      className={
        className ??
        \`relative flex h-dvh w-dvw flex-col items-stretch overflow-hidden \${
          desktop ? "p-6" : "p-2"
        }\`
      }
    >
      <Workspace
        {...contentProps}
        viewport={resolvedViewport}
        menuItems={menuItems}
        activeMenuHref={activeMenuHref}
        menuTitle={menuTitle}
        className={
          contentProps?.className ??
          "flex h-full w-full flex-col overflow-hidden rounded-[16px] bg-[#f3fbff] shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)]"
        }
      >
        {children}
      </Workspace>
    </div>
  );
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Layout</div>
        <h1 className="doc-hero-title">Container</h1>
        <p className="doc-hero-subtitle">
          The outermost responsive wrapper designed to hold the entire application layout shell. It manages padding, aspect boundaries, and responsive viewport adaptations.
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
          <p className="doc-section-desc">Test and simulate the Container's padding responsiveness across different viewports in one view.</p>
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
                  Viewport Mode:
                  <select value={viewport} onChange={(e) => setViewport(e.target.value as any)}>
                    <option value="Desktop">Desktop (24px padding)</option>
                    <option value="Mobile">Mobile (8px padding)</option>
                  </select>
                </label>
              </div>

              <div className="doc-playground-content">
                <div className="doc-preview-area !p-3 !bg-white border border-slate-200/80 rounded-2xl shadow-xl">
                  <div className={`transition-all duration-300 rounded-[20px] overflow-hidden relative bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)] flex ${viewport === "Mobile" ? "w-[390px] h-[520px]" : "w-full max-w-[850px] h-[460px]"}`}>
                    <Container viewport={viewport} className="w-full h-full flex flex-col relative transition-all duration-300">
                      <div className="flex-1 bg-white/95 backdrop-blur rounded-xl border border-dashed border-cu-line flex flex-col items-center justify-center p-6 text-center">
                        <span className="text-sm font-semibold text-cu-ink">Workspace Bounded Surface</span>
                        <span className="text-xs text-cu-muted mt-1 max-w-[280px]">
                          {viewport === "Desktop" ? "Desktop view applied: p-6 (24px padding) around workspace" : "Mobile view applied: p-2 (8px padding) around workspace"}
                        </span>
                      </div>
                    </Container>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import Container from "@/components/layout/container";

export default function AppLayout() {
  return (
    <Container viewport="${viewport}">
      {/* Workspace & Children */}
    </Container>
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/layout/container.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import Container from "@/components/layout/container";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import Container from "@/components/layout/container";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Complete full source code of the Container component.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/layout/container.tsx</span>
            <button onClick={() => handleCopy(containerSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{containerSourceCode}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Responsive Variants</h2>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Desktop Mode (p-6)</h3>
              <p>Provides 24px of external margins to let the application canvas breathe gracefully over rich background gradients.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Mobile Mode (p-2)</h3>
              <p>Tightens outer margin to 8px, giving 98% of horizontal screen space to actual application content on mobile viewports.</p>
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
                <td>Determines outer padding. Controls layout alignment.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
