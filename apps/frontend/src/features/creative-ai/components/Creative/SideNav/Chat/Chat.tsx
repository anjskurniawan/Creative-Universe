"use client";

import { useState } from "react";
import { Header } from "./Header";
import { ChatRow } from "./ChatRow";
import { ViewAllLink } from "./ViewAllLink";
import type { ChatProps, ChatItem } from "./Chat.types";

export function Chat({
  items,
  isExpanded = true,
  isOpen: controlledIsOpen,
  onToggleOpen,
  onViewAll,
  viewAllHref = "/creative-ai/history",
  activeHref,
  className = "",
}: ChatProps) {
  // Status buka/tutup seksi riwayat obrolan (default: expand / true)
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const isOpen = controlledIsOpen ?? internalIsOpen;

  const handleToggle = () => {
    if (onToggleOpen) {
      onToggleOpen();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Riwayat Percakapan"
      className={`flex flex-col w-full ${isExpanded ? "gap-1" : "gap-1 items-center"} ${className}`.trim()}
    >
      {/* Header Judul Seksi Riwayat (Di mode collapsed menampilkan icon Chat) */}
      <Header isOpen={isOpen} isExpanded={isExpanded} onToggle={handleToggle} />

      {/* List Item Riwayat Diskusi (Hanya tampil saat sidebar expanded dan seksi terbuka) */}
      {isExpanded && isOpen && (
        <>
          {items.map((item: ChatItem) => {
            const isActive =
              item.isActive !== undefined
                ? item.isActive
                : Boolean(
                    item.href &&
                    activeHref &&
                    item.href !== "#" &&
                    (activeHref === item.href || activeHref.startsWith(`${item.href}/`))
                  );

            return (
              <ChatRow
                key={item.id}
                item={item}
                isExpanded={isExpanded}
                isActive={isActive}
              />
            );
          })}

          {/* Tombol "Lihat Semua" di bagian paling bawah item (Hanya mode expanded) */}
          {isExpanded && (
            <ViewAllLink href={viewAllHref} onPress={onViewAll} />
          )}
        </>
      )}
    </nav>
  );
}
