"use client";

import React, { useCallback, useEffect, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { apiFetch } from "@/lib/api";
import { getEchoClient } from "@/lib/echo";
import { pushLocalNotification } from "@/lib/local-notifications";
import {
  formatRupiah,
  pricetagError,
  PricetagBatch,
  PricetagPage,
} from "@/lib/pricetag";
import { useAuth } from "@/providers/auth-provider";

export default function PricetagHistoryPage() {
  const { user } = useAuth();

  // State
  const [batches, setBatches] = useState<PricetagBatch[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  // Detail Modal State
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [detailBatch, setDetailBatch] = useState<PricetagBatch | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [expandedModalItemId, setExpandedModalItemId] = useState<number | null>(null);

  // Sync mobile viewport state
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const syncViewport = () => {
      setIsMobile(mediaQuery.matches);
      setPage(1); // Reset page on resize to prevent empty page states
    };
    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);
    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  const notify = useCallback((message: string) => {
    pushLocalNotification(message, "/pricetag/history", user?.id);
  }, [user]);

  const loadBatchDetail = useCallback(async (id: number, silent = false) => {
    if (!silent) setIsLoadingDetail(true);
    try {
      const res = await apiFetch<PricetagBatch>(`/pricetag/batches/${id}`);
      setDetailBatch(res);
    } catch (err) {
      if (!silent) notify(pricetagError(err));
      setSelectedBatchId(null);
    } finally {
      if (!silent) setIsLoadingDetail(false);
    }
  }, [notify]);

  // ----------------------------------------------------
  // Load History Batches
  // ----------------------------------------------------
  const loadBatches = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);

    try {
      const limit = isMobile ? 5 : 10;
      const res = await apiFetch<PricetagPage<PricetagBatch>>(
        `/pricetag/batches?page=${page}&per_page=${limit}`
      );
      setBatches(res.data);
      setLastPage(res.meta.last_page);
      setTotal(res.meta.total);
    } catch (err) {
      if (!silent) notify(pricetagError(err));
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [page, isMobile, notify]);

  useEffect(() => {
    queueMicrotask(() => void loadBatches());
  }, [loadBatches]);

  // ----------------------------------------------------
  // Real-time Updates via Laravel Echo
  // ----------------------------------------------------
  useEffect(() => {
    const echo = getEchoClient();
    if (!echo) return;

    // Filter pending or processing batches to listen
    const activeBatches = batches.filter(
      (b) => b.status === "pending" || b.status === "processing"
    );
    if (activeBatches.length === 0) return;

    activeBatches.forEach((batch) => {
      const channelName = `pricetag-batch.${batch.id}`;
      echo.private(channelName).listen(".pricetag.updated", () => {
        // Trigger silent refresh
        loadBatches(true);
        // If modal is open for this batch, reload detail too
        if (selectedBatchId === batch.id) {
          loadBatchDetail(batch.id, true);
        }
      });
    });

    return () => {
      activeBatches.forEach((batch) => {
        echo.leave(`pricetag-batch.${batch.id}`);
      });
    };
  }, [batches, loadBatches, selectedBatchId, loadBatchDetail]);

  // ----------------------------------------------------
  // Polling Fallback (5 seconds)
  // ----------------------------------------------------
  useEffect(() => {
    const hasActive = batches.some(
      (b) => b.status === "pending" || b.status === "processing"
    );
    if (!hasActive) return;

    const interval = setInterval(() => {
      loadBatches(true); // Silent refresh
      if (selectedBatchId) {
        const currentSelectedBatch = batches.find((b) => b.id === selectedBatchId);
        if (currentSelectedBatch && (currentSelectedBatch.status === "pending" || currentSelectedBatch.status === "processing")) {
          loadBatchDetail(selectedBatchId, true);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [batches, loadBatches, selectedBatchId, loadBatchDetail]);

  const openDetail = (id: number) => {
    setSelectedBatchId(id);
    setDetailBatch(null);
    setExpandedModalItemId(null);
    loadBatchDetail(id);
  };

  const closeDetail = () => {
    setSelectedBatchId(null);
    setDetailBatch(null);
    setExpandedModalItemId(null);
  };

  return (
    <div className="space-y-5 md:space-y-6">
      <header className="hidden flex-col gap-4 sm:flex sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cu-muted">Pricetag Generate</p>
          <h1 className="mt-1 text-2xl font-semibold text-cu-ink">Riwayat pengguna</h1>
          <p className="mt-1 text-sm text-cu-muted">
            Total {total} antrean pembuatan label ditemukan di sistem.
          </p>
        </div>
      </header>
      {isLoading ? (
        <Loading />
      ) : batches.length === 0 ? (
        <Empty />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border border-cu-line bg-cu-surface shadow-sm">
            <table className="min-w-[800px] w-full text-sm text-left">
              <thead className="bg-cu-panel-soft text-xs uppercase font-bold tracking-wider text-cu-muted">
                <tr>
                  <th className="px-4 py-3">Produk/Batch</th>
                  <th className="px-4 py-3">Jumlah Item</th>
                  <th className="px-4 py-3 w-48">Progress</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Tanggal Dibuat</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cu-line">
                {batches.map((batch) => {
                  const percent = batch.total_items > 0 ? Math.round((batch.processed_items / batch.total_items) * 100) : 0;
                  const showZip = batch.status === "completed" || (batch.status === "processing" && batch.processed_items > 0);

                  return (
                    <tr key={batch.id} className="hover:bg-cu-surface-soft transition">
                      <td className="px-4 py-3 font-semibold text-cu-ink">{batch.batch_name}</td>
                      <td className="px-4 py-3 text-cu-muted font-semibold">{batch.total_items} produk</td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-cu-muted">
                            <span>{batch.processed_items} / {batch.total_items} selesai</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-cu-line overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                batch.status === "failed" ? "bg-cu-danger" : "bg-cu-ink"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold inline-flex items-center gap-1 ${
                            batch.status === "completed"
                              ? "bg-cu-success-soft text-cu-success"
                              : batch.status === "failed"
                              ? "bg-cu-danger-soft text-cu-danger"
                              : batch.status === "processing"
                              ? "bg-cu-primary-soft text-cu-primary animate-pulse"
                              : "bg-cu-panel-soft text-cu-muted"
                          }`}
                        >
                          {batch.status === "processing" && (
                            <div className="size-1.5 animate-spin rounded-full border border-cu-primary border-t-transparent" />
                          )}
                          {batch.status === "completed" && "Selesai"}
                          {batch.status === "failed" && "Gagal"}
                          {batch.status === "processing" && "Memproses"}
                          {batch.status === "pending" && "Mengantre"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-cu-muted">
                        {new Date(batch.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {showZip ? (
                            <a
                              href={`/api/v1/pricetag/batches/${batch.id}/download`}
                              download
                              className="inline-flex size-8 items-center justify-center rounded-lg border border-cu-line bg-cu-surface text-cu-ink hover:bg-cu-panel-soft"
                              title="Unduh semua ZIP"
                            >
                              <MaterialIcon name="download" size="xs" />
                            </a>
                          ) : (
                            <span
                              className="inline-flex size-8 items-center justify-center rounded-lg border border-cu-line bg-cu-panel-soft text-cu-soft cursor-not-allowed"
                              title="Belum diproses / tidak ada item sukses"
                            >
                              <MaterialIcon name="download" size="xs" />
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => openDetail(batch.id)}
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-cu-line bg-cu-surface text-cu-ink hover:bg-cu-panel-soft"
                            title="Lihat detail item"
                          >
                            <MaterialIcon name="visibility" size="xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="block space-y-2 rounded-[36px] bg-white p-4 sm:hidden">
            {batches.map((batch) => {
              const percent = batch.total_items > 0 ? Math.round((batch.processed_items / batch.total_items) * 100) : 0;
              const showZip = batch.status === "completed" || (batch.status === "processing" && batch.processed_items > 0);
              const isExpanded = expandedCardId === batch.id;

              return (
                <div
                  key={batch.id}
                  className={`space-y-3 rounded-[24px] border p-4 text-[#2c2c2c] transition-all duration-200 ease-out ${
                    isExpanded
                      ? "border-[#2da3ff] bg-[#d8efff] ring-2 ring-[#2da3ff]/25"
                      : "border-[#c9c9c9] bg-white"
                  }`}
                >
                  {/* Collapsed State: Batch Name & Status + Date */}
                  <button
                    type="button"
                    onClick={() => setExpandedCardId(isExpanded ? null : batch.id)}
                    className="flex w-full cursor-pointer select-none items-center justify-between gap-2 rounded-[18px] text-left transition-all duration-200 ease-out focus:outline-none active:scale-[0.99]"
                    aria-expanded={isExpanded}
                  >
                    {/* Left: Batch Name */}
                    <div className="flex items-center min-w-0">
                      <span className="truncate text-[13px] font-semibold leading-tight text-[#2c2c2c]">{batch.batch_name}</span>
                    </div>

                    {/* Right: Status Indicator and Date (Stacked Sejajar) */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold inline-flex items-center gap-1 ${
                          batch.status === "completed"
                            ? "bg-cu-success-soft text-cu-success"
                            : batch.status === "failed"
                            ? "bg-cu-danger-soft text-cu-danger"
                            : batch.status === "processing"
                            ? "bg-cu-primary-soft text-cu-primary animate-pulse"
                            : "bg-cu-panel-soft text-cu-muted"
                        }`}
                      >
                        {batch.status === "processing" && (
                          <div className="size-1.5 animate-spin rounded-full border border-cu-primary border-t-transparent" />
                        )}
                        {batch.status === "completed" && "Selesai"}
                        {batch.status === "failed" && "Gagal"}
                        {batch.status === "processing" && "Memproses"}
                        {batch.status === "pending" && "Mengantre"}
                      </span>
                      <span className="text-[10px] text-cu-muted">
                        {new Date(batch.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </button>

                  {/* Expanded Detail State */}
                  {isExpanded && (
                    <div className="border-t border-cu-line pt-3 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2 text-cu-muted">
                        <div>
                          <p className="font-semibold text-cu-ink">ID kelompok</p>
                          <p>#{batch.id}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-cu-ink">Jumlah item</p>
                          <p>{batch.total_items} produk</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-cu-muted">
                          <span>{batch.processed_items} / {batch.total_items} selesai</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-cu-line overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              batch.status === "failed" ? "bg-cu-danger" : "bg-cu-ink"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-1">
                        {showZip ? (
                          <a
                            href={`/api/v1/pricetag/batches/${batch.id}/download`}
                            download
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-[14px] border border-[#2da3ff] bg-[#2da3ff] py-2 text-white shadow-sm transition-all duration-200 hover:bg-[#1476b8] hover:shadow-md active:scale-[0.98] font-semibold text-center"
                          >
                            <MaterialIcon name="download" size="xs" />
                            Unduh ZIP
                          </a>
                        ) : (
                          <span
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-cu-line bg-cu-panel-soft py-2 text-cu-soft cursor-not-allowed font-semibold text-center"
                            title="Belum diproses / tidak ada item sukses"
                          >
                            <MaterialIcon name="download" size="xs" />
                            Unduh ZIP
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => openDetail(batch.id)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-[14px] border border-[#c9c9c9] bg-white py-2 text-[#303431] shadow-sm transition-all duration-200 hover:border-[#2da3ff] hover:bg-[#2da3ff] hover:text-white hover:shadow-md active:scale-[0.98] font-semibold text-center"
                        >
                          <MaterialIcon name="visibility" size="xs" />
                          Lihat detail
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Pagination */}
      <Pagination page={page} lastPage={lastPage} onPage={setPage} />

      {/* Detail Modal */}
      {selectedBatchId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-cu-overlay/60 p-6 sm:p-4">
          <div role="dialog" aria-modal="true" className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] border border-[#c9c9c9] bg-white shadow-xl sm:rounded-2xl">
            <div className="flex min-h-[60px] items-center border-b border-[#E3E4E3] px-5">
              <div className="min-w-0">
                <h2 className="truncate text-[16px] font-bold leading-tight text-[#303431] sm:text-lg">
                  {isLoadingDetail ? "Memuat..." : detailBatch?.batch_name}
                </h2>
                {detailBatch && (
                  <p className="mt-1 text-[11px] font-medium leading-tight text-[#8a8a8a] sm:text-xs">
                    {new Date(detailBatch.created_at).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>

            {isLoadingDetail ? (
              <div className="py-12 text-center text-xs text-cu-muted flex-1 flex items-center justify-center">
                Memuat detail antrean item...
              </div>
            ) : detailBatch ? (
              <div className="flex-1 overflow-y-auto bg-[#f8f9fb] sm:border sm:border-cu-line sm:bg-white">
                {/* Desktop Modal Table View */}
                <table className="hidden sm:table min-w-[600px] w-full text-xs text-left">
                  <thead className="bg-cu-panel-soft uppercase font-bold text-cu-muted tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Produk / Varian</th>
                      <th className="px-4 py-3">Harga promo</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Detail Eror</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cu-line">
                    {detailBatch.items && detailBatch.items.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-cu-muted">Tidak ada item di batch ini.</td>
                      </tr>
                    ) : (
                      detailBatch.items?.map((item) => (
                        <tr key={item.id} className="hover:bg-cu-surface-soft transition">
                          <td className="px-4 py-3">
                            <span className="font-bold text-cu-ink">{item.product?.name || "Produk dihapus"}</span>
                            {item.product?.variant_name !== " " && (
                              <span className="block text-[10px] text-cu-muted mt-0.5">Varian: {item.product?.variant_name}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="block text-[10px] text-cu-muted line-through">{formatRupiah(item.product?.normal_price ?? 0)}</span>
                            <span className="font-semibold text-cu-success">{formatRupiah(item.product?.discount_price ?? 0)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                item.status === "success"
                                  ? "bg-cu-success-soft text-cu-success"
                                  : item.status === "failed"
                                  ? "bg-cu-danger-soft text-cu-danger"
                                  : "bg-cu-panel-soft text-cu-muted"
                              }`}
                            >
                              {item.status === "success" && "Sukses"}
                              {item.status === "failed" && "Gagal"}
                              {item.status === "pending" && "Mengantre"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-cu-danger whitespace-pre-wrap max-w-xs">
                            {item.error_message || "-"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              {item.status === "success" && item.product?.preview_url ? (
                                <a
                                  href={item.product.preview_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex size-7 items-center justify-center rounded-md border border-cu-line bg-cu-surface text-cu-ink hover:bg-cu-panel-soft"
                                  title="Lihat Gambar"
                                >
                                  <MaterialIcon name="visibility" size="xs" />
                                </a>
                              ) : (
                                <span className="inline-flex size-7 items-center justify-center rounded-md border border-cu-line bg-cu-panel-soft text-cu-soft cursor-not-allowed">
                                  <MaterialIcon name="visibility" size="xs" />
                                </span>
                              )}
                              {item.status === "success" && item.product?.download_url ? (
                                <a
                                  href={item.product.download_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex size-7 items-center justify-center rounded-md border border-cu-line bg-cu-surface text-cu-ink hover:bg-cu-panel-soft"
                                  title="Unduh Gambar"
                                >
                                  <MaterialIcon name="download" size="xs" />
                                </a>
                              ) : (
                                <span className="inline-flex size-7 items-center justify-center rounded-md border border-cu-line bg-cu-panel-soft text-cu-soft cursor-not-allowed">
                                  <MaterialIcon name="download" size="xs" />
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Mobile Modal Card List View */}
                <div className="block space-y-2 p-4 sm:hidden">
                  {detailBatch.items && detailBatch.items.length === 0 ? (
                    <div className="py-6 text-center text-xs text-cu-muted">Tidak ada item di batch ini.</div>
                  ) : (
                    detailBatch.items?.map((item) => {
                      const isItemExpanded = expandedModalItemId === item.id;
                      return (
                        <div key={item.id} className="overflow-hidden rounded-[20px] border border-[#d8d8d8] bg-white">
                          {/* Item Collapsed Header */}
                          <button
                            type="button"
                            onClick={() => setExpandedModalItemId(isItemExpanded ? null : item.id)}
                            className="flex min-h-[60px] w-full cursor-pointer select-none items-center justify-between gap-3 px-4 text-left transition active:scale-[0.99]"
                            aria-expanded={isItemExpanded}
                          >
                            <div className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-semibold leading-tight text-[#303431]">{item.product?.name || "Produk dihapus"}</span>
                              {item.product?.variant_name !== " " && (
                                <span className="mt-1 block truncate text-[10px] font-medium leading-tight text-[#8a8a8a]">Varian: {item.product?.variant_name}</span>
                              )}
                            </div>
                            <div className="grid shrink-0 grid-cols-[auto_auto] items-center gap-x-2 gap-y-1 text-right">
                              <span className="text-[9px] font-medium leading-none text-[#8a8a8a]">Status</span>
                              <span
                                className={`justify-self-end rounded-full px-2 py-0.5 text-[9px] font-semibold leading-none ${
                                  item.status === "success"
                                    ? "bg-cu-success-soft text-cu-success"
                                    : item.status === "failed"
                                    ? "bg-cu-danger-soft text-cu-danger"
                                    : "bg-cu-panel-soft text-cu-muted"
                                }`}
                              >
                                {item.status === "success" && "Sukses"}
                                {item.status === "failed" && "Gagal"}
                                {item.status === "pending" && "Mengantre"}
                              </span>
                              <span className="text-[9px] font-medium leading-none text-[#8a8a8a]">Normal</span>
                              <span className="text-[10px] font-medium leading-none text-[#8a8a8a] line-through">
                                {formatRupiah(item.product?.normal_price ?? 0)}
                              </span>
                              <span className="text-[9px] font-medium leading-none text-[#8a8a8a]">Promo</span>
                              <span className="text-[12px] font-semibold leading-none text-cu-success">
                                {formatRupiah(item.product?.discount_price ?? 0)}
                              </span>
                            </div>
                          </button>

                          {/* Item Expanded Details */}
                          {isItemExpanded && (
                            <div className="space-y-3 border-t border-[#E3E4E3] bg-[#f8f9fb] p-4 text-[10px]">
                              {item.error_message && (
                                <div className="bg-cu-danger-soft p-2 rounded-lg text-cu-danger">
                                  <p className="font-semibold">Detail Eror:</p>
                                  <p className="whitespace-pre-wrap">{item.error_message}</p>
                                </div>
                              )}
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-[#303431]">Aksi item</p>
                                  <p className="mt-0.5 text-[#8a8a8a]">Lihat atau unduh file label.</p>
                                </div>
                                <div className="flex shrink-0 gap-1.5">
                                  {item.status === "success" && item.product?.preview_url ? (
                                    <a
                                      href={item.product.preview_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex size-8 items-center justify-center rounded-full border border-[#c9c9c9] bg-white text-[#303431] transition hover:border-[#2da3ff] hover:bg-[#2da3ff] hover:text-white"
                                      title="Lihat Gambar"
                                    >
                                      <MaterialIcon name="visibility" size="xs" />
                                    </a>
                                  ) : (
                                    <span className="inline-flex size-7 items-center justify-center rounded-md border border-cu-line bg-cu-panel-soft text-cu-soft cursor-not-allowed">
                                      <MaterialIcon name="visibility" size="xs" />
                                    </span>
                                  )}
                                  {item.status === "success" && item.product?.download_url ? (
                                    <a
                                      href={item.product.download_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex size-8 items-center justify-center rounded-full border border-[#2da3ff] bg-[#2da3ff] text-white transition hover:bg-[#1476b8]"
                                      title="Unduh Gambar"
                                    >
                                      <MaterialIcon name="download" size="xs" />
                                    </a>
                                  ) : (
                                    <span className="inline-flex size-7 items-center justify-center rounded-md border border-cu-line bg-cu-panel-soft text-cu-soft cursor-not-allowed">
                                      <MaterialIcon name="download" size="xs" />
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : null}

            <div className="flex justify-end border-t border-[#E3E4E3] bg-white px-5 py-4">
              <button type="button" onClick={closeDetail} className="inline-flex h-10 items-center justify-center rounded-full border border-[#c9c9c9] bg-white px-5 text-sm font-semibold text-[#303431] transition hover:bg-[#f8f9fb]">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// UI Helpers
// ----------------------------------------------------
function Pagination({ page, lastPage, onPage }: { page: number; lastPage: number; onPage: (page: number) => void }) {
  if (lastPage <= 1) return null;
  return (
    <div className="hidden items-center justify-between text-xs text-cu-muted sm:flex mt-4">
      <span>Halaman {page} dari {lastPage}</span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="btn btn-secondary py-1 px-3 text-xs"
        >
          Sebelumnya
        </button>
        <button
          type="button"
          disabled={page >= lastPage}
          onClick={() => onPage(page + 1)}
          className="btn btn-secondary py-1 px-3 text-xs"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex min-h-[88px] items-center justify-center rounded-[28px] bg-white px-8 py-8 text-center text-[15px] font-medium leading-tight text-[#9aa1af] sm:rounded-2xl sm:border sm:border-cu-line sm:bg-cu-surface sm:p-12 sm:text-sm sm:text-cu-muted">
      Memuat riwayat antrean batch...
    </div>
  );
}

function Empty() {
  return (
    <div className="rounded-[28px] bg-white px-8 py-8 text-center text-[#9aa1af] sm:rounded-2xl sm:border sm:border-dashed sm:border-cu-line sm:bg-cu-surface sm:p-12">
      <MaterialIcon name="history" size="md" className="mx-auto text-cu-soft animate-pulse" />
      <h2 className="mt-3 text-[15px] font-medium leading-tight sm:text-sm sm:font-semibold sm:text-cu-ink">Belum ada riwayat batch</h2>
      <p className="mx-auto mt-1 max-w-xs text-xs text-cu-muted">
        Anda belum pernah membuat label harga promo secara kelompok atau satuan.
      </p>
    </div>
  );
}
