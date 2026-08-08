import React from "react";

export interface HrdReviewCardProps {
  leave: number;
  appPermission: number;
  absence: number;
  late: number;
  score: number;
}

export function HrdReviewCard({ leave, appPermission, absence, late, score }: HrdReviewCardProps) {
  const items = [
    ["Cuti", leave],
    ["Izin App", appPermission],
    ["Bolos", absence],
    ["Telat", late],
  ] as const;

  return (
    <section className="rounded-2xl border border-[#e8edf0] bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-[#248235]">C. HRD Review (20%)</h2>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl bg-[#eefaf0] p-3 text-center text-[#248235]"
          >
            <p className="text-xs">{label}</p>
            <b className="mt-1 block text-2xl">{value}</b>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between rounded-xl bg-[#eefaf0] px-4 py-3 font-semibold text-[#248235]">
        <span>Σ Nilai</span>
        <span>{score}/20</span>
      </div>
    </section>
  );
}
