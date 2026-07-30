"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, MonitorPlay, Accessibility, BookOpen, FileCode, CheckCircle2, Palette } from "lucide-react";
import ProfileDropdown, { type ProfileMenuItem, type UserProfile } from "@/components/layout/navbar/profile-dropdown";

export function NavbarProfileDropdownDocumentation() {
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

  const profileSourceCode = `"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";

export type ProfileMenuItem = { label: string; href: string; icon: string };
export type UserProfile = {
  name: string;
  role: string;
  avatarUrl?: string | null;
  initials: string;
};

export default function ProfileDropdown({
  isOpen,
  onClose,
  user = { name: "Guest", role: "User", initials: "U" },
  menuItems = [],
  onSignOut = () => {},
}: {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
  menuItems?: ProfileMenuItem[];
  onSignOut?: () => void;
}) {
  // ... component implementation ...
}`;

  const sampleUser: UserProfile = {
    name: "Anjas Kurniawan",
    role: "Project Owner",
    initials: "AK"
  };

  const sampleItems: ProfileMenuItem[] = [
    { label: "Profile Settings", href: "#", icon: "person" },
    { label: "System Preferences", href: "#", icon: "settings" }
  ];

  return (
    <div className="doc-example-container">
      {/* ── Hero Section ── */}
      <header className="doc-hero">
        <div className="doc-hero-badge">Navbar Sub-component</div>
        <h1 className="doc-hero-title">Navbar: Profile Dropdown</h1>
        <p className="doc-hero-subtitle">
          User account information and action links dropdown overlay populated within the workspace.
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

              <div className="doc-playground-content" style={{ minHeight: '340px' }}>
                {isOpen ? (
                  <div className="doc-preview-area !p-6 flex items-center justify-center">
                    <div className="relative min-w-[280px] flex items-center justify-center">
                      <div className="[&>div]:!static [&>div]:!top-0 [&>div]:!right-0 [&>div]:!left-0">
                        <ProfileDropdown 
                          isOpen={true}
                          onClose={() => setIsOpen(false)}
                          user={sampleUser}
                          menuItems={sampleItems}
                          onSignOut={() => alert("Sign out triggered!")}
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
                <pre><code>{`import ProfileDropdown from "@/components/layout/navbar/profile-dropdown";

export default function WorkspaceNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <ProfileDropdown 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        user={{ name: "John Doe", role: "Developer", initials: "JD" }}
        menuItems={[
          { label: "Profile", href: "/profile", icon: "person" }
        ]}
        onSignOut={() => doLogout()}
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
          <div className="doc-install-body text-cu-muted"><code>apps/frontend/src/components/layout/navbar/profile-dropdown.tsx</code></div>
        </div>
        <div className="doc-install-card mt-4">
          <div className="doc-install-header flex-between">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Import Statement</span>
            <button onClick={() => handleCopy(`import ProfileDropdown from "@/components/layout/navbar/profile-dropdown";`)} className="copy-btn">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-install-body"><code>import ProfileDropdown from "@/components/layout/navbar/profile-dropdown";</code></div>
        </div>
      </section>

      {/* ── Component Source Code ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Code2 size={18} className="inline-icon" /> Component Source</h2>
          <p className="doc-section-desc">Full interface source for ProfileDropdown.</p>
        </div>
        
        <div className="doc-code-block-container">
          <div className="doc-code-block-header">
            <span className="doc-code-filename">components/layout/navbar/profile-dropdown.tsx</span>
            <button onClick={() => handleCopy(profileSourceCode, true)} className="copy-btn">
              {copiedSource ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="doc-code-area full-source">
            <pre><code>{profileSourceCode}</code></pre>
          </div>
        </div>
      </section>

      {/* ── Variants Gallery ── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-title"><Palette size={18} className="inline-icon" /> Tray Elements</h2>
        </div>
        
        <div className="doc-grid">
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>User Card Header</h3>
              <p>Top section presenting user avatar picture or initials along with full name and assigned role tag.</p>
            </div>
          </div>
          <div className="doc-grid-item">
            <div className="doc-grid-info">
              <h3>Sign Out Action</h3>
              <p>Integrated Sign Out button at the bottom triggering account session cleanup callbacks.</p>
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
                <td>Toggles profile dropdown visibility.</td>
              </tr>
              <tr>
                <td><code>user</code></td>
                <td><code className="type">UserProfile</code></td>
                <td><code>Guest details</code></td>
                <td>Logged in user credentials (Name, Role, Initials).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
