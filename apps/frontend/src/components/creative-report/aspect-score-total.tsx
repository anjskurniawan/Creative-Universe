import React from "react";

export interface AspectScoreTotalProps {
  total: number;
  maxima: number[];
  color: string;
}

export function AspectScoreTotal({ total, maxima, color }: AspectScoreTotalProps) {
  const maxTotal = maxima.reduce((a, b) => a + b, 0);

  return (
    <div className={`mt-5 flex justify-between rounded-xl bg-current/10 px-4 py-3 font-semibold ${color}`}>
      <span>Σ Nilai</span>
      <span>
        {total}/ {maxTotal}
      </span>
    </div>
  );
}
