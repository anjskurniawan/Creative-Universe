"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/material-icon";
import { creativeReportApi } from "@/features/creative-report/api";
import type { CreativeReportUserDetail } from "@/features/creative-report/types";

const collaboration = [
  "Komunikasi Aktif",
  "Dapat Diandalkan",
  "Inisiatif Tim",
  "Pemahaman Brief",
  "Skill & Powerful",
];
const performance = [
  "Timeline On Time",
  "Hasil Rapi",
  "Responsif Revisi",
  "Cepat Tanggap",
  "Todo & Report",
];

function ScorePanel({
  title,
  color,
  labels,
  scores,
  maximum,
  total,
}: {
  title: string;
  color: string;
  labels: string[];
  scores: number[];
  maximum: number;
  total: number;
}) {
  return (
    <section className="rounded-2xl border border-[#e8edf0] bg-white p-5 shadow-sm">
      <h2 className={`font-semibold ${color}`}>{title}</h2>
      <div className="mt-4 space-y-3">
        {labels.map((label, i) => (
          <div
            key={label}
            className="grid grid-cols-[1fr_120px_44px] items-center gap-3 text-xs"
          >
            <span className="text-[#525e61]">{label}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-[#edf0f3]">
              <span
                className="block h-full rounded-full bg-current"
                style={{ width: `${(scores[i] / maximum) * 100}%` }}
              />
            </span>
            <b className="text-right">
              {scores[i]}/{maximum}
            </b>
          </div>
        ))}
      </div>
      <div
        className={`mt-5 flex justify-between rounded-xl bg-current/10 px-4 py-3 font-semibold ${color}`}
      >
        <span>Σ Nilai</span>
        <span>
          {total}/ {maximum * 5}
        </span>
      </div>
    </section>
  );
}

function CreativeReportDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [detail, setDetail] = useState<CreativeReportUserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const userId = searchParams.get("user");
  const selectedMonth = searchParams.get("month") ?? undefined;

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();
    void creativeReportApi.userDetail(userId, selectedMonth, { signal: controller.signal })
      .then((result) => {
        setDetail(result);
        setError(null);
        if (!selectedMonth) {
          const query = new URLSearchParams(searchParams.toString());
          query.set("month", result.period);
          router.replace(`/creative-report/detail?${query}`, { scroll: false });
        }
      })
      .catch((cause) => {
        if (!controller.signal.aborted) setError(
          cause instanceof Error ? cause.message : "Gagal memuat report.",
        );
      });
    return () => controller.abort();
  }, [router, searchParams, selectedMonth, userId]);
  const changeMonth = (month: string) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set("month", month);
    router.replace(`/creative-report/detail?${query}`, { scroll: false });
  };
  const monthLabel = useMemo(
    () =>
      detail
        ? new Intl.DateTimeFormat("id-ID", {
            month: "long",
            year: "numeric",
          }).format(new Date(`${detail.period}-01T00:00:00`))
        : "",
    [detail],
  );
  if (!userId || error)
    return (
      <main className="min-h-screen bg-[#f6faff] p-8">
        <Link href="/creative-report" className="text-[#6d46eb]">
          ← Kembali ke report
        </Link>
        <p className="mt-6 rounded-xl bg-[#ffedf1] p-4 text-[#b4234d]">
          {error ?? "Assessment tidak ditemukan."}
        </p>
      </main>
    );
  if (!detail)
    return (
      <main className="min-h-screen bg-[#f6faff] p-8 text-[#7b868a]">
        Memuat report individual...
      </main>
    );
  const final = detail.totals.final;
  return (
    <main className="min-h-screen bg-[#f6faff] px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <Link
          href="/creative-report"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#6d46eb]"
        >
          <MaterialIcon name="arrow_back" size="sm" />
          Kembali ke Creative Report
        </Link>
        <header className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#222] sm:text-4xl">
              Creative Monthly Performance
            </h1>
            <p className="mt-2 text-sm text-[#7b868a]">
              Laporan penilaian bulanan staff kreatif.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedMonth ?? detail.period}
              onChange={(event) => changeMonth(event.target.value)}
              className="h-11 rounded-xl border border-[#e1e8eb] bg-white px-3 text-sm font-medium text-[#525e61] outline-none focus:ring-2 focus:ring-[#6d46eb]"
              aria-label="Pilih bulan laporan"
            >
              {detail.available_months.map((month) => (
                <option key={month} value={month}>
                  {new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date(`${month}-01T00:00:00`))}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex h-11 items-center gap-2 rounded-xl bg-[#6d46eb] px-4 text-sm font-semibold text-white"
            >
              <MaterialIcon name="picture_as_pdf" size="sm" />
              Export PDF
            </button>
          </div>
        </header>
        <section className="mt-6 grid gap-6 rounded-2xl border border-[#e8edf0] bg-white p-6 shadow-sm lg:grid-cols-[1fr_auto]">
          <div className="flex items-center gap-5">
            <span className="flex size-24 items-center justify-center rounded-full bg-[#ede9fe] text-3xl font-bold text-[#6d46eb]">
              {detail.user.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div>
              <h2 className="text-2xl font-semibold text-[#222]">
                {detail.user.name}
              </h2>
              <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-[#525e61]">
                <div>
                  <dt className="text-xs text-[#7b868a]">Jabatan</dt>
                  <dd>{detail.user.position ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#7b868a]">Divisi</dt>
                  <dd>{detail.group.name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#7b868a]">Periode</dt>
                  <dd>{monthLabel}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex size-32 flex-col items-center justify-center rounded-full border-8 border-[#6d46eb] text-center">
              <b className="text-4xl text-[#222]">{final}</b>
              <span className="text-sm text-[#7b868a]">/ 100</span>
            </div>
            <span className="rounded-xl bg-[#edf9ee] px-4 py-3 text-sm font-semibold text-[#248235]">
              {final >= 85
                ? "Excellent"
                : final >= 70
                  ? "Good"
                  : "Needs Review"}
            </span>
          </div>
        </section>
        <section className="mt-5 grid gap-4 md:grid-cols-4">
          {[
            [
              "Collaborative Review",
              detail.totals.score_30,
              30,
              "text-[#6d46eb]",
            ],
            [
              "Performance Review",
              detail.totals.score_50,
              50,
              "text-[#f18728]",
            ],
            ["HRD Review", detail.hrd_review.score, 20, "text-[#248235]"],
            ["Final Score", final, 100, "text-[#6d46eb]"],
          ].map(([label, value, max, color]) => (
            <article
              key={String(label)}
              className={`rounded-2xl border border-[#e8edf0] bg-white p-5 ${color}`}
            >
              <p className="text-sm font-semibold">{label}</p>
              <p className="mt-2 text-3xl font-bold">
                {value} <span className="text-lg">/ {max}</span>
              </p>
              <span
                className="mt-4 block h-1.5 rounded-full bg-current"
                style={{ width: `${(Number(value) / Number(max)) * 100}%` }}
              />
            </article>
          ))}
        </section>
        <section className="mt-5 grid gap-4 lg:grid-cols-3">
          <ScorePanel
            title="A. Collaborative Review (30%)"
            color="text-[#6d46eb]"
            labels={collaboration}
            scores={detail.creative_scores.slice(0, 5)}
            maximum={6}
            total={detail.totals.score_30}
          />
          <ScorePanel
            title="B. Performance Review (50%)"
            color="text-[#f18728]"
            labels={performance}
            scores={detail.creative_scores.slice(5)}
            maximum={10}
            total={detail.totals.score_50}
          />
          <section className="rounded-2xl border border-[#e8edf0] bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-[#248235]">
              C. HRD Review (20%)
            </h2>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                ["Cuti", detail.hrd_review.leave],
                ["Bolos", detail.hrd_review.absence],
                ["Telat", detail.hrd_review.late],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="rounded-xl bg-[#eefaf0] p-3 text-center text-[#248235]"
                >
                  <p className="text-xs">{label}</p>
                  <b className="mt-1 block text-2xl">{value}</b>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-between rounded-xl bg-[#eefaf0] px-4 py-3 font-semibold text-[#248235]">
              <span>Σ Nilai</span>
              <span>{detail.hrd_review.score}/20</span>
            </div>
          </section>
        </section>
        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-[#e8edf0] bg-white p-5">
            <h2 className="font-semibold text-[#6d46eb]">
              Aturan Pengurangan HRD Review
            </h2>
            <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
              <span>
                Cuti
                <br />
                <b>0</b>
              </span>
              <span>
                Bolos 1×
                <br />
                <b>-3</b>
              </span>
              <span>
                Bolos ≥2×
                <br />
                <b>-5</b>
              </span>
              <span>
                Telat 1×
                <br />
                <b>-1</b>
              </span>
              <span>
                Telat ≥2×
                <br />
                <b>-2</b>
              </span>
            </div>
          </article>
          <article className="rounded-2xl border border-[#e8edf0] bg-white p-5">
            <h2 className="font-semibold text-[#6d46eb]">Catatan Evaluasi</h2>
            <p className="mt-4 text-sm leading-6 text-[#525e61]">
              Report individual ini merangkum collaborative review, performance
              review, dan HRD review pada periode {monthLabel}.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}

export default function CreativeReportDetailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f6faff] p-8 text-[#7b868a]">Memuat report individual...</main>}>
      <CreativeReportDetailContent />
    </Suspense>
  );
}
