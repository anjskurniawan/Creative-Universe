"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COMPONENT_DATABASE } from "./library.data";
import type { ComponentItem } from "./library.data";
import { LibraryMenu } from "./library-menu";
import { LibraryPreview } from "./library-preview";
import type { LibraryTreeItem } from "./library.types";

function flattenItems(items: ComponentItem[], depth = 0): LibraryTreeItem[] {
  const sortedItems = [...items].sort((a, b) => {
    const aIsFolder = a.file.endsWith("/");
    const bIsFolder = b.file.endsWith("/");
    if (aIsFolder !== bIsFolder) return aIsFolder ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return sortedItems.flatMap((item) => [
    { ...item, depth },
    ...(item.children ? flattenItems(item.children, depth + 1) : []),
  ]);
}

function prefixItems(items: ComponentItem[], prefix: string): ComponentItem[] {
  return items.map((item) => ({
    ...item,
    file: `${prefix}${item.file}`,
    children: item.children ? prefixItems(item.children, prefix) : undefined,
  }));
}

function getExpandedFolders(path: string) {
  const parts = path.split("/");
  const expanded = new Set<string>();
  for (let index = 0; index < parts.length - 1; index += 1) {
    expanded.add(`${parts.slice(0, index + 1).join("/")}/`);
  }
  return expanded;
}

function LibraryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat") || "ui";
  const comp = searchParams.get("comp") || "";
  const categoryItems = useMemo(() => COMPONENT_DATABASE[cat] || [], [cat]);
  const allItems = useMemo(() => flattenItems(categoryItems), [categoryItems]);
  const explorerItems = useMemo(() => [
    ...Object.entries(COMPONENT_DATABASE)
      .filter(([category]) => category !== "root")
      .map(([category, items]) => ({
        name: category,
        file: `${category}/`,
        description: `${category} component folder`,
        tags: ["Folder"],
        children: prefixItems(items, `${category}/`),
      })),
    ...prefixItems(COMPONENT_DATABASE.root ?? [], ""),
  ], []);
  const menuItems = useMemo(() => flattenItems(explorerItems), [explorerItems]);
  const selected = useMemo(() => allItems.find((item) => item.file === comp) || allItems[0], [allItems, comp]);
  const selectedPath = cat === "root" ? (selected?.file ?? "") : `${cat}/${selected?.file ?? ""}`;
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => getExpandedFolders(selectedPath));
  const visibleItems = useMemo(() => {
    const visible: LibraryTreeItem[] = [];
    const ancestors: string[] = [];
    for (const item of menuItems) {
      ancestors.length = item.depth;
      if (item.depth === 0 || ancestors.every((folder) => expandedFolders.has(folder))) visible.push(item);
      if (item.file.endsWith("/")) ancestors[item.depth] = item.file;
    }
    return visible;
  }, [expandedFolders, menuItems]);

  const handleSelect = (file: string, isFolder: boolean) => {
    if (isFolder) {
      const nextCategory = file.slice(0, -1);
      router.push(`/developer/library?cat=${encodeURIComponent(nextCategory)}`);
      return;
    }

    const knownCategory = file.split("/")[0];
    const nextCategory = knownCategory && Object.prototype.hasOwnProperty.call(COMPONENT_DATABASE, knownCategory) && knownCategory !== "root" ? knownCategory : "root";
    const nextComponent = nextCategory === "root" ? file : file.slice(nextCategory.length + 1);
    router.push(`/developer/library?cat=${encodeURIComponent(nextCategory)}&comp=${encodeURIComponent(nextComponent)}`);
  };

  return <div className="flex h-full min-h-0 w-full flex-col gap-6 animate-fade-in pb-4">
    <div className="grid h-full min-h-0 w-full grid-cols-1 items-stretch gap-4 lg:grid-cols-6">
      <LibraryMenu items={visibleItems} total={menuItems.filter((item) => !item.file.endsWith("/")).length} selectedFile={selectedPath} expandedFolders={expandedFolders}
        onToggleFolder={(file) => setExpandedFolders((current) => { const next = new Set(current); if (next.has(file)) next.delete(file); else next.add(file); return next; })}
        onSelect={handleSelect} />
      <div className="min-h-0 h-full w-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:col-span-5"><LibraryPreview category={cat} component={selected} /></div>
    </div>
  </div>;
}

export default function DeveloperLibraryPage() {
  return <Suspense fallback={null}><LibraryPageContent /></Suspense>;
}
