"use client";

import { useState } from "react";
import { DropdownMenu } from "@/components/ui/form/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthCardFooter } from "@/components/auth/auth-card-footer";
import { AuthCardHeader } from "@/components/auth/auth-card-header";

const frame = "contents";

export function DropdownMenuPreview() {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("");
  const items = [
    { value: "design", label: "Design" },
    { value: "development", label: "Development" },
    { value: "qa", label: "Quality Assurance" },
  ];
  return <div className={frame}><div className="relative w-72"><button type="button" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm" onClick={() => setOpen((value) => !value)}>{selected || "Pilih divisi"}</button><DropdownMenu isOpen={open} items={items} onSelect={(value) => { setSelected(value); setOpen(false); }} onClose={() => setOpen(false)} /></div></div>;
}

export function ModalPreview() {
  const [open, setOpen] = useState(false);
  return <div className={frame}><button type="button" className="rounded-xl bg-[#6d46eb] px-4 py-2 text-sm font-semibold text-white" onClick={() => setOpen(true)}>Buka Modal</button>{open && <Modal title="Contoh Modal" onClose={() => setOpen(false)} footer={<button type="button" onClick={() => setOpen(false)} className="rounded-lg bg-[#6d46eb] px-3 py-2 text-sm text-white">Tutup</button>}><p className="text-sm text-slate-600">Konten modal untuk preview component.</p></Modal>}</div>;
}

export function AuthCardPreview() {
  return <AuthCard title="Autentikasi" footerText="Butuh bantuan?" showCloseButton onHeaderButtonClick={() => {}}><div className="w-full space-y-3 p-6"><div className="h-10 rounded-lg bg-slate-100" /><div className="h-10 rounded-lg bg-slate-100" /></div></AuthCard>;
}

export function AuthCardHeaderPreview() {
  return <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white"><AuthCardHeader title="Autentikasi" showCloseButton buttonAriaLabel="Tutup preview" onButtonClick={() => {}} /></div>;
}

export function AuthCardFooterPreview() {
  return <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white"><AuthCardFooter text="Butuh bantuan? Buka Help Center" /></div>;
}
