"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import NotificationDropdown, { type NotificationItem } from "@/components/layout/navbar/notification-dropdown";

export function NavbarNotificationDropdownDocumentation() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [copiedSource, setCopiedSource] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  
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

  const notificationSourceCode = `"use client";

import { useEffect, useRef } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type NotificationItem = {
  id: string;
  title: string;
  content: string;
  time: string;
  read?: boolean;
  icon?: string;
};

export default function NotificationDropdown({
  isOpen,
  onClose,
  notifications = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  notifications?: NotificationItem[];
}) {
  // ... component implementation ...
}`;

  const sampleNotifications: NotificationItem[] = [
    { id: "1", title: "Tugas Baru", content: "Anda ditugaskan pada tugas #4402 - KV Retail Banner", time: "10m lalu", read: false, icon: "assignment" },
    { id: "2", title: "Revisi Diterima", content: "Desain KV Banner telah disetujui klien", time: "2j lalu", read: true, icon: "done" }
  ];

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Navbar Sub-component</div>
        <h1 className="doc-hero-title">Navbar: Notification Dropdown</h1>
        <p className="doc-hero-subtitle">
          Modular alert popover rendering real-time system, tasks, and updates notifications.
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
          <p className="doc-section-desc">Toggle the dropdown state to view the standalone popover overlay.</p>
        </div>
        
        <div className="doc-playground">
          <div className="doc-playground-tabs">
            <button className={`doc-tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Preview</button>
            <button className={`doc-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
          </div>
          
          {activeTab === 'preview' ? (
            <div>
              <div className="doc-playground-controls">
                <label>
                  Dropdown State:
                  <select value={isOpen ? "Open" : "Closed"} onChange={(e) => setIsOpen(e.target.value === "Open")}>
                    <option value="Open">Open (Visible)</option>
                    <option value="Closed">Closed (Hidden)</option>
                  </select>
                </label>
              </div>

              <div className="doc-playground-content" style={{ minHeight: '320px' }}>
                {isOpen ? (
                  <div className="doc-preview-area !p-6 flex items-center justify-center">
                    <div className="relative min-w-[280px] flex items-center justify-center">
                      <div className="[&>div]:!static [&>div]:!top-0 [&>div]:!right-0 [&>div]:!left-0">
                        <NotificationDropdown 
                          isOpen={true}
                          onClose={() => setIsOpen(false)}
                          notifications={sampleNotifications}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="doc-preview-area text-center py-6 px-8">
                    <span className="text-xs text-cu-muted font-medium">Dropdown is currently hidden. Switch <b>Dropdown State</b> to <b>Open</b> above to display.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#111]">
              <div className="doc-code-area">
                <pre><code>{`import NotificationDropdown from "@/components/layout/navbar/notification-dropdown";

export default function WorkspaceNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <NotificationDropdown 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={[
          { id: "1", title: "New Task", content: "Task assigned to you", time: "5m ago", read: false }
        ]}
      />
    </div>
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/layout/navbar/notification-dropdown.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import NotificationDropdown from "@/components/layout/navbar/notification-dropdown";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import NotificationDropdown from "@/components/layout/navbar/notification-dropdown";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Source code structure for NotificationDropdown.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/layout/navbar/notification-dropdown.tsx</span>
            <button onClick={() => handleCopy(notificationSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{notificationSourceCode}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Item States</h2>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Unread Dot Badge</h3>
              <p>Highlights a pink dot at the top right header when there are unread items in the list.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Unread List Row Highlight</h3>
              <p>Highlights unread item backgrounds with <code>bg-[#dff6ff]/40</code> for quick visual distinction.</p>
            </div>
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
                <td><code>isOpen</code></td>
                <td><code className="type">boolean</code></td>
                <td><code>false</code></td>
                <td>Toggles visibility of the alerts drawer.</td>
              </tr>
              <tr>
                <td><code>onClose</code></td>
                <td><code className="type">() =&gt; void</code></td>
                <td><code>undefined</code></td>
                <td>Callback listener invoked when dismissing popover.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
