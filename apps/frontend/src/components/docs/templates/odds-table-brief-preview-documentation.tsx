"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, FileCode } from "lucide-react";
import { TableBriefPreview } from "@/features/odds/components/brief-details/table-brief-preview";
import { type TableBriefRow } from "@/features/odds/components/brief-details";

function MockTableBriefPreviewWrapper() {
  const [rows] = useState<TableBriefRow[]>([
    { id: "1", image_order: "1", image_description: "Logo placement on center chest", image_illustration: "", image_illustration_id: null, additional_notes: "Vibrant colors" },
    { id: "2", image_order: "2", image_description: "Backside slogan print", image_illustration: "", image_illustration_id: null, additional_notes: "Font Outfit Bold" }
  ]);

  return (
    <div className="w-full max-w-[850px] bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col p-8 min-h-[400px] font-sans">
      <TableBriefPreview 
        packagingImageId={null}
        packagingImageName=""
        rows={rows}
        designerName="John Doe"
        deadline="2026-08-15"
        title="Kaos Kreatif JETE"
      />
    </div>
  );
}

export function OddsTableBriefPreviewDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);

  const handleCopy = (text: string, isSource = false) => {
    navigator.clipboard.writeText(text);
    if (isSource) { setCopiedSource(true); setTimeout(() => setCopiedSource(false), 2000); } 
    else { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const sourceCode = `"use client";
import { TableBriefPreview } from "@/features/odds/components/brief-details/table-brief-preview";
export default function Page() { 
  return (
    <TableBriefPreview 
      packagingImageId={null}
      packagingImageName=""
      rows={rows}
      designerName="John Doe"
      deadline="2026-08-15"
      title="Kaos Kreatif JETE"
    />
  ); 
}`;

  return (
    <div className="doc-example-container font-sans">
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Request Builder</div>
        <h1 className="doc-hero-title">TableBriefPreview</h1>
        <p className="doc-hero-subtitle">Interactive documentation for the structured table brief preview component shown during the final review step.</p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Live preview of TableBriefPreview.</p>
        </div>
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          {activeTab === 'preview' ? (
            <div className="doc-playground-content bg-slate-50/50 p-4 md:p-8 flex justify-center items-center">
              <MockTableBriefPreviewWrapper />
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
          <div className="doc-install-body text-cu-muted"><code>src/features/odds/components/brief-details/table-brief-preview.tsx</code></div>
        </div>
      </section>
    </div>
  );
}
