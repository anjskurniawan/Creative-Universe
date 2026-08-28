"use client";

import Link from "next/link";
import { Suspense } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import { Toast } from "@/components/feedback/Toast/Toast";
import { useCreativeReportSummary } from "@/app/creative-report/summary/use-creative-report-summary";
import { ContentTitle } from "@/components/ui/ContentTitle/ContentTitle";
import { ScorePanel } from "@/app/creative-report/summary/_components/ScorePanel/ScorePanel";
import { SummaryProfile } from "@/app/creative-report/summary/_components/SummaryProfile/SummaryProfile";
import { SummaryPillars } from "@/app/creative-report/summary/_components/SummaryPillars/SummaryPillars";
import { HrdReviewCard } from "@/app/creative-report/summary/_components/HrdReviewCard/HrdReviewCard";
import { HrdRulesCard } from "@/app/creative-report/summary/_components/HrdRulesCard/HrdRulesCard";
import { EvaluationNotesCard } from "@/app/creative-report/summary/_components/EvaluationNotesCard/EvaluationNotesCard";

// --- SUB-KOMPONEN KONTEN UTAMA (MEMBACA QUERY PARAMS DENGAN SAFE SUSPENSE) ---
function CreativeReportDetailContent() {
  const {
    detail,
    error,
    setError,
    userId,
    selectedMonth,
    collabAspects,
    perfAspects,
    changeMonth,
    monthLabel,
  } = useCreativeReportSummary();

  // Tampilan halaman jika parameter salah atau terjadi error
  if (!userId || error) {
    return (
      <main className="min-h-screen bg-[#f6faff] p-8">
        <Link href="/creative-report" className="text-[#6d46eb]">
          ← Kembali ke report
        </Link>
        {error && <Toast message={error} status="error" onClose={() => setError(null)} />}
      </main>
    );
  }

  // Tampilan placeholder loading data
  if (!detail) {
    return (
      <main className="min-h-screen bg-[#f6faff] p-8 text-[#7b868a]">
        Memuat report individual...
      </main>
    );
  }

  const final = detail.totals.final;

  return (
    <main className="cu-style w-full">
      <div className="mx-auto max-w-[1400px]">
        {/* Tombol Navigasi Kembali */}
        <Link
          href="/creative-report"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#6d46eb]"
        >
          <MaterialIcon name="arrow_back" size="sm" />
          Kembali ke Creative Report
        </Link>

        {/* Bagian Judul Halaman dan Aksi */}
        <ContentTitle
          title="Creative Monthly Performance"
          subtitle="Laporan penilaian bulanan staff kreatif."
          className="mt-5"
          rightElement={
            <>
              {/* Pemilih Bulan Laporan */}
              <select
                value={selectedMonth ?? detail.period}
                onChange={(event) => changeMonth(event.target.value)}
                className="h-11 rounded-xl border border-[#e1e8eb] bg-white px-3 text-sm font-medium text-[#525e61] outline-none focus:ring-2 focus:ring-[#6d46eb] cursor-pointer"
                aria-label="Pilih bulan laporan"
              >
                {detail.available_months.map((month) => (
                  <option key={month} value={month}>
                    {new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(
                      new Date(`${month}-01T00:00:00`),
                    )}
                  </option>
                ))}
              </select>
              {/* Aksi Cetak Laporan */}
              <button
                type="button"
                onClick={() => window.print()}
                className="flex h-11 items-center gap-2 rounded-xl bg-[#6d46eb] px-4 text-sm font-semibold text-white cursor-pointer"
              >
                <MaterialIcon name="picture_as_pdf" size="sm" />
                Export PDF
              </button>
            </>
          }
        />

        {/* Bagian Ringkasan Profil & Status Skor Akhir */}
        <SummaryProfile
          user={detail.user}
          group={detail.group}
          monthLabel={monthLabel}
          final={final}
        />

        {/* Bagian Ringkasan 4 Pilar Nilai */}
        <SummaryPillars
          score30={detail.totals.score_30}
          score50={detail.totals.score_50}
          hrdScore={detail.hrd_review.score}
          finalScore={final}
        />

        {/* Detail Rincian Skor Tiap Kategori */}
        <section className="mt-5 grid gap-4 lg:grid-cols-3">
          {/* Panel Rincian Collaborative Review */}
          <ScorePanel
            title="A. Collaborative Review (30%)"
            color="text-[#6d46eb]"
            labels={collabAspects.map((a) => a.name)}
            scores={detail.creative_scores.slice(0, 5)}
            maxima={collabAspects.map((a) => a.maxPoints)}
            total={detail.totals.score_30}
          />

          {/* Panel Rincian Performance Review */}
          <ScorePanel
            title="B. Performance Review (50%)"
            color="text-[#f18728]"
            labels={perfAspects.map((a) => a.name)}
            scores={detail.creative_scores.slice(5)}
            maxima={perfAspects.map((a) => a.maxPoints)}
            total={detail.totals.score_50}
          />

          {/* Panel Rekap Data Presensi HRD */}
          <HrdReviewCard
            leave={detail.hrd_review.leave}
            appPermission={detail.hrd_review.app_permission}
            absence={detail.hrd_review.absence}
            late={detail.hrd_review.late}
            score={detail.hrd_review.score}
          />
        </section>

        {/* Bagian Keterangan Aturan Pengurangan HRD & Catatan Evaluasi */}
        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          {/* Aturan Pengurangan Nilai Presensi HRD */}
          <HrdRulesCard />

          {/* Kotak Catatan Penutup */}
          <EvaluationNotesCard monthLabel={monthLabel} />
        </section>
      </div>
    </main>
  );
}

// --- ROOT PAGE DENGAN SUSPENSE LAYOUT ---
export default function CreativeReportDetailPage() {
  return (
    <Suspense
      fallback={<main className="w-full p-8 text-[#7b868a]">Memuat report individual...</main>}
    >
      <CreativeReportDetailContent />
    </Suspense>
  );
}
