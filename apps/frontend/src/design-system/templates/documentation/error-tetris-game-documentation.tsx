"use client";

import { ErrorTetrisGame } from "@/design-system/organisms/feedback/error-tetris-game";

export function ErrorTetrisGameDocumentation() {
  return (
    <article className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cu-muted">Design System / Organism / Feedback</p>
        <h1 className="mt-2 text-3xl font-bold text-cu-ink">Error Tetris Game</h1>
        <p className="mt-3 text-sm leading-6 text-cu-muted">Tetris bergaya retro untuk menjaga halaman error tetap berguna dan menarik.</p>
      </header>
      <section className="rounded-2xl border border-black/10 bg-white p-4 md:p-8">
        <ErrorTetrisGame />
      </section>
      <section className="rounded-2xl border border-cu-line p-5">
        <h2 className="text-lg font-semibold text-cu-ink">Interaction contract</h2>
        <p className="mt-3 text-sm text-cu-muted">Gunakan tombol panah untuk bergerak, <code>Arrow Up</code> untuk memutar, dan <code>Space</code> untuk menjatuhkan balok. Kontrol sentuh tersedia untuk layar kecil.</p>
      </section>
    </article>
  );
}
