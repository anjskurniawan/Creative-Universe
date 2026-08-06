"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import type { LibraryTreeItem } from "./library.types";

type LibraryMenuProps = {
  items: LibraryTreeItem[];
  total: number;
  selectedFile?: string;
  expandedFolders: Set<string>;
  onToggleFolder: (file: string) => void;
  onSelect: (file: string, isFolder: boolean) => void;
};

export function LibraryMenu({ items, total, selectedFile, expandedFolders, onToggleFolder, onSelect }: LibraryMenuProps) {
  return (
    <div className="lg:col-span-1 min-h-0 h-full overflow-hidden bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
        <MaterialIcon name="folder_open" size="sm" className="text-slate-400" />
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Files ({total})</h3>
      </div>
      <nav className="flex flex-col gap-1 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {total === 0 ? <div className="text-center py-6 text-slate-400 text-xs">Tidak ada file</div> : items.map((item) => {
          const isFolder = item.file.endsWith("/");
          const isSelected = selectedFile === item.file;
          return (
            <button key={item.file} type="button" onClick={() => { if (isFolder) onToggleFolder(item.file); onSelect(item.file, isFolder); }}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs transition-all ${isSelected ? "bg-[#ede9fe]/60 font-semibold text-[#6d46eb]" : "text-slate-600 hover:bg-slate-50"}`}
              style={{ paddingLeft: `${12 + item.depth * 16}px` }}>
              <MaterialIcon name={isFolder ? (isSelected || expandedFolders.has(item.file) ? "folder_open" : "folder") : isSelected ? "insert_drive_file" : "description"} size="sm" className={isSelected ? "text-[#6d46eb]" : "text-slate-400"} />
              <span className="truncate">{item.file.endsWith("/") ? item.file.slice(0, -1) : item.file}</span>
              {!isFolder && <span className="ml-auto shrink-0 text-[9px] text-slate-300">FILE</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
