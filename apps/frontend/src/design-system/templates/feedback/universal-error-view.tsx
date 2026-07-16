"use client";

import Link from "next/link";
import { ErrorRunnerGame } from "@/design-system/organisms/feedback/error-runner-game";

interface UniversalErrorViewProps {
  onRetry?: () => void;
  embedded?: boolean;
  showHomeAction?: boolean;
}

export function UniversalErrorView({ onRetry, embedded = false, showHomeAction = true }: UniversalErrorViewProps) {
  return <main className={`flex flex-col items-center justify-center bg-white px-4 py-12 font-sans text-[#24252b] ${embedded ? "min-h-[640px] rounded-2xl border border-black/10" : "min-h-screen"}`}><div className="mb-8 text-center"><p className="text-sm font-medium uppercase tracking-[0.16em] text-[#ba0dcb]">Creative Universe</p><h1 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">Mon maap, masih dibenerin.</h1><p className="mt-2 text-lg text-[#6f7078]">Main game aja dulu :)</p></div><ErrorRunnerGame />{(onRetry || showHomeAction) && <div className="mt-6 flex items-center gap-3">{onRetry && <button type="button" onClick={onRetry} className="rounded-full bg-[#24252b] px-5 py-2.5 text-sm font-semibold text-white">Coba lagi</button>}{showHomeAction && <Link href="/" className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-[#24252b]">Kembali ke awal</Link>}</div>}</main>;
}
