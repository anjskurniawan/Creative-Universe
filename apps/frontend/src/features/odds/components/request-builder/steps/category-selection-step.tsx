import { useMemo, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import type { OddsCategory } from "@/features/odds/api";
import type { OddsRequestForm, RequestBuilderTheme } from "../types";

export function CategorySelectionStep({
  categories,
  selectedCategoryId,
  update,
  theme,
}: {
  categories: OddsCategory[];
  selectedCategoryId: string;
  update: (field: keyof OddsRequestForm, value: string) => void;
  theme: RequestBuilderTheme;
}) {
  const [search, setSearch] = useState("");
  const filteredCategories = useMemo(
    () => categories.filter((category) => category.name.toLowerCase().includes(search.toLowerCase())),
    [categories, search],
  );
  const { dark, inputClass, textMuted, textTitle } = theme;

  return (
    <section className="flex min-h-0 flex-1 flex-col space-y-5">
      <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div className="shrink-0">
          <h2 className={`text-xl font-bold tracking-tight ${textTitle}`}>Pilih Kategori Desain</h2>
          <p className={`mt-0.5 text-xs ${textMuted}`}>Pilih kategori spesifik yang mewakili request Anda</p>
        </div>
        <div className="relative w-full flex-1">
          <MaterialIcon name="search" size="xs" className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kategori..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className={`pl-10 ${inputClass}`}
          />
        </div>
      </header>

      {filteredCategories.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400">Kategori tidak ditemukan.</div>
      ) : (
        <div className="grid min-h-0 flex-1 content-start gap-3.5 overflow-y-auto p-2 [scrollbar-width:none] sm:grid-cols-2 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
          {filteredCategories.map((category) => {
            const isSelected = selectedCategoryId === String(category.id);
            const matrix = (category.important_matrix || "Q4").toUpperCase();
            const matrixBadgeClass =
              matrix === "Q1"
                ? "bg-red-500/20 text-red-500 border-red-500/30"
                : matrix === "Q2"
                  ? "bg-orange-500/20 text-orange-500 border-orange-500/30"
                  : matrix === "Q3"
                    ? "bg-blue-500/20 text-blue-500 border-blue-500/30"
                    : "bg-slate-500/20 text-slate-400 border-slate-500/30";

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  update("category_id", String(category.id));
                  update("important_matrix", category.important_matrix || "Q4");
                }}
                className={`group relative flex items-center justify-between overflow-hidden rounded-2xl border p-4 pl-6 text-left transition-all duration-200 ${
                  isSelected
                    ? dark
                      ? "border-[#B0FF5E] bg-[#B0FF5E]/10 text-white"
                      : "border-[#00A4FF] bg-[#00A4FF]/5 text-[#00A4FF]"
                    : dark
                      ? "border-white/5 bg-[#171717] text-[#B9B9B9] hover:border-white/20"
                      : "border-[#BDEAFF] bg-[#F3FAFF]/40 text-[#04044A] hover:border-[#00A4FF]"
                }`}
              >
                <span className={`absolute bottom-0 left-0 top-0 w-1.5 transition-colors ${isSelected ? dark ? "bg-[#B0FF5E]" : "bg-[#00A4FF]" : "bg-transparent"}`} />
                <span className="mr-2 flex min-w-0 items-center gap-2">
                  <span className="truncate text-xs font-semibold">{category.name}</span>
                  <span className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-extrabold ${matrixBadgeClass}`}>{matrix}</span>
                </span>
                {isSelected && (
                  <MaterialIcon name="check_circle" size="auto" className={`shrink-0 text-lg ${dark ? "text-[#B0FF5E]" : "text-[#00A4FF]"}`} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
