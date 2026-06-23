"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import DocsMenu from "@/components/docs/DocsMenu";
import DocsContent from "@/components/docs/DocsContent";

// Note: metadata is omitted here because this is a client component.
// Add a layout.tsx inside app/docs/ with metadata if needed.

/** Reads the active ?section= param and renders <DocsContent /> */
function DocsPageInner() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("section") ?? "";
  return <DocsContent slug={slug} />;
}


export default function DocsPage() {
  return (
    <div className="docs-shell">
      {/* ─── Page Header ─────────────────────────────────────────── */}
      <header className="docs-header">
        <div className="docs-header-inner">
          {/* Breadcrumb */}
          <nav className="docs-breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/" className="docs-breadcrumb-link">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="docs-breadcrumb-sep">
                <span className="cu-material-icon" style={{ fontSize: "1rem" }}>
                  chevron_right
                </span>
              </li>
              <li>
                <span className="docs-breadcrumb-current">Documentation</span>
              </li>
            </ol>
          </nav>

          {/* Title block */}
          <div className="docs-header-title">
            <p className="docs-header-eyebrow">Creative Universe</p>
            <h1 className="docs-header-h1">Documentation</h1>
          </div>
        </div>
      </header>

      {/* ─── Body: sidebar + content ─────────────────────────────── */}
      <div className="docs-body">
        {/* Left: Side Menu */}
        <aside className="docs-sidebar">
          <Suspense fallback={<div className="docs-menu-loading">Memuat menu…</div>}>
            <DocsMenu />
          </Suspense>
        </aside>

        {/* Right: Content */}
        <main className="docs-content" id="docs-main">
          <Suspense fallback={
            <div className="docs-content-suspense-fallback">Memuat konten…</div>
          }>
            <DocsPageInner />
          </Suspense>
        </main>
      </div>

      {/* ─── Scoped styles ───────────────────────────────────────── */}
      <style>{`
        /* ── Shell ── */
        .docs-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: hsl(var(--background));
          font-family: var(--font-sans);
        }

        /* ── Header ── */
        .docs-header {
          background-color: hsl(var(--card));
          border-bottom: 1px solid hsl(var(--border));
          padding: 2rem 0 1.75rem;
          position: sticky;
          top: 0;
          z-index: 20;
          box-shadow: var(--shadow-sm);
        }

        .docs-header-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        /* Breadcrumb */
        .docs-breadcrumb ol {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .docs-breadcrumb-link {
          font-size: 0.8125rem;
          color: hsl(var(--muted-foreground));
          transition: color 0.15s ease;
        }
        .docs-breadcrumb-link:hover {
          color: hsl(var(--foreground));
        }

        .docs-breadcrumb-sep {
          color: hsl(var(--muted-foreground));
          display: flex;
          align-items: center;
          opacity: 0.6;
        }

        .docs-breadcrumb-current {
          font-size: 0.8125rem;
          font-weight: 500;
          color: hsl(var(--primary));
        }

        /* Title */
        .docs-header-eyebrow {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: hsl(var(--muted-foreground));
          margin: 0;
        }

        .docs-header-h1 {
          font-size: clamp(1.625rem, 3vw, 2.25rem);
          font-weight: 700;
          margin: 0.15rem 0 0;
          background: var(--gradient-rainbow);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        /* ── Body ── */
        .docs-body {
          display: flex;
          flex: 1;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 0;
        }

        /* ── Sidebar ── */
        .docs-sidebar {
          width: 260px;
          flex-shrink: 0;
          background-color: hsl(var(--card));
          border-right: 1px solid hsl(var(--border));
          position: sticky;
          top: 112px; /* offset = header height */
          height: calc(100vh - 112px);
          overflow-y: auto;
        }

        /* ── Content ── */
        .docs-content {
          flex: 1;
          min-width: 0;
          padding: 2.5rem 2rem;
        }

        /* ── Sidebar menu loading fallback ── */
        .docs-menu-loading {
          padding: 1.25rem 1rem;
          font-size: 0.8125rem;
          color: hsl(var(--muted-foreground));
        }

        /* ── Content suspense fallback ── */
        .docs-content-suspense-fallback {
          padding: 2rem;
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
}
