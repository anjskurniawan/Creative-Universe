import React from "react";

export interface AspectScoreListProps {
  labels: string[];
  scores: number[];
  maxima: number[];
}

export function AspectScoreList({ labels, scores, maxima }: AspectScoreListProps) {
  return (
    <div className="mt-4 space-y-3">
      {labels.map((label, i) => (
        <div key={label} className="grid grid-cols-[1fr_120px_44px] items-center gap-3 text-xs">
          <span className="text-[#525e61]">{label}</span>
          {/* Progress Bar Persentase Nilai */}
          <span className="h-1.5 overflow-hidden rounded-full bg-[#edf0f3]">
            <span
              className="block h-full rounded-full bg-current"
              style={{ width: `${(scores[i] / (maxima[i] || 1)) * 100}%` }}
            />
          </span>
          {/* Detail Angka Nilai */}
          <b className="text-right">
            {scores[i]}/{maxima[i]}
          </b>
        </div>
      ))}
    </div>
  );
}
