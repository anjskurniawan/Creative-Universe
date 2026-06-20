"use client";

import React, { FormEvent, useCallback, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/material-icon";
import { apiFetch } from "@/lib/api";
import { pushLocalNotification } from "@/lib/local-notifications";
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

  const notify = useCallback((message: string) => {
    pushLocalNotification(message, "/pricetag/generator");
  }, []);

  // ----------------------------------------------------
  // Tab 1: Wizard Single State
  // ----------------------------------------------------
  const [wizardStep, setWizardStep] = useState(1);
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
  const [isChecklistDesktop, setIsChecklistDesktop] = useState(false);

  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);
  const [selectedProductsData, setSelectedProductsData] = useState<Record<number, PricetagProduct>>({});
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [expandedChecklistProductId, setExpandedChecklistProductId] = useState<number | null>(null);
  const [checklistPrices, setChecklistPrices] = useState<Record<number, string>>({});
  const [checklistBatchName, setChecklistBatchName] = useState("");
  const [isSubmittingChecklist, setIsSubmittingChecklist] = useState(false);

  // ----------------------------------------------------
  // Tab 3: Bulk CSV State
  // ----------------------------------------------------
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bulkStep, setBulkStep] = useState(1);
  const [csvData, setCsvData] = useState<Array<{ produk: string; varian: string; harga_diskon: string; error?: string }>>([]);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [isValidatingCsv, setIsValidatingCsv] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncViewport = () => {
      setIsChecklistDesktop(mediaQuery.matches);
      setChecklistPage(1);
    };

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);
    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);



  // ----------------------------------------------------
  // Deep Link ?product_id={id} Handling
  // ----------------------------------------------------
  useEffect(() => {
    const productIdParam = searchParams.get("product_id");
    if (productIdParam) {
      const prodId = Number(productIdParam);
      if (!isNaN(prodId)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsGenerating(true);
        apiFetch<PricetagProduct>(`/pricetag/products/${prodId}`)
          .then((prod) => {
            // eslint-disable-next-line react-hooks/set-state-in-effect
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
            notify(pricetagError(err));
          })
          .finally(() => {
            setIsGenerating(false);
          });
      }
    }
  }, [notify, searchParams]);

  // ----------------------------------------------------
  // Tab 1 (Single): Product Search API (distinct product names)
  // ----------------------------------------------------
  useEffect(() => {
    if (activeTab !== "single" || wizardStep !== 1) return;

    const query = wizardProductSearch.trim();
    if (!query) {
      queueMicrotask(() => {
        setProductsList([]);
      });
      return;
    }

    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams({
        per_page: "100",
        search: query,
      });

      apiFetch<PricetagPage<PricetagProduct>>(`/pricetag/products?${params}`)
        .then((res) => {
          // extract distinct product names
          const names = Array.from(new Set(res.data.map((p) => p.name)));
          setProductsList(names);
        })
        .catch((err) => notify(pricetagError(err)));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [wizardProductSearch, wizardStep, activeTab, notify]);

  // ----------------------------------------------------
  // Tab 1 (Single): Variant Search API
  // ----------------------------------------------------
  useEffect(() => {
    if (activeTab !== "single" || wizardStep !== 2 || !wizardProductName) return;

    const query = wizardVariantSearch.trim();
    const params = new URLSearchParams({
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
      .catch((err) => notify(pricetagError(err)));
  }, [wizardVariantSearch, wizardProductName, wizardStep, activeTab, notify]);

  // ----------------------------------------------------
  // Tab 1 (Single): Actions
  // ----------------------------------------------------
  const handleSelectProduct = (prodName: string) => {
    setWizardProductName(prodName);
    setWizardVariantSearch("");

    // Fetch variants to check count
    const params = new URLSearchParams({
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
            // Auto skip to step 3
            setWizardProductId(singleVar.id);
            setSelectedProduct(singleVar);
            setWizardDiscountPrice(String(singleVar.discount_price ?? 0));
            setWizardCategoryId(singleVar.category.id);
            setWizardCategoryName(singleVar.category.name);
            setWizardStep(3);
            return;
          }
        }
        if (list.length > 0) {
          setWizardCategoryId(list[0].category.id);
          setWizardCategoryName(list[0].category.name);
        }
        setVariantsList(list);
        setWizardStep(2);
      })
      .catch((err) => notify(pricetagError(err)))
      .finally(() => setIsGenerating(false));
  };

  const handleSelectVariant = (prod: PricetagProduct) => {
    setWizardProductId(prod.id);
    setSelectedProduct(prod);
    setWizardDiscountPrice(String(prod.discount_price ?? 0));
    setWizardCategoryId(prod.category.id);
    setWizardCategoryName(prod.category.name);
    setWizardStep(3);
  };

  const handleBackFromStep3 = () => {
    if (!wizardProductName) return;
    setIsGenerating(true);

    const params = new URLSearchParams({
      search: wizardProductName,
      per_page: "100",
    });

    apiFetch<PricetagPage<PricetagProduct>>(`/pricetag/products?${params}`)
      .then((res) => {
        const list = res.data.filter((p) => p.name === wizardProductName);
        if (list.length === 1) {
          const singleVar = list[0];
          if (singleVar.variant_name === "Default" || !singleVar.variant_name) {
            setWizardStep(1);
            return;
          }
        }
        setWizardStep(2);
      })
      .catch((err) => notify(pricetagError(err)))
      .finally(() => setIsGenerating(false));
  };

  const handleGenerateSingle = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsGenerating(true);
    setWizardStep(4); // Go to loader page

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
      setWizardStep(5);
      notify(`Label harga untuk ${res.name} berhasil dibuat!`);
    } catch (err) {
      notify(pricetagError(err));
      setWizardStep(3); // Rollback to form input
    } finally {
      setIsGenerating(false);
    }
  };

  const resetWizard = () => {
    setWizardStep(1);
    setWizardProductSearch("");
    setProductsList([]);
    setWizardCategoryId(null);
    setWizardCategoryName("");
    setWizardProductName(null);
    setWizardProductId(null);
    setSelectedProduct(null);
    setWizardDiscountPrice("");
    setGeneratedViewUrl(null);
    setGeneratedDownloadUrl(null);
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

    try {
      const search = checklistAppliedSearch.trim();
      const params = new URLSearchParams({
        page: String(isChecklistDesktop ? checklistPage : 1),
        per_page: isChecklistDesktop ? "10" : "100",
        search,
      });
      const firstPage = await apiFetch<PricetagPage<PricetagProduct>>(`/pricetag/products?${params}`);

      if (!isChecklistDesktop && firstPage.meta.last_page > 1) {
        const remainingPages = await Promise.all(
          Array.from({ length: firstPage.meta.last_page - 1 }, (_, index) => {
            const nextParams = new URLSearchParams({
              page: String(index + 2),
              per_page: "100",
              search,
            });
            return apiFetch<PricetagPage<PricetagProduct>>(`/pricetag/products?${nextParams}`);
          })
        );
        setChecklistProducts([
          ...firstPage.data,
          ...remainingPages.flatMap((page) => page.data),
        ]);
      } else {
        setChecklistProducts(firstPage.data);
      }

      setChecklistLastPage(isChecklistDesktop ? firstPage.meta.last_page : 1);
      setChecklistTotal(firstPage.meta.total);
    } catch (err) {
      notify(pricetagError(err));
    } finally {
      setChecklistIsLoading(false);
    }
  }, [checklistPage, checklistAppliedSearch, activeTab, isChecklistDesktop, notify]);

  useEffect(() => {
    queueMicrotask(() => void loadChecklistProducts());
  }, [loadChecklistProducts]);

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
      notify("Pilih minimal satu produk untuk dibuat labelnya.");
      return;
    }

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
      notify(pricetagError(err));
    } finally {
      setIsSubmittingChecklist(false);
    }
  };

  // ----------------------------------------------------
  // Tab 3 (Bulk CSV): Actions
  // ----------------------------------------------------
  const handleBulkFileChange = (file: File | null) => {
    setBulkFile(file);
    if (file) {
      setIsValidatingCsv(true);
      parseAndValidateCSV(file);
    } else {
      setCsvData([]);
      setCsvErrors([]);
      setBulkStep(1);
    }
  };

  const parseAndValidateCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        setIsValidatingCsv(false);
        return;
      }
      
      // Delay for validation screen transition
      setTimeout(() => {
        const lines = text.split(/\r?\n/);
        if (lines.length < 2) {
          const validationMessage = "File CSV kosong atau tidak memiliki baris data.";
          setCsvErrors([validationMessage]);
          notify(validationMessage);
          setCsvData([]);
          setIsValidatingCsv(false);
          setBulkStep(2);
          return;
        }
        
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
        const prodIndex = headers.indexOf("produk");
        const varIndex = headers.indexOf("varian");
        const priceIndex = headers.indexOf("harga_diskon");
        
        if (prodIndex === -1 || varIndex === -1 || priceIndex === -1) {
          const validationMessage = "Format header CSV tidak valid. Harus mengandung kolom: produk, varian, harga_diskon";
          setCsvErrors([validationMessage]);
          notify(validationMessage);
          setCsvData([]);
          setIsValidatingCsv(false);
          setBulkStep(2);
          return;
        }
        
        const parsedRows: Array<{ produk: string; varian: string; harga_diskon: string; error?: string }> = [];
        const errorsList: string[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const cols = line.split(",").map(c => c.trim().replace(/^["']|["']$/g, ""));
          if (cols.length < headers.length) {
            errorsList.push(`Baris ${i + 1}: Jumlah kolom kurang dari header.`);
            continue;
          }
          
          const produk = cols[prodIndex];
          const varian = cols[varIndex];
          const harga_diskon = cols[priceIndex];
          
          let rowError = "";
          if (!produk) {
            rowError = "Nama produk kosong.";
          } else if (harga_diskon && isNaN(Number(harga_diskon))) {
            rowError = "Harga diskon harus berupa angka.";
          }
          
          if (rowError) {
            errorsList.push(`Baris ${i + 1}: ${rowError}`);
          }
          
          parsedRows.push({
            produk,
            varian,
            harga_diskon,
            error: rowError || undefined
          });
        }
        
        setCsvData(parsedRows);
        setCsvErrors(errorsList);
        if (errorsList.length > 0) {
          notify(`Ditemukan ${errorsList.length} kesalahan pada data CSV. Periksa status setiap baris sebelum memproses ulang.`);
        } else {
          notify(`Semua data CSV valid (${parsedRows.length} baris) dan siap diproses.`);
        }
        setIsValidatingCsv(false);
        setBulkStep(2);
      }, 1000);
    };
    reader.readAsText(file);
  };

  const handleBulkGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!bulkFile) {
      notify("File CSV wajib diunggah.");
      return;
    }

    setIsSubmittingBulk(true);
    setBulkStep(3);

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
    const defaultBulkBatchName = `Pricetag CSV ${formattedDate} ${formattedTime}`;

    const formData = new FormData();
    formData.append("batch_name", defaultBulkBatchName);
    formData.append("file", bulkFile);

    try {
      await apiFetch("/pricetag/generations/bulk", {
        method: "POST",
        body: formData,
      });

      setBulkFile(null);
      setCsvData([]);
      setCsvErrors([]);
      setBulkStep(1);
      router.push("/pricetag/history");
    } catch (err) {
      notify(pricetagError(err));
      setBulkStep(2);
    } finally {
      setIsSubmittingBulk(false);
    }
  };

  if (!hasPermission("access-pricetag")) {
    return <AccessDenied />;
  }

  const displayedChecklistProducts = showOnlySelected
    ? Object.values(selectedProductsData)
    : checklistProducts;

  return (
    <div>
      <div className="mb-8 flex w-full justify-center">
        <div className="grid w-full grid-cols-3 gap-1 rounded-2xl border border-cu-line bg-cu-surface-soft p-1 shadow-sm sm:inline-flex sm:w-auto sm:flex-nowrap sm:rounded-full md:gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("single")}
            className={`flex min-w-0 items-center justify-center rounded-xl px-1 py-2 text-center text-[8px] font-bold uppercase leading-tight tracking-normal transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cu-border-hover sm:rounded-full sm:px-3 sm:text-[10px] sm:tracking-wider sm:whitespace-nowrap md:px-6 md:py-2.5 md:text-xs ${
              activeTab === "single"
                ? "bg-cu-ink text-white shadow-sm font-extrabold"
                : "text-cu-muted hover:text-cu-ink hover:bg-cu-panel-soft/50"
            }`}
          >
            Buat Label Satuan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("checklist")}
            className={`flex min-w-0 items-center justify-center rounded-xl px-1 py-2 text-center text-[8px] font-bold uppercase leading-tight tracking-normal transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cu-border-hover sm:rounded-full sm:px-3 sm:text-[10px] sm:tracking-wider sm:whitespace-nowrap md:px-6 md:py-2.5 md:text-xs ${
              activeTab === "checklist"
                ? "bg-cu-ink text-white shadow-sm font-extrabold"
                : "text-cu-muted hover:text-cu-ink hover:bg-cu-panel-soft/50"
            }`}
          >
            Buat Label Sekaligus
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bulk")}
            className={`flex min-w-0 items-center justify-center rounded-xl px-1 py-2 text-center text-[8px] font-bold uppercase leading-tight tracking-normal transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cu-border-hover sm:rounded-full sm:px-3 sm:text-[10px] sm:tracking-wider sm:whitespace-nowrap md:px-6 md:py-2.5 md:text-xs ${
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
            <div className="flex items-start justify-between max-w-xl mx-auto">
              {/* Step 1 Product */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${wizardStep >= 1 ? "bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10" : "bg-cu-panel-soft text-cu-muted border border-cu-line"}`}>
                  1
                </div>
                <span className={`max-w-16 text-center text-[9px] font-bold uppercase leading-tight tracking-wide sm:text-[10px] sm:tracking-wider ${wizardStep >= 1 ? "text-cu-ink" : "text-cu-muted"}`}>Produk</span>
              </div>

              <div className={`mt-4 h-0.5 flex-1 mx-2 transition-all duration-300 ${wizardStep >= 2 ? "bg-cu-ink" : "bg-cu-line"}`}></div>

              {/* Step 2 Variant */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${wizardStep >= 2 ? "bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10" : "bg-cu-panel-soft text-cu-muted border border-cu-line"}`}>
                  2
                </div>
                <span className={`max-w-16 text-center text-[9px] font-bold uppercase leading-tight tracking-wide sm:text-[10px] sm:tracking-wider ${wizardStep >= 2 ? "text-cu-ink" : "text-cu-muted"}`}>Varian</span>
              </div>

              <div className={`mt-4 h-0.5 flex-1 mx-2 transition-all duration-300 ${wizardStep >= 3 ? "bg-cu-ink" : "bg-cu-line"}`}></div>

              {/* Step 3 Price */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${wizardStep >= 3 ? "bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10" : "bg-cu-panel-soft text-cu-muted border border-cu-line"}`}>
                  3
                </div>
                <span className={`max-w-16 text-center text-[9px] font-bold uppercase leading-tight tracking-wide sm:text-[10px] sm:tracking-wider ${wizardStep >= 3 ? "text-cu-ink" : "text-cu-muted"}`}>Harga</span>
              </div>

              <div className={`mt-4 h-0.5 flex-1 mx-2 transition-all duration-300 ${wizardStep >= 5 ? "bg-cu-ink" : "bg-cu-line"}`}></div>

              {/* Step 4 Result */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${wizardStep >= 5 ? "bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10" : "bg-cu-panel-soft text-cu-muted border border-cu-line"}`}>
                  <MaterialIcon name="check" size="xs" />
                </div>
                <span className={`max-w-16 text-center text-[9px] font-bold uppercase leading-tight tracking-wide sm:text-[10px] sm:tracking-wider ${wizardStep >= 5 ? "text-cu-ink" : "text-cu-muted"}`}>Selesai</span>
              </div>
            </div>
          </div>

          {/* STEP 1: Select Product */}
          {wizardStep === 1 && (
            <div className="rounded-2xl border border-cu-line bg-cu-surface p-6 sm:p-8 shadow-sm max-w-xl mx-auto">
              <h3 className="text-base font-bold text-cu-ink mb-4">Cari Produk</h3>
              
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
                  placeholder="Cari nama produk..."
                  autoFocus
                />
              </div>

              {/* Product List */}
              {wizardProductSearch.trim() !== "" && (
                <div className="divide-y divide-cu-line/60 border border-cu-line rounded-2xl overflow-hidden bg-cu-surface shadow-sm mt-4">
                  {isGenerating ? (
                    <div className="p-8 text-center text-xs text-cu-muted">Memuat...</div>
                  ) : productsList.length > 0 ? (
                    productsList.map((prodName) => (
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
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-cu-muted">
                      Tidak menemukan produk &quot;{wizardProductSearch}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Select Variant */}
          {wizardStep === 2 && (
            <div className="rounded-2xl border border-cu-line bg-cu-surface p-6 sm:p-8 shadow-sm max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-cu-ink">Pilih Varian</h3>
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
                    Tidak menemukan varian &quot;{wizardVariantSearch}&quot;
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Input Promo Price */}
          {wizardStep === 3 && selectedProduct && (
            <div className="rounded-2xl border border-cu-line bg-cu-surface p-6 sm:p-8 shadow-sm max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-5 border-b border-cu-line pb-3">
                <h3 className="text-base font-bold text-cu-ink">Atur Harga Promo</h3>
                <button type="button" onClick={handleBackFromStep3} className="inline-flex items-center gap-1 text-xs text-cu-muted hover:text-cu-ink transition">
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

                <div className="flex items-center gap-3 border-t border-cu-line pt-4">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cu-ink px-6 py-2.5 text-sm font-semibold text-cu-surface shadow-sm transition hover:bg-cu-ink-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover sm:w-auto"
                  >
                    <MaterialIcon name="photo_filter" size="sm" />
                    <span>Buat Gambar Label</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: Generating Loading */}
          {wizardStep === 4 && (
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

          {/* STEP 5: Success Output */}
          {wizardStep === 5 && (
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
                {/* Pencarian Varian (Kiri) */}
                <div className="order-2 w-full sm:order-1 sm:max-w-md">
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
                        const nextSearch = e.target.value;
                        setChecklistSearch(nextSearch);
                        setChecklistAppliedSearch(nextSearch);
                        setChecklistPage(1);
                      }}
                      className="h-11 w-full rounded-full border border-cu-line bg-cu-surface pl-11 pr-4 text-sm text-cu-ink placeholder-cu-muted shadow-sm focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover"
                      placeholder="Cari nama produk..."
                    />
                  </div>
                </div>

                {/* Keterangan Produk Terpilih & Action Group (Kanan) - Tinggi disesuaikan dengan Searchbar */}
                <div className="order-1 flex h-11 items-center gap-2 self-end sm:order-2">
                  <div className="inline-flex items-center h-full rounded-full border border-cu-line bg-cu-surface p-1 shadow-sm gap-1">
                    {/* Angka total item terpilih */}
                    <span className="flex items-center justify-center min-w-9 h-9 px-2.5 rounded-full bg-cu-panel-soft text-xs font-bold text-cu-ink" title="Total produk terpilih">
                      {selectedVariants.length}
                    </span>
                    
                    {/* Divider */}
                    <span className="h-4 w-px bg-cu-line"></span>

                    {/* List Item toggle */}
                    <button
                      type="button"
                      onClick={() => setShowOnlySelected(!showOnlySelected)}
                      className={`h-9 px-4 rounded-full text-xs font-semibold transition-all ${
                        showOnlySelected
                          ? "bg-cu-success text-white"
                          : "text-cu-muted hover:text-cu-ink hover:bg-cu-panel-soft/50"
                      }`}
                    >
                      List Item
                    </button>

                    {/* Divider */}
                    <span className="h-4 w-px bg-cu-line"></span>

                    {/* Generate label button */}
                    <button
                      type="submit"
                      disabled={isSubmittingChecklist || selectedVariants.length === 0}
                      className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-full bg-cu-ink text-white text-xs font-bold transition hover:bg-cu-ink/90 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isSubmittingChecklist ? (
                        <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <MaterialIcon name="playlist_play" size="xs" />
                      )}
                      <span>Generate Label</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Checklist Table (Collapsible) */}
              <div 
                className="transition-all duration-500 ease-in-out overflow-hidden"
                style={{
                  maxHeight: (checklistAppliedSearch.trim() !== "" || showOnlySelected) ? "1500px" : "0px",
                  opacity: (checklistAppliedSearch.trim() !== "" || showOnlySelected) ? 1 : 0,
                  marginTop: (checklistAppliedSearch.trim() !== "" || showOnlySelected) ? "1.25rem" : "0px",
                }}
              >
                <div className="overflow-hidden bg-transparent lg:rounded-lg lg:border lg:border-cu-line lg:bg-cu-surface">
                  <div className="hidden items-center justify-end gap-3 border-b border-cu-line bg-cu-panel-soft px-4 py-3 text-xs font-semibold text-cu-muted lg:flex">
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
                  
                  {/* Mobile: kartu produk dengan detail collapse/expand. */}
                  <div className="space-y-3 lg:hidden">
                    {checklistIsLoading ? (
                      <div className="px-4 py-8 text-center text-sm text-cu-muted">Memuat...</div>
                    ) : displayedChecklistProducts.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-cu-muted">
                        {showOnlySelected
                          ? "Belum ada produk terpilih."
                          : !checklistAppliedSearch.trim()
                          ? "Silakan cari produk untuk mulai memilih."
                          : "Tidak ada produk yang ditemukan."}
                      </div>
                    ) : (
                      displayedChecklistProducts.map((product) => {
                        const isExpanded = expandedChecklistProductId === product.id;
                        const isChecked = selectedVariants.includes(product.id);
                        const detailId = `checklist-product-${product.id}`;

                        return (
                          <article
                            key={product.id}
                            className={`overflow-hidden rounded-xl border shadow-sm ${
                              isChecked
                                ? "border-cu-border-hover bg-cu-panel-soft/30"
                                : "border-cu-line bg-cu-surface"
                            }`}
                          >
                            <button
                              type="button"
                              aria-expanded={isExpanded}
                              aria-controls={detailId}
                              onClick={() => setExpandedChecklistProductId(isExpanded ? null : product.id)}
                              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                            >
                              <div className="min-w-0">
                                <p className="break-words text-sm font-semibold text-cu-ink">{product.name}</p>
                                <p className="mt-1 text-xs text-cu-muted">{isChecked ? "Sudah dipilih" : "Ketuk untuk melihat detail"}</p>
                              </div>
                              <MaterialIcon
                                name="expand_more"
                                size="sm"
                                className={`shrink-0 text-cu-muted transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </button>

                            {isExpanded && (
                              <div id={detailId} className="space-y-4 border-t border-cu-line px-4 py-4">
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-cu-muted">Kategori</p>
                                  <p className="mt-1 break-words text-sm font-medium text-cu-ink">{product.category.name}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-cu-muted">Varian</p>
                                  <p className="mt-1 break-words text-sm font-medium text-cu-ink">{product.variant_name || "Default"}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-cu-muted">Harga Normal</p>
                                  <p className="mt-1 text-sm font-medium text-cu-ink">{formatRupiah(product.normal_price)}</p>
                                </div>
                                <div>
                                  <label htmlFor={`checklist-price-${product.id}`} className="text-[10px] font-bold uppercase tracking-wider text-cu-muted">
                                    Harga Diskon
                                  </label>
                                  <div className="relative mt-1.5">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-semibold text-cu-muted">Rp</span>
                                    <input
                                      id={`checklist-price-${product.id}`}
                                      type="number"
                                      min="0"
                                      placeholder={product.discount_price ? String(product.discount_price) : "Harga..."}
                                      value={checklistPrices[product.id] ?? ""}
                                      onChange={(event) => handleChecklistPriceChange(product.id, event.target.value)}
                                      className="block w-full rounded-full border border-cu-line bg-cu-surface py-2 pl-9 pr-4 text-sm text-cu-ink focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover"
                                    />
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleToggleSelectProduct(product)}
                                  className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                                    isChecked
                                      ? "border border-cu-line bg-cu-panel-soft text-cu-ink"
                                      : "bg-cu-ink text-white hover:bg-cu-ink/90"
                                  }`}
                                >
                                  <MaterialIcon name={isChecked ? "remove" : "add"} size="sm" weight={500} />
                                  {isChecked ? "Hapus dari pilihan" : "Tambahkan ke pilihan"}
                                </button>
                              </div>
                            )}
                          </article>
                        );
                      })
                    )}
                  </div>

                  {/* Desktop: tabel produk. */}
                  <div className="hidden overflow-x-auto lg:block">
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
                            if (displayedChecklistProducts.length === 0) {
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

                            return displayedChecklistProducts.map((p) => {
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
                                      className={`inline-flex size-9 items-center justify-center rounded-lg transition-all duration-300 ${
                                        isChecked
                                          ? "bg-cu-panel-soft text-cu-muted border border-cu-line/60"
                                          : "bg-cu-ink text-white hover:bg-cu-ink/90 shadow-sm"
                                      }`}
                                      title={isChecked ? "Hapus dari pilihan" : "Tambah ke pilihan"}
                                    >
                                      <MaterialIcon
                                        name="add"
                                        size="sm"
                                        weight={500}
                                        className={`transition-transform duration-300 ${isChecked ? "rotate-45" : ""}`}
                                      />
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
                    <div className="hidden border-t border-cu-line bg-cu-panel-soft/20 px-6 py-4 text-xs text-cu-muted lg:flex lg:items-center lg:justify-between lg:gap-3">
                      <span>Halaman {checklistPage} dari {checklistLastPage}</span>
                      <Pagination page={checklistPage} lastPage={checklistLastPage} onPage={(p) => { setChecklistPage(p); loadChecklistProducts(); }} />
                    </div>
                  )}
                </div>
              </div>

            </form>
          </div>
        </div>
      )}      {/* Tab 3: Bulk CSV Uploader */}
      {activeTab === "bulk" && (
        <div className="w-full">
          {/* Stepper Indicator */}
          <div className="bg-cu-surface border border-cu-line rounded-xl p-4 shadow-sm mb-6">
            <div className="flex items-center justify-between max-w-xl mx-auto">
              {/* Step 1 Upload */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${bulkStep >= 1 ? "bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10" : "bg-cu-panel-soft text-cu-muted border border-cu-line"}`}>
                  1
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:block ${bulkStep >= 1 ? "text-cu-ink" : "text-cu-muted"}`}>Unggah CSV</span>
              </div>

              <div className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${bulkStep >= 2 ? "bg-cu-ink" : "bg-cu-line"}`}></div>

              {/* Step 2 Validate */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${bulkStep >= 2 ? "bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10" : "bg-cu-panel-soft text-cu-muted border border-cu-line"}`}>
                  2
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:block ${bulkStep >= 2 ? "text-cu-ink" : "text-cu-muted"}`}>Validasi Data</span>
              </div>

              <div className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${bulkStep >= 3 ? "bg-cu-ink" : "bg-cu-line"}`}></div>

              {/* Step 3 Generate */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${bulkStep >= 3 ? "bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10" : "bg-cu-panel-soft text-cu-muted border border-cu-line"}`}>
                  3
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-wider hidden sm:block ${bulkStep >= 3 ? "text-cu-ink" : "text-cu-muted"}`}>Proses</span>
              </div>
            </div>
          </div>

          {/* STEP 1: Input File CSV */}
          {bulkStep === 1 && !isValidatingCsv && (
            <div className="rounded-2xl border border-cu-line bg-cu-surface p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cu-line pb-4 gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-cu-ink">Unggah File CSV</h2>
                  <p className="text-xs text-cu-muted mt-1">Unggah file daftar produk untuk membuat label harga dalam jumlah besar secara otomatis.</p>
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
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cu-info hover:text-cu-info/80 transition shrink-0"
                >
                  <MaterialIcon name="download_for_offline" size="sm" />
                  Download Template CSV
                </a>
              </div>

              <div>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-cu-line rounded-lg cursor-pointer bg-cu-surface hover:bg-cu-panel-soft transition duration-200 relative overflow-hidden">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <MaterialIcon name="cloud_upload" size="lg" className="text-cu-soft mb-2" />
                      <p className="mb-1 text-sm text-cu-ink"><span className="font-semibold">Klik untuk memilih file</span> atau tarik file ke sini</p>
                      <p className="text-xs text-cu-muted">File CSV (Maks. 2MB)</p>
                    </div>
                    <input
                      type="file"
                      accept=".csv,.txt,text/csv"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        handleBulkFileChange(file);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* LOADING STATE: Membaca & Memvalidasi File */}
          {isValidatingCsv && (
            <div className="rounded-2xl border border-cu-line bg-cu-surface p-12 shadow-sm text-center">
              <div className="flex flex-col items-center justify-center space-y-6">
                {/* Premium Loading Circle */}
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-cu-info opacity-20"></span>
                  <div className="size-16 rounded-full bg-cu-info-soft flex items-center justify-center text-cu-info shadow-sm relative z-10">
                    <svg className="animate-spin h-8 w-8 text-cu-info" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>

                <div className="space-y-2 max-w-sm">
                  <h3 className="text-base font-bold text-cu-ink">Membaca &amp; Memvalidasi File CSV</h3>
                  <p className="text-xs text-cu-muted">Sistem sedang menganalisis baris data pada file CSV Anda untuk memastikan kecocokan format. Harap tunggu...</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Validasi Data File CSV */}
          {bulkStep === 2 && !isValidatingCsv && (
            <form onSubmit={handleBulkGenerate} className="rounded-2xl border border-cu-line bg-cu-surface p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-cu-line pb-4">
                <div>
                  <h2 className="text-lg font-semibold text-cu-ink">Validasi Hasil Pembacaan CSV</h2>
                  <p className="text-xs text-cu-muted mt-1">Periksa kembali data di bawah ini sebelum memulai proses generate.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBulkFile(null);
                    setCsvData([]);
                    setCsvErrors([]);
                    setBulkStep(1);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-cu-muted hover:text-cu-ink transition font-semibold"
                >
                  <MaterialIcon name="arrow_back" size="xs" /> Upload Ulang
                </button>
              </div>

              {/* Tabel Preview CSV */}
              <div className="border border-cu-line rounded-lg overflow-hidden bg-cu-surface">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-cu-line bg-cu-panel-soft/50 text-xs font-semibold uppercase tracking-wider text-cu-muted sticky top-0 z-10">
                        <th className="px-4 py-2 text-center w-12 bg-cu-panel-soft">No</th>
                        <th className="px-4 py-2 bg-cu-panel-soft">Nama Produk</th>
                        <th className="px-4 py-2 bg-cu-panel-soft">Varian</th>
                        <th className="px-4 py-2 text-right bg-cu-panel-soft">Harga Diskon</th>
                        <th className="px-4 py-2 text-center bg-cu-panel-soft">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cu-line">
                      {csvData.map((row, idx) => (
                        <tr key={idx} className={row.error ? "bg-cu-danger-soft/10" : ""}>
                          <td className="px-4 py-2 text-center text-xs text-cu-muted">{idx + 1}</td>
                          <td className="px-4 py-2 font-medium text-cu-ink">{row.produk}</td>
                          <td className="px-4 py-2 text-cu-muted">{row.varian || "Default"}</td>
                          <td className="px-4 py-2 text-right font-mono font-medium">{row.harga_diskon ? formatRupiah(Number(row.harga_diskon)) : "-"}</td>
                          <td className="px-4 py-2 text-center">
                            {row.error ? (
                              <span className="inline-flex items-center gap-1 rounded bg-cu-danger-soft px-1.5 py-0.5 text-[10px] font-bold text-cu-danger" title={row.error}>
                                <MaterialIcon name="error" size="xs" /> Error
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded bg-cu-success-soft px-1.5 py-0.5 text-[10px] font-bold text-cu-success">
                                <MaterialIcon name="check" size="xs" /> Valid
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-cu-line flex items-center gap-3">
                <button
                  type="submit"
                  disabled={csvErrors.length > 0 || isSubmittingBulk}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cu-ink px-6 py-2.5 text-sm font-semibold text-cu-surface transition hover:bg-cu-ink-hover disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <MaterialIcon name="queue" size="sm" />
                  <span>Mulai Membuat Label Massal</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Progress/Submit Loading */}
          {bulkStep === 3 && (
            <div className="rounded-2xl border border-cu-line bg-cu-surface p-6 sm:p-12 shadow-sm text-center">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-cu-info opacity-20"></span>
                  <div className="size-16 rounded-full bg-cu-info-soft flex items-center justify-center text-cu-info shadow-sm z-10 relative">
                    <MaterialIcon size="md" name="cloud_sync" className="animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2 max-w-sm">
                  <h3 className="text-base font-bold text-cu-ink">Sedang Memproses Pembuatan Label Massal</h3>
                  <p className="text-xs text-cu-muted">Sistem Creative Universe sedang mengunggah file CSV dan mendaftarkan produk ke antrean. Mohon tunggu...</p>
                </div>

                <div className="w-full max-w-md mx-auto">
                  <div className="cu-loading-bar">
                    <div className="cu-loading-bar-value"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
