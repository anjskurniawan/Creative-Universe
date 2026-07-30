"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { OddsRequestBuilder } from "@/features/odds/components/request-builder";
import type { OddsRequestForm } from "@/features/odds/components/request-builder/types";
import type { OddsCategory, OddsDesignerProfile, OddsTaskAttachment } from "@/features/odds/api";

const mockCategories: OddsCategory[] = [
  { id: 1, name: "UI/UX Design", score_weight: 10, normal_revision_limit: 3, sla_minutes: 120, is_active: true },
  { id: 2, name: "Social Media", score_weight: 5, normal_revision_limit: 2, sla_minutes: 60, is_active: true },
  { id: 3, name: "Illustration", score_weight: 15, normal_revision_limit: 5, sla_minutes: 180, is_active: true },
];

const mockDesigners: OddsDesignerProfile[] = [
  {
    id: 1,
    user_id: 1,
    status: "available",
    specializations: null,
    leave_dates: null,
    is_active: true,
    current_load_minutes: 45,
    user: { id: 1, name: "John Doe", avatar: "https://i.pravatar.cc/150?u=1" }
  },
  {
    id: 2,
    user_id: 2,
    status: "off",
    specializations: null,
    leave_dates: null,
    is_active: true,
    current_load_minutes: 120,
    user: { id: 2, name: "Jane Smith", avatar: "https://i.pravatar.cc/150?u=2" }
  }
];

const mockProductCatalog = [
  { id: 1, name: "Apparel", products: [{ id: 101, name: "T-Shirt" }, { id: 102, name: "Jacket" }] },
  { id: 2, name: "Digital", products: [{ id: 201, name: "Banner" }, { id: 202, name: "Feed Post" }] }
];

function MockOddsRequestBuilderWrapper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<OddsRequestForm>({
    request_type: "design",
    category_id: "",
    preferred_designer_id: "",
    design_purpose: "",
    brief_text: "",
    reference_visual: "",
    deadline: "",
    important_matrix: "",
    attachment_notes: "",
  });

  const [uploadedAttachments, setUploadedAttachments] = useState<OddsTaskAttachment[]>([]);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = (field: keyof OddsRequestForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAttachmentFiles = async (files: FileList | File[] | null) => {
    if (!files) return [];
    setUploadingAttachments(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUploadingAttachments(false);
    
    const newAttachments: OddsTaskAttachment[] = Array.from(files).map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      path: URL.createObjectURL(f),
      mime_type: f.type,
      size: f.size
    }));
    
    setUploadedAttachments((prev) => [...prev, ...newAttachments]);
    return newAttachments;
  };

  const handleRemoveAttachment = (id: number) => {
    setUploadedAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    alert("Form submitted successfully in playground!");
    setCurrentStep(1); // Reset
  };

  return (
    <div className="w-full max-w-[1000px] bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[600px] h-[75vh]">
      <OddsRequestBuilder
        theme="light"
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        form={form}
        update={handleUpdate}
        categories={mockCategories}
        selectedCategory={mockCategories.find(c => c.id.toString() === form.category_id)}
        selectableDesigners={mockDesigners}
        todayCapacity={5}
        selectedDesigner={mockDesigners.find(d => d.id.toString() === form.preferred_designer_id)}
        productCatalog={mockProductCatalog}
        uploadedAttachments={uploadedAttachments}
        uploadingAttachments={uploadingAttachments}
        addAttachmentFiles={handleAddAttachmentFiles}
        onRemoveAttachment={handleRemoveAttachment}
        loading={loading}
        initializing={false}
        submit={handleSubmit}
      />
    </div>
  );
}

export function OddsRequestBuilderDocumentation() {
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

import { OddsRequestBuilder } from "@/features/odds/components/request-builder";

export default function Page() {
  return (
    // Check documentation source for full wrapper implementation
    <OddsRequestBuilder />
  );
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Features</div>
        <h1 className="doc-hero-title">OddsRequestBuilder</h1>
        <p className="doc-hero-subtitle">
          Interactive documentation for the ODDS OddsRequestBuilder component.
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
          <p className="doc-section-desc">Live preview of OddsRequestBuilder.</p>
        </div>
        
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          
          {activeTab === 'preview' ? (
            <div className="doc-playground-content bg-slate-50/50 p-4 md:p-8 flex justify-center items-center">
              <MockOddsRequestBuilderWrapper />
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
          <div className="doc-install-body text-cu-muted"><code>src/features/odds/components/request-builder/odds-request-builder.tsx</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
        </div>
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">features/odds/components/request-builder/odds-request-builder.tsx</span>
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
