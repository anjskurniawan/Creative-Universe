"use client";

import { useEffect, useState } from "react";
import Container from "@/components/global-layout/container";
import profileCardMenu from "./profile-card-menu";
import oddsTaskCardMenu from "./odds-task-card-menu";
import ProfileCardPreview from "./profile-card-preview";
import OddsTaskCardPreview from "./odds-task-card-preview";

type PreviewId = "profile-card" | "odds-task-card";
type SidebarTheme = "light" | "dark" | "retro";

export default function GlobalLayoutPage() {
  const [viewport, setViewport] = useState<"Mobile" | "Desktop">("Mobile");
  const [activePreview, setActivePreview] = useState<PreviewId>("profile-card");
  const [sidebarTheme, setSidebarTheme] = useState<SidebarTheme>("light");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const menuItems = [profileCardMenu, oddsTaskCardMenu];

  useEffect(() => {
    const syncViewport = () => setViewport(window.innerWidth >= 1024 ? "Desktop" : "Mobile");
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    const syncPreview = () => setActivePreview(window.location.hash === "#odds-task-card" ? "odds-task-card" : "profile-card");
    syncPreview();
    window.addEventListener("hashchange", syncPreview);
    return () => window.removeEventListener("hashchange", syncPreview);
  }, []);

  const selectPreview = (href?: string) => {
    if (!href) return;
    setActivePreview(href === "#odds-task-card" ? "odds-task-card" : "profile-card");
    if (window.location.hash !== href) window.history.pushState(null, "", href);
  };

  return (
    <div
      className="h-dvh w-dvw overflow-hidden bg-[linear-gradient(135deg,#00cbd2_0%,#0077bf_45%,#000675_100%)] font-sans text-slate-900 antialiased"
      onClickCapture={(event) => {
        const target = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
        selectPreview(target?.getAttribute("href") ?? undefined);
      }}
    >
      <Container
        viewport={viewport}
        menuTitle="Global Layout"
        menuItems={menuItems}
        activeMenuHref={`#${activePreview}`}
        contentProps={{
          sidebarTheme,
          sidebarExpanded,
          onToggleSidebarTheme: () => setSidebarTheme((current) => current === "dark" ? "light" : "dark"),
          onToggleSidebarRetro: () => setSidebarTheme((current) => current === "retro" ? "light" : "retro"),
          onToggleSidebarExpanded: () => setSidebarExpanded((current) => !current),
          onMenuItemClick: (item) => selectPreview(item.href),
        }}
      >
        {activePreview === "profile-card" ? <ProfileCardPreview viewport={viewport} /> : <OddsTaskCardPreview />}
      </Container>
    </div>
  );
}
