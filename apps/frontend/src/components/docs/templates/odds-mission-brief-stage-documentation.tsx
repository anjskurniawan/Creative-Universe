"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { MissionBriefStage } from "@/components/odds/retro/mission-brief-stage";
import type { TaskForm } from "@/app/odds/new/types";
import { OddsGameboyFrame } from "@/components/odds/odds-gameboy-frame";

function MockMissionBriefWrapper() {
  const [form, setForm] = useState<TaskForm>({
    request_type: "design",
    category_id: "1",
    preferred_designer_id: "1",
    design_purpose: "Promo Campaign",
    brief_text: "Need a banner design",
    reference_visual: "Use bright colors",
    deadline: "",
    important_matrix: "Q2",
    attachment_notes: "",
  });
  const [missionStep, setMissionStep] = useState(1);

  const update = (field: keyof TaskForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 h-[600px] font-mono">
      <div className="flex gap-2">
        <button onClick={() => setMissionStep(1)} className={`px-4 py-2 text-xs font-bold rounded-lg border-2 border-[#24252b] ${missionStep === 1 ? 'bg-[#ba0dcb] text-white' : 'bg-[#eceee6] text-[#24252b]'}`}>Mission Name</button>
        <button onClick={() => setMissionStep(2)} className={`px-4 py-2 text-xs font-bold rounded-lg border-2 border-[#24252b] ${missionStep === 2 ? 'bg-[#ba0dcb] text-white' : 'bg-[#eceee6] text-[#24252b]'}`}>Important Matrix</button>
        <button onClick={() => setMissionStep(3)} className={`px-4 py-2 text-xs font-bold rounded-lg border-2 border-[#24252b] ${missionStep === 3 ? 'bg-[#ba0dcb] text-white' : 'bg-[#eceee6] text-[#24252b]'}`}>Timer</button>
        <button onClick={() => setMissionStep(4)} className={`px-4 py-2 text-xs font-bold rounded-lg border-2 border-[#24252b] ${missionStep === 4 ? 'bg-[#ba0dcb] text-white' : 'bg-[#eceee6] text-[#24252b]'}`}>Transmit Brief</button>
      </div>
      <div className="w-full max-w-[850px] h-full flex flex-col">
        <OddsGameboyFrame label="Mock Mission Brief" className="h-full flex flex-col">
          <div className="game-stage-panel retro-scrollbar flex h-full min-w-0 flex-col overflow-y-auto rounded-xl border-[3px] border-[#24252b] bg-[#dfe2d3] p-3 shadow-[inset_0_0_0_3px_#b5b9ad] sm:p-4">
            <MissionBriefStage 
              initialStep={missionStep}
              form={form}
              briefPlainText={form.brief_text}
              attachments={[]}
              uploading={false}
              onUpdate={update}
              onUpload={async () => []}
              onRemoveAttachment={() => {}}
              onBack={() => {}}
              onContinue={() => {}}
            />
          </div>
        </OddsGameboyFrame>
      </div>
    </div>
  );
}

export function OddsMissionBriefStageDocumentation() {
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

import { MissionBriefStage } from "@/components/odds/retro/mission-brief-stage";

export default function Page() {
  return (
    <MissionBriefStage {...props} />
  );
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Retro Edition</div>
        <h1 className="doc-hero-title">MissionBriefStage</h1>
        <p className="doc-hero-subtitle">
          Interactive documentation for the ODDS MissionBriefStage retro component.
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
          <p className="doc-section-desc">Live preview of MissionBriefStage.</p>
        </div>
        
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          
          {activeTab === 'preview' ? (
            <div className="doc-playground-content">
              <div className="doc-preview-area !p-4 !bg-[#f1f3ee] w-full flex justify-center">
                <MockMissionBriefWrapper />
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/odds/retro/mission-brief-stage.tsx</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
        </div>
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/odds/retro/mission-brief-stage.tsx</span>
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
