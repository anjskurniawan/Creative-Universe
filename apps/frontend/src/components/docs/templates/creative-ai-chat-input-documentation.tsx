"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { CreativeAiChatInput } from "@/components/creative-ai/chat-input";

export function CreativeAiChatInputDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

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

  const inputSourceCode = `"use client";

import { MaterialIcon } from "@/components/ui/material-icon";

export type CreativeAiChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: (text?: string) => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  isTyping?: boolean;
  className?: string;
};

export function CreativeAiChatInput({
  value,
  onChange,
  onSend,
  isFocused,
  onFocus,
  onBlur,
  isTyping = false,
  className = "",
}: CreativeAiChatInputProps) {
  // ... implementation ...
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Creative AI</div>
        <h1 className="doc-hero-title">Chat Input & Suggestions</h1>
        <p className="doc-hero-subtitle">
          Pill prompt input bar component featuring focus glow, submit button, and quick suggestion chips.
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
          <p className="doc-section-desc">Type in the prompt input or click suggestion chips to send messages.</p>
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
                  <input type="checkbox" checked={isFocused} onChange={(e) => setIsFocused(e.target.checked)} className="size-4 rounded" />
                  Force Dark Focus Glow (`isFocused`)
                </label>
              </div>

              <div className="doc-playground-content">
                <div className={`doc-preview-area !p-6 rounded-xl border w-full max-w-[650px] ${isFocused ? 'bg-[#09090b]' : 'bg-slate-50'}`}>
                  <CreativeAiChatInput
                    value={value}
                    onChange={setValue}
                    onSend={(text) => {
                      alert(`Prompt Sent: "${text || value}"`);
                      setValue("");
                    }}
                    isFocused={isFocused}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import { CreativeAiChatInput } from "@/components/creative-ai/chat-input";

export default function Page() {
  return (
    <CreativeAiChatInput
      value={value}
      onChange={(v) => setValue(v)}
      onSend={(text) => handleSendMessage(text)}
      isFocused={${isFocused}}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
}`}</code></pre>
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/creative-ai/chat-input.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import { CreativeAiChatInput } from "@/components/creative-ai/chat-input";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import {'{ CreativeAiChatInput }'} from "@/components/creative-ai/chat-input";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Source code implementation of CreativeAiChatInput.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/creative-ai/chat-input.tsx</span>
            <button onClick={() => handleCopy(inputSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{inputSourceCode}</code></pre>
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
                <td><code>value</code></td>
                <td><code className="type">string</code></td>
                <td><code>required</code></td>
                <td>Controlled text input value.</td>
              </tr>
              <tr>
                <td><code>onSend</code></td>
                <td><code className="type">(text?: string) =&gt; void</code></td>
                <td><code>required</code></td>
                <td>Callback fired when submit button or chip is clicked.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
