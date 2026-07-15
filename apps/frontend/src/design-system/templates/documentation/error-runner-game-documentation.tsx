"use client";

import { ErrorRunnerGame } from "@/design-system/organisms/feedback/error-runner-game";

export function ErrorRunnerGameDocumentation() {
  return <article className="space-y-8"><header><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cu-muted">Design System / Organism / Feedback</p><h1 className="mt-2 text-3xl font-bold text-cu-ink">Error Runner Game</h1><p className="mt-3 text-sm leading-6 text-cu-muted">Permainan ringan universal untuk menjaga halaman error tetap berguna dan menarik.</p></header><section className="rounded-2xl bg-[#111217] p-4 text-white md:p-8"><ErrorRunnerGame /></section><section className="rounded-2xl border border-cu-line p-5"><h2 className="text-lg font-semibold text-cu-ink">Interaction contract</h2><p className="mt-3 text-sm text-cu-muted">Klik area permainan, tekan <code>Space</code>, atau <code>Arrow Up</code> untuk melompat. Tabrakan mengubah status menjadi game over dan interaksi berikutnya memulai ulang permainan.</p></section></article>;
}
