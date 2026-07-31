"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, FileCode } from "lucide-react";
import { TableBriefDetails, type TableBriefRow } from "@/features/odds/components/brief-details";

function MockTableBriefDetailsWrapper() {
  const [category, setCategory] = useState("Apparel");
  const [product, setProduct] = useState("T-Shirt");
  const [deadline, setDeadline] = useState("");
  const [rows, setRows] = useState<TableBriefRow[]>([
    { id: "1", image_order: "1", image_description: "Front print illustration", image_illustration: "", image_illustration_id: null, additional_notes: "Keep colors vivid" }
  ]);

  const productCatalog = [
    { id: 1, name: "Apparel", products: [{ id: 101, name: "T-Shirt" }, { id: 102, name: "Jacket" }] },
    { id: 2, name: "Digital", products: [{ id: 201, name: "Banner" }, { id: 202, name: "Feed Post" }] }
  ];

  const handleRowChange = (id: string, field: keyof Omit<TableBriefRow, "id">, value: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const today = new Date().toLocaleDateString("en-CA");
  const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString("en-CA");
  const threeDays = new Date(Date.now() + 3 * 86400000).toLocaleDateString("en-CA");

  // Minimal mock for form and update
  const mockForm = {
    request_type: "design",
    category_id: "",
    preferred_designer_id: "",
    design_purpose: "",
    brief_text: "",
    reference_visual: "",
    deadline,
    important_matrix: "Q4",
    attachment_notes: "",
  } as unknown as Parameters<typeof import("@/features/odds/components/brief-details")["TableBriefDetails"]>[0]["form"];
  const mockUpdate = (field: string, value: string) => { if (field === "deadline") setDeadline(value); };

  return (
    <div className="w-full max-w-[950px] bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col p-6 min-h-[400px]">
      <TableBriefDetails 
        category={category}
        product={product}
        packagingImageName="mock-packaging.jpg"
        packagingImageId={1}
        rows={rows}
        uploadingPackagingImage={false}
        onCategoryChange={setCategory}
        onProductChange={setProduct}
        onPackagingImageUpload={() => {}}
        onRowChange={handleRowChange}
        onIllustrationUpload={() => {}}
        uploadingIllustrationId={null}
        onAddRow={() => setRows(prev => [...prev, { id: String(Date.now()), image_order: String(prev.length + 1), image_description: "", image_illustration: "", image_illustration_id: null, additional_notes: "" }])}
        onRemoveRow={(id) => setRows(prev => prev.filter(r => r.id !== id))}
        onReorderRows={() => {}}
        productCatalog={productCatalog}
        form={mockForm}
        update={mockUpdate as Parameters<typeof import("@/features/odds/components/brief-details")["TableBriefDetails"]>[0]["update"]}
        selectedCategory={undefined}
        todayDate={today}
        tomorrowDate={tomorrow}
        threeDaysDate={threeDays}
      />
    </div>
  );
}

export function OddsTableBriefDetailsDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);

  const handleCopy = (text: string, isSource = false) => {
    navigator.clipboard.writeText(text);
    if (isSource) { setCopiedSource(true); setTimeout(() => setCopiedSource(false), 2000); } 
    else { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const sourceCode = `"use client";
import { TableBriefDetails } from "@/features/odds/components/brief-details";
export default function Page() { 
  return (
    <TableBriefDetails 
      category={category} 
      product={product} 
      rows={rows} 
      onRowChange={handleRowChange} 
      {...props} 
    />
  ); 
}`;

  return (
    <div className="doc-example-container">
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Request Builder</div>
        <h1 className="doc-hero-title">TableBriefDetails</h1>
        <p className="doc-hero-subtitle">Interactive documentation for the structured table-based brief description format used for specific categories (Deskripsi Produk).</p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Live preview of TableBriefDetails.</p>
        </div>
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          {activeTab === 'preview' ? (
            <div className="doc-playground-content bg-slate-50/50 p-4 md:p-8 flex justify-center items-center">
              <MockTableBriefDetailsWrapper />
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
          <div className="doc-install-body text-cu-muted"><code>src/features/odds/components/brief-details/table-brief-details.tsx</code></div>
        </div>
      </section>
    </div>
  );
}
