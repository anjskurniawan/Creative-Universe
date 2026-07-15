"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { pricetagApi } from "@/features/generator/pricetag/api";
import { pushLocalNotification } from "@/lib/local-notifications";
import {
  formatRupiah,
  PricetagCategory,
  pricetagError,
  PricetagProduct,
} from "@/features/generator/pricetag/types";
import { useAuth } from "@/providers/auth-provider";

const mobileRowTitleClass = "block truncate text-[13px] font-semibold leading-tight";
const mobileRowMetaClass = "mt-0.5 block text-[10px] font-medium leading-tight text-[#8a8a8a]";
const mobileProductTitleClass = "min-w-0 truncate text-[13px] font-semibold leading-tight";

export default function PricetagSearchPage() {
  const { user } = useAuth();
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
        const result = await pricetagApi.products.list(`?${params}`);
        setProducts(result.data);
        setCategories([]);
        setLastPage(result.meta.last_page);
        setTotal(result.meta.total);
      } else {
        const result = await pricetagApi.categories.list(`?${params}`);
        setCategories(result.data);
        setProducts([]);
        setLastPage(result.meta.last_page);
        setTotal(result.meta.total);
      }
    } catch (requestError) {
      pushLocalNotification(pricetagError(requestError), "/generator/pricetag/search", user?.id);
    } finally {
      setIsLoading(false);
    }
  }, [appliedSearch, category, page, user?.id]);

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

  const hasProductContext = Boolean(category || appliedSearch);

  return (
    <div className="space-y-5 md:space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="hidden items-center gap-3 md:flex">
          {(category || appliedSearch) && (
            <button
              type="button"
              onClick={backToCategories}
              className="size-10 items-center justify-center rounded-full border border-cu-line bg-cu-surface text-cu-ink shadow-sm transition hover:bg-cu-panel-soft md:inline-flex"
              aria-label="Kembali ke kategori"
            >
              <MaterialIcon name="arrow_back" size="sm" />
            </button>
          )}
          <div>
            <h1 className="mt-1 text-2xl font-semibold text-cu-ink">
              {category ? category.name : (appliedSearch ? "Hasil pencarian" : "Cari produk")}
            </h1>
            <p className="mt-1 text-sm text-cu-muted">
              {category || appliedSearch
                ? `${total} produk dan varian ditemukan.`
                : "Pilih kategori untuk melihat produk."}
            </p>
          </div>
        </div>

        <div className="flex w-full items-center md:w-auto md:min-w-[24rem] md:max-w-md">
          <form onSubmit={submitSearch} className="relative min-w-0 flex-1 transition-all duration-300 ease-out">
            <div className="cu-animated-rainbow-border rounded-full p-[2px] md:bg-none md:p-0">
              <div className="relative h-[46px] rounded-full bg-black transition-all duration-300 ease-out md:h-auto md:bg-transparent">
                <MaterialIcon
                  name="search"
                  size="md"
                  className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/70 md:left-4 md:top-3.5 md:translate-y-0 md:text-cu-muted"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari produk..."
                  className="h-full w-full rounded-full border-0 bg-transparent pl-14 pr-5 text-[15px] font-medium text-white outline-none transition-all duration-300 ease-out placeholder:text-white/65 focus:ring-0 md:h-11 md:border md:border-cu-line md:bg-cu-surface md:pl-11 md:pr-4 md:text-sm md:font-normal md:text-cu-ink md:shadow-sm md:placeholder:text-cu-muted md:focus:border-cu-border-hover"
                />
              </div>
            </div>
          </form>
          <button
            type="button"
            onClick={backToCategories}
            disabled={!hasProductContext}
            className={`inline-flex h-[46px] shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap text-[16px] font-medium text-white transition-all duration-300 ease-out md:hidden ${
              hasProductContext
                ? "ml-8 w-24 translate-x-0 opacity-100"
                : "ml-0 w-0 translate-x-2 opacity-0"
            }`}
            aria-label="Kembali ke kategori"
            aria-hidden={!hasProductContext}
          >
            <MaterialIcon name="arrow_back" size="md" />
            <span>Kembali</span>
          </button>
        </div>
      </header>
      <div className="overflow-visible">
        {isLoading ? (
          <LoadingState />
        ) : category || appliedSearch ? (
          products.length === 0 ? <Empty title="Tidak ada produk" /> : (
            <>
              <div className="space-y-2 rounded-[36px] bg-white p-4 md:hidden">
                {products.map((product) => (
                  <MobileProductRow
                    key={product.id}
                    product={product}
                    expanded={expandedProduct?.id === product.id}
                    onToggle={() => setExpandedProduct(expandedProduct?.id === product.id ? null : product)}
                  />
                ))}
              </div>
              <div className="hidden grid-cols-1 items-start gap-4 sm:grid-cols-2 md:grid lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <DesktopProductCard
                    key={product.id}
                    product={product}
                    expanded={expandedProduct?.id === product.id}
                    onToggle={() => setExpandedProduct(expandedProduct?.id === product.id ? null : product)}
                    onClose={() => setExpandedProduct(null)}
                  />
                ))}
              </div>
            </>
          )
        ) : categories.length === 0 ? <Empty title="Kategori tidak ditemukan" /> : (
          <>
            <div className="space-y-2 rounded-[36px] bg-white p-4 md:hidden">
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectCategory(item)}
                  className="flex min-h-[60px] w-full items-center justify-between gap-2 rounded-[24px] border border-[#c9c9c9] bg-white px-5 text-left text-[#2c2c2c] transition-all duration-200 ease-out focus:border-[#2da3ff] focus:bg-[#d8efff] focus:outline-none focus:ring-2 focus:ring-[#2da3ff] active:scale-[0.99] active:border-[#2da3ff] active:bg-[#d8efff]"
                >
                  <span className="flex min-w-0 items-center gap-1">
                    <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden text-[#2c2c2c]">
                      {item.icon_svg ? (
                        <span dangerouslySetInnerHTML={{ __html: item.icon_svg }} className="flex size-full items-center justify-center *:size-full" />
                      ) : (
                        <MaterialIcon name="headphones" size="md" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className={mobileRowTitleClass}>
                        {item.name}
                      </span>
                      <span className={mobileRowMetaClass}>
                        {item.products_count} produk
                      </span>
                    </span>
                  </span>
                  <MaterialIcon name="chevron_right" size="md" className="shrink-0 text-[#2c2c2c]" />
                </button>
              ))}
            </div>
            <div className="hidden grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 md:grid md:grid-cols-4 lg:grid-cols-6">
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectCategory(item)}
                  className="group flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-cu-line bg-cu-surface p-2 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:gap-2 sm:rounded-2xl sm:p-3"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cu-panel-soft text-cu-muted group-hover:text-cu-ink">
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
          </>
        )}
      </div>

      <Pagination page={page} lastPage={lastPage} onPage={setPage} />
    </div>
  );
}

function AssetButton({ href, icon, label }: { href: string | null; icon: string; label: string }) {
  if (!href) {
    return <span className="inline-flex size-9 items-center justify-center rounded-lg border border-cu-line bg-cu-panel-soft text-cu-soft" title="Belum dibuat"><MaterialIcon name={icon} size="xs" /></span>;
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex size-9 items-center justify-center rounded-lg border border-cu-line bg-cu-surface text-cu-ink hover:bg-cu-panel-soft" aria-label={label}><MaterialIcon name={icon} size="xs" /></a>;
}

function DesktopProductCard({
  product,
  expanded,
  onToggle,
  onClose,
}: {
  product: PricetagProduct;
  expanded: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const variantName = getDisplayVariantName(product.variant_name);

  return (
    <article className="relative rounded-2xl border border-cu-line bg-cu-surface p-4 shadow-sm transition hover:shadow-md">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className={`size-2 shrink-0 rounded-full ${product.is_ready ? "bg-cu-success" : "bg-cu-muted"}`} />
          <span className="truncate text-sm font-bold text-cu-ink">
            {product.name}
            {variantName && <span className="ml-1 font-normal text-cu-muted">({variantName})</span>}
          </span>
        </span>
        <MaterialIcon name="chevron_right" size="xs" className="text-cu-muted" />
      </button>

      {expanded && (
        <>
          <div className="fixed inset-0 z-40 cursor-default" onClick={(event) => { event.stopPropagation(); onClose(); }} />
          <div className="absolute left-0 right-0 top-full z-50 mt-2 space-y-3 rounded-2xl border border-cu-line bg-cu-surface p-4 text-left shadow-xl animate-in fade-in slide-in-from-top-2 duration-150" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cu-muted">{product.category.name}</span>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${product.is_ready ? "border-cu-success/20 bg-cu-success-soft text-cu-success" : "border-cu-line bg-cu-panel-soft text-cu-muted"}`}>
                {product.is_ready ? "Tersedia" : "Belum tersedia"}
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
                onClick={onClose}
                className="inline-flex size-9 items-center justify-center rounded-lg bg-cu-ink text-white transition hover:bg-opacity-90"
                aria-label="Edit harga promo"
              >
                <MaterialIcon name="edit" size="xs" />
              </Link>
            </div>
          </div>
        </>
      )}
    </article>
  );
}

function MobileProductRow({
  product,
  expanded,
  onToggle,
}: {
  product: PricetagProduct;
  expanded: boolean;
  onToggle: () => void;
}) {
  const variantName = getDisplayVariantName(product.variant_name);
  const readyClass = product.is_ready ? "bg-[#139300]" : "bg-[#dddddd]";

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onToggle}
        className={`flex min-h-[60px] w-full items-center justify-between gap-2 rounded-[24px] border px-5 text-left text-[#2c2c2c] transition-all duration-200 ease-out focus:border-[#2da3ff] focus:bg-[#d8efff] focus:outline-none focus:ring-2 focus:ring-[#2da3ff] active:scale-[0.99] active:border-[#2da3ff] active:bg-[#d8efff] ${expanded ? "border-[#2da3ff] bg-[#d8efff]" : "border-[#c9c9c9] bg-white"}`}
      >
        <span className="flex min-w-0 items-center gap-1">
          <span className={`size-2 shrink-0 rounded-full ${readyClass}`} />
          <span className={mobileProductTitleClass}>
            {product.name}
            {variantName && <span className="font-medium text-[#9aa1af]"> ( {variantName} )</span>}
          </span>
        </span>
        <MaterialIcon name={expanded ? "expand_more" : "chevron_right"} size="md" className="shrink-0 text-[#2c2c2c]" />
      </button>

      {expanded && (
        <div className="rounded-[22px] border border-[#dedede] bg-[#f8f9fb] p-3 text-[#2c2c2c]">
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 truncate text-[12px] font-semibold leading-tight text-[#333333]">{product.category.name}</p>
            <span className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-medium leading-none ${product.is_ready ? "bg-[#139300] text-white" : "border border-[#d0d5dd] bg-white text-[#8a93a3]"}`}>
              {product.is_ready ? "Tersedia pricetag" : "Belum ada pricetag"}
            </span>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[12px] font-medium leading-none text-[#777777] line-through">
                {formatRupiah(product.normal_price)}
              </p>
              <p className="mt-1 text-[18px] font-bold leading-none text-[#139300]">
                {formatRupiah(product.discount_price)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <MobileAssetButton href={product.preview_url} icon="visibility" label="Lihat gambar" disabled={!product.is_ready} />
              <MobileAssetButton href={product.download_url} icon="download" label="Unduh gambar" disabled={!product.is_ready} />
              <Link
                href={product.generator_path}
                className="inline-flex size-9 items-center justify-center rounded-lg bg-[#2da3ff] text-white shadow-sm shadow-[#2da3ff]/25"
                aria-label="Edit harga promo"
              >
                <MaterialIcon name="edit_square" size="sm" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileAssetButton({
  href,
  icon,
  label,
  disabled,
}: {
  href: string | null;
  icon: string;
  label: string;
  disabled: boolean;
}) {
  const className = disabled
    ? "inline-flex size-9 items-center justify-center rounded-lg border border-[#d0d5dd] bg-white text-[#9aa1af]"
    : "inline-flex size-9 items-center justify-center rounded-lg bg-black text-white";

  if (!href || disabled) {
    return (
      <span className={className} title="Belum dibuat">
        <MaterialIcon name={icon} size="sm" />
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={label}>
      <MaterialIcon name={icon} size="sm" />
    </a>
  );
}

function Pagination({ page, lastPage, onPage }: { page: number; lastPage: number; onPage: (page: number) => void }) {
  if (lastPage <= 1) return null;
  return (
    <div className="hidden h-9 items-center justify-between text-xs text-cu-muted md:flex">
      <span>Halaman {page} dari {lastPage}</span>
      <div className="flex gap-2">
        <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className="btn btn-secondary">Sebelumnya</button>
        <button type="button" disabled={page >= lastPage} onClick={() => onPage(page + 1)} className="btn btn-secondary">Berikutnya</button>
      </div>
    </div>
  );
}

function getDisplayVariantName(value: string) {
  const variantName = value.trim();
  return variantName.toLowerCase() === "default" ? "" : variantName;
}

function Empty({ title }: { title: string }) {
  const message = title === "Tidak ada produk" ? "Tidak ada produk ditemukan" : title;
  return (
    <div className="flex min-h-[88px] items-center justify-center gap-2 rounded-[28px] bg-white px-8 py-8 text-center text-[#9aa1af] md:rounded-2xl md:border md:border-dashed md:border-cu-line md:bg-cu-surface md:p-12">
      <MaterialIcon name="sentiment_dissatisfied" size="md" />
      <h2 className="text-[15px] font-medium leading-tight md:text-sm md:font-semibold md:text-cu-ink">{message}</h2>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[88px] items-center justify-center gap-2 rounded-[28px] bg-white px-8 py-8 text-center text-[#9aa1af] md:rounded-2xl md:border md:border-cu-line md:bg-cu-surface md:px-12 md:py-8 md:text-cu-muted">
      <MaterialIcon name="progress_activity" size="md" className="animate-spin" />
      <span className="text-[15px] font-medium leading-tight md:text-sm md:font-semibold">Produk sedang dicari</span>
    </div>
  );
}
