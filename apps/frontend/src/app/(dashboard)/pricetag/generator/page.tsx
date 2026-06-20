"use client";

import React, { FormEvent, useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/material-icon";
import { apiFetch } from "@/lib/api";
import {
  formatRupiah,
  pricetagError,
  PricetagCategory,
  PricetagProduct,
  PricetagPage,
} from "@/lib/pricetag";
import { useAuth } from "@/providers/auth-provider";

type Tab = "single" | "checklist" | "bulk";

export default function PricetagGeneratorPage() {
  const { hasPermission } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab State
  const [activeTab, setActiveTab] = useState<Tab>("single");

  // Global Notice/Error State
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // ----------------------------------------------------
  // Tab 1: Wizard Single State
  // ----------------------------------------------------
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardCategorySearch, setWizardCategorySearch] = useState("");
  const [categoriesList, setCategoriesList] = useState<PricetagCategory[]>([]);
  const [wizardCategoryId, setWizardCategoryId] = useState<number | null>(null);
  const [wizardCategoryName, setWizardCategoryName] = useState("");

  const [wizardProductSearch, setWizardProductSearch] = useState("");
  const [productsList, setProductsList] = useState<string[]>([]); // distinct names
  const [wizardProductName, setWizardProductName] = useState<string | null>(null);

  const [wizardVariantSearch, setWizardVariantSearch] = useState("");
  const [variantsList, setVariantsList] = useState<PricetagProduct[]>([]);
  const [wizardProductId, setWizardProductId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<PricetagProduct | null>(null);

  const [wizardDiscountPrice, setWizardDiscountPrice] = useState<string>("");
  const [generatedViewUrl, setGeneratedViewUrl] = useState<string | null>(null);
  const [generatedDownloadUrl, setGeneratedDownloadUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // ----------------------------------------------------
  // Tab 2: Checklist State
  // ----------------------------------------------------
  const [checklistSearch, setChecklistSearch] = useState("");
  const [checklistAppliedSearch, setChecklistAppliedSearch] = useState("");
  const [checklistProducts, setChecklistProducts] = useState<PricetagProduct[]>([]);
  const [checklistPage, setChecklistPage] = useState(1);
  const [checklistLastPage, setChecklistLastPage] = useState(1);
  const [checklistTotal, setChecklistTotal] = useState(0);
  const [checklistIsLoading, setChecklistIsLoading] = useState(false);

  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);
  const [selectedProductsData, setSelectedProductsData] = useState<Record<number, PricetagProduct>>({});
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [checklistPrices, setChecklistPrices] = useState<Record<number, string>>({});
  const [checklistBatchName, setChecklistBatchName] = useState("");
  const [isSubmittingChecklist, setIsSubmittingChecklist] = useState(false);

  // ----------------------------------------------------
  // Tab 3: Bulk CSV State
  // ----------------------------------------------------
  const [bulkBatchName, setBulkBatchName] = useState("");
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------------------------------
  // Check Access Permissions
  // ----------------------------------------------------
  if (!hasPermission("access-pricetag")) {
    return <AccessDenied />;
  }

  // ----------------------------------------------------
  // Deep Link ?product_id={id} Handling
  // ----------------------------------------------------
  useEffect(() => {
    const productIdParam = searchParams.get("product_id");
    if (productIdParam) {
      const prodId = Number(productIdParam);
      if (!isNaN(prodId)) {
        setIsGenerating(true);
        apiFetch<PricetagProduct>(`/pricetag/products/${prodId}`)
          .then((prod) => {
            setActiveTab("single");
            setWizardCategoryId(prod.category.id);
            setWizardCategoryName(prod.category.name);
            setWizardProductName(prod.name);
            setWizardProductId(prod.id);
            setSelectedProduct(prod);
            setWizardDiscountPrice(String(prod.discount_price ?? 0));
            setWizardStep(4);
          })
          .catch((err) => {
            setError(pricetagError(err));
          })
          .finally(() => {
            setIsGenerating(false);
          });
      }
    }
  }, [searchParams]);

  // ----------------------------------------------------
  // Tab 1 (Single): Category Search API
  // ----------------------------------------------------
  useEffect(() => {
    if (activeTab !== "single" || wizardStep !== 1) return;
    const query = wizardCategorySearch.trim();
    if (!query) {
      setCategoriesList([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      apiFetch<PricetagPage<PricetagCategory>>(`/pricetag/categories?search=${encodeURIComponent(query)}&per_page=10`)
        .then((res) => setCategoriesList(res.data))
        .catch((err) => setError(pricetagError(err)));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [wizardCategorySearch, wizardStep, activeTab]);

  // ----------------------------------------------------
  // Tab 1 (Single): Product Search API (distinct product names)
  // ----------------------------------------------------
  useEffect(() => {
    if (activeTab !== "single" || wizardStep !== 2 || !wizardCategoryId) return;

    const query = wizardProductSearch.trim();
    const params = new URLSearchParams({
      category_id: String(wizardCategoryId),
      per_page: "100",
    });
    if (query) params.set("search", query);

    apiFetch<PricetagPage<PricetagProduct>>(`/pricetag/products?${params}`)
      .then((res) => {
        // extract distinct product names
        const names = Array.from(new Set(res.data.map((p) => p.name)));
        setProductsList(names);
      })
      .catch((err) => setError(pricetagError(err)));
  }, [wizardProductSearch, wizardCategoryId, wizardStep, activeTab]);

  // ----------------------------------------------------
  // Tab 1 (Single): Variant Search API
  // ----------------------------------------------------
  useEffect(() => {
    if (activeTab !== "single" || wizardStep !== 3 || !wizardCategoryId || !wizardProductName) return;

    const query = wizardVariantSearch.trim();
    const params = new URLSearchParams({
      category_id: String(wizardCategoryId),
      search: wizardProductName, // filter by distinct name
      per_page: "100",
    });

    apiFetch<PricetagPage<PricetagProduct>>(`/pricetag/products?${params}`)
      .then((res) => {
        // filter client-side if variant name search query is present
        let list = res.data.filter((p) => p.name === wizardProductName);
        if (query) {
          list = list.filter((p) =>
            p.variant_name.toLowerCase().includes(query.toLowerCase())
          );
        }
        setVariantsList(list);
      })
      .catch((err) => setError(pricetagError(err)));
  }, [wizardVariantSearch, wizardCategoryId, wizardProductName, wizardStep, activeTab]);

  // ----------------------------------------------------
  // Tab 1 (Single): Actions
  // ----------------------------------------------------
  const handleSelectCategory = (cat: PricetagCategory) => {
    setWizardCategoryId(cat.id);
    setWizardCategoryName(cat.name);
    setWizardProductName(null);
    setWizardProductId(null);
    setSelectedProduct(null);
    setWizardProductSearch("");
    setWizardStep(2);
  };

  const handleSelectProduct = (prodName: string) => {
    setWizardProductName(prodName);
    setWizardVariantSearch("");

    // Fetch variants to check count
    const params = new URLSearchParams({
      category_id: String(wizardCategoryId),
      search: prodName,
      per_page: "100",
    });

    setIsGenerating(true);
    apiFetch<PricetagPage<PricetagProduct>>(`/pricetag/products?${params}`)
      .then((res) => {
        const list = res.data.filter((p) => p.name === prodName);
        if (list.length === 1) {
          const singleVar = list[0];
          if (singleVar.variant_name === "Default" || !singleVar.variant_name) {
            // Auto skip to step 4
            setWizardProductId(singleVar.id);
            setSelectedProduct(singleVar);
            setWizardDiscountPrice(String(singleVar.discount_price ?? 0));
            setWizardStep(4);
            return;
          }
        }
        setVariantsList(list);
        setWizardStep(3);
      })
      .catch((err) => setError(pricetagError(err)))
      .finally(() => setIsGenerating(false));
  };

  const handleSelectVariant = (prod: PricetagProduct) => {
    setWizardProductId(prod.id);
    setSelectedProduct(prod);
    setWizardDiscountPrice(String(prod.discount_price ?? 0));
    setWizardStep(4);
  };

  const handleBackFromStep4 = () => {
    if (!wizardCategoryId || !wizardProductName) return;
    setIsGenerating(true);

    const params = new URLSearchParams({
      category_id: String(wizardCategoryId),
      search: wizardProductName,
      per_page: "100",
    });

    apiFetch<PricetagPage<PricetagProduct>>(`/pricetag/products?${params}`)
      .then((res) => {
        const list = res.data.filter((p) => p.name === wizardProductName);
        if (list.length === 1) {
          const singleVar = list[0];
          if (singleVar.variant_name === "Default" || !singleVar.variant_name) {
            setWizardStep(2);
            return;
          }
        }
        setWizardStep(3);
      })
      .catch((err) => setError(pricetagError(err)))
      .finally(() => setIsGenerating(false));
  };

  const handleGenerateSingle = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setError(null);
    setIsGenerating(true);
    setWizardStep(5); // Go to loader page

    try {
      const res = await apiFetch<PricetagProduct>("/pricetag/generations/single", {
        method: "POST",
        body: JSON.stringify({
          product_id: selectedProduct.id,
          discount_price: Number(wizardDiscountPrice),
        }),
      });

      setGeneratedViewUrl(res.preview_url);
      setGeneratedDownloadUrl(res.download_url);
      setWizardStep(6);
      setNotice(`Label harga untuk ${res.name} berhasil dibuat!`);
    } catch (err) {
      setError(pricetagError(err));
      setWizardStep(4); // Rollback to form input
    } finally {
      setIsGenerating(false);
    }
  };

  const resetWizard = () => {
    setWizardStep(1);
    setWizardCategorySearch("");
    setCategoriesList([]);
    setWizardCategoryId(null);
    setWizardCategoryName("");
    setWizardProductName(null);
    setWizardProductId(null);
    setSelectedProduct(null);
    setWizardDiscountPrice("");
    setGeneratedViewUrl(null);
    setGeneratedDownloadUrl(null);
    setError(null);
  };

  const loadChecklistProducts = useCallback(async () => {
    if (activeTab !== "checklist") return;

    if (!checklistAppliedSearch.trim()) {
      setChecklistProducts([]);
      setChecklistLastPage(1);
      setChecklistTotal(0);
      setChecklistIsLoading(false);
      return;
    }

    setChecklistIsLoading(true);
    setError(null);

    const params = new URLSearchParams({
      page: String(checklistPage),
      per_page: "10",
      search: checklistAppliedSearch.trim(),
    });

    try {
      const res = await apiFetch<PricetagPage<PricetagProduct>>(`/pricetag/products?${params}`);
      setChecklistProducts(res.data);
      setChecklistLastPage(res.meta.last_page);
      setChecklistTotal(res.meta.total);
    } catch (err) {
      setError(pricetagError(err));
    } finally {
      setChecklistIsLoading(false);
    }
  }, [checklistPage, checklistAppliedSearch, activeTab]);

  useEffect(() => {
    queueMicrotask(() => void loadChecklistProducts());
  }, [loadChecklistProducts]);

  useEffect(() => {
    if (activeTab !== "checklist") return;
    const handler = setTimeout(() => {
      if (checklistSearch.trim() !== checklistAppliedSearch) {
        setChecklistAppliedSearch(checklistSearch);
        setChecklistPage(1);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [checklistSearch, checklistAppliedSearch, activeTab]);

  const handleSearchChecklist = (e: FormEvent) => {
    e.preventDefault();
    setChecklistPage(1);
    setChecklistAppliedSearch(checklistSearch);
  };

  const handleToggleSelectProduct = (prod: PricetagProduct) => {
    setSelectedVariants((prev) =>
      prev.includes(prod.id) ? prev.filter((id) => id !== prod.id) : [...prev, prod.id]
    );
    setSelectedProductsData((prev) => {
      if (prev[prod.id]) {
        const copy = { ...prev };
        delete copy[prod.id];
        return copy;
      } else {
        return { ...prev, [prod.id]: prod };
      }
    });
  };

  const handleSelectAllCurrentPage = () => {
    const newVariants = [...selectedVariants];
    const newProductsData = { ...selectedProductsData };
    checklistProducts.forEach((p) => {
      if (!newVariants.includes(p.id)) {
        newVariants.push(p.id);
        newProductsData[p.id] = p;
      }
    });
    setSelectedVariants(newVariants);
    setSelectedProductsData(newProductsData);
  };

  const handleClearSelection = () => {
    setSelectedVariants([]);
    setSelectedProductsData({});
    setShowOnlySelected(false);
  };

  const handleChecklistPriceChange = (prodId: number, value: string) => {
    setChecklistPrices((prev) => ({
      ...prev,
      [prodId]: value,
    }));
  };

  const handleChecklistGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedVariants.length === 0) {
      setError("Pilih minimal satu produk untuk dibuat labelnya.");
      return;
    }

    setError(null);
    setIsSubmittingChecklist(true);

    const now = new Date();
    const formattedDate = now.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    const formattedTime = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });
    const defaultBatchName = `Promo Checklist ${formattedDate} ${formattedTime}`;

    const itemsPayload = selectedVariants.map((id) => {
      const customPrice = checklistPrices[id];
      return {
        product_id: id,
        discount_price: customPrice !== undefined && customPrice !== "" ? Number(customPrice) : null,
      };
    });

    try {
      await apiFetch("/pricetag/generations/checklist", {
        method: "POST",
        body: JSON.stringify({
          batch_name: defaultBatchName,
          items: itemsPayload,
        }),
      });

      setSelectedVariants([]);
      setChecklistPrices({});
      setChecklistBatchName("");
      router.push("/pricetag/history");
    } catch (err) {
      setError(pricetagError(err));
    } finally {
      setIsSubmittingChecklist(false);
    }
  };

  // ----------------------------------------------------
  // Tab 3 (Bulk CSV): Actions
  // ----------------------------------------------------
  const handleBulkGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!bulkBatchName.trim()) {
      setError("Nama kelompok promo wajib diisi.");
      return;
    }
    if (!bulkFile) {
      setError("File CSV wajib diunggah.");
      return;
    }

    setError(null);
    setIsSubmittingBulk(true);

    const formData = new FormData();
    formData.append("batch_name", bulkBatchName.trim());
    formData.append("file", bulkFile);

    try {
      await apiFetch("/pricetag/generations/bulk", {
        method: "POST",
        body: formData,
      });

      setBulkBatchName("");
      setBulkFile(null);
      router.push("/pricetag/history");
    } catch (err) {
      setError(pricetagError(err));
    } finally {
      setIsSubmittingBulk(false);
    }
  };

  return (
    <div>
      {notice && <Alert tone="success" message={notice} onClose={() => setNotice(null)} />}
      {error && <Alert tone="error" message={error} onClose={() => setError(null)} />}

      <div className="mb-8 flex justify-start sm:justify-center w-full max-w-full overflow-x-auto scrollbar-none px-4 sm:px-0">
        <div className="inline-flex p-1 rounded-full border border-cu-line bg-cu-surface-soft gap-1 md:gap-1.5 shadow-sm flex-nowrap">
          <button
            type="button"
            onClick={() => { setActiveTab("single"); setError(null); }}
            className={`flex items-center justify-center px-3 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cu-border-hover whitespace-nowrap ${
              activeTab === "single"
                ? "bg-cu-ink text-white shadow-sm font-extrabold"
                : "text-cu-muted hover:text-cu-ink hover:bg-cu-panel-soft/50"
            }`}
          >
            Buat Label Satuan
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("checklist"); setError(null); }}
            className={`flex items-center justify-center px-3 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cu-border-hover whitespace-nowrap ${
              activeTab === "checklist"
                ? "bg-cu-ink text-white shadow-sm font-extrabold"
                : "text-cu-muted hover:text-cu-ink hover:bg-cu-panel-soft/50"
            }`}
          >
            Buat Label Sekaligus
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("bulk"); setError(null); }}
            className={`flex items-center justify-center px-3 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cu-border-hover whitespace-nowrap ${
              activeTab === "bulk"
                ? "bg-cu-ink text-white shadow-sm font-extrabold"
                : "text-cu-muted hover:text-cu-ink hover:bg-cu-panel-soft/50"
            }`}
          >
            Buat Label Massal (CSV)
          </button>
        </div>
      </div>

      {/* Tab 1: Single Generator Wizard */}
      {activeTab === "single" && (
        <div className="space-y-8">
          {/* Modern Stepper Indicator */}
          <div className="bg-cu-surface border border-cu-line rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between max-w-xl mx-auto">
              {/* Step 1 Category */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${wizardStep >= 1 ? "bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10" : "bg-cu-panel-soft text-cu-muted border border-cu-line"}`}>
                  1
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:block ${wizardStep >= 1 ? "text-cu-ink" : "text-cu-muted"}`}>Kategori</span>
              </div>

              <div className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${wizardStep >= 2 ? "bg-cu-ink" : "bg-cu-line"}`}></div>

              {/* Step 2 Product */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${wizardStep >= 2 ? "bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10" : "bg-cu-panel-soft text-cu-muted border border-cu-line"}`}>
                  2
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:block ${wizardStep >= 2 ? "text-cu-ink" : "text-cu-muted"}`}>Produk</span>
              </div>

              <div className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${wizardStep >= 3 ? "bg-cu-ink" : "bg-cu-line"}`}></div>

              {/* Step 3 Variant */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${wizardStep >= 3 ? "bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10" : "bg-cu-panel-soft text-cu-muted border border-cu-line"}`}>
                  3
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:block ${wizardStep >= 3 ? "text-cu-ink" : "text-cu-muted"}`}>Varian</span>
              </div>

              <div className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${wizardStep >= 4 ? "bg-cu-ink" : "bg-cu-line"}`}></div>

              {/* Step 4 Price */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${wizardStep >= 4 ? "bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10" : "bg-cu-panel-soft text-cu-muted border border-cu-line"}`}>
                  4
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:block ${wizardStep >= 4 ? "text-cu-ink" : "text-cu-muted"}`}>Harga</span>
              </div>

              <div className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${wizardStep >= 6 ? "bg-cu-ink" : "bg-cu-line"}`}></div>

              {/* Step 5 Result */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${wizardStep >= 6 ? "bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10" : "bg-cu-panel-soft text-cu-muted border border-cu-line"}`}>
                  <MaterialIcon name="check" size="xs" />
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:block ${wizardStep >= 6 ? "text-cu-ink" : "text-cu-muted"}`}>Selesai</span>
              </div>
            </div>
          </div>

          {/* STEP 1: Select Category */}
          {wizardStep === 1 && (
            <div className="rounded-2xl border border-cu-line bg-cu-surface p-6 sm:p-8 shadow-sm max-w-xl mx-auto">
              <h3 className="text-base font-bold text-cu-ink mb-4">Pilih Kategori Produk</h3>
              
              {/* Search Bar */}
              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-cu-muted">
                  <MaterialIcon name="search" size="sm" />
                </span>
                <input
                  type="text"
                  value={wizardCategorySearch}
                  onChange={(e) => setWizardCategorySearch(e.target.value)}
                  className="block w-full rounded-full border border-cu-line bg-cu-surface py-2.5 pl-11 pr-4 text-sm text-cu-ink placeholder:text-cu-muted/70 focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover transition"
                  placeholder="Cari kategori..."
                  autoFocus
                />
              </div>

              {/* Category List */}
              {wizardCategorySearch.trim() !== "" && (
                <div className="divide-y divide-cu-line/60 border border-cu-line rounded-2xl overflow-hidden bg-cu-surface shadow-sm mt-4">
                  {categoriesList.length > 0 ? categoriesList.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat)}
                      className="w-full flex items-center justify-between p-4 hover:bg-cu-panel-soft/50 transition text-left group"
                    >
                      <span className="text-sm font-semibold text-cu-ink group-hover:text-cu-focus transition-colors">{cat.name}</span>
                      <div className="text-cu-muted group-hover:text-cu-ink transition">
                        <MaterialIcon name="chevron_right" size="sm" />
                      </div>
                    </button>
                  )) : (
                    <div className="p-8 text-center text-xs text-cu-muted">
                      Tidak menemukan kategori "{wizardCategorySearch}"
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Select Product */}
          {wizardStep === 2 && (
            <div className="rounded-2xl border border-cu-line bg-cu-surface p-6 sm:p-8 shadow-sm max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-cu-ink">Pilih Produk</h3>
                <button type="button" onClick={() => setWizardStep(1)} className="inline-flex items-center gap-1 text-xs text-cu-muted hover:text-cu-ink transition">
                  <MaterialIcon name="arrow_back" size="xs" /> Kembali
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-cu-muted">
                  <MaterialIcon name="search" size="sm" />
                </span>
                <input
                  type="text"
                  value={wizardProductSearch}
                  onChange={(e) => setWizardProductSearch(e.target.value)}
                  className="block w-full rounded-full border border-cu-line bg-cu-surface py-2.5 pl-11 pr-4 text-sm text-cu-ink placeholder:text-cu-muted/70 focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover transition"
                  placeholder="Cari produk..."
                  autoFocus
                />
              </div>

              {/* Product List */}
              <div className="divide-y divide-cu-line/60 border border-cu-line rounded-2xl overflow-hidden bg-cu-surface shadow-sm">
                {isGenerating ? <div className="p-8 text-center text-xs text-cu-muted">Memuat...</div> : productsList.length > 0 ? productsList.map((prodName) => (
                  <button
                    key={prodName}
                    type="button"
                    onClick={() => handleSelectProduct(prodName)}
                    className="w-full flex items-center justify-between p-4 hover:bg-cu-panel-soft/50 transition text-left group"
                  >
                    <span className="text-sm font-semibold text-cu-ink group-hover:text-cu-focus transition-colors">{prodName}</span>
                    <div className="text-cu-muted group-hover:text-cu-ink transition">
                      <MaterialIcon name="chevron_right" size="sm" />
                    </div>
                  </button>
                )) : (
                  <div className="p-8 text-center text-xs text-cu-muted">
                    {wizardProductSearch.trim() ? `Tidak menemukan produk "${wizardProductSearch}"` : "Belum ada produk di kategori ini."}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Select Variant */}
          {wizardStep === 3 && (
            <div className="rounded-2xl border border-cu-line bg-cu-surface p-6 sm:p-8 shadow-sm max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-cu-ink">Pilih Varian</h3>
                <button type="button" onClick={() => setWizardStep(2)} className="inline-flex items-center gap-1 text-xs text-cu-muted hover:text-cu-ink transition">
                  <MaterialIcon name="arrow_back" size="xs" /> Kembali
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-cu-muted">
                  <MaterialIcon name="search" size="sm" />
                </span>
                <input
                  type="text"
                  value={wizardVariantSearch}
                  onChange={(e) => setWizardVariantSearch(e.target.value)}
                  className="block w-full rounded-full border border-cu-line bg-cu-surface py-2.5 pl-11 pr-4 text-sm text-cu-ink placeholder:text-cu-muted/70 focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover transition"
                  placeholder="Cari varian..."
                  autoFocus
                />
              </div>

              {/* Variant List */}
              <div className="divide-y divide-cu-line/60 border border-cu-line rounded-2xl overflow-hidden bg-cu-surface shadow-sm">
                {variantsList.length > 0 ? variantsList.map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleSelectVariant(prod)}
                    className="w-full flex items-center justify-between p-4 hover:bg-cu-panel-soft/50 transition text-left group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-cu-ink group-hover:text-cu-focus transition-colors">{prod.variant_name || "Default"}</span>
                      </div>
                      <span className="text-xs text-cu-muted">Harga Normal: {formatRupiah(prod.normal_price)}</span>
                    </div>
                    <div className="text-cu-muted group-hover:text-cu-ink transition">
                      <MaterialIcon name="chevron_right" size="sm" />
                    </div>
                  </button>
                )) : (
                  <div className="p-8 text-center text-xs text-cu-muted">
                    Tidak menemukan varian "{wizardVariantSearch}"
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Input Promo Price */}
          {wizardStep === 4 && selectedProduct && (
            <div className="rounded-2xl border border-cu-line bg-cu-surface p-6 sm:p-8 shadow-sm max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-5 border-b border-cu-line pb-3">
                <h3 className="text-base font-bold text-cu-ink">Atur Harga Promo</h3>
                <button type="button" onClick={handleBackFromStep4} className="inline-flex items-center gap-1 text-xs text-cu-muted hover:text-cu-ink transition">
                  <MaterialIcon name="arrow_back" size="xs" /> Kembali
                </button>
              </div>

              <form onSubmit={handleGenerateSingle} className="space-y-5">
                {/* Product Info Card */}
                <div className="p-4 rounded-xl bg-cu-surface-soft border border-cu-line/60 space-y-2.5">
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <span className="text-cu-muted">Kategori</span>
                    <span className="font-bold text-cu-ink text-right">{wizardCategoryName}</span>

                    <span className="text-cu-muted">Produk</span>
                    <span className="font-bold text-cu-ink text-right">{selectedProduct.name}</span>

                    <span className="text-cu-muted">Varian</span>
                    <span className="font-semibold text-cu-ink text-right font-mono">{selectedProduct.variant_name || "Default"}</span>

                    <span className="text-cu-muted">Harga Normal</span>
                    <span className="font-bold text-cu-ink text-right">{formatRupiah(selectedProduct.normal_price)}</span>
                  </div>
                </div>

                {/* Harga Diskon */}
                <div>
                  <label htmlFor="wizardDiscountPrice" className="block text-sm font-medium text-cu-ink mb-1.5">Harga Promo / Diskon</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-semibold text-cu-muted">Rp</span>
                    <input
                      type="number"
                      id="wizardDiscountPrice"
                      min="0"
                      value={wizardDiscountPrice}
                      onChange={(e) => setWizardDiscountPrice(e.target.value)}
                      className="block w-full rounded-full border border-cu-line bg-cu-surface py-2.5 pl-9 pr-3 text-sm text-cu-ink focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-cu-line flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-cu-ink px-6 py-2.5 text-sm font-semibold text-cu-surface transition hover:bg-cu-ink-hover shadow-sm focus:outline-none focus:ring-1 focus:ring-cu-border-hover"
                  >
                    <MaterialIcon name="photo_filter" size="sm" />
                    <span>Buat Gambar Label</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 5: Generating Loading */}
          {wizardStep === 5 && (
            <div className="rounded-2xl border border-cu-line bg-cu-surface p-6 sm:p-12 shadow-sm max-w-xl mx-auto text-center">
              <div className="flex flex-col items-center justify-center space-y-6">
                
                {/* Custom Spinner/Pulse ring */}
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-cu-info opacity-20"></span>
                  <div className="size-16 rounded-full bg-cu-info-soft flex items-center justify-center text-cu-info shadow-sm z-10 relative">
                    <MaterialIcon size="md" name="cloud_sync" className="animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2 max-w-sm">
                  <h3 className="text-base font-bold text-cu-ink">Sedang Menyusun Gambar Label</h3>
                  <p className="text-xs text-cu-muted">Sistem Creative Universe sedang menyusun layout promo dan menghasilkan gambar. Harap tunggu...</p>
                </div>

                <div className="flex items-center gap-1.5 text-cu-info">
                  <span className="text-xs font-extrabold tracking-wider uppercase">Proses:</span>
                  <span className="text-xs font-black tracking-normal animate-pulse">Berlangsung...</span>
                </div>

                <div className="w-full space-y-2">
                  <div className="cu-loading-bar">
                    <div className="cu-loading-bar-value"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Success Output */}
          {wizardStep === 6 && (
            <div className="rounded-2xl border border-cu-line bg-cu-surface p-6 sm:p-12 shadow-sm max-w-xl mx-auto text-center">
              <div className="flex flex-col items-center justify-center space-y-5">
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-cu-success opacity-20"></span>
                  <div className="size-16 rounded-full bg-cu-success-soft text-cu-success flex items-center justify-center shadow-sm relative z-10">
                    <MaterialIcon name="check_circle" className="animate-pulse" size="lg" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-cu-ink">Label Berhasil Dibuat!</h3>
                  <p className="text-xs text-cu-muted">Label promo untuk produk <span className="font-bold">{selectedProduct?.name}</span> telah siap.</p>
                </div>

                {/* Preview Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-4 border-t border-cu-line/40">
                  {generatedViewUrl && (
                    <a
                      href={generatedViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-cu-line bg-cu-surface px-5 py-2 text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft focus:outline-none focus:ring-1 focus:ring-cu-border-hover"
                    >
                      <MaterialIcon name="visibility" size="xs" />
                      Lihat Label
                    </a>
                  )}
                  {generatedDownloadUrl && (
                    <a
                      href={generatedDownloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-full bg-cu-ink px-5 py-2 text-sm font-semibold text-cu-surface transition hover:bg-cu-ink-hover shadow-sm focus:outline-none focus:ring-1 focus:ring-cu-border-hover"
                    >
                      <MaterialIcon name="download" size="xs" />
                      Unduh Gambar
                    </a>
                  )}
                </div>

                <div className="pt-4">
                  <button type="button" onClick={resetWizard} className="inline-flex items-center gap-1 text-xs font-semibold text-cu-info hover:underline">
                    <MaterialIcon name="replay" size="xs" /> Buat Label Lainnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Checklist Generator */}
      {activeTab === "checklist" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-cu-line bg-cu-surface p-6 sm:p-8 shadow-sm">
            <div className="flex items-start justify-between border-b border-cu-line pb-4 mb-5">
              <div>
                <h2 className="text-lg font-semibold text-cu-ink">Buat Banyak Label Sekaligus</h2>
                <p className="text-xs text-cu-muted mt-1">Pilih beberapa produk di bawah untuk dibuat label harganya secara bersamaan lewat antrean sistem.</p>
              </div>
            </div>

            {/* Loading Bar Sedang Memproses Checklist */}
            {isSubmittingChecklist && (
              <div className="w-full space-y-2 mb-6">
                <div className="flex items-center justify-between text-xs text-cu-info font-medium">
                  <span>Sedang memasukkan data ke antrean sistem, mohon tunggu sejenak...</span>
                  <span className="animate-pulse">Memuat</span>
                </div>
                <div className="cu-loading-bar">
                  <div className="cu-loading-bar-value"></div>
                </div>
              </div>
            )}

            <form onSubmit={handleChecklistGenerate} className="space-y-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-5">
                {/* Pencarian Varian (Kiri) */}
                <div className="w-full sm:max-w-md">
                  <label htmlFor="checklistSearch" className="block text-sm font-medium text-cu-ink mb-1.5">Cari Produk</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-cu-muted">
                      <MaterialIcon name="search" size="sm" />
                    </div>
                    <input
                      type="search"
                      id="checklistSearch"
                      value={checklistSearch}
                      onChange={(e) => {
                        setChecklistSearch(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setChecklistPage(1);
                          setChecklistAppliedSearch(checklistSearch);
                        }
                      }}
                      className="block w-full rounded-full border border-cu-line bg-cu-surface py-2.5 pl-11 pr-4 text-sm text-cu-ink placeholder-cu-muted shadow-sm focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover"
                      placeholder="Cari nama produk..."
                    />
                  </div>
                </div>

                {/* Keterangan Produk Terpilih (Kanan) */}
                <div className="flex items-center gap-3 text-sm font-bold text-cu-ink">
                  <button
                    type="button"
                    onClick={() => setShowOnlySelected(!showOnlySelected)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                      showOnlySelected
                        ? "bg-cu-success text-white ring-2 ring-cu-success/20"
                        : "bg-cu-ink text-white hover:opacity-90"
                    }`}
                  >
                    {showOnlySelected ? "Tampilkan Katalog" : `${selectedVariants.length} Produk Terpilih`}
                  </button>
                </div>
              </div>

              {/* Checklist Table */}
              <div className="border border-cu-line rounded-lg overflow-hidden bg-cu-surface">
                <div className="bg-cu-panel-soft px-4 py-3 flex items-center justify-end border-b border-cu-line text-xs font-semibold text-cu-muted gap-3">
                  {!showOnlySelected && (
                    <>
                      <button
                        type="button"
                        onClick={handleSelectAllCurrentPage}
                        className="text-cu-info hover:text-cu-info-hover transition"
                      >
                        Pilih Semua (Hal Ini)
                      </button>
                      <span className="text-cu-line">|</span>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="text-cu-muted hover:text-cu-ink transition"
                  >
                    Bersihkan Pilihan
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-cu-line bg-cu-panel-soft/50 text-xs font-semibold uppercase tracking-wider text-cu-muted">
                        <th className="px-6 py-3 hidden sm:table-cell">Kategori</th>
                        <th className="px-6 py-3">Produk</th>
                        <th className="px-6 py-3 hidden sm:table-cell">Varian</th>
                        <th className="px-6 py-3 text-right hidden sm:table-cell">Harga Normal</th>
                        <th className="px-6 py-3 text-right text-cu-success">Harga Diskon</th>
                        <th className="px-6 py-3 text-center w-24">Pilih</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cu-line">
                      {checklistIsLoading ? (
                        <tr><td colSpan={6} className="px-6 py-8 text-center text-cu-muted">Memuat...</td></tr>
                      ) : (
                        (() => {
                          const displayedProducts = showOnlySelected
                            ? Object.values(selectedProductsData)
                            : checklistProducts.filter(p => !selectedVariants.includes(p.id));

                          if (displayedProducts.length === 0) {
                            return (
                              <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-cu-muted">
                                  {showOnlySelected
                                    ? "Belum ada produk terpilih."
                                    : !checklistAppliedSearch.trim()
                                    ? "Silakan cari produk untuk mulai memilih."
                                    : "Tidak ada produk yang ditemukan."}
                                </td>
                              </tr>
                            );
                          }

                          return displayedProducts.map((p) => {
                            const isChecked = selectedVariants.includes(p.id);
                            return (
                              <tr key={p.id} className={`${isChecked ? "bg-cu-panel-soft/30" : ""} transition-colors hover:bg-cu-panel-soft/30`}>
                                <td className="px-6 py-4 text-cu-muted hidden sm:table-cell">
                                  {p.category.name}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="font-semibold text-cu-ink">{p.name}</div>
                                  <div className="sm:hidden text-[10px] text-cu-muted mt-1 space-y-0.5">
                                    <span>Kategori: {p.category.name}</span>
                                    <span>• Varian: {p.variant_name || "Default"}</span>
                                    <span className="block line-through">Normal: {formatRupiah(p.normal_price)}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-cu-ink hidden sm:table-cell">
                                  {p.variant_name || "Default"}
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-cu-ink hidden sm:table-cell">
                                  {formatRupiah(p.normal_price)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="relative max-w-[150px] ml-auto">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs font-semibold text-cu-muted">Rp</span>
                                    <input
                                      type="number"
                                      min="0"
                                      placeholder={p.discount_price ? String(p.discount_price) : "Harga..."}
                                      value={checklistPrices[p.id] ?? ""}
                                      onChange={(e) => handleChecklistPriceChange(p.id, e.target.value)}
                                      className="block w-full rounded-full border border-cu-line bg-cu-surface py-1 pl-8 pr-3 text-right text-sm text-cu-ink focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover"
                                    />
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSelectProduct(p)}
                                    className={`inline-flex size-9 items-center justify-center rounded-lg bg-cu-ink text-white transition-all duration-300 hover:bg-cu-ink/90 ${
                                      isChecked ? "opacity-60" : "opacity-100"
                                    }`}
                                    title={isChecked ? "Hapus dari pilihan" : "Tambah ke pilihan"}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="20px"
                                      viewBox="0 -960 960 960"
                                      width="20px"
                                      fill="currentColor"
                                      className={`transition-transform duration-300 ${isChecked ? "rotate-45" : ""}`}
                                    >
                                      <path d="M444-144v-300H144v-72h300v-300h72v300h300v72H516v300h-72Z" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            );
                          });
                        })()
                      )}
                    </tbody>
                  </table>
                </div>

                {!showOnlySelected && (
                  <div className="border-t border-cu-line px-6 py-4 bg-cu-panel-soft/20 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-cu-muted">
                    <span>Halaman {checklistPage} dari {checklistLastPage}</span>
                    <Pagination page={checklistPage} lastPage={checklistLastPage} onPage={(p) => { setChecklistPage(p); loadChecklistProducts(); }} />
                  </div>
                )}
              </div>

              {/* Submit Section */}
              <div className="pt-4 border-t border-cu-line flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmittingChecklist || selectedVariants.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cu-ink px-5 py-2.5 text-sm font-semibold text-cu-surface transition hover:bg-cu-ink-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover disabled:opacity-50"
                >
                  {isSubmittingChecklist ? (
                    <svg className="animate-spin h-4 w-4 text-cu-surface" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <MaterialIcon name="playlist_play" size="sm" />
                  )}
                  <span>Buat Label Terpilih</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Bulk CSV Uploader */}
      {activeTab === "bulk" && (
        <div className="max-w-3xl">
          <form onSubmit={handleBulkGenerate} className="rounded-2xl border border-cu-line bg-cu-surface p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-start justify-between border-b border-cu-line pb-4 mb-5">
              <div>
                <h2 className="text-lg font-semibold text-cu-ink">Buat Label Massal via File CSV</h2>
                <p className="text-xs text-cu-muted mt-1">Buat label harga dalam jumlah besar secara otomatis dengan mengunggah file daftar produk.</p>
              </div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const csvContent = "data:text/csv;charset=utf-8,produk,varian,harga_diskon\nJETE TWS T10,Black,199000\nJETE TWS T10,White,199000\nJETE Powerbank H1,Black,149000\n";
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "pricetag_bulk_generate_template.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-cu-info hover:underline"
              >
                <MaterialIcon name="download_for_offline" size="sm" />
                Download Template CSV
              </a>
            </div>

            {/* Loading Bar Sedang Memproses Bulk */}
            {isSubmittingBulk && (
              <div className="w-full space-y-2 mb-6">
                <div className="flex items-center justify-between text-xs text-cu-info font-medium">
                  <span>Mengunggah daftar produk dan memasukkan ke antrean sistem...</span>
                  <span className="animate-pulse">Memuat</span>
                </div>
                <div className="cu-loading-bar">
                  <div className="cu-loading-bar-value"></div>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* Nama Batch */}
              <div>
                <label htmlFor="batchName" className="block text-sm font-medium text-cu-ink mb-1.5">Nama Kelompok Promo</label>
                <input
                  type="text"
                  id="batchName"
                  value={bulkBatchName}
                  onChange={(e) => setBulkBatchName(e.target.value)}
                  className="block w-full rounded-full border border-cu-line bg-cu-surface px-4 py-2.5 text-sm text-cu-ink placeholder-cu-muted focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover"
                  placeholder="Misal: Promo Harbolnas 12.12"
                  required
                />
              </div>

              {/* Upload File CSV */}
              <div>
                <label className="block text-sm font-medium text-cu-ink mb-1.5">File CSV</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-cu-line rounded-lg cursor-pointer bg-cu-surface hover:bg-cu-panel-soft transition duration-200 relative overflow-hidden">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <MaterialIcon name="cloud_upload" size="lg" className="text-cu-soft mb-2" />
                      <p className="mb-1 text-sm text-cu-ink"><span className="font-semibold">Klik untuk memilih file</span> atau tarik file ke sini</p>
                      <p className="text-xs text-cu-muted">File CSV (Maks. 2MB)</p>
                      
                      {bulkFile && (
                        <div className="mt-3 flex items-center gap-1.5 rounded-full bg-cu-info-soft border border-cu-info/20 px-3 py-1 text-xs text-cu-info font-medium">
                          <MaterialIcon name="insert_drive_file" size="xs" />
                          {bulkFile.name}
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".csv,.txt,text/csv"
                      ref={fileInputRef}
                      onChange={(e) => setBulkFile(e.target.files?.[0] ?? null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required
                    />
                  </label>
                </div>
              </div>

              {/* Warning limitations */}
              <div className="rounded-lg bg-cu-warning-soft border border-cu-warning/20 p-4 flex gap-3">
                <MaterialIcon name="info" className="text-cu-warning shrink-0" size="sm" />
                <div className="text-xs text-cu-warning-hover leading-relaxed">
                  <span className="font-bold">Informasi Antrean Pemrosesan: </span>
                  Sistem Creative Universe akan memproses daftar produk Anda secara bertahap dalam antrean untuk menjamin kestabilan dan kecepatan pembuatan gambar.
                </div>
              </div>

              <div className="pt-4 border-t border-cu-line flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmittingBulk}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cu-ink px-5 py-2.5 text-sm font-semibold text-cu-surface transition hover:bg-cu-ink-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover disabled:opacity-50"
                >
                  {isSubmittingBulk ? (
                    <svg className="animate-spin h-4 w-4 text-cu-surface" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <MaterialIcon name="queue" size="sm" />
                  )}
                  <span>Mulai Membuat Label Massal</span>
                </button>
              </div>

            </div>
          </form>
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
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className="rounded border border-cu-line bg-cu-surface px-3 py-1.5 text-[10px] font-bold text-cu-ink transition hover:bg-cu-panel-soft disabled:opacity-50"
      >
        Sebelumnya
      </button>
      <button
        type="button"
        disabled={page >= lastPage}
        onClick={() => onPage(page + 1)}
        className="rounded border border-cu-line bg-cu-surface px-3 py-1.5 text-[10px] font-bold text-cu-ink transition hover:bg-cu-panel-soft disabled:opacity-50"
      >
        Berikutnya
      </button>
    </div>
  );
}

function Alert({ tone, message, onClose }: { tone: "success" | "error"; message: string; onClose: () => void }) {
  const borderClass = tone === "success" ? "border-cu-success/20 bg-cu-success-soft text-cu-success" : "border-cu-danger/20 bg-cu-danger-soft text-cu-danger";
  return (
    <div className={`flex justify-between rounded-xl border px-4 py-3 text-sm ${borderClass}`}>
      <span className="font-semibold whitespace-pre-wrap">{message}</span>
      <button type="button" onClick={onClose} aria-label="Tutup" className="ml-3 self-start shrink-0">
        <MaterialIcon name="close" size="xs" />
      </button>
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
