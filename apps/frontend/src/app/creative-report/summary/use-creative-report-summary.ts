import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { creativeReportApi } from "@/features/creative-report/api";
import type { CreativeReportUserDetail } from "@/features/creative-report/types";
import { useCreativeReportSettings } from "@/features/creative-report/settings";

export function useCreativeReportSummary() {
  const { settings } = useCreativeReportSettings();
  const collabAspects = useMemo(() => settings.collabAspects, [settings.collabAspects]);
  const perfAspects = useMemo(() => settings.perfAspects, [settings.perfAspects]);

  const router = useRouter();
  const searchParams = useSearchParams();

  // State data laporan, error, dan query params
  const [detail, setDetail] = useState<CreativeReportUserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const userId = searchParams.get("user");
  const selectedMonth = searchParams.get("month") ?? undefined;

  // --- EFEK PEMUATAN DATA ASSESSMENT INDIVIDUAL ---
  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();
    void creativeReportApi.userDetail(userId, selectedMonth, { signal: controller.signal })
      .then((result) => {
        setDetail(result);
        setError(null);
        // Jika parameter month kosong, set default ke periode terisi pertama
        if (!selectedMonth) {
          const query = new URLSearchParams(searchParams.toString());
          query.set("month", result.period);
          router.replace(`/creative-report/summary?${query}`, { scroll: false });
        }
      })
      .catch((cause) => {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : "Gagal memuat report.");
        }
      });
    return () => controller.abort();
  }, [router, searchParams, selectedMonth, userId]);

  // Handler interaksi ganti bulan laporan
  const changeMonth = (month: string) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set("month", month);
    router.replace(`/creative-report/summary?${query}`, { scroll: false });
  };

  // Label bulan berformat Bahasa Indonesia (contoh: Januari 2026)
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

  return {
    detail,
    error,
    setError,
    userId,
    selectedMonth,
    collabAspects,
    perfAspects,
    changeMonth,
    monthLabel,
  };
}
