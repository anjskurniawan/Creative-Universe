const fs = require('fs');

const components = [
  { file: 'odds-welcome-screen-documentation.tsx', comp: 'WelcomeScreen', path: '@/components/odds/retro/welcome-screen' },
  { file: 'odds-request-type-select-stage-documentation.tsx', comp: 'RequestTypeSelectStage', path: '@/components/odds/retro/request-type-select-stage' },
  { file: 'odds-category-inventory-stage-documentation.tsx', comp: 'CategoryInventoryStage', path: '@/components/odds/retro/category-inventory-stage' },
  { file: 'odds-designer-character-select-stage-documentation.tsx', comp: 'DesignerCharacterSelectStage', path: '@/components/odds/retro/designer-character-select-stage' },
  { file: 'odds-mission-brief-stage-documentation.tsx', comp: 'MissionBriefStage', path: '@/components/odds/retro/mission-brief-stage' },
  { file: 'odds-mission-scroll-review-documentation.tsx', comp: 'MissionScrollReview', path: '@/components/odds/retro/mission-scroll-review' },
  { file: 'odds-retro-hud-route-documentation.tsx', comp: 'RetroHudRoute', path: '@/components/odds/retro/retro-hud-route' },
  { file: 'odds-loadout-row-documentation.tsx', comp: 'LoadoutRow', path: '@/components/odds/retro/loadout-row' },
  { file: 'odds-panel-documentation.tsx', comp: 'Panel', path: '@/components/odds/retro/panel' },
  { file: 'odds-step-actions-documentation.tsx', comp: 'StepActions', path: '@/components/odds/retro/panel' }
];

const dir = 'src/components/docs/templates';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

components.forEach(c => {
    const docName = c.file.replace('.tsx', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    const content = `"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { ${c.comp} } from "${c.path}";

export function ${docName}() {
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

  const sourceCode = \`"use client";

import { ${c.comp} } from "${c.path}";

export default function Page() {
  return (
    // Add props here
    <${c.comp} />
  );
}\`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Retro Edition</div>
        <h1 className="doc-hero-title">${c.comp}</h1>
        <p className="doc-hero-subtitle">
          Interactive documentation for the ODDS ${c.comp} retro component.
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
          <p className="doc-section-desc">Live preview of ${c.comp}.</p>
        </div>
        
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={\`doc-tab \${activeTab === 'preview' ? 'active' : ''}\`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={\`doc-tab \${activeTab === 'code' ? 'active' : ''}\`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          
          {activeTab === 'preview' ? (
            <div className="doc-playground-content">
              <div className="doc-preview-area !p-4 !bg-[#dfe2d3] border-[3px] border-[#24252b] shadow-[inset_0_0_0_3px_#b5b9ad] w-full max-w-[850px] font-mono">
                {/* 
                  Note: Render dummy component here due to complex props.
                  In actual implementation, we would mock the required props.
                */}
                <div className="p-8 text-center border-2 border-[#24252b] bg-[#eceee6] text-[#24252b]">
                  <h3 className="text-xl font-black uppercase">${c.comp}</h3>
                  <p className="text-xs mt-2">Requires complex context/props to render standalone.</p>
                </div>
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
          <div className="doc-install-body text-cu-muted"><code>${c.path.replace('@', 'apps/frontend/src')}.tsx</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
        </div>
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">${c.path.replace('@/', '')}.tsx</span>
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
`;
    fs.writeFileSync(dir + '/' + c.file, content);
});

console.log('Generated 10 documentation templates.');
