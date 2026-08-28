"use client";

import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import { SearchBar } from "@/components/ui/SearchBar/SearchBar";
import type { LibraryTreeItem } from "@/app/developer/library/library.types";

type LibraryMenuProps = {
  items: LibraryTreeItem[];
  total: number;
  selectedFile?: string;
  expandedFolders: Set<string>;
  onToggleFolder: (file: string) => void;
  onSelect: (file: string, isFolder: boolean) => void;
};

export function LibraryMenu({ items, total, selectedFile, expandedFolders, onToggleFolder, onSelect }: LibraryMenuProps) {
  const [search, setSearch] = useState("");
  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => item.name.toLowerCase().includes(query) || item.file.toLowerCase().includes(query));
  }, [items, search]);

  return (
    <div className="lg:col-span-1 min-h-0 h-full overflow-hidden bg-white rounded-2xl border border-slate-100 p-2 shadow-sm flex flex-col gap-2">
      <div className="flex shrink-0 items-center gap-1 border-b border-slate-50 pb-1">
        <MaterialIcon name="folder_open" size="xs" className="text-slate-400" />
        <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Component ({total})</h3>
      </div>
      <SearchBar
        value={search}
        onChange={setSearch}
        onClear={() => setSearch("")}
        placeholder="Cari component..."
        aria-label="Cari component"
        className="h-8 shrink-0 rounded-lg px-2.5"
      />
      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filteredItems.length === 0 ? <div className="py-6 text-center text-[10px] text-slate-400">Component tidak ditemukan</div> : filteredItems.map((item) => {
          const isFolder = item.file.endsWith("/");
          const isSelected = selectedFile === item.file;
          const isActiveParent = isFolder && !isSelected && Boolean(selectedFile?.startsWith(item.file));
          return (
            <button key={item.file} type="button" onClick={() => { if (isFolder) onToggleFolder(item.file); onSelect(item.file, isFolder); }}
              className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[10px] transition-all ${isSelected ? "bg-[#ede9fe]/70 font-semibold text-[#6d46eb]" : isActiveParent ? "bg-slate-100 font-medium text-slate-700" : "text-slate-600 hover:bg-slate-50"}`}
              style={{ paddingLeft: `${6 + item.depth * 10}px` }}>
              <MaterialIcon name={isFolder ? (isSelected || expandedFolders.has(item.file) ? "folder_open" : "folder") : isSelected ? "insert_drive_file" : "description"} size="xs" className={isSelected ? "text-[#6d46eb]" : isActiveParent ? "text-slate-500" : "text-slate-400"} />
              <span className="truncate">{item.file.endsWith("/") ? item.file.slice(0, -1) : item.file}</span>
              {!isFolder && <span className="ml-auto shrink-0 text-[8px] text-slate-300">FILE</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
