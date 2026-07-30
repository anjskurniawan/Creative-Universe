"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Palette, Accessibility, BookOpen } from "lucide-react";
import { Navbar, type NavbarSession, type NavbarVariant } from "@/components/navigation/navbar";

export function NavbarDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  // States for Playground
  const [variant, setVariant] = useState<NavbarVariant>("light");
  const [session, setSession] = useState<Exclude<NavbarSession, "connected">>("preview-authenticated");
  const [sticky, setSticky] = useState(false);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

  const handleCopy = () => {
    navigator.clipboard.writeText(`import { Navbar } from "@/components/navigation/navbar";`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Navigation</div>
        <h1 className="doc-hero-title">Navbar</h1>
        <p className="doc-hero-subtitle">
          The main navigation bar for Creative Universe. It provides responsive routing, application switching, and user account management across different module boundaries.
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
                <div style={{ padding: '1rem', background: 'hsl(var(--secondary))', borderBottom: '1px solid hsl(var(--border))', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Control label="Variant" value={variant} options={["light","dark","transparent-dark"]} onChange={(v) => setVariant(v as NavbarVariant)} />
                  <Control label="Session" value={session} options={["preview-authenticated","guest"]} onChange={(v) => setSession(v as typeof session)} />
                  <Control label="Position" value={sticky ? "sticky" : "relative"} options={["relative","sticky"]} onChange={(v) => setSticky(v === "sticky")} />
                  <Control label="Viewport" value={viewport} options={["desktop","mobile"]} onChange={(v) => setViewport(v as typeof viewport)} />
                </div>
                <div style={{ padding: '2rem', flex: 1, background: 'hsl(var(--card))', overflowX: 'auto' }}>
                  <div className={`transition-[width] ${viewport === "mobile" ? "w-[390px] mx-auto border border-cu-line" : "w-full"}`}>
                    <Navbar variant={variant} sticky={sticky} session={session} />
                    <div style={{ height: '200px', background: 'white', padding: '1.5rem', color: '#999' }}>
                      Page content area (Simulating scrolling surface)
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="doc-code-area" style={{ margin: '2rem', width: 'auto' }}>
                <pre>
                  <code>
{`<Navbar 
  variant="${variant}" 
  sticky={${sticky}} 
  session="${session}" 
/>`}
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
            <code>apps/frontend/src/components/navigation/navbar.tsx</code>
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
            <code>import {'{ Navbar }'} from "@/components/navigation/navbar";</code>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Visual Axis</h2>
          <p className="doc-section-desc">The component comes with several visual states depending on layout.</p>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Light</h3>
              <p>Default white surface with dark text. Used for standard application dashboards.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Dark</h3>
              <p>Dark background surface with white text. Suitable for dark mode interfaces.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Transparent Dark</h3>
              <p>Transparent surface with white text. Used over hero images or dark dynamic backgrounds (e.g., Landing Page).</p>
            </div>
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
                <td><code>variant</code></td>
                <td><code className="type">"light" | "dark" | "transparent-dark"</code></td>
                <td><code>"light"</code></td>
                <td>The color scheme of the navigation bar.</td>
              </tr>
              <tr>
                <td><code>session</code></td>
                <td><code className="type">"connected" | "preview-authenticated" | "guest"</code></td>
                <td><code>"connected"</code></td>
                <td>Controls whether user is logged in. <code>connected</code> uses real Auth Context.</td>
              </tr>
              <tr>
                <td><code>sticky</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>true</code></td>
                <td>If true, the navbar remains fixed at the top of the viewport.</td>
              </tr>
              <tr>
                <td><code>hideBrand</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>false</code></td>
                <td>If true, hides the Creative Universe logo on the left side.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}

function Control({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { 
  return (
    <label className="flex flex-col gap-1.5 text-xs font-semibold text-cu-muted">
      {label}
      <select 
        value={value} 
        onChange={(event) => onChange(event.target.value)} 
        className="h-9 rounded-lg border border-cu-line bg-white px-3 text-sm font-medium text-cu-ink outline-none focus:border-cu-focus"
      >
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  ); 
}
