"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, BookOpen } from "lucide-react";
import { UniversalErrorView } from "@/components/feedback/universal-error-view";

export function UniversalErrorViewDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`import { UniversalErrorView } from "@/components/feedback/universal-error-view";`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Feedback</div>
        <h1 className="doc-hero-title">Universal Error View</h1>
        <p className="doc-hero-subtitle">
          Core's universal error template, shared by runtime errors, root errors, and 404 pages.
        </p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
        </div>
      </header>

      {/* ── Quick Playground ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
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
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <UniversalErrorView embedded onRetry={() => alert("Retry action triggered")} />
              </div>
            ) : (
              <div className="doc-code-area" style={{ margin: '2rem', width: 'auto' }}>
                <pre>
                  <code>
{`<UniversalErrorView 
  onRetry={() => window.location.reload()} 
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
            <code>apps/frontend/src/components/feedback/universal-error-view.tsx</code>
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
            <code>import {'{ UniversalErrorView }'} from "@/components/feedback/universal-error-view";</code>
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
                <td><code>onRetry</code></td>
                <td><code className="type">() {`=>`} void</code></td>
                <td>-</td>
                <td>Optional. Callback function triggered when the user clicks the retry button.</td>
              </tr>
              <tr>
                <td><code>embedded</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>false</code></td>
                <td>Optional. Use true to embed within a container instead of filling the whole screen (useful for documentation).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
