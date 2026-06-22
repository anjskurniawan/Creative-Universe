"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { apiFetch } from "@/lib/api";
import { pushLocalNotification } from "@/lib/local-notifications";
import {
  formatRupiah,
  PricetagCategory,
  pricetagError,
  PricetagPage,
  PricetagProduct,
} from "@/lib/pricetag";
import { useAuth } from "@/providers/auth-provider";

export default function PricetagSearchPage() {
  const { user, hasPermission } = useAuth();
  const [category, setCategory] = useState<PricetagCategory | null>(null);
  const [categories, setCategories] = useState<PricetagCategory[]>([]);
  const [products, setProducts] = useState<PricetagProduct[]>([]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedProduct, setExpandedProduct] = useState<PricetagProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCatalog = useCallback(async () => {
    if (!hasPermission("access-pricetag")) return;
    setIsLoading(true);

    const params = new URLSearchParams({ page: String(page), per_page: "12" });
    if (appliedSearch) {
      params.set("search", appliedSearch);
    } else if (!category) {
      params.set("per_page", "12");
      params.set("sort_by", "products_count");
      params.set("sort_order", "desc");
    }

    try {
      if (category || appliedSearch) {
        if (category) {
          params.set("category_id", String(category.id));
        }
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
      pushLocalNotification(pricetagError(requestError), "/pricetag/search", user?.id);
    } finally {
      setIsLoading(false);
    }
  }, [appliedSearch, category, hasPermission, page, user?.id]);

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
    setExpandedProduct(null);
  };

  const backToCategories = () => {
    setCategory(null);
    setSearch("");
    setAppliedSearch("");
    setPage(1);
    setExpandedProduct(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          {(category || appliedSearch) && (
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
            <h1 className="mt-1 text-2xl font-semibold text-cu-ink">
              {category ? category.name : (appliedSearch ? "Hasil Pencarian" : "Cari Produk")}
            </h1>
            <p className="mt-1 text-sm text-cu-muted">
              {category || appliedSearch
                ? `${total} produk dan varian ditemukan.`
                : "Pilih kategori untuk melihat produk."}
            </p>
          </div>
        </div>

        <form onSubmit={submitSearch} className="relative w-full md:max-w-md">
          <MaterialIcon name="search" size="sm" className="pointer-events-none absolute left-4 top-3.5 text-cu-muted" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari produk ... "
            className="h-11 w-full rounded-full border border-cu-line bg-cu-surface pl-11 pr-4 text-sm text-cu-ink shadow-sm outline-none focus:border-cu-border-hover"
          />
        </form>
      </header>
      <div className="h-[824px] sm:h-[404px] lg:h-[264px] xl:h-[194px] overflow-visible">
        {isLoading ? (
          category || appliedSearch ? (
            <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-cu-line bg-cu-surface p-4 shadow-sm animate-pulse">
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2 w-full">
                      <span className="size-2 shrink-0 rounded-full bg-cu-panel-soft" />
                      <span className="h-4 w-2/3 rounded bg-cu-panel-soft" />
                    </span>
                    <div className="size-5 shrink-0 rounded bg-cu-panel-soft" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-cu-line bg-cu-surface p-2 text-center shadow-sm sm:gap-2 sm:rounded-2xl sm:p-3 animate-pulse"
                >
                  <div className="size-10 shrink-0 rounded-xl bg-cu-panel-soft" />
                  <div className="h-3 w-12 rounded bg-cu-panel-soft sm:w-16" />
                </div>
              ))}
            </div>
          )
        ) : category || appliedSearch ? (
          products.length === 0 ? <Empty title="Tidak Ada Produk" /> : (
            <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <article key={product.id} className="relative rounded-2xl border border-cu-line bg-cu-surface p-4 shadow-sm hover:shadow-md transition">
                  <button
                    type="button"
                    onClick={() => setExpandedProduct(expandedProduct?.id === product.id ? null : product)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className={`size-2 shrink-0 rounded-full ${product.is_ready ? "bg-cu-success" : "bg-cu-muted"}`} />
                      <span className="truncate text-sm font-bold text-cu-ink">
                        {product.name}
                        {product.variant_name !== "Default" && <span className="ml-1 font-normal text-cu-muted">({product.variant_name})</span>}
                      </span>
                    </span>
                    <MaterialIcon name="chevron_right" size="xs" className="text-cu-muted" />
                  </button>

                  {/* Dropdown popup */}
                  {expandedProduct?.id === product.id && (
                    <>
                      {/* Transparent click-outside backdrop */}
                      <div className="fixed inset-0 z-40 cursor-default" onClick={(e) => { e.stopPropagation(); setExpandedProduct(null); }} />
                      <div className="absolute left-0 right-0 top-full z-50 mt-2 space-y-3 rounded-2xl border border-cu-line bg-cu-surface p-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 text-left" onClick={(e) => e.stopPropagation()}>
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
                          <Link
                            href={product.generator_path}
                            onClick={() => setExpandedProduct(null)}
                            className="inline-flex size-9 items-center justify-center rounded-lg bg-cu-ink text-white hover:bg-opacity-90 transition"
                            aria-label="Edit harga promo"
                          >
                            <MaterialIcon name="edit" size="xs" />
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          )
        ) : categories.length === 0 ? <Empty title="Kategori Tidak Ditemukan" /> : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectCategory(item)}
                className="group flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-cu-line bg-cu-surface p-2 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:gap-2 sm:rounded-2xl sm:p-3"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cu-panel-soft text-cu-muted group-hover:text-cu-ink overflow-hidden">
                  {item.icon_svg ? (
                    <span dangerouslySetInnerHTML={{ __html: item.icon_svg }} className="flex size-full items-center justify-center p-1.5 *:size-full" />
                  ) : (
                    <MaterialIcon name="category" size="sm" className="sm:text-lg" />
                  )}
                </span>
                <span className="w-full min-w-0">
                  <span className="block whitespace-normal break-words text-[11px] font-bold leading-tight text-cu-ink [overflow-wrap:anywhere] sm:text-xs">
                    {item.name}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

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
  if (lastPage <= 1) return <div className="h-9" aria-hidden="true" />;
  return (
    <div className="flex h-9 items-center justify-between text-xs text-cu-muted">
      <span>Halaman {page} dari {lastPage}</span>
      <div className="flex gap-2">
        <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className="btn btn-secondary">Sebelumnya</button>
        <button type="button" disabled={page >= lastPage} onClick={() => onPage(page + 1)} className="btn btn-secondary">Berikutnya</button>
      </div>
    </div>
  );
}

function Empty({ title }: { title: string }) { return <div className="rounded-2xl border border-dashed border-cu-line bg-cu-surface p-12 text-center"><MaterialIcon name="search_off" size="lg" className="mx-auto text-cu-soft" /><h2 className="mt-3 text-sm font-semibold text-cu-ink">{title}</h2></div>; }
function AccessDenied() { return <div className="rounded-2xl border border-cu-danger/20 bg-cu-danger-soft p-8 text-center"><MaterialIcon name="lock" size="lg" className="mx-auto text-cu-danger" /><h1 className="mt-3 text-lg font-semibold">Akses ditolak</h1><p className="mt-1 text-sm text-cu-muted">Anda tidak memiliki permission access-pricetag.</p></div>; }
