import { apiBlob, apiFetch, type ApiRequestOptions } from "@/core/api/client";
import type {
  PricetagBatch,
  PricetagCategory,
  PricetagCategoryInput,
  PricetagChecklistInput,
  PricetagImportSummary,
  PricetagPage,
  PricetagProduct,
  PricetagProductInput,
} from "@/features/generator/pricetag/types";

const PREFIX = "/generator/pricetag";

export const pricetagApi = {
  categories: {
    list: (query = "", options?: ApiRequestOptions) =>
      apiFetch<PricetagPage<PricetagCategory>>(`${PREFIX}/categories${query}`, options),
    detail: (id: number | string, options?: ApiRequestOptions) =>
      apiFetch<PricetagCategory>(`${PREFIX}/categories/${id}`, options),
    create: (input: PricetagCategoryInput) =>
      apiFetch<PricetagCategory>(`${PREFIX}/categories`, json("POST", input)),
    update: (id: number | string, input: PricetagCategoryInput) =>
      apiFetch<PricetagCategory>(`${PREFIX}/categories/${id}`, json("PATCH", input)),
    remove: (id: number | string) =>
      apiFetch<null>(`${PREFIX}/categories/${id}`, { method: "DELETE" }),
  },
  products: {
    list: (query = "", options?: ApiRequestOptions) =>
      apiFetch<PricetagPage<PricetagProduct>>(`${PREFIX}/products${query}`, options),
    detail: (id: number | string, options?: ApiRequestOptions) =>
      apiFetch<PricetagProduct>(`${PREFIX}/products/${id}`, options),
    create: (input: PricetagProductInput) =>
      apiFetch<PricetagProduct>(`${PREFIX}/products`, json("POST", input)),
    update: (id: number | string, input: PricetagProductInput) =>
      apiFetch<PricetagProduct>(`${PREFIX}/products/${id}`, json("PATCH", input)),
    remove: (id: number | string) =>
      apiFetch<null>(`${PREFIX}/products/${id}`, { method: "DELETE" }),
  },
  generations: {
    single: (productId: number, discountPrice: number) =>
      apiFetch<PricetagProduct>(`${PREFIX}/generations/single`, json("POST", {
        product_id: productId,
        discount_price: discountPrice,
      })),
    checklist: (input: PricetagChecklistInput) =>
      apiFetch<PricetagBatch>(`${PREFIX}/generations/checklist`, json("POST", input)),
    csv: (formData: FormData) =>
      apiFetch<PricetagBatch>(`${PREFIX}/generations/csv`, { method: "POST", body: formData }),
  },
  batches: {
    list: (query = "", options?: ApiRequestOptions) =>
      apiFetch<PricetagPage<PricetagBatch>>(`${PREFIX}/batches${query}`, options),
    detail: (id: number | string, options?: ApiRequestOptions) =>
      apiFetch<PricetagBatch>(`${PREFIX}/batches/${id}`, options),
    download: (id: number | string, options?: ApiRequestOptions) =>
      apiBlob(`${PREFIX}/batches/${id}/download`, options),
  },
  imports: {
    products: (formData: FormData) =>
      apiFetch<PricetagImportSummary>(`${PREFIX}/imports/products`, { method: "POST", body: formData }),
  },
} as const;

function json(method: "POST" | "PATCH", body: unknown): ApiRequestOptions {
  return { method, body: JSON.stringify(body) };
}

export async function downloadPricetagBatch(batch: PricetagBatch): Promise<void> {
  const blob = await pricetagApi.batches.download(batch.id);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pricetag-batch-${batch.id}.zip`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
