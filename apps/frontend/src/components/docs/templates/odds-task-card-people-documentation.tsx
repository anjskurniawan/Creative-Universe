"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, FileCode } from "lucide-react";
import { TaskCardPerson, TaskCardPeople, TaskCardWidePeople } from "@/components/odds/TaskCard/task-card-people";

function PeoplePreviewAll() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">TaskCardPerson (default)</span>
        <TaskCardPerson name="Budi Santoso" role="Project Manager" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">TaskCardPerson (accent)</span>
        <TaskCardPerson name="Budi Santoso" role="Project Manager" accent />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">TaskCardPeople</span>
        <TaskCardPeople requesterName="Budi Santoso" requesterRole="Marketing" designerName="Rina Dewi" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">TaskCardWidePeople</span>
        <TaskCardWidePeople requesterName="Budi Santoso" requesterRole="Marketing" designerName="Rina Dewi" lineClass="border-slate-200" />
      </div>
    </div>
  );
}

export function OddsTaskCardPeopleDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sourceCode = `import {
  TaskCardPerson,
  TaskCardPeople,
  TaskCardWidePeople,
} from "@/components/odds/TaskCard/task-card-people";

// Satu orang
<TaskCardPerson name="Budi Santoso" role="Project Manager" accent />

// Dua orang (mobile/compact)
<TaskCardPeople
  requesterName="Budi Santoso"
  requesterRole="Marketing"
  designerName="Rina Dewi"
/>

// Dua orang kolom (wide)
<TaskCardWidePeople
  requesterName="Budi Santoso"
  requesterRole="Marketing"
  designerName="Rina Dewi"
  lineClass="border-slate-200"
/>`;

  return (
    <div className="doc-example-container">
      <header className="doc-hero">
        <div className="doc-hero-badge">ODDS / Task Cards</div>
        <h1 className="doc-hero-title">Task Card People</h1>
        <p className="doc-hero-subtitle">Komponen avatar dan identitas orang yang terlibat dalam tugas: TaskCardPerson (unit tunggal), TaskCardPeople (requester + designer), dan TaskCardWidePeople (dua kolom berdampingan untuk Wide layout).</p>
        <div className="doc-hero-links">
          <a href="#" className="doc-link-item"><MonitorPlay size={14} /> Figma Design</a>
          <a href="#" className="doc-link-item"><Code2 size={14} /> Source Code</a>
          <a href="#" className="doc-link-item"><Accessibility size={14} /> WAI-ARIA</a>
        </div>
      </header>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Interactive Playground</h2>
          <p className="doc-section-desc">Live preview dari semua varian TaskCardPeople.</p>
        </div>
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          {activeTab === 'preview' ? (
            <div className="doc-playground-content bg-slate-50/50 p-4 md:p-8 flex justify-center items-center">
              <PeoplePreviewAll />
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
          <div className="doc-install-body text-cu-muted"><code>src/components/odds/TaskCard/task-card-people.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span>Import Statement</span>
            <button onClick={() => handleCopy('import { TaskCardPerson, TaskCardPeople, TaskCardWidePeople } from "@/components/odds/TaskCard/task-card-people";')} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>{"import { TaskCardPerson, TaskCardPeople, TaskCardWidePeople } from \"@/components/odds/TaskCard/task-card-people\";"}</code></div>
        </div>
      </section>

      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title">Detail</h2>
        </div>
        <div className="doc-table-wrapper mt-4">
          <table className="doc-table">
            <tbody>
              <tr><th style={{width: '25%'}}>Exports</th><td><code>TaskCardPerson</code>, <code>TaskCardPeople</code>, <code>TaskCardWidePeople</code></td></tr>
              <tr><th>TaskCardPerson</th><td>Unit tunggal: avatar inisial + nama + role. Props: <code>name</code>, <code>role</code>, <code>accent?</code>, <code>compact?</code></td></tr>
              <tr><th>TaskCardPeople</th><td>Requester + designer berdampingan. Digunakan di Mobile & Compact layout.</td></tr>
              <tr><th>TaskCardWidePeople</th><td>Dua kolom dengan garis pemisah. Khusus Wide layout (≥2xl). Prop <code>lineClass</code> mengontrol warna border.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
