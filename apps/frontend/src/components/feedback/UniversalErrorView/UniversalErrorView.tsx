"use client";

import Link from "next/link";
import { ErrorTetrisGame } from "@/components/feedback/ErrorTetrisGame";

interface UniversalErrorViewProps {
  onRetry?: () => void;
  embedded?: boolean;
  showHomeAction?: boolean;
  errorKind?: ErrorKind;
}

export type ErrorKind =
  "runtime" | "global" | "not-found" | "forbidden" | "session" | "maintenance";

const ERROR_COPY: Record<ErrorKind, { title: string; description: string }> = {
  runtime: {
    title: "Terjadi Kesalahan",
    description: "Halaman ini mengalami kendala yang tidak terduga.",
  },
  global: {
    title: "Kesalahan Sistem",
    description: "Aplikasi mengalami kesalahan sistem dan perlu dimuat ulang.",
  },
  "not-found": {
    title: "Halaman Tidak Ditemukan",
    description:
      "Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.",
  },
  forbidden: {
    title: "Akses Ditolak (403)",
    description:
      "Anda tidak memiliki izin untuk mengakses halaman atau aplikasi ini.",
  },
  session: {
    title: "Sesi Tidak Tersedia",
    description: "Sesi pengguna tidak dapat diverifikasi. Silakan coba lagi.",
  },
  maintenance: {
    title: "Sistem Dalam Pemeliharaan",
    description: "Aplikasi sedang dalam pemeliharaan. Silakan coba lagi nanti.",
  },
};

export function UniversalErrorView({
  onRetry,
  embedded = false,
  showHomeAction = true,
  errorKind = "runtime",
}: UniversalErrorViewProps) {
  const copy = ERROR_COPY[errorKind];

  return (
    <main
      className={`flex flex-col items-center justify-center bg-white px-4 py-12 font-sans text-[#24252b] ${embedded ? "min-h-[640px] rounded-2xl border border-black/10" : "min-h-screen"}`}
    >
      <div className="mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#ba0dcb]">
          Creative Universe
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-2 text-lg text-[#6f7078]">{copy.description}</p>
        <p className="mt-1 text-sm text-[#8a8d96]">Main Tetris aja dulu :)</p>
      </div>
      <ErrorTetrisGame />
      {(onRetry || showHomeAction) && (
        <div className="mt-8 flex items-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-full bg-[#24252b] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Coba lagi
            </button>
          )}
          {showHomeAction && (
            <Link
              href="/"
              className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-[#24252b]"
            >
              Kembali ke awal
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
