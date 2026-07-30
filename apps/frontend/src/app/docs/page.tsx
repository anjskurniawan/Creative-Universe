"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DocsMenu, { getDocsBreadcrumbs } from "@/components/docs/DocsMenu";
import DocsContent from "@/components/docs/DocsContent";
import GlobalLayoutNavbar from "@/components/layout/navbar";
import { MaterialIcon } from "@/components/ui/material-icon";
import "./docs.css";

function DocsPageInner() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("section") ?? "";

  return <DocsContent slug={slug} />;
}

function DocsNavbar({
  isDesktop,
  onMenuClick,
}: {
  isDesktop: boolean;
  onMenuClick: () => void;
}) {
  const searchParams = useSearchParams();
  const slug = searchParams.get("section") ?? "";

  return (
    <GlobalLayoutNavbar
      viewport={isDesktop ? "Desktop" : "Mobile"}
      breadcrumbItems={["Documentation", ...getDocsBreadcrumbs(slug)]}
      onMenuClick={onMenuClick}
    />
  );
}

function DocsLoading({ label }: { label: string }) {
  return (
    <div className="flex min-h-24 items-center justify-center gap-2 text-sm text-slate-500">
      <span className="size-4 animate-spin rounded-full border-2 border-slate-200 border-t-[#00a4ff]" />
      {label}
    </div>
  );
}

export default function DocsPage() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setMenuOpen(false);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return (
    <div className="h-dvh w-dvw overflow-hidden bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)] p-2 lg:p-6">
      <div className="flex size-full flex-col overflow-hidden rounded-2xl bg-[#f3fbff] shadow-[0_14px_42px_rgba(44,42,39,0.16)]">
        <Suspense
          fallback={
            <GlobalLayoutNavbar
              viewport={isDesktop ? "Desktop" : "Mobile"}
              breadcrumbItems={["Documentation", "Overview"]}
              onMenuClick={() => setMenuOpen(true)}
            />
          }
        >
          <DocsNavbar
            isDesktop={isDesktop}
            onMenuClick={() => setMenuOpen(true)}
          />
        </Suspense>

        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          {isDesktop && (
            <aside className="docs-global-sidebar">
              <div className="docs-sidebar-scroll">
                <Suspense fallback={<DocsLoading label="Memuat menu..." />}>
                  <DocsMenu />
                </Suspense>
              </div>
            </aside>
          )}

          <main className="docs-global-content" id="docs-main">
            <Suspense fallback={<DocsLoading label="Memuat konten..." />}>
              <DocsPageInner />
            </Suspense>
          </main>

          {!isDesktop && menuOpen && (
            <div className="absolute inset-0 z-30 flex">
              <button
                type="button"
                aria-label="Tutup menu dokumentasi"
                className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
                onClick={() => setMenuOpen(false)}
              />
              <aside className="docs-mobile-menu">
                <div className="docs-mobile-menu-header">
                  <div className="flex items-center gap-3">
                    <span className="docs-sidebar-icon">
                      <MaterialIcon name="menu_book" size="sm" />
                    </span>
                    <div>
                      <p>Documentation</p>
                      <span>Creative Universe</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Tutup menu"
                    className="flex size-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    <MaterialIcon name="close" size="sm" />
                  </button>
                </div>
                <div className="docs-sidebar-scroll">
                  <Suspense fallback={<DocsLoading label="Memuat menu..." />}>
                    <DocsMenu onNavigate={() => setMenuOpen(false)} />
                  </Suspense>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
