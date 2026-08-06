"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/layout/container";
import { COMPONENT_DATABASE } from "./library.data";

function LibraryLayoutContent({ children }: { children: React.ReactNode }) {
  const [viewport, setViewport] = useState<"Mobile" | "Desktop">("Mobile");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [sidebarTheme, setSidebarTheme] = useState<"light" | "dark" | "retro">("light");
  
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat");
  const comp = searchParams.get("comp");

  useEffect(() => {
    const syncViewport = () => setViewport(window.innerWidth >= 1024 ? "Desktop" : "Mobile");
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const menuItems = [
    ...Object.keys(COMPONENT_DATABASE)
      .filter((category) => category !== "root")
      .map((category) => ({
        label: category.charAt(0).toUpperCase() + category.slice(1).replace("-", " "),
        href: `/developer/library?cat=${category}`,
        icon: "folder",
      })),
    ...(COMPONENT_DATABASE.root ?? []).map((component) => ({
      label: component.file,
      href: `/developer/library?cat=root&comp=${encodeURIComponent(component.file)}`,
      icon: "description",
    })),
  ];

  const activeMenuHref = cat === "root" && comp
    ? `/developer/library?cat=root&comp=${encodeURIComponent(comp)}`
    : cat
      ? `/developer/library?cat=${cat}`
      : undefined;

  // Resolve dynamic breadcrumbs
  const catLabel = cat ? (cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")) : null;
  const breadcrumbs = catLabel 
    ? ["Developer", "Library", catLabel] 
    : ["Developer", "Library"];

  return (
    <div className="h-dvh w-dvw overflow-hidden bg-[linear-gradient(135deg,#00cbd2_0%,#0077bf_45%,#000675_100%)]">
      <Container
        viewport={viewport}
        menuTitle="Library Sandbox"
        menuItems={menuItems}
        breadcrumbItems={breadcrumbs}
        activeMenuHref={activeMenuHref}
        contentProps={{
          sidebarTheme,
          sidebarExpanded,
          onToggleSidebarTheme: () => setSidebarTheme((c) => c === "dark" ? "light" : "dark"),
          onToggleSidebarRetro: () => setSidebarTheme((c) => c === "retro" ? "light" : "retro"),
          onToggleSidebarExpanded: () => setSidebarExpanded((c) => !c),
        }}
      >
        {children}
      </Container>
    </div>
  );
}

export default function DeveloperLibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <LibraryLayoutContent>{children}</LibraryLayoutContent>
    </Suspense>
  );
}
