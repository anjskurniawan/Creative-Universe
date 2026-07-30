"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import { CreativeAiChatMessages, type CreativeAiMessage } from "@/components/creative-ai/chat-messages";

export function CreativeAiChatMessagesDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

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

  const sampleMessages: CreativeAiMessage[] = [
    {
      id: "1",
      role: "user",
      content: "Halo Creative AI, buatkan draf ringkasan laporan performa desainer minggu ini.",
      timestamp: "10:30"
    },
    {
      id: "2",
      role: "assistant",
      content: "Halo Sobat CU! Berikut draf ringkasan performa tim desainer minggu ini:\n\n1. **Total Tugas Selesai**: 24 Brief\n2. **Rata-rata Skor**: 94.5 / 100\n3. **Divisi Teraktif**: Motion & Graphic Design",
      timestamp: "10:31"
    }
  ];

  const messagesSourceCode = `"use client";

export interface CreativeAiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export type CreativeAiChatMessagesProps = {
  messages: CreativeAiMessage[];
  isTyping?: boolean;
  onResetChat?: () => void;
  className?: string;
};

export function CreativeAiChatMessages({
  messages,
  isTyping = false,
  onResetChat,
  className = "",
}: CreativeAiChatMessagesProps) {
  // ... implementation ...
}`;

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Creative AI</div>
        <h1 className="doc-hero-title">Chat Messages</h1>
        <p className="doc-hero-subtitle">
          Scrollable chat history component rendering user and AI assistant message bubbles with typing indicators.
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
          <p className="doc-section-desc">Toggle AI typing indicator simulation.</p>
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
                  <input type="checkbox" checked={isTyping} onChange={(e) => setIsTyping(e.target.checked)} className="size-4 rounded" />
                  Toggle AI Typing (`isTyping`)
                </label>
              </div>

              <div className="doc-playground-content">
                <div className="doc-preview-area !p-4 !bg-[#09090b] border border-slate-800 rounded-2xl shadow-xl w-full max-w-[650px] min-h-[300px]">
                  <CreativeAiChatMessages
                    messages={sampleMessages}
                    isTyping={isTyping}
                    onResetChat={() => alert("Reset Chat Clicked!")}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import { CreativeAiChatMessages } from "@/components/creative-ai/chat-messages";

export default function Page() {
  return (
    <CreativeAiChatMessages
      messages={messages}
      isTyping={${isTyping}}
      onResetChat={() => resetChat()}
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/creative-ai/chat-messages.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import { CreativeAiChatMessages } from "@/components/creative-ai/chat-messages";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import {'{ CreativeAiChatMessages }'} from "@/components/creative-ai/chat-messages";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Source code implementation of CreativeAiChatMessages.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/creative-ai/chat-messages.tsx</span>
            <button onClick={() => handleCopy(messagesSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{messagesSourceCode}</code></pre>
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
                <td><code>messages</code></td>
                <td><code className="type">CreativeAiMessage[]</code></td>
                <td><code>required</code></td>
                <td>Array of chat message models.</td>
              </tr>
              <tr>
                <td><code>isTyping</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>false</code></td>
                <td>Controls visibility of animated typing indicator.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
