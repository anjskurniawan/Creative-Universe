"use client";

import { UniversalErrorView } from "@/design-system/templates/feedback/universal-error-view";

export function UniversalErrorViewDocumentation() {
  return <article className="space-y-8"><header><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cu-muted">Design System / Template / Feedback</p><h1 className="mt-2 text-3xl font-bold text-cu-ink">Universal Error View</h1><p className="mt-3 text-sm leading-6 text-cu-muted">Template error milik Core yang digunakan bersama oleh runtime error, root error, dan halaman 404.</p></header><UniversalErrorView embedded onRetry={() => undefined} /><section className="rounded-2xl border border-cu-line p-5"><h2 className="text-lg font-semibold text-cu-ink">Public contract</h2><p className="mt-3 text-sm text-cu-muted"><code>onRetry?, embedded?</code></p><p className="mt-2 text-sm text-cu-muted"><code>embedded</code> hanya dipakai untuk preview dokumentasi. Halaman produksi selalu mengisi viewport.</p></section></article>;
}
