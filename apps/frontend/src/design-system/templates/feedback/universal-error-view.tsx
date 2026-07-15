"use client";

import Link from "next/link";
import { ErrorRunnerGame } from "@/design-system/organisms/feedback/error-runner-game";

interface UniversalErrorViewProps {
  onRetry?: () => void;
  embedded?: boolean;
  showHomeAction?: boolean;
}

export function UniversalErrorView({ onRetry, embedded = false, showHomeAction = true }: UniversalErrorViewProps) {
  return <main className={`flex flex-col items-center justify-center bg-[#111217] px-4 py-12 font-sans text-white ${embedded ? "min-h-[640px] rounded-2xl" : "min-h-screen"}`}><div className="mb-8 text-center"><p className="text-sm font-medium uppercase tracking-[0.16em] text-[#d78be0]">Creative Universe</p><h1 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">Mon maap, masih dibenerin.</h1><p className="mt-2 text-lg text-white/65">Main game aja dulu :)</p></div><ErrorRunnerGame />{(onRetry || showHomeAction) && <div className="mt-6 flex items-center gap-3">{onRetry && <button type="button" onClick={onRetry} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#111217]">Coba lagi</button>}{showHomeAction && <Link href="/" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white">Kembali ke awal</Link>}</div>}</main>;
}
