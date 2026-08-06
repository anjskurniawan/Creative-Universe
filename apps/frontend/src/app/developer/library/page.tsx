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

function LibraryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat") || "ui";
  const comp = searchParams.get("comp") || "";
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const categoryItems = useMemo(() => COMPONENT_DATABASE[cat] || [], [cat]);
  const allItems = useMemo(() => flattenItems(categoryItems), [categoryItems]);
  const menuItems = useMemo(() => cat === "root" && comp && !comp.endsWith("/") ? [] : allItems, [allItems, cat, comp]);
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
  const selected = useMemo(() => allItems.find((item) => item.file === comp) || allItems[0], [allItems, comp]);

  return <div className="flex h-full min-h-0 w-full flex-col gap-6 animate-fade-in pb-4">
    <div className="grid h-full min-h-0 w-full grid-cols-1 items-stretch gap-4 lg:grid-cols-6">
      <LibraryMenu items={visibleItems} total={menuItems.length} selectedFile={selected?.file} expandedFolders={expandedFolders}
        onToggleFolder={(file) => setExpandedFolders((current) => { const next = new Set(current); if (next.has(file)) next.delete(file); else next.add(file); return next; })}
        onSelect={(file) => router.push(`/developer/library?cat=${cat}&comp=${encodeURIComponent(file)}`)} />
      <div className="min-h-0 h-full w-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:col-span-5"><LibraryPreview category={cat} component={selected} /></div>
    </div>
  </div>;
}

export default function DeveloperLibraryPage() {
  return <Suspense fallback={null}><LibraryPageContent /></Suspense>;
}
