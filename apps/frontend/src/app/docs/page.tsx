"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";
import DocsMenu from "@/components/docs/DocsMenu";
import DocsContent from "@/components/docs/DocsContent";

function DocsPageInner() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("section") ?? "";
  return <DocsContent slug={slug} />;
}

export default function DocsPage() {
  return (
    <div className="docs-shell">
      <header className="docs-topbar">
        <div className="docs-topbar-inner">
          <Link href="/" className="docs-brand" aria-label="Creative Universe home">
            <span className="docs-brand-mark" aria-hidden="true">
              <Image src="/images/landing/logo-navbar.svg" alt="" width={22} height={24} priority />
            </span>
            <span className="docs-brand-text">Creative Universe</span>
            <span className="docs-version">docs</span>
          </Link>

          <label className="docs-search">
            <MaterialIcon name="search" size="auto" className="text-lg" />
            <input type="search" placeholder="Search" aria-label="Search documentation" />
            <kbd>CTRL K</kbd>
          </label>

          <nav className="docs-topnav" aria-label="Documentation top navigation">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/odds">ODDS</Link>
            <Link href="/docs?section=components/odds-designer-dashboard-cards">Components</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </nav>
        </div>
      </header>

      <div className="docs-body">
        <aside className="docs-sidebar">
          <Suspense fallback={<div className="docs-menu-loading">Memuat menu...</div>}>
            <DocsMenu />
          </Suspense>
        </aside>

        <main className="docs-content" id="docs-main">
          <Suspense fallback={<div className="docs-content-suspense-fallback">Memuat konten...</div>}>
            <DocsPageInner />
          </Suspense>
        </main>

        <aside className="docs-toc" aria-label="On this page">
          <p className="docs-toc-title">ON THIS PAGE</p>
          <nav className="docs-toc-list">
            <a href="#docs-main" className="active">Overview</a>
            <a href="#docs-main">Playground</a>
            <a href="#docs-main">Detail</a>
            <a href="#docs-main">Implementation</a>
          </nav>
        </aside>
      </div>

      <style>{`
        .docs-shell {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          background-color: hsl(var(--background));
          font-family: var(--font-sans);
        }

        .docs-topbar {
          height: 64px;
          flex-shrink: 0;
          border-bottom: 1px solid hsl(var(--border));
          background-color: hsl(var(--card));
        }

        .docs-topbar-inner {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          height: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .docs-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          min-width: 240px;
        }

        .docs-brand-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #000000;
          padding: 4px;
        }

        .docs-brand-mark img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .docs-brand-text {
          font-size: 1.25rem;
          font-weight: 750;
          color: hsl(var(--foreground));
        }

        .docs-version {
          border-radius: 999px;
          background: #eef4ff;
          padding: 0.2rem 0.55rem;
          color: #0b5cff;
          font-size: 0.72rem;
          font-weight: 600;
        }

        .docs-search {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: min(360px, 30vw);
          height: 38px;
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          padding: 0 0.75rem;
          color: hsl(var(--muted-foreground));
          background: hsl(var(--background));
        }

        .docs-search input {
          min-width: 0;
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.875rem;
          color: hsl(var(--foreground));
        }

        .docs-search kbd {
          font-size: 0.62rem;
          color: hsl(var(--muted-foreground));
        }

        .docs-topnav {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-left: auto;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .docs-topnav a {
          color: hsl(var(--foreground));
        }

        .docs-topnav a:hover {
          color: #0b5cff;
        }

        .docs-body {
          display: flex;
          flex: 1;
          min-height: 0;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          overflow: hidden;
        }

        .docs-sidebar {
          width: 260px;
          flex-shrink: 0;
          height: 100%;
          overflow-y: auto;
          border-right: 1px solid hsl(var(--border));
          background-color: hsl(var(--card));
          scrollbar-width: none;
        }

        .docs-sidebar::-webkit-scrollbar {
          display: none;
        }

        .docs-content {
          flex: 1;
          min-width: 0;
          min-height: 0;
          height: 100%;
          overflow-y: auto;
          padding: 2.25rem 2rem 4rem;
          scrollbar-width: none;
        }

        .docs-content::-webkit-scrollbar {
          display: none;
        }

        .docs-toc {
          width: 250px;
          flex-shrink: 0;
          height: 100%;
          border-left: 1px solid hsl(var(--border));
          background-color: hsl(var(--card));
          padding: 2.5rem 1.5rem;
        }

        .docs-toc-title {
          margin: 0 0 1rem;
          color: hsl(var(--foreground));
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .docs-toc-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          font-size: 0.875rem;
        }

        .docs-toc-list a {
          border-left: 2px solid transparent;
          padding-left: 0.65rem;
          color: hsl(var(--muted-foreground));
        }

        .docs-toc-list a.active {
          border-left-color: #0b5cff;
          color: #0b5cff;
          font-weight: 600;
        }

        .docs-menu-loading,
        .docs-content-suspense-fallback {
          padding: 1.25rem 1rem;
          font-size: 0.8125rem;
          color: hsl(var(--muted-foreground));
        }

        @media (max-width: 1180px) {
          .docs-toc {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .docs-search,
          .docs-topnav {
            display: none;
          }

          .docs-brand {
            min-width: 0;
          }

          .docs-sidebar {
            width: 240px;
          }
        }
      `}</style>
    </div>
  );
}
