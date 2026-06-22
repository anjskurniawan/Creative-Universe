"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { apiFetch } from "@/lib/api";
import { pushLocalNotification } from "@/lib/local-notifications";
import {
  emptyProductForm,
  formatRupiah,
  PricetagCategory,
  pricetagError,
  PricetagImportSummary,
  PricetagPage,
  PricetagProduct,
  PricetagProductForm,
} from "@/lib/pricetag";
import { useAuth } from "@/providers/auth-provider";

type Tab = "categories" | "products";

export default function PricetagDatabasePage() {
  const { user, hasPermission } = useAuth();
  const [tab, setTab] = useState<Tab>("categories");
  const [categories, setCategories] = useState<PricetagCategory[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<PricetagCategory[]>([]);
  const [products, setProducts] = useState<PricetagProduct[]>([]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [categoryModal, setCategoryModal] = useState<PricetagCategory | "new" | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIconSvg, setCategoryIconSvg] = useState("");
  const [productModal, setProductModal] = useState<PricetagProduct | "new" | null>(null);
  const [productForm, setProductForm] = useState<PricetagProductForm>(emptyProductForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const notify = useCallback((message: string) => {
    pushLocalNotification(message, "/pricetag/database", user?.id);
  }, [user]);

  const loadData = useCallback(async () => {
    if (!hasPermission("pricetag.manage")) return;
    setIsLoading(true);
    const params = new URLSearchParams({ page: String(page), per_page: "10" });
    if (appliedSearch) params.set(tab === "categories" ? "name" : "search", appliedSearch);

    try {
      if (tab === "categories") {
        const result = await apiFetch<PricetagPage<PricetagCategory>>(`/pricetag/categories?${params}`);
        setCategories(result.data);
        setLastPage(result.meta.last_page);
        setTotal(result.meta.total);
      } else {
        const [result, options] = await Promise.all([
          apiFetch<PricetagPage<PricetagProduct>>(`/pricetag/products?${params}`),
          apiFetch<PricetagPage<PricetagCategory>>("/pricetag/categories?per_page=100"),
        ]);
        setProducts(result.data);
        setCategoryOptions(options.data);
        setLastPage(result.meta.last_page);
        setTotal(result.meta.total);
      }
    } catch (requestError) {
      notify(pricetagError(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [appliedSearch, hasPermission, page, tab]);

  useEffect(() => { queueMicrotask(() => void loadData()); }, [loadData]);

  if (!hasPermission("pricetag.manage")) return <AccessDenied />;

  const changeTab = (next: Tab) => {
    setTab(next);
    setSearch("");
    setAppliedSearch("");
    setPage(1);
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setAppliedSearch(search.trim());
  };

  const openCategory = (category: PricetagCategory | "new") => {
    setCategoryModal(category);
    setCategoryName(category === "new" ? "" : category.name);
    setCategoryIconSvg(category === "new" ? "" : category.icon_svg || "");
  };

  const saveCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!categoryModal) return;
    setIsSaving(true);
    try {
      const editing = categoryModal !== "new";
      await apiFetch(editing ? `/pricetag/categories/${categoryModal.id}` : "/pricetag/categories", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify({ name: categoryName, icon_svg: categoryIconSvg || null }),
      });
      setCategoryModal(null);
      notify(editing ? "Kategori berhasil diperbarui." : "Kategori berhasil dibuat.");
      await loadData();
    } catch (requestError) {
      notify(pricetagError(requestError));
    } finally { setIsSaving(false); }
  };

  const deleteCategory = async (category: PricetagCategory) => {
    if (!window.confirm(`Hapus kategori ${category.name}?`)) return;
    try {
      await apiFetch(`/pricetag/categories/${category.id}`, { method: "DELETE" });
      notify(`Kategori ${category.name} berhasil dihapus.`);
      await loadData();
    } catch (requestError) { notify(pricetagError(requestError)); }
  };

  const openProduct = (product: PricetagProduct | "new") => {
    setProductModal(product);
    setProductForm(product === "new" ? emptyProductForm : {
      category_id: product.category.id,
      name: product.name,
      variant_name: product.variant_name === "Default" ? "" : product.variant_name,
      normal_price: String(product.normal_price),
      discount_price: String(product.discount_price ?? 0),
    });
  };

  const saveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productModal) return;
    setIsSaving(true);
    try {
      const editing = productModal !== "new";
      await apiFetch(editing ? `/pricetag/products/${productModal.id}` : "/pricetag/products", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify({
          category_id: productForm.category_id,
          name: productForm.name,
          variant_name: productForm.variant_name,
          normal_price: Number(productForm.normal_price),
          discount_price: productForm.discount_price === "" ? null : Number(productForm.discount_price),
        }),
      });
      setProductModal(null);
      notify(editing ? "Produk berhasil diperbarui." : "Produk berhasil dibuat.");
      await loadData();
    } catch (requestError) { notify(pricetagError(requestError)); }
    finally { setIsSaving(false); }
  };

  const deleteProduct = async (product: PricetagProduct) => {
    if (!window.confirm(`Hapus ${product.name} (${product.variant_name})?`)) return;
    try {
      await apiFetch(`/pricetag/products/${product.id}`, { method: "DELETE" });
      notify(`Produk ${product.name} berhasil dihapus.`);
      await loadData();
    } catch (requestError) { notify(pricetagError(requestError)); }
  };

  const importCatalog = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!importFile) { notify("Pilih file CSV terlebih dahulu."); return; }
    setIsImporting(true);
    notify(`Import CSV dimulai untuk file ${importFile.name}.`);
    const formData = new FormData();
    formData.append("file", importFile);
    try {
      const summary = await apiFetch<PricetagImportSummary>("/pricetag/imports/products", { method: "POST", body: formData });
      notify(`Import ${summary.total} baris selesai: ${summary.created} baru, ${summary.updated} diperbarui, ${summary.restored} dipulihkan.`);
      setImportFile(null);
      setIsImportModalOpen(false);
      const input = document.getElementById("catalog-csv") as HTMLInputElement | null;
      if (input) input.value = "";
      await loadData();
    } catch (requestError) { notify(pricetagError(requestError)); }
    finally { setIsImporting(false); }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cu-muted">Pricetag Studio</p>
          <h1 className="mt-1 text-2xl font-semibold text-cu-ink">Manajemen Katalog</h1>
          <p className="mt-1 text-sm text-cu-muted">{total} data pada tab {tab === "categories" ? "kategori" : "produk"}.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button type="button" onClick={() => setIsImportModalOpen(true)} className="flex-1 sm:flex-none btn btn-secondary flex items-center justify-center gap-1.5 py-2 px-3 text-xs sm:text-sm">
            <MaterialIcon name="upload_file" size="sm" />
            <span className="truncate">Import CSV</span>
          </button>
          <button type="button" onClick={() => tab === "categories" ? openCategory("new") : openProduct("new")} className="flex-1 sm:flex-none btn bg-cu-ink text-white hover:bg-cu-ink-hover flex items-center justify-center gap-1.5 py-2 px-3 text-xs sm:text-sm">
            <MaterialIcon name="add" size="sm" />
            <span className="truncate">Tambah {tab === "categories" ? "Kategori" : "Produk"}</span>
          </button>
        </div>
      </header>

      <div className="flex border-b border-cu-line">
        <TabButton active={tab === "categories"} onClick={() => changeTab("categories")} icon="category" label="Kategori" />
        <TabButton active={tab === "products"} onClick={() => changeTab("products")} icon="inventory_2" label="Produk & Varian" />
      </div>

      <form onSubmit={submitSearch} className="relative max-w-lg">
        <MaterialIcon name="search" size="sm" className="pointer-events-none absolute left-3 top-2.5 text-cu-muted" />
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={tab === "categories" ? "Cari kategori..." : "Cari produk atau varian..."} className="h-10 w-full rounded-full border border-cu-line bg-cu-surface pl-10 pr-20 text-sm outline-none" />
        <button type="submit" className="absolute right-1 top-1 h-8 rounded-full bg-cu-panel-soft px-4 text-xs font-semibold">Cari</button>
      </form>

      {isLoading ? <Loading /> : tab === "categories" ? (
        <CategoryTable categories={categories} onEdit={openCategory} onDelete={deleteCategory} />
      ) : (
        <ProductTable products={products} onEdit={openProduct} onDelete={deleteProduct} />
      )}

      <Pagination page={page} lastPage={lastPage} onPage={setPage} />

      {categoryModal && <CategoryModal name={categoryName} setName={setCategoryName} iconSvg={categoryIconSvg} setIconSvg={setCategoryIconSvg} editing={categoryModal !== "new"} saving={isSaving} onSubmit={saveCategory} onClose={() => setCategoryModal(null)} />}
      {productModal && <ProductModal form={productForm} setForm={setProductForm} categories={categoryOptions} editing={productModal !== "new"} saving={isSaving} onSubmit={saveProduct} onClose={() => setProductModal(null)} />}
      {isImportModalOpen && <ImportCsvModal importFile={importFile} setImportFile={setImportFile} isImporting={isImporting} onSubmit={importCatalog} onClose={() => setIsImportModalOpen(false)} />}
    </div>
  );
}

function CategoryTable({ categories, onEdit, onDelete }: { categories: PricetagCategory[]; onEdit: (item: PricetagCategory) => void; onDelete: (item: PricetagCategory) => void }) {
  return <div className="overflow-x-auto rounded-2xl border border-cu-line bg-cu-surface shadow-sm"><table className="min-w-full text-sm"><thead className="bg-cu-panel-soft text-left text-xs uppercase tracking-wide text-cu-muted"><tr><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Produk</th><th className="px-4 py-3 text-right">Aksi</th></tr></thead><tbody className="divide-y divide-cu-line">{categories.length === 0 ? <tr><td colSpan={3} className="p-10 text-center text-cu-muted">Belum ada kategori.</td></tr> : categories.map((item) => <tr key={item.id}><td className="px-4 py-3 font-semibold text-cu-ink"><div className="flex items-center gap-2"><span className="flex size-6 shrink-0 items-center justify-center text-cu-muted">{item.icon_svg ? <span dangerouslySetInnerHTML={{ __html: item.icon_svg }} className="flex size-full items-center justify-center *:size-full" /> : <MaterialIcon name="category" size="xs" />}</span>{item.name}</div></td><td className="px-4 py-3 text-cu-muted">{item.products_count}</td><td className="px-4 py-3"><div className="flex justify-end gap-2"><Action icon="edit" label="Edit kategori" onClick={() => onEdit(item)} /><Action icon="delete" label="Hapus kategori" danger onClick={() => void onDelete(item)} /></div></td></tr>)}</tbody></table></div>;
}

function ProductTable({ products, onEdit, onDelete }: { products: PricetagProduct[]; onEdit: (item: PricetagProduct) => void; onDelete: (item: PricetagProduct) => void }) {
  return (
    <>
      {/* Desktop View (5-Column Table) */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-cu-line bg-cu-surface shadow-sm">
        <table className="min-w-[760px] w-full text-sm">
          <thead className="bg-cu-panel-soft text-left text-xs uppercase tracking-wide text-cu-muted">
            <tr>
              <th className="px-4 py-3">Produk</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Harga</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cu-line">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-cu-muted">Belum ada produk.</td>
              </tr>
            ) : (
              products.map((item) => (
                <tr key={item.id} className="hover:bg-cu-surface-soft/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-cu-ink">{item.name}</span>
                    <span className="block text-xs text-cu-muted">{item.variant_name}</span>
                  </td>
                  <td className="px-4 py-3 text-cu-muted">{item.category.name}</td>
                  <td className="px-4 py-3">
                    <span className="block text-xs text-cu-muted line-through">{formatRupiah(item.normal_price)}</span>
                    <span className="font-semibold text-cu-success">{formatRupiah(item.discount_price)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs ${item.is_ready ? "bg-cu-success-soft text-cu-success" : "bg-cu-panel-soft text-cu-muted"}`}>
                      {item.is_ready ? "Ready" : "Belum"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Action icon="edit" label="Edit produk" onClick={() => onEdit(item)} />
                      <Action icon="delete" label="Hapus produk" danger onClick={() => void onDelete(item)} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View (Compact 3-Column Table) */}
      <div className="block sm:hidden w-full rounded-2xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-cu-panel-soft text-left text-xs uppercase tracking-wide text-cu-muted">
            <tr>
              <th className="px-3 py-3 w-[45%]">Produk</th>
              <th className="px-3 py-3 w-[25%]">Harga</th>
              <th className="px-3 py-3 w-[30%] text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cu-line">
            {products.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-10 text-center text-cu-muted">Belum ada produk.</td>
              </tr>
            ) : (
              products.map((item) => (
                <tr key={item.id} className="hover:bg-cu-surface-soft/50 transition-colors">
                  <td className="px-3 py-2.5 align-middle">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] font-bold text-cu-muted uppercase tracking-wider truncate">
                        {item.category.name}
                      </span>
                      <span className="font-semibold text-cu-ink text-xs sm:text-sm truncate">
                        {item.name}
                      </span>
                      {item.variant_name && item.variant_name !== "Default" && (
                        <span className="text-[10px] text-cu-muted truncate">
                          {item.variant_name}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 align-middle">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-cu-muted line-through">
                        {formatRupiah(item.normal_price)}
                      </span>
                      <span className="font-semibold text-cu-success text-xs sm:text-sm">
                        {formatRupiah(item.discount_price)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 align-middle text-right">
                    <div className="flex justify-end gap-1">
                      <Action icon="edit" label="Edit produk" onClick={() => onEdit(item)} />
                      <Action icon="delete" label="Hapus produk" danger onClick={() => void onDelete(item)} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function CategoryModal({ name, setName, iconSvg, setIconSvg, editing, saving, onSubmit, onClose }: { name: string; setName: (value: string) => void; iconSvg: string; setIconSvg: (value: string) => void; editing: boolean; saving: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onClose: () => void }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") setIconSvg(text);
    };
    reader.readAsText(file);
  };

  return <Modal title={editing ? "Edit Kategori" : "Tambah Kategori"} onClose={onClose}><form onSubmit={onSubmit} className="space-y-4"><label className="block text-sm font-medium">Nama kategori<input autoFocus value={name} onChange={(event) => setName(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-cu-line px-3" /></label>
  <div>
    <label className="block text-sm font-medium">Icon SVG (Opsional)</label>
    <div className="mt-1 flex items-center gap-2">
      <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn-secondary text-xs px-3 py-2"><MaterialIcon name="upload_file" size="xs" className="mr-1" />Upload File .svg</button>
      <input type="file" accept=".svg" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
    </div>
    <textarea value={iconSvg} onChange={(e) => setIconSvg(e.target.value)} placeholder="Atau paste kode <svg> mentah di sini..." rows={4} className="mt-2 w-full rounded-lg border border-cu-line p-3 text-xs font-mono"></textarea>
  </div>
  <ModalActions saving={saving} onClose={onClose} /></form></Modal>;
}

function ProductModal({ form, setForm, categories, editing, saving, onSubmit, onClose }: { form: PricetagProductForm; setForm: (form: PricetagProductForm) => void; categories: PricetagCategory[]; editing: boolean; saving: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onClose: () => void }) {
  const field = (key: keyof PricetagProductForm, value: string | number) => setForm({ ...form, [key]: value });
  return <Modal title={editing ? "Edit Produk" : "Tambah Produk"} onClose={onClose}><form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2 text-sm font-medium">Kategori<select value={form.category_id} onChange={(event) => field("category_id", Number(event.target.value) || "")} className="mt-1 h-10 w-full rounded-lg border border-cu-line px-3"><option value="">Pilih kategori</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="text-sm font-medium">Nama produk<input value={form.name} onChange={(event) => field("name", event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-cu-line px-3" /></label><label className="text-sm font-medium">Varian<input value={form.variant_name} onChange={(event) => field("variant_name", event.target.value)} placeholder="Default" className="mt-1 h-10 w-full rounded-lg border border-cu-line px-3" /></label><label className="text-sm font-medium">Harga normal<input type="number" min="0" value={form.normal_price} onChange={(event) => field("normal_price", event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-cu-line px-3" /></label><label className="text-sm font-medium">Harga diskon<input type="number" min="0" value={form.discount_price} onChange={(event) => field("discount_price", event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-cu-line px-3" /></label><div className="sm:col-span-2"><ModalActions saving={saving} onClose={onClose} /></div></form></Modal>;
}

function ImportCsvModal({ importFile, setImportFile, isImporting, onSubmit, onClose }: { importFile: File | null; setImportFile: (file: File | null) => void; isImporting: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onClose: () => void }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,kategori,produk,variant,harga normal,harga diskon\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pricetag_database_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <Modal title="Import / Update CSV" onClose={onClose}><form onSubmit={onSubmit} className="space-y-4"><div className="flex items-center justify-between gap-3 rounded-xl border border-cu-line bg-cu-surface-soft px-4 py-3"><div><p className="text-sm font-semibold text-cu-ink">Template CSV Kosong</p><p className="text-xs text-cu-muted">Format header sudah disiapkan tanpa isi data.</p></div><button type="button" onClick={downloadTemplate} className="btn btn-secondary"><MaterialIcon name="download_for_offline" size="sm" />Unduh Template</button></div><div><p className="mb-1 text-sm font-medium text-cu-ink">File CSV / TXT</p><div className={`flex min-h-40 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition hover:bg-cu-panel-soft ${importFile ? "border-cu-info/40 bg-cu-info-soft" : "border-cu-line bg-cu-surface"}`} onClick={() => fileInputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); setImportFile(event.dataTransfer.files?.[0] ?? null); }}><MaterialIcon name={importFile ? "description" : "cloud_upload"} size="lg" className={`mb-3 ${importFile ? "text-cu-info" : "text-cu-soft"}`} />{importFile ? <><p className="max-w-full break-all text-sm font-semibold text-cu-info">{importFile.name}</p><p className="mt-1 text-xs text-cu-muted">Klik atau jatuhkan file lain untuk mengganti.</p></> : <><p className="text-sm text-cu-ink"><span className="font-semibold">Klik untuk memilih file</span> atau jatuhkan file di sini</p><p className="mt-1 text-xs text-cu-muted">Maksimal 2 MB. Format CSV atau TXT.</p></>}<input id="catalog-csv" ref={fileInputRef} type="file" accept=".csv,.txt,text/csv" onChange={(event) => setImportFile(event.target.files?.[0] ?? null)} className="hidden" /></div></div><p className="text-xs text-cu-muted">Mendukung separator koma atau titik koma. Tabel katalog tetap menampilkan maksimal 10 item per halaman.</p><ModalActions saving={isImporting} onClose={onClose} submitLabel={isImporting ? "Mengimpor..." : "Import CSV"} /></form></Modal>;
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) { return <div className="fixed inset-0 z-[120] flex items-center justify-center bg-cu-overlay/70 p-4"><div role="dialog" aria-modal="true" className="relative z-[121] w-full max-w-xl rounded-2xl bg-cu-surface p-5 shadow-xl"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2><button type="button" onClick={onClose} aria-label="Tutup"><MaterialIcon name="close" size="sm" /></button></div>{children}</div></div>; }
function ModalActions({ saving, onClose, submitLabel }: { saving: boolean; onClose: () => void; submitLabel?: string }) { return <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="btn btn-secondary">Batal</button><button type="submit" disabled={saving} className="btn bg-cu-ink text-white">{submitLabel ?? (saving ? "Menyimpan..." : "Simpan")}</button></div>; }
function Action({ icon, label, onClick, danger = false }: { icon: string; label: string; onClick: () => void; danger?: boolean }) { return <button type="button" onClick={onClick} aria-label={label} className={`inline-flex size-8 items-center justify-center rounded-lg border ${danger ? "border-cu-danger/20 bg-cu-danger-soft text-cu-danger" : "border-cu-line bg-cu-surface text-cu-ink"}`}><MaterialIcon name={icon} size="xs" /></button>; }
function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) { return <button type="button" onClick={onClick} className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold ${active ? "border-cu-ink text-cu-ink" : "border-transparent text-cu-muted"}`}><MaterialIcon name={icon} size="sm" />{label}</button>; }
function Pagination({ page, lastPage, onPage }: { page: number; lastPage: number; onPage: (page: number) => void }) { if (lastPage <= 1) return null; return <div className="flex items-center justify-between text-xs text-cu-muted"><span>Halaman {page} dari {lastPage}</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className="btn btn-secondary">Sebelumnya</button><button type="button" disabled={page >= lastPage} onClick={() => onPage(page + 1)} className="btn btn-secondary">Berikutnya</button></div></div>; }
function Loading() { return <div className="rounded-2xl border border-cu-line bg-cu-surface p-12 text-center text-sm text-cu-muted">Memuat database katalog...</div>; }
function AccessDenied() { return <div className="rounded-2xl border border-cu-danger/20 bg-cu-danger-soft p-8 text-center"><MaterialIcon name="lock" size="lg" className="mx-auto text-cu-danger" /><h1 className="mt-3 text-lg font-semibold">Akses ditolak</h1><p className="mt-1 text-sm text-cu-muted">Anda tidak memiliki permission pricetag.manage.</p></div>; }
