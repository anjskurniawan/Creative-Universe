"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { BriefCompositionStep } from "@/features/odds/components/request-builder/steps/brief-composition-step";
import { createRequestBuilderTheme } from "@/features/odds/components/request-builder/theme";
import type { OddsRequestForm } from "@/features/odds/components/request-builder/types";

function MockBriefCompositionWrapper() {
  const theme = createRequestBuilderTheme("light");
  const [form, setForm] = useState<OddsRequestForm>({
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
  const [uploading, setUploading] = useState(false);

  const update = (field: keyof OddsRequestForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-[1000px] bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col p-8 min-h-[500px]">
      <BriefCompositionStep 
        theme={theme}
        miniStep={1}
        form={form}
        update={update}
        selectedCategory={{ id: 1, name: "UI/UX Design", score_weight: 10, normal_revision_limit: 3, sla_minutes: 120, is_active: true }}
        usesTableBrief={false}
        todayDate="2026-07-30"
        tomorrowDate="2026-07-31"
        threeDaysDate="2026-08-02"
        tableBriefCategory=""
        tableBriefProduct=""
        tableBriefPackagingImageName=""
        tableBriefPackagingImageId={null}
        tableBriefRows={[]}
        productCatalog={[]}
        uploadingAttachments={uploading}
        uploadingIllustrationId={null}
        onTableBriefCategoryChange={() => {}}
        onTableBriefProductChange={() => {}}
        onPackagingImageUpload={() => {}}
        onTableBriefRowChange={() => {}}
        onIllustrationUpload={() => {}}
        onAddTableBriefRow={() => {}}
        onRemoveTableBriefRow={() => {}}
        onReorderTableBriefRows={() => {}}
        addAttachmentFiles={async () => []}
      />
    </div>
  );
}

export function OddsBriefCompositionStepDocumentation() {
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
import { BriefCompositionStep } from "@/features/odds/components/request-builder/steps/brief-composition-step";
import { createRequestBuilderTheme } from "@/features/odds/components/request-builder/theme";

export default function Page() {
  const theme = createRequestBuilderTheme("light");
  return <BriefCompositionStep {...props} theme={theme} />;
}`;

  return (
    <div className="doc-example-container">
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Request Builder</div>
        <h1 className="doc-hero-title">BriefCompositionStep (Composite)</h1>
        <p className="doc-hero-subtitle">
          Interactive documentation for the ODDS BriefCompositionStep composite component.
          See the individual sub-steps (Purpose, Editor, Matrix, Deadline) in the sidebar.
        </p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Live preview of BriefCompositionStep.</p>
        </div>
        
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          
          {activeTab === 'preview' ? (
            <div className="doc-playground-content bg-slate-50/50 p-4 md:p-8 flex justify-center items-center">
              <MockBriefCompositionWrapper />
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

      <section className="doc-section">
        <h2 className="doc-section-title">Installation & Usage</h2>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header"><span className="flex items-center gap-2"><FileCode size={14} /> File Location</span></div>
          <div className="doc-install-body text-cu-muted"><code>src/features/odds/components/request-builder/steps/brief-composition-step.tsx</code></div>
        </div>
      </section>
    </div>
  );
}
