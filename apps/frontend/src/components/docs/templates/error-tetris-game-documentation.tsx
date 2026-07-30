"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, Gamepad2 } from "lucide-react";
import { ErrorTetrisGame } from "@/components/feedback/error-tetris-game";

export function ErrorTetrisGameDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`import { ErrorTetrisGame } from "@/components/feedback/error-tetris-game";`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Feedback</div>
        <h1 className="doc-hero-title">Error Tetris Game</h1>
        <p className="doc-hero-subtitle">
          Retro-styled Tetris game to keep error pages useful and engaging. 
        </p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
        </div>
      </header>

      {/* ── Quick Playground ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Play the game directly.</p>
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
              <div style={{ width: '100%', padding: '2rem', background: '#ffffff', display: 'flex', justifyContent: 'center' }}>
                <ErrorTetrisGame />
              </div>
            ) : (
              <div className="doc-code-area" style={{ margin: '2rem', width: 'auto' }}>
                <pre>
                  <code>
{`<ErrorTetrisGame />`}
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
            <code>apps/frontend/src/components/feedback/error-tetris-game.tsx</code>
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
            <code>import {'{ ErrorTetrisGame }'} from "@/components/feedback/error-tetris-game";</code>
          </div>
        </div>
      </section>

      {/* ── Interaction Contract ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Gamepad2 size={18} className="inline-icon" /> Interaction Contract</h2>
        </div>
        <p className="doc-section-desc mt-4">
          Use the <code>Arrow</code> keys to move, <code>Arrow Up</code> to rotate, and <code>Space</code> to hard drop. Touch controls are automatically enabled for small screens.
        </p>
      </section>

    </div>
  );
}
