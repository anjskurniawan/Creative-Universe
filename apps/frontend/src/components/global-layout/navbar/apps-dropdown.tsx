"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";
export type ApplicationItem = { key: string; display_name: string; href: string; icon: string };
export default function AppsDropdown({ isOpen, onClose, applications = [] }: { isOpen: boolean; onClose: () => void; applications?: ApplicationItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!isOpen) return; const close = (event: MouseEvent) => { if ((event.target as Element).closest("[data-dropdown-trigger]")) return; if (ref.current && !ref.current.contains(event.target as Node)) onClose(); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, [isOpen, onClose]);
  if (!isOpen) return null;
  return <div ref={ref} className="absolute right-0 top-[calc(100%+8px)] z-50 w-[280px] max-w-[calc(100vw-2rem)] rounded-xl border border-[#bdeaff] bg-[#f3fbff]/95 p-1.5 shadow-[0_10px_24px_rgba(0,4,117,0.18)] backdrop-blur-md"><ul role="menu" className="m-0 flex list-none flex-col gap-1 p-0">{applications.map((app) => <li key={app.key}><Link href={app.href} onClick={onClose} className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm text-[#04044a] transition-colors hover:bg-[#dff6ff]"><MaterialIcon name={app.icon} size="auto" className="text-lg" /><span className="truncate font-medium">{app.display_name}</span></Link></li>)}</ul></div>;
}
