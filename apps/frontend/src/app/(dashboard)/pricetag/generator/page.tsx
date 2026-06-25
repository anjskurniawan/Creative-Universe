"use client";

import React, { FormEvent, useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
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
  PricetagBatch,
} from "@/lib/pricetag";
import { useAuth } from "@/providers/auth-provider";
import ExcelJS from "exceljs";

type Tab = "single" | "checklist" | "bulk";

const formatPricePlaceholder = (value: number) => new Intl.NumberFormat("id-ID").format(value);
const onlyDigits = (value: string) => value.replace(/\D/g, "");
const formatPriceInput = (value: string) => {
  const digits = onlyDigits(value);
  return digits ? new Intl.NumberFormat("id-ID").format(Number(digits)) : "";
};

export default function PricetagGeneratorPage() {
  const { user, hasRole } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab State
  const [activeTab, setActiveTab] = useState<Tab>("single");

  const notify = useCallback((message: string) => {
    pushLocalNotification(message, "/pricetag/generator", user?.id);
  }, [user]);

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
  const [wizardGenerationFailed, setWizardGenerationFailed] = useState(false);

  // ----------------------------------------------------
  // Tab 2: Checklist State
  // ----------------------------------------------------
  const [checklistSearch, setChecklistSearch] = useState("");
  const [checklistAppliedSearch, setChecklistAppliedSearch] = useState("");
  const [checklistCategories, setChecklistCategories] = useState<PricetagCategory[]>([]);
  const [checklistCategory, setChecklistCategory] = useState<PricetagCategory | null>(null);
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
  const [isChecklistSuccess, setIsChecklistSuccess] = useState(false);
  const [activeBatch, setActiveBatch] = useState<PricetagBatch | null>(null);
  const [visualPercent, setVisualPercent] = useState(0);
  const completedBatchNotificationIdsRef = useRef<Set<number>>(new Set());

  const percent = activeBatch && activeBatch.total_items > 0
    ? Math.round((activeBatch.processed_items / activeBatch.total_items) * 100)
    : 0;

  useEffect(() => {
    if (!activeBatch) return;
    if (activeBatch.status === "completed" || activeBatch.status === "failed") return;

    const interval = setInterval(async () => {
      try {
        const res = await apiFetch<PricetagBatch>(`/pricetag/batches/${activeBatch.id}`);
        setActiveBatch(res);
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeBatch]);

  useEffect(() => {
    if (!activeBatch || activeBatch.status !== "completed") return;
    if (completedBatchNotificationIdsRef.current.has(activeBatch.id)) return;

    completedBatchNotificationIdsRef.current.add(activeBatch.id);
    pushLocalNotification(
      `${activeBatch.batch_name} selesai dibuat. ${activeBatch.processed_items}/${activeBatch.total_items} label berhasil diproses.`,
      "/pricetag/history",
      user?.id
    );
  }, [activeBatch, user?.id]);

  // Trickle progress visual smoothing
  useEffect(() => {
    if (!activeBatch) return;

    const isDone = activeBatch.status === "completed" || activeBatch.status === "failed";
    const targetPercent = isDone
      ? 100
      : activeBatch.total_items > 0
        ? Math.round((activeBatch.processed_items / activeBatch.total_items) * 95)
        : 0;

    const interval = setInterval(() => {
      setVisualPercent((prev) => {
        const diff = targetPercent - prev;
        if (diff <= 0) return prev;
        // Step increases slightly if difference is large to catch up, but still incremental
        const step = diff > 20 ? 3 : (diff > 10 ? 2 : 1);
        return Math.min(prev + step, targetPercent);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [activeBatch]);

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
            setWizardDiscountPrice("");
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
          if (singleVar.variant_name === " " || !singleVar.variant_name) {
            // Auto skip to step 3
            setWizardProductId(singleVar.id);
            setSelectedProduct(singleVar);
            setWizardDiscountPrice("");
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
    setWizardDiscountPrice("");
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
          if (singleVar.variant_name === " " || !singleVar.variant_name) {
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
    if (Number(wizardDiscountPrice || 0) <= 0) return;

    setIsGenerating(true);
    setWizardGenerationFailed(false);
    setVisualPercent(0);
    setWizardStep(4); // Go to loader page

    // Trickle progress up to 95%
    const interval = setInterval(() => {
      setVisualPercent((prev) => {
        if (prev < 95) {
          const diff = 95 - prev;
          const step = diff > 20 ? 3 : 1;
          return prev + step;
        }
        return prev;
      });
    }, 100);

    try {
      const res = await apiFetch<PricetagProduct>("/pricetag/generations/single", {
        method: "POST",
        body: JSON.stringify({
          product_id: selectedProduct.id,
          discount_price: Number(wizardDiscountPrice),
        }),
      });

      clearInterval(interval);
      setVisualPercent(100);

      // Delay slightly so user sees 100% completion
      setTimeout(() => {
        setGeneratedViewUrl(res.preview_url);
        setGeneratedDownloadUrl(res.download_url);
        setWizardStep(5);
        notify(`Label harga untuk ${res.name} berhasil dibuat!`);
      }, 500);
    } catch (err) {
      clearInterval(interval);
      notify(pricetagError(err));
      setWizardGenerationFailed(true);
      setWizardStep(6);
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
    setWizardGenerationFailed(false);
  };

  const loadChecklistCategories = useCallback(async () => {
    if (
      activeTab !== "checklist" ||
      isChecklistDesktop ||
      checklistAppliedSearch.trim() ||
      checklistCategory
    ) {
      return;
    }

    setChecklistIsLoading(true);

    try {
      const params = new URLSearchParams({
        page: "1",
        per_page: "100",
        sort_by: "products_count",
        sort_order: "desc",
      });
      const result = await apiFetch<PricetagPage<PricetagCategory>>(`/pricetag/categories?${params}`);
      setChecklistCategories(result.data);
      setChecklistProducts([]);
      setChecklistLastPage(1);
      setChecklistTotal(result.meta.total);
    } catch (err) {
      notify(pricetagError(err));
    } finally {
      setChecklistIsLoading(false);
    }
  }, [activeTab, checklistAppliedSearch, checklistCategory, isChecklistDesktop, notify]);

  useEffect(() => {
    queueMicrotask(() => void loadChecklistCategories());
  }, [loadChecklistCategories]);

  const loadChecklistProducts = useCallback(async () => {
    if (activeTab !== "checklist") return;

    if (!checklistAppliedSearch.trim() && !checklistCategory) {
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
      });

      if (search) {
        params.set("search", search);
      }

      if (checklistCategory) {
        params.set("category_id", String(checklistCategory.id));
      }

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
  }, [checklistPage, checklistAppliedSearch, checklistCategory, activeTab, isChecklistDesktop, notify]);

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
    const digits = onlyDigits(value);
    setChecklistPrices((prev) => ({
      ...prev,
      [prodId]: digits,
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
      const res = await apiFetch<PricetagBatch>("/pricetag/generations/checklist", {
        method: "POST",
        body: JSON.stringify({
          batch_name: defaultBatchName,
          items: itemsPayload,
        }),
      });

      setActiveBatch(res);
      setIsChecklistSuccess(true);
      notify("Berhasil! Antrean pembuatan label telah dijadwalkan.");
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
    if (!file) {
      setCsvData([]);
      setCsvErrors([]);
      setBulkStep(1);
    }
  };

  const handleStartCsvValidation = () => {
    if (bulkFile) {
      setIsValidatingCsv(true);
      parseAndValidateCSV(bulkFile);
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
      const res = await apiFetch<PricetagBatch>("/pricetag/generations/csv", {
        method: "POST",
        body: formData,
      });

      setActiveBatch(res);
      setBulkStep(4);
      notify("Berhasil! File CSV telah masuk ke antrean proses pembuatan.");
    } catch (err) {
      notify(pricetagError(err));
      setBulkStep(2);
    } finally {
      setIsSubmittingBulk(false);
    }
  };

  const handleDownloadTemplate = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch<PricetagPage<PricetagProduct>>("/pricetag/products?per_page=2000");
      if (!res.data || res.data.length === 0) {
        notify("Tidak ada data produk di database untuk dijadikan template.");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      
      // Sheet 1: Template
      const worksheet = workbook.addWorksheet("Template");
      worksheet.columns = [
        { header: "produk", key: "produk", width: 35 },
        { header: "varian", key: "varian", width: 20 },
        { header: "harga_diskon", key: "harga_diskon", width: 15 },
      ];

      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      // Sheet 2: Database (Visible to user)
      const refSheet = workbook.addWorksheet("Database");
      refSheet.columns = [
        { header: "produk", key: "name", width: 35 },
        { header: "varian", key: "variant", width: 20 },
        { header: "harga_normal", key: "normal_price", width: 15 },
        { header: "harga_diskon", key: "discount_price", width: 15 },
      ];
      refSheet.getRow(1).font = { bold: true };

      // Populate Database sheet with all active products and their pricing from backend
      res.data.forEach((prod, idx) => {
        refSheet.getCell(`A${idx + 2}`).value = prod.name;
        refSheet.getCell(`B${idx + 2}`).value = prod.variant_name || " ";
        refSheet.getCell(`C${idx + 2}`).value = prod.normal_price;
        refSheet.getCell(`C${idx + 2}`).numFmt = "#,##0";
        refSheet.getCell(`D${idx + 2}`).value = prod.discount_price || "";
        refSheet.getCell(`D${idx + 2}`).numFmt = "#,##0";
      });

      const totalRows = res.data.length;

      // Apply Excel dropdown data validation referencing the 'Database' sheet
      for (let i = 2; i <= 100; i++) {
        worksheet.getCell(`A${i}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`Database!$A$2:$A$${totalRows + 1}`],
          showErrorMessage: true,
          errorTitle: "Input Salah",
          error: "Harap pilih nama produk dari daftar yang tersedia."
        };

        worksheet.getCell(`B${i}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`Database!$B$2:$B$${totalRows + 1}`],
          showErrorMessage: true,
          errorTitle: "Input Salah",
          error: "Harap pilih varian dari daftar yang tersedia."
        };
        
        worksheet.getCell(`C${i}`).numFmt = "#,##0";
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "pricetag_bulk_generate_template.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      notify("Berhasil mengunduh template Excel (.xlsx) dengan dropdown.");
    } catch (err) {
      notify("Gagal mengunduh template: " + pricetagError(err));
    }
  };

  const displayedChecklistProducts = showOnlySelected
    ? Object.values(selectedProductsData)
    : checklistProducts;
  const shouldShowChecklistCategories =
    !isChecklistDesktop &&
    activeTab === "checklist" &&
    !checklistCategory &&
    !checklistAppliedSearch.trim() &&
    !showOnlySelected;
  const shouldShowChecklistProducts =
    checklistAppliedSearch.trim() !== "" || showOnlySelected || Boolean(checklistCategory);
  const hasChecklistBack = Boolean(checklistCategory || checklistAppliedSearch);
  const mobileWizardMeta = (() => {
    if (wizardGenerationFailed || wizardStep === 6) {
      return { label: "SELESAI", percent: 100 };
    }

    if (wizardStep === 5) {
      return { label: "SELESAI", percent: 100 };
    }

    if (wizardStep === 4) {
      return { label: "PROSES MEMBUAT PRICETAG", percent: 80 };
    }

    if (wizardStep === 3) {
      return { label: "ATUR HARGA DISKON", percent: 60 };
    }

    if (wizardStep === 2) {
      return { label: "PILIH VARIANT", percent: 40 };
    }

    return { label: "PILIH PRODUK", percent: 20 };
  })();

  const handleSelectChecklistCategory = (category: PricetagCategory) => {
    setChecklistCategory(category);
    setChecklistSearch("");
    setChecklistAppliedSearch("");
    setChecklistPage(1);
    setExpandedChecklistProductId(null);
  };

  const handleBackToChecklistCategories = () => {
    setChecklistCategory(null);
    setChecklistSearch("");
    setChecklistAppliedSearch("");
    setChecklistPage(1);
    setExpandedChecklistProductId(null);
  };

  const mobileBackFromProductSearch = () => {
    setWizardProductSearch("");
    setProductsList([]);
  };
  const hasMobileWizardBack = wizardStep !== 1 || wizardProductSearch.trim() !== "";
  const isWizardDiscountInvalid = Number(wizardDiscountPrice || 0) <= 0;

  return (
    <div>
      <div className="mb-6 flex w-full justify-center lg:mb-8">
        <div className={`grid w-full grid-cols-2 items-stretch gap-0 lg:gap-1 lg:rounded-2xl lg:border lg:border-cu-line lg:bg-cu-surface-soft lg:p-1 lg:shadow-sm sm:grid sm:w-full sm:flex-nowrap sm:rounded-full md:gap-1.5 ${
          hasRole("root") ? "lg:grid-cols-3" : "lg:grid-cols-2"
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab("single")}
            className={`flex h-full w-full min-w-0 items-center justify-center rounded-full px-2 py-3 text-center text-[11px] font-bold uppercase leading-none tracking-normal transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cu-border-hover sm:px-3 sm:text-[10px] sm:tracking-wider sm:whitespace-nowrap md:px-6 md:py-2.5 md:text-xs lg:rounded-full lg:py-2 ${
              activeTab === "single"
                ? "bg-white text-[#111] shadow-sm font-extrabold lg:bg-cu-ink lg:text-white"
                : "text-white hover:text-white/80 lg:text-cu-muted lg:hover:text-cu-ink lg:hover:bg-cu-panel-soft/50"
            }`}
          >
            Buat satuan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("checklist")}
            className={`flex h-full w-full min-w-0 items-center justify-center rounded-full px-2 py-3 text-center text-[11px] font-bold uppercase leading-none tracking-normal transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cu-border-hover sm:px-3 sm:text-[10px] sm:tracking-wider sm:whitespace-nowrap md:px-6 md:py-2.5 md:text-xs lg:rounded-full lg:py-2 ${
              activeTab === "checklist"
                ? "bg-white text-[#111] shadow-sm font-extrabold lg:bg-cu-ink lg:text-white"
                : "text-white hover:text-white/80 lg:text-cu-muted lg:hover:text-cu-ink lg:hover:bg-cu-panel-soft/50"
            }`}
          >
            Buat sekaligus
          </button>
          {hasRole("root") && (
            <button
              type="button"
              onClick={() => setActiveTab("bulk")}
              className={`hidden min-w-0 items-center justify-center rounded-full px-3 py-4 text-center text-[14px] font-bold uppercase leading-tight tracking-normal transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cu-border-hover sm:px-3 sm:text-[10px] sm:tracking-wider sm:whitespace-nowrap md:px-6 md:py-2.5 md:text-xs lg:flex lg:rounded-full lg:py-2 ${
                activeTab === "bulk"
                  ? "bg-cu-danger text-white shadow-sm font-extrabold"
                  : "text-cu-danger hover:bg-cu-danger-soft/20 font-bold border border-cu-danger/25"
              }`}
            >
              Buat Label Massal (CSV)
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Single Generator Wizard */}
      {activeTab === "single" && (
        <div>
          <div className="space-y-5 lg:hidden">
            <div className="space-y-2">
              <h2 className="text-[13px] font-bold uppercase tracking-wide text-white">{mobileWizardMeta.label}</h2>
              <div className="h-3 overflow-hidden rounded-full bg-[#121212]">
                <div
                  className="h-full rounded-full bg-[#269556] transition-all duration-500"
                  style={{ width: `${mobileWizardMeta.percent}%` }}
                />
              </div>
            </div>

            {(wizardStep === 1 || wizardStep === 2 || wizardStep === 3) && (
              <div className="flex items-center">
                <div className="cu-animated-rainbow-border min-w-0 flex-1 rounded-full p-[2px] transition-all duration-300 ease-out">
                  <div className="relative h-[46px] rounded-full bg-black">
                    <MaterialIcon
                      name="search"
                      size="md"
                      className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/70"
                      filled={false}
                    />
                    <input
                      type="search"
                      value={wizardStep === 1 ? wizardProductSearch : wizardVariantSearch}
                      onChange={(event) => {
                        if (wizardStep === 1) {
                          setWizardProductSearch(event.target.value);
                        } else {
                          setWizardVariantSearch(event.target.value);
                        }
                      }}
                      className="h-full w-full rounded-full border-0 bg-transparent pl-14 pr-5 text-[15px] font-medium text-white outline-none placeholder:text-white/65 focus:ring-0"
                      placeholder={wizardStep === 1 ? "Cari produk..." : "Cari varian..."}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!hasMobileWizardBack}
                  onClick={() => {
                    if (wizardStep === 1) {
                      mobileBackFromProductSearch();
                    } else if (wizardStep === 2) {
                      setWizardStep(1);
                      setWizardVariantSearch("");
                    } else {
                      handleBackFromStep3();
                    }
                  }}
                  className={`flex h-[46px] shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap text-[16px] font-medium text-white transition-all duration-300 ease-out ${
                    hasMobileWizardBack
                      ? "ml-8 w-24 translate-x-0 opacity-100"
                      : "ml-0 w-0 translate-x-2 opacity-0"
                  }`}
                  aria-hidden={!hasMobileWizardBack}
                  aria-label="Kembali"
                >
                  <MaterialIcon name="arrow_back" size="md" filled={false} />
                  <span>Kembali</span>
                </button>
              </div>
            )}

            {wizardStep === 1 && wizardProductSearch.trim() !== "" && (
              <div className="rounded-[36px] bg-white p-4">
                {isGenerating ? (
                  <MobileGeneratorMessage text="Memuat..." />
                ) : productsList.length > 0 ? (
                  <div className="space-y-2">
                    {productsList.map((prodName) => (
                      <MobileGeneratorListButton
                        key={prodName}
                        label={prodName}
                        onClick={() => handleSelectProduct(prodName)}
                      />
                    ))}
                  </div>
                ) : (
                  <MobileGeneratorMessage icon="sentiment_dissatisfied" text="Produk tidak ditemukan" />
                )}
              </div>
            )}

            {wizardStep === 2 && (
              <div className="rounded-[36px] bg-white p-4">
                {variantsList.length > 0 ? (
                  <div className="space-y-2">
                    {variantsList.map((prod) => (
                      <MobileGeneratorListButton
                        key={prod.id}
                        label={prod.variant_name || " "}
                        onClick={() => handleSelectVariant(prod)}
                      />
                    ))}
                  </div>
                ) : (
                  <MobileGeneratorMessage icon="sentiment_dissatisfied" text="Varian tidak ditemukan" />
                )}
              </div>
            )}

            {wizardStep === 3 && selectedProduct && (
              <form onSubmit={handleGenerateSingle} className="rounded-[36px] bg-white p-4">
                <div className="overflow-hidden rounded-[24px] border border-[#c9c9c9] bg-white">
                  <div className="flex min-h-[60px] w-full items-center justify-between gap-2 px-5 text-left text-[#2c2c2c]">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="size-2 shrink-0 rounded-full bg-[#dddddd]" />
                      <p className="min-w-0 truncate text-[13px] font-semibold leading-tight">{selectedProduct.name}</p>
                    </div>
                    <MaterialIcon name="expand_more" size="md" className="shrink-0 text-[#2c2c2c]" />
                  </div>

                  <div className="space-y-3 border-t border-[#E3E4E3] bg-[#f8f9fb] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-medium leading-tight text-[#8a8a8a]">Kategori</span>
                      <span className="break-words text-right text-[12px] font-semibold text-[#303431]">{wizardCategoryName}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-medium leading-tight text-[#8a8a8a]">Varian</span>
                      <span className="break-words text-right text-[12px] font-semibold text-[#303431]">{selectedProduct.variant_name || " "}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-medium leading-tight text-[#8a8a8a]">Harga normal</span>
                      <span className="text-right text-[12px] font-semibold text-[#303431]">{formatRupiah(selectedProduct.normal_price)}</span>
                    </div>
                    <div className="border-t border-[#E3E4E3] pt-3">
                      <label htmlFor="mobileWizardDiscountPrice" className="text-[10px] font-medium leading-tight text-[#8a8a8a]">
                        Harga diskon
                      </label>
                      <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-xs font-semibold text-[#777B78]">Rp</span>
                        <input
                          id="mobileWizardDiscountPrice"
                          type="text"
                          inputMode="numeric"
                          value={formatPriceInput(wizardDiscountPrice)}
                          onChange={(event) => setWizardDiscountPrice(onlyDigits(event.target.value))}
                          className="block h-[46px] w-full rounded-full border border-[#C7C9C8] bg-white pl-10 pr-4 text-sm text-[#303431] outline-none placeholder:text-[#8f9690] focus:border-[#2da3ff]"
                          placeholder={formatPricePlaceholder(selectedProduct.discount_price ?? 0)}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating || isWizardDiscountInvalid}
                      className={`flex h-[46px] w-full items-center justify-center rounded-full text-[16px] font-bold transition ${
                        isWizardDiscountInvalid
                          ? "cursor-not-allowed bg-[#b7b7b7] text-white"
                          : "bg-black text-white disabled:opacity-50"
                      }`}
                    >
                      Lanjutkan
                    </button>
                  </div>
                </div>
              </form>
            )}

            {wizardStep === 4 && (
              <MobileProcessCard visualPercent={visualPercent} />
            )}

            {wizardStep === 5 && (
              <MobileResultCard
                success
                title="Membuat Pricetag Berhasil"
                generatedViewUrl={generatedViewUrl}
                generatedDownloadUrl={generatedDownloadUrl}
                onReset={resetWizard}
              />
            )}

            {wizardStep === 6 && (
              <MobileResultCard
                title="Membuat Pricetag Gagal"
                description="Silahkan hubungi Leader Creative terkait kendala yang dialami."
              />
            )}
          </div>

          <div className="hidden space-y-8 lg:block">
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
              <h3 className="text-base font-bold text-cu-ink mb-4">Cari produk</h3>
              
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
                        <span className="text-sm font-semibold text-cu-ink group-hover:text-cu-focus transition-colors">{prod.variant_name || " "}</span>
                      </div>
                      <span className="text-xs text-cu-muted">Harga normal: {formatRupiah(prod.normal_price)}</span>
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
                <h3 className="text-base font-bold text-cu-ink">Atur harga promo</h3>
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
                    <span className="font-semibold text-cu-ink text-right font-mono">{selectedProduct.variant_name || " "}</span>

                    <span className="text-cu-muted">Harga normal</span>
                    <span className="font-bold text-cu-ink text-right">{formatRupiah(selectedProduct.normal_price)}</span>
                  </div>
                </div>

                {/* Harga Diskon */}
                <div>
                  <label htmlFor="wizardDiscountPrice" className="block text-sm font-medium text-cu-ink mb-1.5">Harga promo / diskon</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-semibold text-cu-muted">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      id="wizardDiscountPrice"
                      value={formatPriceInput(wizardDiscountPrice)}
                      onChange={(e) => setWizardDiscountPrice(onlyDigits(e.target.value))}
                      className="block w-full rounded-full border border-cu-line bg-cu-surface py-2.5 pl-9 pr-3 text-sm text-cu-ink focus:border-cu-border-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover"
                      placeholder={formatPricePlaceholder(selectedProduct.discount_price ?? 0)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-cu-line pt-4">
                  <button
                    type="submit"
                    disabled={isGenerating || isWizardDiscountInvalid}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cu-ink px-6 py-2.5 text-sm font-semibold text-cu-surface shadow-sm transition hover:bg-cu-ink-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover disabled:cursor-not-allowed disabled:bg-[#b7b7b7] sm:w-auto"
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
              <div className="flex flex-col items-center justify-center space-y-5">
                
                {/* Custom Spinner/Pulse ring */}
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-cu-info opacity-20"></span>
                  <div className="size-16 rounded-full bg-cu-info-soft text-cu-info flex items-center justify-center shadow-sm relative z-10">
                    <MaterialIcon name="settings" className="animate-spin" size="lg" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-cu-ink">Sedang Menyusun Gambar Label</h3>
                  <p className="text-xs text-cu-muted">Sistem Creative Universe sedang menyusun layout promo dan menghasilkan gambar. Harap tunggu...</p>
                  
                  <div className="w-full max-w-xs mx-auto mt-4 pt-2 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-cu-muted">
                      <span>Proses pembuatan...</span>
                      <span>{visualPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-cu-line overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300 bg-cu-success"
                        style={{ width: `${visualPercent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-center mt-1 font-medium text-cu-info animate-pulse">
                      Status: Memproses
                    </div>
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
        </div>
      )}

      {/* Tab 2: Checklist Generator */}
      {activeTab === "checklist" && (
        <div className="space-y-6">
          {isChecklistSuccess ? (
            <div className="rounded-[36px] bg-white p-4 text-[#303431] lg:mx-auto lg:max-w-xl">
              <div className="overflow-hidden rounded-[24px] border border-[#c9c9c9] bg-white">
                <div className="flex min-h-[60px] items-center justify-between gap-3 px-5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`size-2 shrink-0 rounded-full ${activeBatch?.status === "completed" ? "bg-[#269556]" : "bg-[#2da3ff]"}`} />
                    <p className="min-w-0 truncate text-[13px] font-semibold leading-tight">
                      {activeBatch?.status === "completed" ? "Pembuatan Label Selesai" : "Antrean Pembuatan Label"}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold leading-none ${
                    activeBatch?.status === "completed"
                      ? "bg-[#e7f5ee] text-[#1f8f52]"
                      : "bg-[#d8efff] text-[#1476b8]"
                  }`}>
                    {activeBatch?.status === "completed" ? "Selesai" : "Memproses"}
                  </span>
                </div>

                <div className="space-y-4 border-t border-[#E3E4E3] bg-[#f8f9fb] p-4">
                  <div className="flex items-center gap-3">
                    <div className={`relative flex size-12 shrink-0 items-center justify-center rounded-full ${
                      activeBatch?.status === "completed"
                        ? "bg-[#e7f5ee] text-[#269556]"
                        : "bg-[#d8efff] text-[#2da3ff]"
                    }`}>
                      {activeBatch?.status !== "completed" && <span className="absolute size-full rounded-full border border-[#2da3ff]/30 animate-ping" />}
                      <MaterialIcon
                        name={activeBatch?.status === "completed" ? "check" : "settings"}
                        size="md"
                        weight={600}
                        className={`relative ${activeBatch?.status === "completed" ? "" : "animate-spin"}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[16px] font-bold leading-tight text-[#303431]">
                        {activeBatch?.status === "completed" ? "Label selesai dibuat" : "Label sedang diproses"}
                      </h3>
                      <p className="mt-1 text-[11px] font-medium leading-snug text-[#8a8a8a]">
                        {activeBatch?.status === "completed"
                          ? "Semua label promo untuk batch ini berhasil dibuat."
                          : "Sistem sedang memproses antrean label promo."}
                      </p>
                    </div>
                  </div>

                  {activeBatch && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-semibold leading-tight text-[#8a8a8a]">
                        <span>{activeBatch.processed_items} / {activeBatch.total_items} selesai</span>
                        <span>{visualPercent}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#E3E4E3]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            activeBatch.status === "failed" ? "bg-cu-danger" : "bg-[#269556]"
                          }`}
                          style={{ width: `${Math.max(8, visualPercent)}%` }}
                        />
                      </div>
                      <p className="text-center text-[10px] font-medium capitalize text-[#8a8a8a]">
                        Status: <span className={activeBatch.status === "completed" ? "font-bold text-[#1f8f52]" : "text-[#1476b8] animate-pulse"}>
                          {activeBatch.status === "processing" ? "Memproses" : activeBatch.status === "pending" ? "Mengantre" : activeBatch.status}
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="grid gap-2 border-t border-[#E3E4E3] pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsChecklistSuccess(false);
                        setVisualPercent(0);
                        setActiveBatch(null);
                        setSelectedVariants([]);
                        setSelectedProductsData({});
                        setChecklistPrices({});
                        setChecklistBatchName("");
                      }}
                      className="inline-flex h-[46px] items-center justify-center gap-1.5 rounded-full border border-[#c9c9c9] bg-white px-4 text-[13px] font-bold text-[#303431]"
                    >
                      <MaterialIcon name="replay" size="xs" weight={500} />
                      Buat Label Baru
                    </button>
                    <Link
                      href="/pricetag/history"
                      className="inline-flex h-[46px] items-center justify-center gap-1.5 rounded-full bg-black px-4 text-[13px] font-bold text-white"
                    >
                      <MaterialIcon name="history" size="xs" weight={500} />
                      Lihat Riwayat
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-transparent lg:rounded-2xl lg:border lg:border-cu-line lg:bg-cu-surface lg:p-8 lg:shadow-sm">
            <div className="mb-5 hidden items-start justify-between border-b border-cu-line pb-4 lg:flex">
              <div>
                <h2 className="text-lg font-semibold text-cu-ink">Buat Banyak Label Sekaligus</h2>
                <p className="text-xs text-cu-muted mt-1">
                  <span className="hidden lg:inline">Pilih beberapa produk di bawah untuk dibuat label harganya secara bersamaan lewat antrean sistem.</span>
                  <span className="lg:hidden">Ketuk produk untuk melihat detail & mengatur harga promo.</span>
                </p>
              </div>
            </div>


            <form onSubmit={handleChecklistGenerate} className="space-y-5">
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Pencarian Varian (Kiri) */}
                <div className="order-2 w-full lg:order-1 lg:max-w-md">
                  <label htmlFor="checklistSearch" className="mb-1.5 hidden text-sm font-medium text-cu-ink lg:block">Cari produk</label>
                  <div className="flex w-full items-center lg:block">
                    <div className="cu-animated-rainbow-border min-w-0 flex-1 rounded-full p-[2px] transition-all duration-300 ease-out lg:bg-none lg:p-0">
                      <div className="relative h-[46px] rounded-full bg-black lg:h-auto lg:bg-transparent">
                        <MaterialIcon
                          name="search"
                          size="md"
                          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/70 lg:left-4 lg:text-cu-muted"
                        />
                        <input
                          type="search"
                          id="checklistSearch"
                          value={checklistSearch}
                          onChange={(e) => {
                            const nextSearch = e.target.value;
                            setChecklistSearch(nextSearch);
                            setChecklistAppliedSearch(nextSearch);
                            setChecklistCategory(null);
                            setChecklistPage(1);
                          }}
                          className="h-full w-full rounded-full border-0 bg-transparent pl-14 pr-5 text-[15px] font-medium text-white shadow-none outline-none placeholder:text-white/65 focus:ring-0 lg:h-11 lg:border lg:border-cu-line lg:bg-cu-surface lg:pl-11 lg:pr-4 lg:text-sm lg:font-normal lg:text-cu-ink lg:shadow-sm lg:placeholder:text-cu-muted lg:focus:border-cu-border-hover lg:focus:outline-none lg:focus:ring-1 lg:focus:ring-cu-border-hover"
                          placeholder="Cari produk..."
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleBackToChecklistCategories}
                      disabled={!hasChecklistBack}
                      className={`flex h-[46px] shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap text-[16px] font-medium text-white transition-all duration-300 ease-out lg:hidden ${
                        hasChecklistBack
                          ? "ml-8 w-24 translate-x-0 opacity-100"
                          : "ml-0 w-0 translate-x-2 opacity-0"
                      }`}
                      aria-label="Kembali ke kategori"
                      aria-hidden={!hasChecklistBack}
                    >
                      <MaterialIcon name="arrow_back" size="md" />
                      <span>Kembali</span>
                    </button>
                  </div>
                </div>

                {/* Keterangan Produk Terpilih & Action Group (Kanan) - Tinggi disesuaikan dengan Searchbar */}
                <div className="order-1 hidden h-11 items-center gap-2 self-end lg:order-2 lg:flex">
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

              {shouldShowChecklistCategories && (
                <div className="rounded-[36px] bg-white p-4 lg:hidden">
                  {checklistIsLoading ? (
                    <div className="py-8 text-center text-base font-medium text-[#626662]">Memuat...</div>
                  ) : checklistCategories.length === 0 ? (
                    <div className="py-8 text-center text-base font-medium text-[#626662]">Kategori tidak ditemukan.</div>
                  ) : (
                    <div className="space-y-2">
                      {checklistCategories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleSelectChecklistCategory(category)}
                          className="flex min-h-[60px] w-full items-center justify-between gap-2 rounded-[24px] border border-[#c9c9c9] bg-white px-5 text-left text-[#2c2c2c] transition-all duration-200 ease-out focus:border-[#2da3ff] focus:bg-[#d8efff] focus:outline-none focus:ring-2 focus:ring-[#2da3ff] active:scale-[0.99] active:border-[#2da3ff] active:bg-[#d8efff]"
                        >
                          <span className="flex min-w-0 items-center gap-1">
                            <span className="flex size-9 shrink-0 items-center justify-center text-[#2c2c2c]">
                              {category.icon_svg ? (
                                <span
                                  dangerouslySetInnerHTML={{ __html: category.icon_svg }}
                                  className="flex size-full items-center justify-center *:size-full"
                                />
                              ) : (
                                <MaterialIcon name="headphones" size="md" />
                              )}
                            </span>
                            <span className="min-w-0 truncate text-[13px] font-semibold leading-tight">
                              {category.name}
                            </span>
                          </span>
                          <MaterialIcon name="chevron_right" size="md" className="shrink-0 text-[#2c2c2c]" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Checklist Table (Collapsible) */}
              <div 
                className="transition-all duration-500 ease-in-out overflow-hidden"
                style={{
                  maxHeight: shouldShowChecklistProducts ? "1500px" : "0px",
                  opacity: shouldShowChecklistProducts ? 1 : 0,
                  marginTop: shouldShowChecklistProducts ? "1.25rem" : "0px",
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
                  <div className="space-y-2 rounded-[36px] bg-white p-4 lg:hidden">
                    {checklistIsLoading ? (
                      <div className="flex min-h-[88px] items-center justify-center text-center text-[15px] font-medium leading-tight text-[#9aa1af]">Memuat...</div>
                    ) : displayedChecklistProducts.length === 0 ? (
                      <div className="flex min-h-[88px] items-center justify-center px-4 text-center text-[15px] font-medium leading-tight text-[#9aa1af]">
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
                            className={`overflow-hidden rounded-[24px] border bg-white transition-colors duration-300 ${
                              isChecked
                                ? "border-[#2da3ff]"
                                : "border-[#c9c9c9]"
                            }`}
                          >
                            <button
                              type="button"
                              aria-expanded={isExpanded}
                              aria-controls={detailId}
                              onClick={() => setExpandedChecklistProductId(isExpanded ? null : product.id)}
                              className={`flex min-h-[60px] w-full items-center justify-between gap-2 px-5 text-left transition-all duration-200 ease-out focus:border-[#2da3ff] focus:bg-[#d8efff] focus:outline-none focus:ring-2 focus:ring-[#2da3ff] active:scale-[0.99] ${
                                isChecked
                                  ? "bg-[#d8efff] text-[#2c2c2c]"
                                  : "bg-white text-[#2c2c2c]"
                              }`}
                            >
                              <div className="flex min-w-0 items-center gap-1">
                                <span className={`size-2 shrink-0 rounded-full ${isChecked ? "bg-[#139300]" : "bg-[#dddddd]"}`} />
                                <p className="min-w-0 truncate text-[13px] font-semibold leading-tight">{product.name}</p>
                              </div>
                              <MaterialIcon
                                name="chevron_right"
                                size="md"
                                className={`shrink-0 text-[#2c2c2c] transition-all duration-200 ${isExpanded ? "rotate-90" : ""}`}
                              />
                            </button>

                            {isExpanded && (
                              <div id={detailId} className="space-y-3 border-t border-[#E3E4E3] bg-[#f8f9fb] p-4">
                                <div className="flex justify-between items-center gap-2">
                                  <span className="text-[10px] font-medium leading-tight text-[#8a8a8a]">Kategori</span>
                                  <span className="break-words text-right text-[12px] font-semibold text-[#303431]">{product.category.name}</span>
                                </div>
                                <div className="flex justify-between items-center gap-2">
                                  <span className="text-[10px] font-medium leading-tight text-[#8a8a8a]">Varian</span>
                                  <span className="break-words text-right text-[12px] font-semibold text-[#303431]">{product.variant_name || " "}</span>
                                </div>
                                <div className="flex justify-between items-center gap-2">
                                  <span className="text-[10px] font-medium leading-tight text-[#8a8a8a]">Harga normal</span>
                                  <span className="text-right text-[12px] font-semibold text-[#303431]">{formatRupiah(product.normal_price)}</span>
                                </div>
                                <div className="border-t border-[#E3E4E3] pt-3">
                                  <label htmlFor={`checklist-price-${product.id}`} className="text-[10px] font-medium leading-tight text-[#8a8a8a]">
                                    Harga diskon
                                  </label>
                                  <div className="relative mt-1">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-xs font-semibold text-[#777B78]">Rp</span>
                                    <input
                                      id={`checklist-price-${product.id}`}
                                      type="text"
                                      inputMode="numeric"
                                      placeholder={formatPricePlaceholder(product.discount_price ?? 0)}
                                      value={formatPriceInput(checklistPrices[product.id] ?? "")}
                                      onChange={(event) => handleChecklistPriceChange(product.id, event.target.value)}
                                      className="block h-[46px] w-full rounded-full border border-[#C7C9C8] bg-white pl-10 pr-4 text-sm text-[#303431] focus:border-[#2da3ff] focus:outline-none"
                                    />
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleToggleSelectProduct(product)}
                                  className={`inline-flex h-[46px] w-full items-center justify-center gap-1.5 rounded-full border px-4 text-[13px] font-bold transition-colors duration-300 ${
                                    isChecked
                                      ? "border-[#c9c9c9] bg-white text-[#303431]"
                                      : "border-transparent bg-[#2da3ff] text-white"
                                  }`}
                                >
                                  <MaterialIcon name={isChecked ? "remove" : "add"} size="xs" weight={500} />
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
                          <th className="px-6 py-3 text-right hidden sm:table-cell">Harga normal</th>
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
                                      <span>• Varian: {p.variant_name || " "}</span>
                                      <span className="block line-through">Normal: {formatRupiah(p.normal_price)}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 font-medium text-cu-ink hidden sm:table-cell">
                                    {p.variant_name || " "}
                                  </td>
                                  <td className="px-6 py-4 text-right font-medium text-cu-ink hidden sm:table-cell">
                                    {formatRupiah(p.normal_price)}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="relative max-w-[150px] ml-auto">
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs font-semibold text-cu-muted">Rp</span>
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder={formatPricePlaceholder(p.discount_price ?? 0)}
                                        value={formatPriceInput(checklistPrices[p.id] ?? "")}
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

              {selectedVariants.length > 0 && (
                <div className="rounded-[36px] bg-white p-4 lg:hidden">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowOnlySelected(!showOnlySelected)}
                      className={`flex h-[46px] min-w-[46px] items-center justify-center rounded-full px-4 text-sm font-bold transition ${
                        showOnlySelected
                          ? "bg-[#2da3ff] text-white"
                          : "bg-[#d8efff] text-[#2c2c2c]"
                      }`}
                      aria-pressed={showOnlySelected}
                      aria-label={showOnlySelected ? "Tampilkan semua produk" : "Tampilkan produk terpilih"}
                    >
                      {selectedVariants.length}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingChecklist}
                      className="flex h-[46px] flex-1 items-center justify-center rounded-full bg-[#2da3ff] px-5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#b7b7b7]"
                    >
                      {isSubmittingChecklist ? "Memproses..." : "Generate label"}
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
          )}
        </div>
      )}      {/* Tab 3: Bulk CSV Uploader */}
      {activeTab === "bulk" && (
        <div className="w-full">
          {/* Stepper Indicator */}
          <div className="bg-cu-surface border border-cu-line rounded-xl p-4 shadow-sm mb-6">
            <div className="flex items-start justify-between max-w-xl mx-auto">
              {/* Step 1 Upload */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${bulkStep >= 1 ? "bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10" : "bg-cu-panel-soft text-cu-muted border border-cu-line"}`}>
                  1
                </div>
                <span className={`max-w-16 text-center text-[9px] font-bold uppercase leading-tight tracking-wide sm:text-[10px] sm:tracking-wider ${bulkStep >= 1 ? "text-cu-ink" : "text-cu-muted"}`}>Unggah CSV</span>
              </div>

              <div className={`mt-4 h-0.5 flex-1 mx-2 transition-all duration-300 ${bulkStep >= 2 ? "bg-cu-ink" : "bg-cu-line"}`}></div>

              {/* Step 2 Validate */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${bulkStep >= 2 ? "bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10" : "bg-cu-panel-soft text-cu-muted border border-cu-line"}`}>
                  2
                </div>
                <span className={`max-w-16 text-center text-[9px] font-bold uppercase leading-tight tracking-wide sm:text-[10px] sm:tracking-wider ${bulkStep >= 2 ? "text-cu-ink" : "text-cu-muted"}`}>Validasi</span>
              </div>

              <div className={`mt-4 h-0.5 flex-1 mx-2 transition-all duration-300 ${bulkStep >= 3 ? "bg-cu-ink" : "bg-cu-line"}`}></div>

              {/* Step 3 Process */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${bulkStep >= 3 ? "bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10" : "bg-cu-panel-soft text-cu-muted border border-cu-line"}`}>
                  3
                </div>
                <span className={`max-w-16 text-center text-[9px] font-bold uppercase leading-tight tracking-wide sm:text-[10px] sm:tracking-wider ${bulkStep >= 3 ? "text-cu-ink" : "text-cu-muted"}`}>Proses</span>
              </div>

              <div className={`mt-4 h-0.5 flex-1 mx-2 transition-all duration-300 ${bulkStep >= 4 ? "bg-cu-ink" : "bg-cu-line"}`}></div>

              {/* Step 4 Result */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${bulkStep >= 4 ? "bg-cu-ink text-cu-surface ring-4 ring-cu-ink/10" : "bg-cu-panel-soft text-cu-muted border border-cu-line"}`}>
                  <MaterialIcon name="check" size="xs" />
                </div>
                <span className={`max-w-16 text-center text-[9px] font-bold uppercase leading-tight tracking-wide sm:text-[10px] sm:tracking-wider ${bulkStep >= 4 ? "text-cu-ink" : "text-cu-muted"}`}>Selesai</span>
              </div>
            </div>
          </div>

          {/* STEP 1: Input File CSV */}
          {bulkStep === 1 && !isValidatingCsv && (
            <div className="rounded-2xl border border-cu-line bg-cu-surface p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cu-line pb-4 gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-cu-ink">Unggah File CSV</h2>
                  <p className="text-xs text-cu-muted mt-1">
                    Unggah file daftar produk untuk membuat label harga dalam jumlah besar secara otomatis.{" "}
                    <a
                      href="#"
                      onClick={handleDownloadTemplate}
                      className="font-bold text-cu-info hover:underline inline sm:hidden"
                    >
                      Download Template Excel di sini.
                    </a>
                  </p>
                </div>
                <a
                  href="#"
                  onClick={handleDownloadTemplate}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-cu-info hover:text-cu-info/80 transition shrink-0"
                >
                  <MaterialIcon name="download_for_offline" size="sm" />
                  Download Template Excel
                </a>
              </div>

              {/* Petunjuk Penggunaan Template Excel (Collapsible) */}
              <details className="group rounded-lg bg-cu-info-soft/30 border border-cu-info/20 p-4 text-xs transition-all duration-300">
                <summary className="flex items-center justify-between cursor-pointer font-bold text-cu-info select-none list-none [&::-webkit-details-marker]:hidden">
                  <div className="flex items-center gap-2">
                    <MaterialIcon name="info" className="text-cu-info shrink-0" size="sm" />
                    <span>Petunjuk Penggunaan Template Excel</span>
                  </div>
                  <div className="transition-transform duration-300 group-open:rotate-180 text-cu-info flex items-center">
                    <MaterialIcon name="expand_more" size="xs" />
                  </div>
                </summary>
                
                <div className="text-cu-ink leading-relaxed space-y-1 mt-3 pl-7 border-t border-cu-info/10 pt-3">
                  <ol className="list-decimal pl-4 space-y-1.5 text-cu-muted">
                    <li>Klik <strong>Download Template Excel</strong> di atas.</li>
                    <li>Buka file Excel tersebut, lalu pilih produk dan varian menggunakan menu <strong>dropdown</strong> yang disediakan untuk menghindari typo.</li>
                    <li>Masukkan harga diskon pada kolom <strong>harga_diskon</strong>.</li>
                    <li>Setelah selesai, simpan file sebagai format <strong>CSV (Comma delimited) (*.csv)</strong> sebelum mengunggahnya ke form di bawah ini.</li>
                  </ol>
                </div>
              </details>

              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-cu-line rounded-lg cursor-pointer bg-cu-surface hover:bg-cu-panel-soft transition duration-200 relative overflow-hidden">
                    <div className="flex flex-col items-center justify-center pt-4 pb-4 px-4 text-center">
                      <MaterialIcon name={bulkFile ? "insert_drive_file" : "cloud_upload"} size="md" className="text-cu-soft mb-1.5" />
                      {bulkFile ? (
                        <>
                          <p className="text-sm font-semibold text-cu-ink truncate max-w-xs">{bulkFile.name}</p>
                          <p className="text-[10px] text-cu-muted mt-0.5">{(bulkFile.size / 1024).toFixed(1)} KB - Klik untuk mengganti file</p>
                        </>
                      ) : (
                        <>
                          <p className="mb-0.5 text-xs text-cu-ink"><span className="font-semibold">Klik untuk memilih file</span> atau tarik file ke sini</p>
                          <p className="text-[10px] text-cu-muted">File CSV (Maks. 2MB)</p>
                        </>
                      )}
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

                {bulkFile && (
                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={handleStartCsvValidation}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-cu-ink px-6 py-2.5 text-sm font-semibold text-cu-surface shadow-sm transition hover:bg-cu-ink-hover focus:outline-none focus:ring-1 focus:ring-cu-border-hover w-full sm:w-auto"
                    >
                      <MaterialIcon name="done_all" size="xs" />
                      Validasi File CSV
                    </button>
                  </div>
                )}
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

              {/* Tabel Preview CSV (Desktop Only) */}
              <div className="hidden sm:block border border-cu-line rounded-lg overflow-hidden bg-cu-surface">
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
                          <td className="px-4 py-2 text-cu-muted">{row.varian || " "}</td>
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

              {/* Cards Preview CSV (Mobile Only) */}
              <div className="block sm:hidden space-y-2">
                {csvData.map((row, idx) => {
                  const normalPrice = Number(row.harga_diskon) ? Math.round(Number(row.harga_diskon) * 1.25) : 0;
                  return (
                    <div key={idx} className={`p-3 rounded-xl border ${row.error ? "border-cu-danger/30 bg-cu-danger-soft/10" : "border-cu-line bg-cu-surface"} shadow-xs text-xs space-y-1`}>
                      {/* Row 1: Product Name on left, Indicator dot on right */}
                      <div className="flex items-center justify-between gap-3 w-full">
                        <h4 className="font-bold text-cu-ink leading-tight truncate">{row.produk}</h4>
                        <div className="shrink-0">
                          {row.error ? (
                            <span className="inline-flex size-2 rounded-full bg-cu-danger" title={row.error}></span>
                          ) : (
                            <span className="inline-flex size-2 rounded-full bg-cu-success"></span>
                          )}
                        </div>
                      </div>

                      {/* Row 2: Varian on left, Prices on right */}
                      <div className="flex items-center justify-between text-[10px] text-cu-muted gap-2 w-full">
                        <div>
                          <span className="font-medium">Varian: {row.varian || " "}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="line-through bg-cu-success/15 text-cu-success px-1.5 py-0.5 rounded font-bold">
                            {normalPrice > 0 ? formatRupiah(normalPrice) : "-"}
                          </span>
                          <span className="font-extrabold text-cu-ink font-mono">
                            {row.harga_diskon ? formatRupiah(Number(row.harga_diskon)) : "-"}
                          </span>
                        </div>
                      </div>
                      
                      {row.error && (
                        <p className="text-[9px] font-semibold text-cu-danger mt-1 bg-cu-danger-soft/20 p-1 rounded">{row.error}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-cu-line flex items-center gap-3">
                <button
                  type="submit"
                  disabled={csvErrors.length > 0 || isSubmittingBulk}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-cu-ink px-6 py-2.5 text-sm font-semibold text-cu-surface transition hover:bg-cu-ink-hover disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  <span>Lanjut</span>
                  <MaterialIcon name="navigate_next" size="xs" />
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

          {/* STEP 4: Success Uploader State */}
          {bulkStep === 4 && (
            <div className="rounded-2xl border border-cu-line bg-cu-surface p-6 sm:p-12 shadow-sm max-w-xl mx-auto text-center">
              <div className="flex flex-col items-center justify-center space-y-5">
                <div className="relative flex items-center justify-center">
                  {activeBatch?.status === "completed" ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-cu-success opacity-20"></span>
                      <div className="size-16 rounded-full bg-cu-success-soft text-cu-success flex items-center justify-center shadow-sm relative z-10">
                        <MaterialIcon name="check" size="lg" />
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-cu-info opacity-20"></span>
                      <div className="size-16 rounded-full bg-cu-info-soft text-cu-info flex items-center justify-center shadow-sm relative z-10">
                        <MaterialIcon name="settings" className="animate-spin" size="lg" />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-cu-ink">
                    {activeBatch?.status === "completed" ? "Pembuatan Label Massal Selesai!" : "File CSV Berhasil Diunggah!"}
                  </h3>
                  <p className="text-xs text-cu-muted">
                    {activeBatch?.status === "completed"
                      ? "Semua label dari file CSV berhasil diproses."
                      : "Label dari file CSV sedang diproses. Silakan tunggu hingga progress mencapai 100%."}
                  </p>
                  
                  {activeBatch && (
                    <div className="w-full max-w-xs mx-auto mt-4 pt-2 space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-cu-muted">
                        <span>{activeBatch.processed_items} / {activeBatch.total_items} selesai</span>
                        <span>{visualPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-cu-line overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            activeBatch.status === "failed" ? "bg-cu-danger" : "bg-cu-success"
                          }`}
                          style={{ width: `${visualPercent}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-center mt-1 font-medium capitalize">
                        Status: <span className={activeBatch.status === "completed" ? "text-cu-success font-bold" : "text-cu-info animate-pulse"}>
                          {activeBatch.status === "processing" ? "Memproses" : activeBatch.status === "pending" ? "Mengantre" : activeBatch.status}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-4 border-t border-cu-line/40">
                  <button
                    type="button"
                    onClick={() => {
                      setBulkFile(null);
                      setCsvData([]);
                      setCsvErrors([]);
                      setBulkStep(1);
                      setVisualPercent(0);
                      setActiveBatch(null);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-cu-line bg-cu-surface px-5 py-2 text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft"
                  >
                    <MaterialIcon name="upload_file" size="xs" />
                    Unggah CSV Baru
                  </button>
                  <Link
                    href="/pricetag/history"
                    className="flex items-center justify-center gap-1.5 rounded-full bg-cu-ink px-5 py-2 text-sm font-semibold text-cu-surface transition hover:bg-cu-ink-hover shadow-sm"
                  >
                    <MaterialIcon name="history" size="xs" />
                    Lihat Riwayat
                  </Link>
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

function MobileGeneratorListButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[60px] w-full items-center justify-between gap-2 rounded-[24px] border border-[#c9c9c9] bg-white px-5 text-left text-[#2c2c2c] transition-all duration-200 ease-out focus:border-[#2da3ff] focus:bg-[#d8efff] focus:outline-none focus:ring-2 focus:ring-[#2da3ff] active:scale-[0.99] active:border-[#2da3ff] active:bg-[#d8efff]"
    >
      <span className="min-w-0 truncate text-[13px] font-semibold leading-tight">{label}</span>
      <MaterialIcon name="chevron_right" size="md" className="shrink-0 text-[#2c2c2c]" />
    </button>
  );
}

function MobileGeneratorMessage({ icon, text }: { icon?: string; text: string }) {
  return (
    <div className="flex min-h-[88px] items-center justify-center gap-2 text-center text-[#9aa1af]">
      {icon && <MaterialIcon name={icon} size="md" filled={false} />}
      <span className="text-[15px] font-medium leading-tight">{text}</span>
    </div>
  );
}

function MobileProcessCard({ visualPercent }: { visualPercent: number }) {
  const progress = Math.max(12, visualPercent);

  return (
    <div className="rounded-[36px] bg-white p-4 text-[#303431]">
      <div className="overflow-hidden rounded-[24px] border border-[#c9c9c9] bg-white">
        <div className="flex min-h-[60px] items-center justify-between gap-3 px-5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-[#269556]" />
            <p className="min-w-0 truncate text-[13px] font-semibold leading-tight">Membuat Gambar Label</p>
          </div>
          <span className="rounded-full bg-[#e7f5ee] px-3 py-1 text-[11px] font-bold leading-none text-[#1f8f52]">
            {visualPercent}%
          </span>
        </div>

        <div className="space-y-4 border-t border-[#E3E4E3] bg-[#f8f9fb] p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-[#e7f5ee] text-[#269556]">
              <span className="absolute size-full rounded-full border border-[#269556]/25 animate-ping" />
              <MaterialIcon name="settings" size="md" className="relative animate-spin" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[16px] font-bold leading-tight text-[#303431]">Sedang menyusun label</h3>
              <p className="mt-1 text-[11px] font-medium leading-snug text-[#8a8a8a]">
                Sistem sedang menyiapkan layout promo dan file pricetag.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-semibold leading-tight text-[#8a8a8a]">
              <span>Proses pembuatan</span>
              <span>{visualPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#E3E4E3]">
              <div
                className="h-full rounded-full bg-[#269556] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="rounded-[18px] border border-[#E3E4E3] bg-white px-4 py-3">
            <p className="text-[12px] font-medium leading-snug text-[#303431]">
              Harap tunggu sebentar. Halaman akan otomatis berpindah setelah proses selesai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileResultCard({
  success = false,
  title,
  description,
  generatedViewUrl,
  generatedDownloadUrl,
  onReset,
}: {
  success?: boolean;
  title: string;
  description?: string;
  generatedViewUrl?: string | null;
  generatedDownloadUrl?: string | null;
  onReset?: () => void;
}) {
  const tone = success
    ? {
        dot: "bg-[#269556]",
        soft: "bg-[#e7f5ee]",
        text: "text-[#1f8f52]",
        icon: "check",
        label: "Selesai",
      }
    : {
        dot: "bg-[#9f2424]",
        soft: "bg-[#fdeeee]",
        text: "text-[#9f2424]",
        icon: "close",
        label: "Gagal",
      };

  return (
    <div className="rounded-[36px] bg-white p-4 text-[#303431]">
      <div className="overflow-hidden rounded-[24px] border border-[#c9c9c9] bg-white">
        <div className="flex min-h-[60px] items-center justify-between gap-3 px-5">
          <div className="flex min-w-0 items-center gap-2">
            <span className={`size-2 shrink-0 rounded-full ${tone.dot}`} />
            <p className="min-w-0 truncate text-[13px] font-semibold leading-tight">{title}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-[11px] font-bold leading-none ${tone.soft} ${tone.text}`}>
            {tone.label}
          </span>
        </div>

        <div className="space-y-4 border-t border-[#E3E4E3] bg-[#f8f9fb] p-4">
          <div className="flex items-center gap-3">
            <div className={`relative flex size-12 shrink-0 items-center justify-center rounded-full ${tone.soft} ${tone.text} cu-result-status-pop`}>
              {success && <span className="absolute size-full rounded-full border border-[#269556]/30 cu-result-status-ring" />}
              <MaterialIcon name={tone.icon} size="md" weight={600} className="relative" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[16px] font-bold leading-tight text-[#303431]">{title}</h3>
              <p className="mt-1 text-[11px] font-medium leading-snug text-[#8a8a8a]">
                {description ?? "File pricetag sudah selesai dibuat dan siap digunakan."}
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            {success ? (
              <>
                {generatedViewUrl && (
                  <a
                    href={generatedViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-[46px] items-center justify-center gap-1.5 rounded-full bg-black px-4 text-[13px] font-bold text-white"
                  >
                    <MaterialIcon name="visibility" size="xs" weight={500} />
                    Lihat
                  </a>
                )}
                {generatedDownloadUrl && (
                  <a
                    href={generatedDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-[46px] items-center justify-center gap-1.5 rounded-full border border-[#c9c9c9] bg-white px-4 text-[13px] font-bold text-[#303431]"
                  >
                    <MaterialIcon name="download" size="xs" weight={500} />
                    Download
                  </a>
                )}
                {onReset && (
                  <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex h-[46px] items-center justify-center gap-1.5 rounded-full bg-[#269556] px-4 text-[13px] font-bold text-white"
                  >
                    <MaterialIcon name="add" size="xs" weight={500} />
                    Buat Lagi
                  </button>
                )}
              </>
            ) : (
              <a
                href="mailto:"
                className="inline-flex h-[46px] items-center justify-center gap-1.5 rounded-full bg-black px-4 text-[13px] font-bold text-white"
              >
                <MaterialIcon name="support_agent" size="xs" weight={500} />
                Hubungi Admin
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
