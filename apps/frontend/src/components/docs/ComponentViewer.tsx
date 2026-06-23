"use client";

import { useEffect, useMemo, useState } from "react";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import { AuthProvider, type User } from "@/providers/auth-provider";
import { Navbar } from "@/components/navbar";

hljs.registerLanguage("typescript", typescript);

type ViewMode = "desktop" | "mobile";
type PreviewRole = "guest" | "member" | "admin";

type MockApiBoundaryProps = {
  role: PreviewRole;
  children: React.ReactNode;
};

const NAVBAR_SOURCE_URL =
  "https://raw.githubusercontent.com/anjskurniawan/Creative-Universe/main/apps/frontend/src/components/navbar.tsx";

const NAVBAR_SOURCE_FALLBACK = `"use client";

import { Navbar } from "@/components/navbar";

// Source could not be loaded from GitHub.
// Open apps/frontend/src/components/navbar.tsx to view the full source.`;

const DESCRIPTION =
  "The Navbar is the main navigation bar that appears at the top of the app. It shows the Creative Universe logo, login entry for guests, and account tools for logged-in users. Admin users also see shortcuts for user, role, and maintenance features.";

const ROLE_LABEL: Record<PreviewRole, string> = {
  guest: "Guest",
  member: "Member",
  admin: "Admin",
};

const VIEW_LABEL: Record<ViewMode, string> = {
  desktop: "Desktop",
  mobile: "Mobile",
};

function createPreviewUser(role: PreviewRole): User | null {
  if (role === "guest") return null;

  if (role === "admin") {
    return {
      id: 9001,
      name: "Admin Preview",
      username: "admin.preview",
      email: "admin.preview@creative-universe.test",
      whatsapp_number: null,
      avatar_url: null,
      is_active: true,
      roles: ["Root"],
      permissions: [
        "access-core",
        "manage-users",
        "manage-roles",
        "approve-users",
        "view-logs",
        "run-artisan",
        "access-pricetag",
        "pricetag.manage",
      ],
      settings: null,
    };
  }

  return {
    id: 9002,
    name: "Member Preview",
    username: "member.preview",
    email: "member.preview@creative-universe.test",
    whatsapp_number: null,
    avatar_url: null,
    is_active: true,
    roles: ["Designer"],
    permissions: ["access-core", "access-pricetag"],
    settings: null,
  };
}

function isPreviewApiUrl(input: RequestInfo | URL, path: string) {
  const url = typeof input === "string" ? input : input instanceof Request ? input.url : input.toString();
  return url.includes(`/api/v1${path}`) || url.endsWith(path);
}

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function MockApiBoundary({ role, children }: MockApiBoundaryProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      if (isPreviewApiUrl(input, "/auth/me")) {
        const previewUser = createPreviewUser(role);

        if (!previewUser) {
          return jsonResponse(
            {
              success: false,
              message: "Preview guest session.",
            },
            401
          );
        }

        return jsonResponse({
          success: true,
          message: "Preview user loaded.",
          data: previewUser,
        });
      }

      if (isPreviewApiUrl(input, "/notifications")) {
        return jsonResponse({
          success: true,
          message: "Preview notifications loaded.",
          data: {
            notifications: [],
            unread_count: 0,
          },
        });
      }

      if (isPreviewApiUrl(input, "/notifications/read-all")) {
        return jsonResponse({
          success: true,
          message: "Preview notifications marked as read.",
          data: null,
        });
      }

      if (isPreviewApiUrl(input, "/auth/logout")) {
        return jsonResponse({
          success: true,
          message: "Preview logout ignored.",
          data: null,
        });
      }

      return originalFetch(input, init);
    };

    setIsReady(true);

    return () => {
      window.fetch = originalFetch;
      setIsReady(false);
    };
  }, [role]);

  if (!isReady) {
    return (
      <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-cu-line bg-cu-panel-soft text-sm text-cu-muted">
        Preparing Navbar preview...
      </div>
    );
  }

  return <AuthProvider key={role}>{children}</AuthProvider>;
}

function SegmentedControl<TValue extends string>({
  label,
  value,
  options,
  getLabel,
  onChange,
}: {
  label: string;
  value: TValue;
  options: TValue[];
  getLabel: (value: TValue) => string;
  onChange: (value: TValue) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cu-muted">{label}</span>
      <div className="inline-flex rounded-full border border-cu-line bg-cu-surface p-1 shadow-sm">
        {options.map((option) => {
          const isActive = option === value;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-cu-ink text-white shadow-sm"
                  : "text-cu-muted hover:bg-cu-panel-soft hover:text-cu-ink"
              }`}
              aria-pressed={isActive}
            >
              {getLabel(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PreviewFrame({ viewMode, role }: { viewMode: ViewMode; role: PreviewRole }) {
  const frameClass =
    viewMode === "mobile"
      ? "mx-auto w-[390px] max-w-full overflow-hidden rounded-[28px] border border-cu-line bg-cu-surface shadow-2xl"
      : "w-full overflow-visible rounded-2xl border border-cu-line bg-cu-surface shadow-xl";

  function stopPreviewNavigation(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const link = target.closest("a");
    const button = target.closest("button");

    if (link) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (button?.textContent?.includes("Keluar")) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  return (
    <div className="rounded-[24px] border border-cu-line bg-[radial-gradient(circle_at_top_left,rgba(255,133,1,0.12),transparent_32%),linear-gradient(135deg,#f7f7f5,#ffffff)] p-4 md:p-6">
      <div className={frameClass} onClickCapture={stopPreviewNavigation}>
        <MockApiBoundary role={role}>
          <Navbar sticky={false} />
        </MockApiBoundary>
      </div>
    </div>
  );
}

function CodeViewer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sourceCode, setSourceCode] = useState(NAVBAR_SOURCE_FALLBACK);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    let cancelled = false;

    fetch(NAVBAR_SOURCE_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Source request failed.");
        return response.text();
      })
      .then((source) => {
        if (!cancelled) setSourceCode(source);
      })
      .catch(() => {
        if (!cancelled) setSourceCode(NAVBAR_SOURCE_FALLBACK);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const highlightedSource = useMemo(
    () => hljs.highlight(sourceCode, { language: "typescript" }).value,
    [sourceCode]
  );

  async function copySourceCode() {
    try {
      await navigator.clipboard.writeText(sourceCode);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1400);
    } catch {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    }
  }

  return (
    <section className="overflow-hidden rounded-[24px] border border-cu-line bg-[#0d1117] shadow-xl">
      <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[0.03] px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Navbar source code</h3>
          <p className="mt-1 text-sm text-white/55">Read-only source for the real Navbar component.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Collapse code" : "Expand code"}
          </button>
          <button
            type="button"
            onClick={copySourceCode}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0d1117] transition-opacity hover:opacity-85"
          >
            {copyStatus === "copied" ? "Copied" : copyStatus === "failed" ? "Copy failed" : "Copy code"}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="component-viewer-code max-h-[560px] overflow-auto p-5 text-sm leading-6">
          <pre className="m-0 whitespace-pre text-white/90">
            <code
              className="language-typescript"
              dangerouslySetInnerHTML={{ __html: highlightedSource }}
            />
          </pre>
        </div>
      )}

      <style>{`
        .component-viewer-code .hljs-keyword,
        .component-viewer-code .hljs-selector-tag,
        .component-viewer-code .hljs-built_in {
          color: #ff7b72;
        }

        .component-viewer-code .hljs-string,
        .component-viewer-code .hljs-attr,
        .component-viewer-code .hljs-template-string {
          color: #a5d6ff;
        }

        .component-viewer-code .hljs-title,
        .component-viewer-code .hljs-function,
        .component-viewer-code .hljs-variable.language_ {
          color: #d2a8ff;
        }

        .component-viewer-code .hljs-comment {
          color: #8b949e;
        }

        .component-viewer-code .hljs-number,
        .component-viewer-code .hljs-literal {
          color: #79c0ff;
        }
      `}</style>
    </section>
  );
}

export default function ComponentViewer() {
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [role, setRole] = useState<PreviewRole>("member");

  return (
    <section className="space-y-8">
      <div className="rounded-[24px] border border-cu-line bg-cu-surface p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cu-muted">Components / Navbar</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-cu-ink">Navbar</h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-cu-muted">{DESCRIPTION}</p>
      </div>

      <section className="space-y-4 rounded-[24px] border border-cu-line bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-cu-ink">Live preview</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-cu-muted">
              Switch the viewport and role to see how the real Navbar responds. This preview uses local sample data only.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <SegmentedControl<ViewMode>
              label="View"
              value={viewMode}
              options={["desktop", "mobile"]}
              getLabel={(option) => VIEW_LABEL[option]}
              onChange={setViewMode}
            />
            <SegmentedControl<PreviewRole>
              label="Role"
              value={role}
              options={["guest", "member", "admin"]}
              getLabel={(option) => ROLE_LABEL[option]}
              onChange={setRole}
            />
          </div>
        </div>

        <PreviewFrame viewMode={viewMode} role={role} />
      </section>

      <CodeViewer />
    </section>
  );
}
