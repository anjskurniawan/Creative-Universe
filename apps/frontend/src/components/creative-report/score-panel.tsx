import React from "react";
import { ContentTitle } from "@/components/ui/content-title";
import { AspectScoreList } from "./aspect-score-list";
import { AspectScoreTotal } from "./aspect-score-total";

export interface ScorePanelProps {
  title: string;
  color: string;
  labels: string[];
  scores: number[];
  maxima: number[];
  total: number;
}

export function ScorePanel({ title, color, labels, scores, maxima, total }: ScorePanelProps) {
  return (
    <section className="rounded-2xl border border-[#e8edf0] bg-white p-5 shadow-sm">
      {/* Judul Kategori Skor */}
      <ContentTitle title={title} className={color} />

      {/* Daftar Nilai Setiap Aspek */}
      <AspectScoreList labels={labels} scores={scores} maxima={maxima} />

      {/* Total Penjumlahan Nilai Aspek */}
      <AspectScoreTotal total={total} maxima={maxima} color={color} />
    </section>
  );
}
