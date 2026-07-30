"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { MissionScrollReview } from "@/components/odds/retro/mission-scroll-review";
import { OddsGameboyFrame } from "@/components/odds/odds-gameboy-frame";

function MockMissionScrollReviewWrapper() {
  return (
    <div className="w-full max-w-[850px] font-mono flex flex-col h-[600px]">
      <OddsGameboyFrame label="Mock Mission Review" className="h-full flex flex-col">
        <div className="game-stage-panel retro-scrollbar flex h-full min-w-0 flex-col overflow-y-auto rounded-xl border-[3px] border-[#24252b] bg-[#dfe2d3] p-3 shadow-[inset_0_0_0_3px_#b5b9ad] sm:p-4">
          <MissionScrollReview 
            title="Promo Campaign"
            requestType="Design"
            category="UI/UX Design"
            designer="John Doe"
            priority="Q2"
            deadline="2026-08-15"
            brief="Need a banner design"
            references={[{ type: "link", url: "http://example.com/ref", label: "Example Reference" }]}
            onEditType={() => alert("Edit Type")}
            onEditCategory={() => alert("Edit Category")}
            onEditDesigner={() => alert("Edit Designer")}
            onEditMission={() => alert("Edit Mission")}
                      />
        </div>
      </OddsGameboyFrame>
    </div>
  );
}

export function OddsMissionScrollReviewDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);

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

  const sourceCode = `"use client";

import { MissionScrollReview } from "@/components/odds/retro/mission-scroll-review";

export default function Page() {
  return (
    <MissionScrollReview {...props} />
  );
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Retro Edition</div>
        <h1 className="doc-hero-title">MissionScrollReview</h1>
        <p className="doc-hero-subtitle">
          Interactive documentation for the ODDS MissionScrollReview retro component.
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
          <p className="doc-section-desc">Live preview of MissionScrollReview.</p>
        </div>
        
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          
          {activeTab === 'preview' ? (
            <div className="doc-playground-content">
              <div className="doc-preview-area !p-4 !bg-[#f1f3ee] w-full flex justify-center">
                <MockMissionScrollReviewWrapper />
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{sourceCode}</code></pre>
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/odds/retro/mission-scroll-review.tsx</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
        </div>
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/odds/retro/mission-scroll-review.tsx</span>
            <button onClick={() => handleCopy(sourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{sourceCode}</code></pre>
          </div>
        </div>
      </section>
    </div>
  );
}

