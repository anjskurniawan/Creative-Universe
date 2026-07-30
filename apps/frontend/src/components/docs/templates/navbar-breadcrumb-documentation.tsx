"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import Breadcrumb from "@/components/layout/navbar/breadcrumb";

export function NavbarBreadcrumbDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [dark, setDark] = useState(false);
  const [itemsText, setItemsText] = useState("Creative Report, Dashboard, Performa");
  
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

  const breadcrumbSourceCode = `import { MaterialIcon } from "@/components/ui/material-icon";

export default function Breadcrumb({
  items = ["Creative Universe", "Global Layout"],
  dark = false,
}: {
  items?: string[];
  dark?: boolean;
}) {
  return (
    <div className="relative flex items-center gap-1">
      {items.map((item, index) => (
        <span key={\`\${item}-\${index}\`} className="flex items-center gap-1">
          <span
            className={\`whitespace-nowrap font-sans text-sm leading-none \${
              index === items.length - 1
                ? \`font-medium \${dark ? "text-white" : "text-[#3b4446]"}\`
                : dark
                ? "font-normal text-[#7b7b7b]"
                : "font-normal text-[#aeb6b8]"
            }\`}
          >
            {item}
          </span>
          {index < items.length - 1 && (
            <span className="flex size-6 items-center justify-center">
              <MaterialIcon
                name="chevron_right"
                size="sm"
                className={dark ? "text-[#7b7b7b]" : "text-[#aeb6b8]"}
              />
            </span>
          )}
        </span>
      ))}
    </div>
  );
}`;

  const items = itemsText.split(",").map(i => i.trim()).filter(Boolean);

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Navbar Sub-component</div>
        <h1 className="doc-hero-title">Navbar: Breadcrumb</h1>
        <p className="doc-hero-subtitle">
          Renders hierarchical navigation steps, commonly mapping module context (e.g. Sub-App / Current Page).
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
          <p className="doc-section-desc">Type custom items or toggle dark mode styling to see real-time updates.</p>
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
                  <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} className="size-4 rounded" />
                  Dark Mode
                </label>
                <label>
                  Items:
                  <input 
                    type="text" 
                    value={itemsText} 
                    onChange={(e) => setItemsText(e.target.value)}
                    className="w-64"
                  />
                </label>
              </div>

              <div className="doc-playground-content">
                <div className={`doc-preview-area transition-colors duration-200 ${dark ? 'bg-[#111413] border-[#222]' : 'bg-white'}`}>
                  <Breadcrumb items={items} dark={dark} />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import Breadcrumb from "@/components/layout/navbar/breadcrumb";

export default function PageHeader() {
  return (
    <Breadcrumb 
      items={${JSON.stringify(items)}} 
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/layout/navbar/breadcrumb.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import Breadcrumb from "@/components/layout/navbar/breadcrumb";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import Breadcrumb from "@/components/layout/navbar/breadcrumb";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Full implementation code for Breadcrumb.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/layout/navbar/breadcrumb.tsx</span>
            <button onClick={() => handleCopy(breadcrumbSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{breadcrumbSourceCode}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Aesthetic Variants</h2>
          <p className="doc-section-desc">Breadcrumb theme adaptations.</p>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Light Background (Default)</h3>
              <p>Muted gray text (#aeb6b8) for root nodes and dark charcoal text (#3b4446) for current active leaf step.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Dark Background (dark=true)</h3>
              <p>Subtle gray text (#7b7b7b) for parent nodes and pure white text for active step on dark panels.</p>
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
                <td><code>items</code></td>
                <td><code className="type">string[]</code></td>
                <td><code>["Creative Universe", "Global Layout"]</code></td>
                <td>Array of navigation steps/titles to display.</td>
              </tr>
              <tr>
                <td><code>dark</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>false</code></td>
                <td>Adapts breadcrumb typography colors to fit over dark backdrop backgrounds.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
