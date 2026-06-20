"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { apiFetch } from "@/lib/api";
import {
  formatRupiah,
  PricetagCategory,
  pricetagError,
  PricetagPage,
  PricetagProduct,
} from "@/lib/pricetag";
import { useAuth } from "@/providers/auth-provider";

export default function PricetagSearchPage() {
  const { hasPermission } = useAuth();
  const [category, setCategory] = useState<PricetagCategory | null>(null);
  const [categories, setCategories] = useState<PricetagCategory[]>([]);
  const [products, setProducts] = useState<PricetagProduct[]>([]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCatalog = useCallback(async () => {
    if (!hasPermission("access-pricetag")) return;
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({ page: String(page), per_page: "12" });
    if (appliedSearch) {
      params.set(category ? "search" : "name", appliedSearch);
    } else if (!category) {
      params.set("per_page", "4");
      params.set("sort_by", "products_count");
      params.set("sort_order", "desc");
    }

    try {
      if (category) {
        params.set("category_id", String(category.id));
        const result = await apiFetch<PricetagPage<PricetagProduct>>(
          `/pricetag/products?${params}`
        );
        setProducts(result.data);
        setCategories([]);
        setLastPage(result.meta.last_page);
        setTotal(result.meta.total);
      } else {
        const result = await apiFetch<PricetagPage<PricetagCategory>>(
          `/pricetag/categories?${params}`
        );
        setCategories(result.data);
        setProducts([]);
        setLastPage(result.meta.last_page);
        setTotal(result.meta.total);
      }
    } catch (requestError) {
      setError(pricetagError(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [appliedSearch, category, hasPermission, page]);

  useEffect(() => {
    queueMicrotask(() => void loadCatalog());
  }, [loadCatalog]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.trim() !== appliedSearch) {
        setAppliedSearch(search.trim());
        setPage(1);
      }
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [search, appliedSearch]);

  if (!hasPermission("access-pricetag")) {
    return <AccessDenied />;
  }

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const selectCategory = (selected: PricetagCategory) => {
    setCategory(selected);
    setSearch("");
    setAppliedSearch("");
    setPage(1);
    setExpanded(null);
  };

  const backToCategories = () => {
    setCategory(null);
    setSearch("");
    setAppliedSearch("");
    setPage(1);
    setExpanded(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          {category && (
            <button
              type="button"
              onClick={backToCategories}
              className="inline-flex size-10 items-center justify-center rounded-full border border-cu-line bg-cu-surface text-cu-ink shadow-sm transition hover:bg-cu-panel-soft"
              aria-label="Kembali ke kategori"
            >
              <MaterialIcon name="arrow_back" size="sm" />
            </button>
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cu-muted">Pricetag Generator</p>
            <h1 className="mt-1 text-2xl font-semibold text-cu-ink">
              {category ? category.name : "Cari Kategori"}
            </h1>
            <p className="mt-1 text-sm text-cu-muted">
              {category
                ? `${total} produk dan varian ditemukan.`
                : "Pilih kategori untuk melihat pricetag."}
            </p>
          </div>
        </div>

        <form onSubmit={submitSearch} className="relative w-full md:max-w-md">
          <MaterialIcon name="search" size="sm" className="pointer-events-none absolute left-4 top-3.5 text-cu-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={category ? "Cari produk atau varian..." : "Cari kategori..."}
            className="h-11 w-full rounded-full border border-cu-line bg-cu-surface pl-11 pr-4 text-sm text-cu-ink shadow-sm outline-none focus:border-cu-border-hover"
          />
        </form>
      </header>

      {error && <Alert message={error} onClose={() => setError(null)} />}

      {isLoading ? (
        <Loading />
      ) : category ? (
        products.length === 0 ? <Empty title="Tidak Ada Produk" /> : (
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const isExpanded = expanded === product.id;
              return (
                <article key={product.id} className="overflow-hidden rounded-2xl border border-cu-line bg-cu-surface p-4 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setExpanded(isExpanded ? null : product.id)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                    aria-expanded={isExpanded}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className={`size-2 shrink-0 rounded-full ${product.is_ready ? "bg-cu-success" : "bg-cu-muted"}`} />
                      <span className="truncate text-sm font-bold text-cu-ink">
                        {product.name}
                        {product.variant_name !== "Default" && <span className="ml-1 font-normal text-cu-muted">({product.variant_name})</span>}
                      </span>
                    </span>
                    <MaterialIcon name="chevron_right" size="xs" className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-3 border-t border-cu-line pt-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cu-muted">{product.category.name}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${product.is_ready ? "border-cu-success/20 bg-cu-success-soft text-cu-success" : "border-cu-line bg-cu-panel-soft text-cu-muted"}`}>
                          {product.is_ready ? "Ready" : "Tidak Ready"}
                        </span>
                      </div>
                      <div className="rounded-xl border border-cu-line bg-cu-surface-soft p-3">
                        <p className="text-xs text-cu-muted line-through">{formatRupiah(product.normal_price)}</p>
                        <p className="text-base font-extrabold text-cu-success">{formatRupiah(product.discount_price)}</p>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <AssetButton href={product.preview_url} icon="visibility" label="Lihat gambar" />
                        <AssetButton href={product.download_url} icon="download" label="Unduh gambar" />
                        <Link href={product.generator_path} className="inline-flex size-9 items-center justify-center rounded-lg bg-cu-ink text-white" aria-label="Edit harga promo">
                          <MaterialIcon name="edit" size="xs" />
                        </Link>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )
      ) : categories.length === 0 ? <Empty title="Kategori Tidak Ditemukan" /> : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectCategory(item)}
              className="group flex items-center gap-3 rounded-2xl border border-cu-line bg-cu-surface p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cu-panel-soft text-cu-muted group-hover:text-cu-ink">
                <MaterialIcon name="category" size="xs" />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-wide text-cu-muted">{item.products_count} Produk</span>
                <span className="block truncate text-sm font-extrabold text-cu-ink">{item.name}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      <Pagination page={page} lastPage={lastPage} onPage={setPage} />
    </div>
  );
}

function AssetButton({ href, icon, label }: { href: string | null; icon: string; label: string }) {
  if (!href) {
    return <span className="inline-flex size-9 items-center justify-center rounded-lg border border-cu-line bg-cu-panel-soft text-cu-soft" title="Belum digenerate"><MaterialIcon name={icon} size="xs" /></span>;
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex size-9 items-center justify-center rounded-lg border border-cu-line bg-cu-surface text-cu-ink hover:bg-cu-panel-soft" aria-label={label}><MaterialIcon name={icon} size="xs" /></a>;
}

function Pagination({ page, lastPage, onPage }: { page: number; lastPage: number; onPage: (page: number) => void }) {
  if (lastPage <= 1) return null;
  return <div className="flex items-center justify-between text-xs text-cu-muted"><span>Halaman {page} dari {lastPage}</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className="btn btn-secondary">Sebelumnya</button><button type="button" disabled={page >= lastPage} onClick={() => onPage(page + 1)} className="btn btn-secondary">Berikutnya</button></div></div>;
}

function Loading() { return <div className="rounded-2xl border border-cu-line bg-cu-surface p-12 text-center text-sm text-cu-muted">Memuat katalog pricetag...</div>; }
function Empty({ title }: { title: string }) { return <div className="rounded-2xl border border-dashed border-cu-line bg-cu-surface p-12 text-center"><MaterialIcon name="search_off" size="lg" className="mx-auto text-cu-soft" /><h2 className="mt-3 text-sm font-semibold text-cu-ink">{title}</h2></div>; }
function Alert({ message, onClose }: { message: string; onClose: () => void }) { return <div className="flex justify-between rounded-xl border border-cu-danger/20 bg-cu-danger-soft px-4 py-3 text-sm text-cu-danger"><span>{message}</span><button type="button" onClick={onClose} aria-label="Tutup"><MaterialIcon name="close" size="xs" /></button></div>; }
function AccessDenied() { return <div className="rounded-2xl border border-cu-danger/20 bg-cu-danger-soft p-8 text-center"><MaterialIcon name="lock" size="lg" className="mx-auto text-cu-danger" /><h1 className="mt-3 text-lg font-semibold">Akses ditolak</h1><p className="mt-1 text-sm text-cu-muted">Anda tidak memiliki permission access-pricetag.</p></div>; }
