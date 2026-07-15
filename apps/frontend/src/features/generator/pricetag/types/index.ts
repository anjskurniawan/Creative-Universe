import { ApiError, ValidationError } from "@/core/api/client";
import type { PaginatedResponse } from "@/core/admin";

export type PricetagPage<T> = PaginatedResponse<T>;

export interface PricetagCategory {
  id: number;
  name: string;
  icon_svg: string | null;
  products_count: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface PricetagProduct {
  id: number;
  category: { id: number; name: string };
  name: string;
  variant_name: string;
  normal_price: number;
  discount_price: number | null;
  is_ready: boolean;
  preview_url: string | null;
  download_url: string | null;
  asset_updated_at: string | null;
  generator_path: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface PricetagImportSummary {
  total: number;
  created: number;
  updated: number;
  restored: number;
  categories_created: number;
  categories_restored: number;
}

export interface PricetagProductForm {
  category_id: number | "";
  name: string;
  variant_name: string;
  normal_price: string;
  discount_price: string;
}

export const emptyProductForm: PricetagProductForm = {
  category_id: "",
  name: "",
  variant_name: "",
  normal_price: "",
  discount_price: "",
};

export function formatRupiah(value: number | null): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function pricetagError(error: unknown): string {
  if (error instanceof ValidationError) {
    const first = Object.values(error.errors).flat()[0];
    if (first) return first;

    const details = error.details as {
      message?: string;
      errors?: { rows?: Array<{ row: number; errors: string[] }> };
    } | null;
    const row = details?.errors?.rows?.[0];
    if (row) return `Baris ${row.row}: ${row.errors.join(" ")}`;
    return details?.message || "Data belum valid.";
  }

  return error instanceof ApiError
    ? error.message
    : "Terjadi kesalahan. Silakan coba lagi.";
}

export interface PricetagBatch {
  id: number;
  batch_name: string;
  status: "pending" | "processing" | "completed" | "failed";
  total_items: number;
  processed_items: number;
  created_by: number;
  creator?: {
    id: number;
    name: string;
    username: string;
  };
  items?: PricetagBatchItem[];
  created_at: string;
  updated_at: string;
}

export interface PricetagBatchItem {
  id: number;
  batch_id: number;
  product_id: number;
  status: "pending" | "success" | "failed";
  error_message: string | null;
  product?: PricetagProduct;
  created_at: string;
  updated_at: string;
}

export interface PricetagCategoryInput {
  name: string;
  icon_svg?: string | null;
}

export interface PricetagProductInput {
  category_id: number;
  name: string;
  variant_name: string;
  normal_price: number;
  discount_price: number | null;
}

export interface PricetagChecklistInput {
  batch_name: string;
  items: Array<{ product_id: number; discount_price?: number | null }>;
}
