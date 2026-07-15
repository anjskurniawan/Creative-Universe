"use client";

import { useState } from "react";
import { HeroHeading } from "@/design-system/atoms/typography/hero-heading";
import { PrimaryActionLink } from "@/design-system/atoms/actions/primary-action-link";

export function GuestLandingDocumentation() {
  const [typing, setTyping] = useState(true);
  const [align, setAlign] = useState<"left" | "center">("center");

  return (
    <article className="space-y-8">
      <header><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cu-muted">Design System / Atoms</p><h1 className="mt-2 text-3xl font-bold text-cu-ink">Guest Landing</h1><p className="mt-3 text-sm leading-6 text-cu-muted">Live documentation for the reusable HeroHeading and PrimaryActionLink atoms.</p></header>
      <section className="rounded-2xl border border-cu-line bg-cu-surface p-5"><h2 className="text-lg font-semibold text-cu-ink">Control panel</h2><div className="mt-4 flex flex-wrap gap-5"><label className="flex items-center gap-2 text-sm text-cu-ink"><input type="checkbox" checked={typing} onChange={(event) => setTyping(event.target.checked)} />Typing animation</label><label className="flex items-center gap-2 text-sm text-cu-ink">Alignment<select value={align} onChange={(event) => setAlign(event.target.value as typeof align)} className="h-9 rounded-lg border border-cu-line bg-white px-3"><option value="center">Center</option><option value="left">Left</option></select></label></div></section>
      <section className="overflow-hidden rounded-2xl border border-cu-line bg-cu-surface"><div className="flex min-h-[420px] flex-col items-center justify-center gap-8 px-4 py-12 md:px-16"><HeroHeading key={`${typing}-${align}`} typing={typing} align={align} className="w-full max-w-6xl">This is Where Creative Begins</HeroHeading><PrimaryActionLink href="#primary-action-preview">Masuk ke Universe</PrimaryActionLink></div></section>
      <ComponentContract name="HeroHeading" level="Atom / Typography" props="children, align, className, typing, typingSpeed" />
      <ComponentContract name="PrimaryActionLink" level="Atom / Action" props="href, children, className" />
    </article>
  );
}

function ComponentContract({ name, level, props }: { name: string; level: string; props: string }) {
  return <section className="rounded-2xl border border-cu-line p-5"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-semibold text-cu-ink">{name}</h2><span className="rounded-full bg-cu-panel-soft px-2.5 py-1 text-xs text-cu-muted">{level}</span></div><p className="mt-3 text-sm text-cu-muted"><strong>Public props:</strong> <code>{props}</code></p></section>;
}
