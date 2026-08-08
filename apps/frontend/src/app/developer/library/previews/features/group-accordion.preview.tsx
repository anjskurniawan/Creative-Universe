"use client";
import { useState } from "react";
import { GroupAccordion } from "@/components/creative-report/group-accordion";
import { PreviewWrapper } from "../preview-wrapper";
export function GroupAccordionPreview() { const [open, setOpen] = useState(true); return <PreviewWrapper width="lg"><GroupAccordion group={{ id: 1, name: "Creative Technology", staff_count: 12 } as never} index={0} isOpen={open} onToggle={() => setOpen((value) => !value)}><div className="rounded-b-xl border border-t-0 border-[#c9bbfc] bg-white p-4 text-sm text-slate-600">Isi kelompok assessment.</div></GroupAccordion></PreviewWrapper>; }
