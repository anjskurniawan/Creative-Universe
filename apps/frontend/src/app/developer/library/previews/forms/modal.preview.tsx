"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { PreviewWrapper } from "../preview-wrapper";
export function ModalPreview() { const [open, setOpen] = useState(false); return <PreviewWrapper width="sm"><button type="button" className="rounded-xl bg-[#6d46eb] px-4 py-2 text-sm font-semibold text-white" onClick={() => setOpen(true)}>Buka Modal</button>{open && <Modal title="Contoh Modal" onClose={() => setOpen(false)} footer={<button type="button" onClick={() => setOpen(false)} className="rounded-lg bg-[#6d46eb] px-3 py-2 text-sm text-white">Tutup</button>}><p className="text-sm text-slate-600">Konten modal untuk preview component.</p></Modal>}</PreviewWrapper>; }
