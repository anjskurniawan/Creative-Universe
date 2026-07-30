"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, BookOpen, Link as LinkIcon } from "lucide-react";
import { PrimaryActionLink } from "@/components/ui/primary-action-link";

export function PrimaryActionLinkDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`import { PrimaryActionLink } from "@/components/ui/primary-action-link";`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">UI Component</div>
        <h1 className="doc-hero-title">Primary Action Link</h1>
        <p className="doc-hero-subtitle">
          Primary visual action for navigation. Mobile follows Figma node 26:238; desktop scales the same anatomy proportionally.
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
                <div style={{ padding: '3rem', flex: 1, background: '#191919', minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PrimaryActionLink href="#primary-action-preview">Continue to Universe</PrimaryActionLink>
                </div>
              </div>
            ) : (
              <div className="doc-code-area" style={{ margin: '2rem', width: 'auto' }}>
                <pre>
                  <code>
{`<PrimaryActionLink href="/next-page">
  Continue to Universe
</PrimaryActionLink>`}
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
            <code>apps/frontend/src/components/ui/primary-action-link.tsx</code>
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
            <code>import {'{ PrimaryActionLink }'} from "@/components/ui/primary-action-link";</code>
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
                <td><code>href</code></td>
                <td><code className="type">string | UrlObject</code></td>
                <td>-</td>
                <td>The destination URL for the link. Required.</td>
              </tr>
              <tr>
                <td><code>children</code></td>
                <td><code className="type">ReactNode</code></td>
                <td>-</td>
                <td>The text label of the action.</td>
              </tr>
              <tr>
                <td><code>className</code></td>
                <td><code className="type">string</code></td>
                <td>-</td>
                <td>Optional custom CSS classes.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-cu-muted">
          Mobile: 48px height, 4px outer padding, 36px radius, 16/20 label, 40px arrow.<br />
          Desktop: 56px height, 18/24 label, 48px arrow.
        </p>
      </section>

    </div>
  );
}
