"use client";

import { useState } from "react";
import { Header } from "./Header";
import { FolderRow } from "./FolderRow";
import type { ProjectProps, ProjectItem } from "./Project.types";

export function Project({
  items,
  isExpanded = true,
  isOpen: controlledIsOpen,
  onToggleOpen,
  onAddProject,
  activeHref,
  className = "",
}: ProjectProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const isOpen = controlledIsOpen ?? internalIsOpen;

  // Track status expand/collapse untuk masing-masing folder proyek (default: collapse)
  const [openFolderIds, setOpenFolderIds] = useState<Record<string, boolean>>({});

  const handleToggle = () => {
    if (onToggleOpen) {
      onToggleOpen();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  const handleToggleFolder = (folderId: string) => {
    setOpenFolderIds((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Proyek Saya"
      className={`flex flex-col w-full ${isExpanded ? "gap-1" : "gap-1 items-center"} ${className}`.trim()}
    >
      {/* Header Judul Seksi Proyek (Di mode collapsed menampilkan icon Folder) */}
      <Header
        isOpen={isOpen}
        isExpanded={isExpanded}
        onToggle={handleToggle}
        onAddProject={onAddProject}
      />

      {/* List Item Proyek (Hanya tampil saat sidebar expanded dan seksi terbuka) */}
      {isExpanded && isOpen &&
        items.map((item: ProjectItem) => {
          const isItemActive =
            item.isActive !== undefined
              ? item.isActive
              : Boolean(
                  item.href &&
                  activeHref &&
                  item.href !== "#" &&
                  (activeHref === item.href || activeHref.startsWith(`${item.href}/`))
                );

          return (
            <FolderRow
              key={item.id}
              item={item}
              isExpanded={isExpanded}
              isFolderOpen={Boolean(openFolderIds[item.id])}
              isItemActive={isItemActive}
              onToggleFolder={() => handleToggleFolder(item.id)}
              activeHref={activeHref}
            />
          );
        })}
    </nav>
  );
}
