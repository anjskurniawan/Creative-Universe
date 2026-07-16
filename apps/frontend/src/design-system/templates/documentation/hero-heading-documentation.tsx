"use client";

import { useState } from "react";
import { HeroHeading } from "@/design-system/atoms/typography/hero-heading";

export function HeroHeadingDocumentation() {
  const [typing, setTyping] = useState(true);
  const [align, setAlign] = useState<"left" | "center">("center");

  return <article className="space-y-8"><header><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cu-muted">Design System / Atom / Typography</p><h1 className="mt-2 text-3xl font-bold text-cu-ink">Hero Heading</h1><p className="mt-3 text-sm leading-6 text-cu-muted">Reusable primary heading for hero sections with optional typing animation.</p></header><section className="rounded-2xl border border-cu-line bg-cu-surface p-5"><div className="flex flex-wrap gap-5"><label className="flex items-center gap-2 text-sm text-cu-ink"><input type="checkbox" checked={typing} onChange={(event) => setTyping(event.target.checked)} />Typing animation</label><label className="flex items-center gap-2 text-sm text-cu-ink">Alignment<select value={align} onChange={(event) => setAlign(event.target.value as typeof align)} className="h-9 rounded-lg border border-cu-line bg-white px-3"><option value="center">Center</option><option value="left">Left</option></select></label></div></section><section className="flex min-h-[360px] items-center rounded-2xl border border-cu-line bg-cu-surface px-4 py-12 md:px-16"><HeroHeading key={`${typing}-${align}`} typing={typing} align={align} className="w-full">This is Where Creative Begins</HeroHeading></section><Contract /></article>;
}

function Contract() { return <section className="rounded-2xl border border-cu-line p-5"><h2 className="text-lg font-semibold text-cu-ink">Public contract</h2><p className="mt-3 text-sm text-cu-muted"><code>children, align, className, typing, typingSpeed, typingDelay</code></p><p className="mt-2 text-sm text-cu-muted">Responsive scale: 48px mobile, 72px tablet, 96px desktop. Cursor memakai posisi absolut sehingga tidak memengaruhi lebar atau wrapping teks.</p></section>; }
