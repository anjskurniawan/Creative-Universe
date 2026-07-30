"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, FileCode } from "lucide-react";
import { RecommendationButton } from "@/components/odds/TaskCard/recommendation-button";

function RecommendationPreview() {
  return (
    <div className="flex flex-wrap items-end gap-6 p-6">
      <div className="flex flex-col gap-2" style={{width: 180}}>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Default</span>
        <div className="rounded-lg bg-[#0077bf] p-3">
          <RecommendationButton label="Rekomendasikan" onClick={() => {}} />
        </div>
      </div>
      <div className="flex flex-col gap-2" style={{width: 180}}>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Disabled</span>
        <div className="rounded-lg bg-[#0077bf] p-3">
          <RecommendationButton label="Rekomendasikan" onClick={() => {}} disabled />
        </div>
      </div>
      <div className="flex flex-col gap-2" style={{width: 180}}>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Done bg</span>
        <div className="rounded-lg bg-[#17633d] p-3">
          <RecommendationButton label="Lihat Detail" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
}

export function OddsTaskCardRecommendationButtonDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sourceCode = `import { RecommendationButton } from "@/components/odds/TaskCard/recommendation-button";

<RecommendationButton
  label="Rekomendasikan"
  onClick={() => handleRecommendation()}
  disabled={false}
/>`;

  return (
    <div className="doc-example-container">
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Task Cards</div>
        <h1 className="doc-hero-title">Recommendation Button</h1>
        <p className="doc-hero-subtitle">Tombol CTA yang digunakan di dalam TaskCardWideStatusPanel sebagai aksi rekomendasi. Dirancang untuk latar gelap (biru/hijau) dengan kontras tinggi dan animasi ikon panah.</p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Live preview di atas latar status panel (biru/hijau).</p>
        </div>
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          {activeTab === 'preview' ? (
            <div className="doc-playground-content bg-slate-50/50 p-4 md:p-8 flex justify-center items-center">
              <RecommendationPreview />
            </div>
          ) : (
            <div className="p-6 bg-[#111]"><div className="doc-code-area"><pre><code>{sourceCode}</code></pre></div></div>
          )}
        </div>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Installation & Usage</h2>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header"><span className="flex items-center gap-2"><FileCode size={14} /> File Location</span></div>
          <div className="doc-install-body text-cu-muted"><code>src/components/odds/TaskCard/recommendation-button.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span>Import Statement</span>
            <button onClick={() => handleCopy('import { RecommendationButton } from "@/components/odds/TaskCard/recommendation-button";')} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>{"import { RecommendationButton } from \"@/components/odds/TaskCard/recommendation-button\";"}</code></div>
        </div>
      </section>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Detail</h2>
        </div>
        <div className="doc-table-wrapper mt-4">
          <table className="doc-table">
            <tbody>
              <tr><th style={{width: '25%'}}>Props</th><td><code>label</code> (string), <code>onClick?</code> (() =&gt; void), <code>disabled?</code> (boolean)</td></tr>
              <tr><th>Context</th><td>Hanya digunakan di dalam <code>TaskCardWideStatusPanel</code> saat prop <code>highlightLabel</code> diisi.</td></tr>
              <tr><th>Design</th><td>Latar putih, teks biru gelap, border putih/70. Hover: transparan dengan teks putih. Ikon panah animate-pulse.</td></tr>
              <tr><th>Disabled</th><td>Opacity 50%, cursor not-allowed, hover effects dinonaktifkan.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
