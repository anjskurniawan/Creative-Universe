"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import DetailCard, { type DetailCardRating, type DetailCardMetric } from "@/components/layout/profile/detail-card";

export function CreativeReportDetailCardDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [canEdit, setCanEdit] = useState(true);

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

  const sampleRatings: DetailCardRating[] = [
    { label: "Creativity", value: 9.5, max: 10 },
    { label: "Speed", value: 8.0, max: 10 },
    { label: "Communication", value: 9.0, max: 10 },
    { label: "Quality", value: 9.2, max: 10 },
    { label: "Teamwork", value: 10.0, max: 10 },
  ];

  const sampleMetrics: DetailCardMetric[] = [
    { label: "Avg. Respond Time", value: "15 Min", icon: "schedule" },
    { label: "On Time Rate", value: "98%", icon: "event_available" },
    { label: "User Rating", value: "4.9 (120)", icon: "star" },
    { label: "Capacity", value: "75%", icon: "speed" },
  ];

  const cardSourceCode = `"use client";

import DetailCard, { DetailCardRating, DetailCardMetric } from "@/components/layout/profile/detail-card";

export default function Page() {
  return (
    <DetailCard
      name="Anjas Kurniawan"
      role="SPV Creative"
      specialties={["Branding", "UI/UX", "3D Design"]}
      ratings={ratings}
      metrics={metrics}
      onEdit={() => router.push("/edit")}
    />
  );
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Creative Report / Creative Agent</div>
        <h1 className="doc-hero-title">Creative Agent Detail Card</h1>
        <p className="doc-hero-subtitle">
          Hero profile showcase card used in Creative Agent displaying staff ratings, capacity metrics, and media preview.
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
          <p className="doc-section-desc">Toggle edit action triggers to test button rendering.</p>
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
                  <input type="checkbox" checked={canEdit} onChange={(e) => setCanEdit(e.target.checked)} className="size-4 rounded" />
                  Enable Edit Button (`onEdit`)
                </label>
              </div>

              <div className="doc-playground-content">
                <div className="doc-preview-area !p-4 !bg-white border border-slate-200/80 rounded-2xl shadow-xl w-full max-w-[850px]">
                  <DetailCard
                    name="Anjas Kurniawan"
                    role="SPV Creative"
                    specialties={["Branding & Identity", "UI/UX Design", "3D Visualization"]}
                    ratings={sampleRatings}
                    metrics={sampleMetrics}
                    onEdit={canEdit ? () => alert("Edit Member Clicked!") : undefined}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{cardSourceCode}</code></pre>
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/layout/profile/detail-card.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import DetailCard from "@/components/layout/profile/detail-card";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import DetailCard from "@/components/layout/profile/detail-card";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Source code implementation of DetailCard.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/layout/profile/detail-card.tsx</span>
            <button onClick={() => handleCopy(cardSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{cardSourceCode}</code></pre>
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
              <h3>Animated Rating Progress Bars</h3>
              <p>GSAP staggered width animation for 5 key performance rating bars.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>ODDS Metrics Showcase</h3>
              <p>Displays response time, on-time rate, user rating, and capacity utilization badges.</p>
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
                <td><code>name</code></td>
                <td><code className="type">string</code></td>
                <td><code>required</code></td>
                <td>Staff member full name.</td>
              </tr>
              <tr>
                <td><code>role</code></td>
                <td><code className="type">string</code></td>
                <td><code>required</code></td>
                <td>Staff position title.</td>
              </tr>
              <tr>
                <td><code>ratings</code></td>
                <td><code className="type">DetailCardRating[]</code></td>
                <td><code>required</code></td>
                <td>Array of aspect rating values.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
