"use client";

import { useState } from "react";
import { AccessDenied } from "@/components/ui/access-denied";
import { ButtonAction } from "@/components/ui/button-action";
import { ContentTitle } from "@/components/ui/content-title";
import { Logo } from "@/components/ui/logo";
import { PrimaryActionLink } from "@/components/ui/primary-action-link";
import { Button } from "@/components/ui/form/button";
import { Input } from "@/components/ui/form/input";

const frame = "contents";

export function AccessDeniedPreview() {
  return <div className={frame}><AccessDenied /></div>;
}

export function ButtonActionPreview() {
  return <div className={frame}><ButtonAction href="#">Lanjutkan</ButtonAction></div>;
}

export function ContentTitlePreview() {
  return <div className={frame}><ContentTitle title="Judul Konten" subtitle="Deskripsi singkat halaman." /></div>;
}

export function LogoPreview() {
  return <div className={frame}><Logo size={72} className="text-[#6d46eb]" /></div>;
}

export function PrimaryActionLinkPreview() {
  return <div className={frame}><PrimaryActionLink href="#">Mulai Sekarang</PrimaryActionLink></div>;
}

export function ButtonPreview() {
  return <div className="flex min-h-[200px] w-full items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-6"><div className="w-64"><Button>Submit</Button></div></div>;
}

export function InputPreview() {
  const [value, setValue] = useState("");
  return <div className={frame}><div className="w-72"><Input id="preview-input" label="Nama" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Masukkan nama" /></div></div>;
}
