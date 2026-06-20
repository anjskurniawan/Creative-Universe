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
  PricetagBatchItem,
  PricetagPage,
} from "@/lib/pricetag";
import { useAuth } from "@/providers/auth-provider";

export default function PricetagHistoryPage() {
  const { hasPermission } = useAuth();

  // State
  const [batches, setBatches] = useState<PricetagBatch[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal State
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [detailBatch, setDetailBatch] = useState<PricetagBatch | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const notify = (message: string) => {
    pushLocalNotification(message, "/pricetag/history");
  };

  const loadBatchDetail = async (id: number, silent = false) => {
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
  };

  // ----------------------------------------------------
  // Load History Batches
  // ----------------------------------------------------
  const loadBatches = useCallback(async (silent = false) => {
    if (!hasPermission("access-pricetag")) return;
    if (!silent) setIsLoading(true);

    try {
      const res = await apiFetch<PricetagPage<PricetagBatch>>(
        `/pricetag/batches?page=${page}&per_page=10`
      );
      setBatches(res.data);
      setLastPage(res.meta.last_page);
      setTotal(res.meta.total);
    } catch (err) {
      if (!silent) notify(pricetagError(err));
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [page, hasPermission]);

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
  }, [batches, loadBatches, selectedBatchId]);

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
  }, [batches, loadBatches, selectedBatchId]);

  const openDetail = (id: number) => {
    setSelectedBatchId(id);
    setDetailBatch(null);
    loadBatchDetail(id);
  };

  const closeDetail = () => {
    setSelectedBatchId(null);
    setDetailBatch(null);
  };

  if (!hasPermission("access-pricetag")) {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cu-muted">Pricetag Generate</p>
          <h1 className="mt-1 text-2xl font-semibold text-cu-ink">Riwayat User</h1>
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
        <div className="overflow-x-auto rounded-2xl border border-cu-line bg-cu-surface shadow-sm">
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
      )}

      {/* Pagination */}
      <Pagination page={page} lastPage={lastPage} onPage={setPage} />

      {/* Detail Modal */}
      {selectedBatchId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-cu-overlay/60 p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-4xl rounded-2xl bg-cu-surface p-5 shadow-xl max-h-[85vh] flex flex-col">
            <div className="mb-4 flex items-center justify-between border-b border-cu-line pb-3">
              <div>
                <h2 className="text-lg font-semibold text-cu-ink">
                  {isLoadingDetail ? "Memuat..." : `Detail Kelompok: ${detailBatch?.batch_name}`}
                </h2>
                {detailBatch && (
                  <p className="text-xs text-cu-muted mt-0.5">
                    Dibuat oleh <b>{detailBatch.creator?.name}</b> pada {new Date(detailBatch.created_at).toLocaleString("id-ID")}
                  </p>
                )}
              </div>
              <button type="button" onClick={closeDetail} aria-label="Tutup" className="text-cu-muted hover:text-cu-ink">
                <MaterialIcon name="close" size="sm" />
              </button>
            </div>

            {isLoadingDetail ? (
              <div className="py-12 text-center text-xs text-cu-muted flex-1 flex items-center justify-center">
                Memuat detail antrean item...
              </div>
            ) : detailBatch ? (
              <div className="overflow-y-auto flex-1 border border-cu-line rounded-xl">
                <table className="min-w-[600px] w-full text-xs text-left">
                  <thead className="bg-cu-panel-soft uppercase font-bold text-cu-muted tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Produk / Varian</th>
                      <th className="px-4 py-3">Harga Promo</th>
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
                            {item.product?.variant_name !== "Default" && (
                              <span className="block text-[10px] text-cu-muted mt-0.5">Varian: {item.product?.variant_name}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-cu-success font-semibold">
                            {formatRupiah(item.product?.discount_price ?? 0)}
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
              </div>
            ) : null}

            <div className="mt-4 flex justify-end border-t border-cu-line pt-3">
              <button type="button" onClick={closeDetail} className="btn btn-secondary">
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
    <div className="flex items-center justify-between text-xs text-cu-muted mt-4">
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
    <div className="rounded-2xl border border-cu-line bg-cu-surface p-12 text-center text-sm text-cu-muted">
      Memuat riwayat antrean batch...
    </div>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl border border-dashed border-cu-line bg-cu-surface p-12 text-center">
      <MaterialIcon name="history" size="lg" className="mx-auto text-cu-soft animate-pulse" />
      <h2 className="mt-3 text-sm font-semibold text-cu-ink">Belum Ada Riwayat Batch</h2>
      <p className="mt-1 text-xs text-cu-muted max-w-xs mx-auto">
        Anda belum pernah membuat label harga promo secara kelompok (Checklist/CSV) atau single.
      </p>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="rounded-2xl border border-cu-danger/20 bg-cu-danger-soft p-8 text-center max-w-lg mx-auto mt-12">
      <MaterialIcon name="lock" size="lg" className="mx-auto text-cu-danger" />
      <h1 className="mt-3 text-lg font-semibold">Akses ditolak</h1>
      <p className="mt-1 text-sm text-cu-muted">
        Anda tidak memiliki permission <code>access-pricetag</code> yang diperlukan untuk membuka modul ini.
      </p>
    </div>
  );
}
